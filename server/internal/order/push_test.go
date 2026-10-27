package order_test

import (
	"context"
	"slices"
	"testing"
	"time"

	webpush "github.com/SherClockHolmes/webpush-go"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// Each change a customer or a store must hear of queues one push on the
// right topic, in the change's transaction, and the changes nobody acts on
// queue none (SEC-25 decisions 2 and 3).
func testPushesTellOfEachChange(t *testing.T, f fixture) {
	t.Helper()

	orders, follow := f.withPushes(t)

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now())
	eclair := f.post(owner, t, shop, "Éclair", 10, 25_000, time.Now())

	follow("seller:" + shop.String())

	placed, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}, {eclair.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	follow("order:" + placed.ID.String())

	if _, err := orders.Ready(owner, placed.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := orders.SendMessage(owner, placed.ID, "", key(), "Món đã xong"); err != nil {
		t.Fatal(err)
	}

	if _, err := orders.SendMessage(customer, placed.ID, "", key(), "Mình tới liền"); err != nil {
		t.Fatal(err)
	}

	if _, err := orders.HandOver(owner, placed.ID); err != nil {
		t.Fatal(err)
	}

	number := order.Number(placed.Number)
	f.expectPushes(t, placed.ID, []pushed{
		{"seller:" + shop.String(), "Đơn mới " + number, "Croissant và 1 món khác · lấy "},
		{"order:" + placed.ID.String(), "Croissant và 1 món khác đã sẵn sàng", "Đến La Paris lấy trước "},
		{"order:" + placed.ID.String(), "La Paris nhắn bạn", "Về đơn " + number + ". Mở đơn để đọc."},
		{"seller:" + shop.String(), "Khách nhắn về đơn " + number, "Mở đơn để đọc và trả lời."},
	})

	cancelled, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := orders.Cancel(customer, cancelled.ID, "", "Đổi ý"); err != nil {
		t.Fatal(err)
	}

	f.expectPushes(t, cancelled.ID, []pushed{
		{"seller:" + shop.String(), "Đơn mới " + order.Number(cancelled.Number), "Croissant · lấy "},
		{"seller:" + shop.String(), "Khách huỷ đơn " + order.Number(cancelled.Number), "Croissant"},
	})

	refused, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{eclair.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	follow("order:" + refused.ID.String())

	if _, err := orders.Refuse(owner, refused.ID, order.RefuseSoldOut, ""); err != nil {
		t.Fatal(err)
	}

	f.expectPushes(t, refused.ID, []pushed{
		{"seller:" + shop.String(), "Đơn mới " + order.Number(refused.Number), "Éclair · lấy "},
		{"order:" + refused.ID.String(), "Đơn " + order.Number(refused.Number) + " đã bị huỷ", "La Paris: món đã hết"},
	})
}

// A moved window is told once, however often its event arrives; a customer is
// reminded once before the window opens, unless they ordered within that time.
func testPushesTellOfTime(t *testing.T, f fixture) {
	t.Helper()

	orders, follow := f.withPushes(t)

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 10, 20_000, time.Now().Add(20*time.Minute))

	early, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	late, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	follow("order:" + early.ID.String())
	follow("order:" + late.ID.String())

	// The early order was placed an hour ago; the late one just now, within
	// the half hour before the window.
	if _, err := f.pool.Exec(t.Context(), `UPDATE order_orders SET created_at = created_at - interval '1 hour' WHERE id = $1`, early.ID); err != nil {
		t.Fatal(err)
	}

	for range 2 { // a second run reminds nobody again
		if err := orders.RemindDueSoon(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	f.expectPushes(t, early.ID, []pushed{{"order:" + early.ID.String(), "Sắp đến giờ lấy Croissant", "La Paris, "}})
	f.expectPushes(t, late.ID, nil)

	start, end := time.Now().Add(2*time.Hour), time.Now().Add(3*time.Hour)
	if _, err := f.offers.Change(owner, croissant.ID, offer.Change{WindowStart: &start, WindowEnd: &end}); err != nil {
		t.Fatal(err)
	}

	for range 2 { // delivered twice, it tells once
		if err := orders.FollowOfferWindow(t.Context(), offer.WindowChangedEvent{OfferID: croissant.ID}); err != nil {
			t.Fatal(err)
		}
	}

	f.expectPushes(t, late.ID, []pushed{{"order:" + late.ID.String(), "Giờ lấy đã đổi: ", "La Paris · Croissant"}})
}

// withPushes returns an order service whose changes queue Web Push, and a
// function that makes one browser follow a topic, as a page would with a live
// ticket.
func (f fixture) withPushes(t *testing.T) (*order.Service, func(topic string)) {
	t.Helper()

	private, public, err := webpush.GenerateVAPIDKeys()
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(f.pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	pushes, err := notification.NewService(f.pool, nil, events, notification.Config{
		SettingsKey: make([]byte, 32),
		Push:        notification.PushConfig{PublicKey: public, PrivateKey: private, SiteURL: "https://secondbite.example"},
	}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	browser := notification.Subscription{
		Endpoint: "https://fcm.googleapis.com/fcm/send/" + f.prefix, P256dh: "key", Auth: "auth",
	}
	// The ticket is the topic itself: redeeming is the live socket's, checked
	// in the live tickets' own test.
	redeem := func(_ context.Context, ticket string) (string, bool, error) { return ticket, true, nil }

	return order.NewService(f.pool, f.offers, f.sellers, pushes, f.trail, platformtest.Logger()), func(topic string) {
		if err := pushes.Subscribe(t.Context(), browser, []string{topic}, redeem); err != nil {
			t.Fatal(err)
		}
	}
}

type pushed struct{ topic, title, bodyStart string }

// expectPushes compares the pushes queued about an order, oldest first, in
// Vietnamese; a body is compared by its start, as it ends with times.
func (f fixture) expectPushes(t *testing.T, about uuid.UUID, want []pushed) {
	t.Helper()

	rows, err := f.pool.Query(t.Context(),
		`SELECT topic, title_vi, body_vi FROM notification_pushes WHERE about = $1 ORDER BY id`, about)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()

	var got []pushed

	for rows.Next() {
		var p pushed
		if err := rows.Scan(&p.topic, &p.title, &p.bodyStart); err != nil {
			t.Fatal(err)
		}

		got = append(got, p)
	}

	if err := rows.Err(); err != nil {
		t.Fatal(err)
	}

	matches := len(got) == len(want) && !slices.ContainsFunc(want, func(w pushed) bool {
		i := slices.Index(want, w)

		return got[i].topic != w.topic || !hasPrefix(got[i].title, w.title) || !hasPrefix(got[i].bodyStart, w.bodyStart)
	})
	if !matches {
		t.Errorf("pushes about %s:\n got %q\nwant %q", about, got, want)
	}
}

func hasPrefix(s, prefix string) bool { return len(s) >= len(prefix) && s[:len(prefix)] == prefix }
