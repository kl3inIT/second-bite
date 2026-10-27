package order_test

import (
	"context"
	"encoding/json"
	"errors"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
	"github.com/kl3inIT/second-bite/server/internal/seller"
)

// chatScene is what the chat checks need: a seller with an owner and staff, an
// offer collected from now, and an order a signed-in customer placed.
type chatScene struct {
	owner, staff, customer, stranger, admin context.Context //nolint:containedctx // the callers of one scene, as the checks pass them
	shop                                    uuid.UUID
	offer                                   offer.Offer
	order                                   order.Order
}

func (f fixture) chatScene(t *testing.T) chatScene {
	t.Helper()

	sc := chatScene{
		owner:    f.as(t, "owner", platform.RoleCustomer),
		staff:    f.as(t, "staff", platform.RoleCustomer),
		customer: f.as(t, "customer", platform.RoleCustomer),
		stranger: f.as(t, "stranger", platform.RoleCustomer),
		admin:    f.as(t, "admin", platform.RoleAdmin),
	}
	sc.shop = f.shop(sc.owner, t, "La Paris", "staff")
	sc.offer = f.post(sc.owner, t, sc.shop, "Croissant", 50, 20_000, time.Now())
	sc.order = f.placeOne(sc.customer, t, sc.offer)

	return sc
}

func (f fixture) placeOne(customer context.Context, t *testing.T, o offer.Offer) order.Order {
	t.Helper()

	placed, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{o.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	return placed
}

func mustSend(who context.Context, t *testing.T, f fixture, access string, id uuid.UUID, text string) order.Message {
	t.Helper()

	m, err := f.orders.SendMessage(who, id, access, key(), text)
	if err != nil {
		t.Fatalf("sending %q: %v", text, err)
	}

	return m
}

func testChatConversation(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	sc := f.chatScene(t)
	id := sc.order.ID

	first := mustSend(sc.customer, t, f, "", id, "  Cho mình nhận trễ 10 phút được không?  ")
	if first.Seq != 1 || first.From != order.SideCustomer || first.Text != "Cho mình nhận trễ 10 phút được không?" {
		t.Fatalf("the customer's message: %+v", first)
	}

	reply := mustSend(sc.staff, t, f, "", id, "Được ạ")
	if reply.Seq != 2 || reply.From != order.SideSeller {
		t.Fatalf("the seller's reply: %+v", reply)
	}

	read, err := f.orders.Messages(sc.customer, id, "", 0, 50)
	if err != nil || len(read.Messages) != 2 || read.Messages[0].Seq != 1 || read.Messages[1].Text != "Được ạ" || !read.Open || read.ClosesAt != nil {
		t.Fatalf("the chat: %+v, %v", read, err)
	}

	if page, err := f.orders.Messages(sc.owner, id, "", 1, 50); err != nil || len(page.Messages) != 1 || page.Messages[0].Seq != 2 {
		t.Errorf("the messages after the first: %+v, %v", page, err)
	}

	if page, err := f.orders.Messages(sc.owner, id, "", 0, 1); err != nil || len(page.Messages) != 1 {
		t.Errorf("a page of one: %+v, %v", page, err)
	}

	unreadFor(t, f, sc, 1, 1, "each side has one unread message")

	if err := f.orders.MarkSeen(sc.customer, id, "", 99); err != nil { // beyond the last counts as the last
		t.Fatal(err)
	}

	if err := f.orders.MarkSeen(sc.customer, id, "", 1); err != nil { // never lowers
		t.Fatal(err)
	}

	if err := f.orders.MarkSeen(sc.staff, id, "", 1); err != nil {
		t.Fatal(err)
	}

	seen, err := f.orders.Messages(sc.customer, id, "", 0, 50)
	if err != nil || seen.SeenCustomer != 2 || seen.SeenSeller != 1 {
		t.Fatalf("what each side has seen: %+v, %v", seen, err)
	}

	unreadFor(t, f, sc, 0, 0, "everything is seen")

	if o, err := f.orders.Get(sc.customer, id, ""); err != nil || o.MessageCount == nil || *o.MessageCount != len(seen.Messages) {
		t.Errorf("the customer reads the order with %v messages (%v), want %d", o.MessageCount, err, len(seen.Messages))
	}

	if o, err := f.orders.Get(sc.admin, id, ""); err != nil || o.UnreadMessages != nil || o.MessageCount != nil {
		t.Errorf("an admin reads the order with unread %v and %v messages (%v), want none", o.UnreadMessages, o.MessageCount, err)
	}
}

// unreadFor checks the unread messages the customer and the seller's people
// read on the order in every place that carries them.
func unreadFor(t *testing.T, f fixture, sc chatScene, customer, staff int, when string) {
	t.Helper()

	got := func(o order.Order) int {
		if o.UnreadMessages == nil {
			return -1
		}

		return *o.UnreadMessages
	}

	if o, err := f.orders.Get(sc.customer, sc.order.ID, ""); err != nil || got(o) != customer {
		t.Errorf("%s: the customer reads %d (%v), want %d", when, got(o), err, customer)
	}

	if o, err := f.orders.Get(sc.staff, sc.order.ID, ""); err != nil || got(o) != staff {
		t.Errorf("%s: staff read %d (%v), want %d", when, got(o), err, staff)
	}

	mine, err := f.orders.Mine(sc.customer, order.WhichAll, uuid.Nil, 10, 0)
	if err != nil || len(mine) != 1 || got(mine[0]) != customer {
		t.Errorf("%s: the customer's list: %+v (%v), want %d unread", when, mine, err, customer)
	}

	listed, err := f.orders.OfSeller(sc.owner, sc.shop, f.orders.Today())
	if err != nil || len(listed) != 1 || got(listed[0]) != staff {
		t.Errorf("%s: the seller's list: %+v (%v), want %d unread", when, listed, err, staff)
	}
}

func testChatWhoTakesPart(t *testing.T, f fixture) {
	t.Helper()

	sc := f.chatScene(t)
	id := sc.order.ID

	another := f.as(t, "another", platform.RoleCustomer)
	f.shop(another, t, "Other shop")

	guestOffer := f.post(sc.owner, t, sc.shop, "Eclair", 5, 25_000, time.Now())

	guest, err := f.orders.Place(t.Context(), key(), uuid.Nil, someone, []order.Wanted{{guestOffer.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	for name, who := range map[string]context.Context{"the customer": sc.customer, "the owner": sc.owner, "staff": sc.staff} {
		if _, err := f.orders.SendMessage(who, id, "", key(), "Xin chào"); err != nil {
			t.Errorf("%s: %v", name, err)
		}
	}

	if m, err := f.orders.SendMessage(t.Context(), guest.ID, guest.Access, key(), "Xin chào"); err != nil || m.From != order.SideCustomer {
		t.Errorf("a customer holding the access: %+v, %v", m, err)
	}

	turnedAway := map[string]struct {
		who    context.Context //nolint:containedctx // a table of who asks
		order  uuid.UUID
		access string
	}{
		"a stranger":                {sc.stranger, id, ""},
		"an admin":                  {sc.admin, id, ""},
		"another seller's owner":    {another, id, ""},
		"nobody signed in":          {t.Context(), guest.ID, ""},
		"a wrong access":            {t.Context(), guest.ID, "nope"},
		"another order's access":    {t.Context(), guest.ID, sc.order.Access},
		"an order that is not real": {sc.customer, uuid.New(), ""},
	}

	for name, c := range turnedAway {
		_, err := f.orders.Messages(c.who, c.order, c.access, 0, 50)
		mustFail(t, name+" reading", err, order.ErrNotFound)

		_, err = f.orders.SendMessage(c.who, c.order, c.access, key(), "Xin chào")
		mustFail(t, name+" writing", err, order.ErrNotFound)

		mustFail(t, name+" marking seen", f.orders.MarkSeen(c.who, c.order, c.access, 1), order.ErrNotFound)

		_, err = f.orders.OrderLiveTicket(c.who, c.order, c.access)
		mustFail(t, name+" asking for a ticket", err, order.ErrNotFound)
	}
}

func testChatClosesWithTheOrder(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	sc := f.chatScene(t)

	// Cancelled, refused and expired orders lock at once.
	later := f.post(sc.owner, t, sc.shop, "Bánh mì", 5, 20_000, time.Now().Add(time.Hour))
	cancelled := f.placeOne(sc.customer, t, later)

	if _, err := f.orders.Cancel(sc.customer, cancelled.ID, "", ""); err != nil {
		t.Fatal(err)
	}

	refused := f.placeOne(sc.customer, t, sc.offer)
	if _, err := f.orders.Refuse(sc.owner, refused.ID, order.RefuseOther, ""); err != nil {
		t.Fatal(err)
	}

	expired := f.placeOne(sc.customer, t, sc.offer)
	f.shift(t, expired.ID, -3*time.Hour)

	for name, id := range map[string]uuid.UUID{"cancelled": cancelled.ID, "refused": refused.ID, "expired": expired.ID} {
		_, err := f.orders.SendMessage(sc.customer, id, "", key(), "Còn không?")
		mustFail(t, "the customer writing on an order "+name, err, order.ErrChatClosed)

		_, err = f.orders.SendMessage(sc.staff, id, "", key(), "Còn không?")
		mustFail(t, "staff writing on an order "+name, err, order.ErrChatClosed)

		if c, err := f.orders.Messages(sc.customer, id, "", 0, 50); err != nil || c.Open || c.ClosesAt != nil {
			t.Errorf("an order %s reads open: %+v, %v", name, c, err)
		}

		if err := f.orders.MarkSeen(sc.customer, id, "", 1); err != nil {
			t.Errorf("marking seen on an order %s: %v", name, err)
		}
	}

	// A collected order's chat stays writable for two hours.
	id := sc.order.ID

	before, err := f.orders.SendMessage(sc.customer, id, "", "first", "Mình sắp tới")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(sc.owner, id); err != nil {
		t.Fatal(err)
	}

	mustSend(sc.customer, t, f, "", id, "Thiếu một cái bánh")
	mustSend(sc.staff, t, f, "", id, "Xin lỗi bạn, mình bù ngay")

	open, err := f.orders.Messages(sc.customer, id, "", 0, 50)
	if err != nil || !open.Open || open.ClosesAt == nil || time.Until(*open.ClosesAt) < time.Hour+50*time.Minute {
		t.Fatalf("a chat just collected: %+v, %v", open, err)
	}

	if _, err := f.pool.Exec(t.Context(), "UPDATE order_orders SET collected_at = now() - interval '3 hours' WHERE id = $1", id); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.SendMessage(sc.customer, id, "", key(), "Còn ai không?")
	mustFail(t, "writing three hours after collecting", err, order.ErrChatClosed)

	closed, err := f.orders.Messages(sc.customer, id, "", 0, 50)
	if err != nil || closed.Open || len(closed.Messages) != 3 {
		t.Fatalf("the chat three hours after collecting: %+v, %v", closed, err)
	}

	// The same key returns the message sent first, even once the chat is closed.
	again, err := f.orders.SendMessage(sc.customer, id, "", "first", "Một chữ khác")
	if err != nil || again.Seq != before.Seq || again.Text != before.Text {
		t.Errorf("a resend after the chat closed: %+v, %v, want the first message", again, err)
	}
}

func testChatBounds(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	sc := f.chatScene(t)
	id := sc.order.ID

	for name, text := range map[string]string{"empty": "", "blank": " \t\n ", "too long": strings.Repeat("a", 1001)} {
		_, err := f.orders.SendMessage(sc.customer, id, "", key(), text)
		mustFail(t, "a message that is "+name, err, order.ErrMessageInvalid)
	}

	// 1,000 letters of three bytes each are 1,000 characters.
	if _, err := f.orders.SendMessage(sc.customer, id, "", key(), strings.Repeat("ế", 1000)); err != nil {
		t.Errorf("a message of 1,000 characters: %v", err)
	}

	for name, k := range map[string]string{"empty": "", "too long": strings.Repeat("k", 256)} {
		_, err := f.orders.SendMessage(sc.customer, id, "", k, "Xin chào")
		mustFail(t, "a key that is "+name, err, order.ErrIdempotencyKeyInvalid)
	}

	// The same key is the same message, from one side; the other side's key is its own.
	one, err := f.orders.SendMessage(sc.staff, id, "", "same", "Chào bạn")
	if err != nil {
		t.Fatal(err)
	}

	two, err := f.orders.SendMessage(sc.owner, id, "", "same", "Một chữ khác")
	if err != nil || two.Seq != one.Seq || two.Text != one.Text {
		t.Errorf("the same key again: %+v, %v, want %+v", two, err, one)
	}

	if m, err := f.orders.SendMessage(sc.customer, id, "", "same", "Của khách"); err != nil || m.Seq == one.Seq || m.From != order.SideCustomer {
		t.Errorf("the customer's message with the seller's key: %+v, %v", m, err)
	}

	// The same key sent at once is still one message, and neither request fails.
	raced := make([]order.Message, 2)

	var (
		wg      sync.WaitGroup
		raceErr [2]error
	)

	for i := range raced {
		wg.Go(func() { raced[i], raceErr[i] = f.orders.SendMessage(sc.customer, id, "", "raced", "Gửi hai lần") })
	}

	wg.Wait()

	if raceErr[0] != nil || raceErr[1] != nil || raced[0].Seq != raced[1].Seq {
		t.Errorf("the same key at once: %+v, %v and %+v, %v", raced[0], raceErr[0], raced[1], raceErr[1])
	}

	// Twenty a minute from one side; the other side is not held back.
	busy := f.placeOne(sc.customer, t, sc.offer)
	for i := range 20 {
		if _, err := f.orders.SendMessage(sc.customer, busy.ID, "", key(), strings.Repeat("x", i+1)); err != nil {
			t.Fatalf("message %d of 20: %v", i+1, err)
		}
	}

	_, err = f.orders.SendMessage(sc.customer, busy.ID, "", key(), "Thứ 21")
	mustFail(t, "the 21st message in a minute", err, order.ErrMessagesTooFast)

	var failure *platform.FailureError
	if !errors.As(err, &failure) || failure.RetryAfter <= 0 || failure.RetryAfter > time.Minute {
		t.Errorf("the wait it asks for: %+v", failure)
	}

	if _, err := f.orders.SendMessage(sc.staff, busy.ID, "", key(), "Vâng ạ"); err != nil {
		t.Errorf("the seller while the customer waits: %v", err)
	}

	if c, err := f.orders.Messages(sc.customer, busy.ID, "", 0, 100); err != nil || len(c.Messages) != 21 {
		t.Errorf("messages stored after the refusal: %d (%v), want 21", len(c.Messages), err)
	}

	// 500 in one chat.
	full := f.placeOne(sc.customer, t, sc.offer)
	if _, err := f.pool.Exec(t.Context(), "INSERT INTO order_chats (order_id, last_seq) VALUES ($1, 500)", full.ID); err != nil {
		t.Fatal(err)
	}

	_, err = f.orders.SendMessage(sc.customer, full.ID, "", key(), "Thứ 501")
	mustFail(t, "the 501st message", err, order.ErrChatFull)
}

func testChatNumbersInCommitOrder(t *testing.T, f fixture) {
	t.Helper()

	sc := f.chatScene(t)

	const senders = 15

	var wg sync.WaitGroup

	errs := make(chan error, senders)

	for i := range senders {
		wg.Go(func() {
			_, err := f.orders.SendMessage(sc.customer, sc.order.ID, "", key(), strings.Repeat("x", i+1))
			errs <- err
		})
	}

	wg.Wait()
	close(errs)

	for err := range errs {
		if err != nil {
			t.Fatal(err)
		}
	}

	c, err := f.orders.Messages(sc.customer, sc.order.ID, "", 0, 100)
	if err != nil || len(c.Messages) != senders {
		t.Fatalf("the chat: %d messages (%v), want %d", len(c.Messages), err, senders)
	}

	for i, m := range c.Messages {
		if m.Seq != i+1 {
			t.Errorf("message %d is numbered %d", i+1, m.Seq)
		}

		if i > 0 && m.SentAt.Before(c.Messages[i-1].SentAt) {
			t.Errorf("message %d was sent before message %d", m.Seq, c.Messages[i-1].Seq)
		}
	}
}

func testLiveTickets(t *testing.T, f fixture) { //nolint:gocyclo // a check reads as one story
	t.Helper()

	sc := f.chatScene(t)
	id := sc.order.ID

	for name, who := range map[string]context.Context{"the customer": sc.customer, "the owner": sc.owner, "staff": sc.staff} {
		ticket, err := f.orders.OrderLiveTicket(who, id, "")
		if err != nil || ticket.Value == "" || time.Until(ticket.ExpiresAt) < 20*time.Second || time.Until(ticket.ExpiresAt) > 31*time.Second {
			t.Fatalf("%s: %+v, %v", name, ticket, err)
		}

		topic, ok, err := f.orders.RedeemLiveTicket(t.Context(), ticket.Value)
		if err != nil || !ok || topic != "order:"+id.String() {
			t.Errorf("%s redeems %q, %v, %v", name, topic, ok, err)
		}

		if _, ok, err := f.orders.RedeemLiveTicket(t.Context(), ticket.Value); err != nil || ok {
			t.Errorf("%s: a ticket worked twice (%v)", name, err)
		}
	}

	guest, err := f.orders.Place(t.Context(), key(), uuid.Nil, someone, []order.Wanted{{sc.offer.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.OrderLiveTicket(t.Context(), guest.ID, guest.Access); err != nil {
		t.Errorf("a customer holding the access: %v", err)
	}

	_, err = f.orders.OrderLiveTicket(t.Context(), guest.ID, "")
	mustFail(t, "the identifier alone", err, order.ErrNotFound)

	for name, who := range map[string]context.Context{"the owner": sc.owner, "staff": sc.staff} {
		ticket, err := f.orders.SellerLiveTicket(who, sc.shop)
		if err != nil {
			t.Fatalf("%s: %v", name, err)
		}

		if topic, ok, err := f.orders.RedeemLiveTicket(t.Context(), ticket.Value); err != nil || !ok || topic != "seller:"+sc.shop.String() {
			t.Errorf("%s redeems %q, %v, %v", name, topic, ok, err)
		}
	}

	for name, who := range map[string]context.Context{"a stranger": sc.stranger, "a customer": sc.customer, "an admin": sc.admin} {
		_, err := f.orders.SellerLiveTicket(who, sc.shop)
		mustFail(t, name+" asking for the seller's ticket", err, seller.ErrNotFound)
	}

	_, err = f.orders.SellerLiveTicket(t.Context(), sc.shop)
	mustFail(t, "nobody signed in", err, platform.ErrAuthenticationRequired)

	// Expired and unknown tickets are refused; the purge removes what expired.
	expired, err := f.orders.OrderLiveTicket(sc.customer, id, "")
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.pool.Exec(t.Context(), "UPDATE order_live_tickets SET expires_at = now() - interval '1 minute'"); err != nil {
		t.Fatal(err)
	}

	if _, ok, err := f.orders.RedeemLiveTicket(t.Context(), expired.Value); err != nil || ok {
		t.Errorf("an expired ticket: %v, %v", ok, err)
	}

	if _, ok, err := f.orders.RedeemLiveTicket(t.Context(), "never-minted"); err != nil || ok {
		t.Errorf("an unknown ticket: %v, %v", ok, err)
	}

	for range 2 { // run twice, it changes nothing more
		if err := f.orders.PurgeLiveTickets(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	var left int
	if err := f.pool.QueryRow(t.Context(), "SELECT count(*) FROM order_live_tickets WHERE expires_at <= now()").Scan(&left); err != nil {
		t.Fatal(err)
	}

	if left != 0 {
		t.Errorf("%d expired tickets remain after the purge", left)
	}

	var stored int
	if err := f.pool.QueryRow(t.Context(), "SELECT count(*) FROM order_live_tickets WHERE ticket_hash = $1", []byte(expired.Value)).Scan(&stored); err != nil || stored != 0 {
		t.Errorf("a ticket is stored as it was given (%d, %v)", stored, err)
	}
}

// heard collects what the order module sends on the live channel.
type heard struct {
	mu       sync.Mutex
	payloads []string
}

func listen(t *testing.T, pool *pgxpool.Pool) *heard {
	t.Helper()

	conn, err := pgx.ConnectConfig(t.Context(), pool.Config().ConnConfig)
	if err != nil {
		t.Fatal(err)
	}

	if _, err := conn.Exec(t.Context(), "LISTEN "+platform.LiveChannel); err != nil {
		t.Fatal(err)
	}

	h := &heard{}
	ctx, cancel := context.WithCancel(t.Context())
	done := make(chan struct{})

	go func() {
		defer close(done)

		for {
			n, err := conn.WaitForNotification(ctx)
			if err != nil {
				return
			}

			h.mu.Lock()
			h.payloads = append(h.payloads, n.Payload)
			h.mu.Unlock()
		}
	}()

	// The connection is closed only once the goroutine waiting on it is gone.
	t.Cleanup(func() {
		cancel()
		<-done

		_ = conn.Close(context.WithoutCancel(t.Context()))
	})

	return h
}

// count is how many notices of status went to topic.
func (h *heard) count(topic, status string) int {
	h.mu.Lock()
	defer h.mu.Unlock()

	n := 0

	for _, p := range h.payloads {
		var b struct {
			Topics []string `json:"topics"`
			Notice struct {
				Status string `json:"status"`
			} `json:"notice"`
		}

		if json.Unmarshal([]byte(p), &b) == nil && slices.Contains(b.Topics, topic) && b.Notice.Status == status {
			n++
		}
	}

	return n
}

// await waits up to ten seconds for n notices of status on topic.
func (h *heard) await(t *testing.T, topic, status string, n int, what string) {
	t.Helper()

	deadline := time.Now().Add(10 * time.Second)

	for h.count(topic, status) < n {
		if time.Now().After(deadline) {
			t.Fatalf("%s: %d notices of %s on %s, want %d", what, h.count(topic, status), status, topic, n)
		}

		time.Sleep(20 * time.Millisecond)
	}
}

func testEveryChangeNotifies(t *testing.T, f fixture) {
	t.Helper()

	h := listen(t, f.pool)
	sc := f.chatScene(t)
	shopTopic := "seller:" + sc.shop.String()

	// Placing, in chatScene.
	h.await(t, "order:"+sc.order.ID.String(), "confirmed", 1, "placing")
	h.await(t, shopTopic, "confirmed", 1, "placing, for the seller")

	step := func(o order.Order, status string, n int, what string, do func() error) {
		t.Helper()

		if err := do(); err != nil {
			t.Fatalf("%s: %v", what, err)
		}

		h.await(t, "order:"+o.ID.String(), status, n, what)
	}

	step(sc.order, "ready", 1, "marking ready", func() error { _, err := f.orders.Ready(sc.staff, sc.order.ID); return err })
	step(sc.order, "collected", 1, "handing over", func() error { _, err := f.orders.HandOver(sc.staff, sc.order.ID); return err })
	step(sc.order, "confirmed", 2, "reopening", func() error { _, err := f.orders.Reopen(sc.staff, sc.order.ID); return err })

	later := f.post(sc.owner, t, sc.shop, "Bánh mì", 5, 20_000, time.Now().Add(time.Hour))
	cancelled := f.placeOne(sc.customer, t, later)
	step(cancelled, "cancelled", 1, "cancelling", func() error { _, err := f.orders.Cancel(sc.customer, cancelled.ID, "", ""); return err })

	refused := f.placeOne(sc.customer, t, sc.offer)
	step(refused, "refused", 1, "refusing", func() error {
		_, err := f.orders.Refuse(sc.staff, refused.ID, order.RefuseOther, "")

		return err
	})

	moving := f.post(sc.owner, t, sc.shop, "Eclair", 5, 25_000, time.Now())
	moved := f.placeOne(sc.customer, t, moving)
	start, end := time.Now().Add(time.Hour), time.Now().Add(3*time.Hour)

	if _, err := f.offers.Change(sc.owner, moving.ID, offer.Change{WindowStart: &start, WindowEnd: &end}); err != nil {
		t.Fatal(err)
	}

	step(moved, "confirmed", 2, "moving the window", func() error {
		return f.orders.FollowOfferWindow(t.Context(), offer.WindowChangedEvent{OfferID: moving.ID})
	})

	withdrawn := f.post(sc.owner, t, sc.shop, "Pain", 5, 25_000, time.Now())
	held := f.placeOne(sc.customer, t, withdrawn)
	step(held, "refused", 1, "withdrawing an offer", func() error {
		if _, err := f.offers.Withdraw(sc.owner, withdrawn.ID); err != nil {
			return err
		}

		return f.orders.RefuseWithdrawnOffer(t.Context(), offer.WithdrawnEvent{OfferID: withdrawn.ID})
	})

	ended := f.placeOne(sc.customer, t, sc.offer)
	f.shift(t, ended.ID, -3*time.Hour)
	step(ended, "expired", 1, "expiry", func() error { return f.orders.ExpireEnded(t.Context()) })
	h.await(t, shopTopic, "expired", 1, "expiry, for the seller")

	// A change that fails sends nothing: only the order placed after it is heard.
	before := h.count(shopTopic, "confirmed")

	_, err := f.orders.Place(sc.customer, key(), uuid.Nil, someone, []order.Wanted{{sc.offer.ID, 999}})
	mustFail(t, "a cart that cannot be filled", err, order.ErrOfferSoldOut)

	placed := f.placeOne(sc.customer, t, sc.offer)
	h.await(t, "order:"+placed.ID.String(), "confirmed", 1, "the order after the failure")

	if got := h.count(shopTopic, "confirmed") - before; got != 1 {
		t.Errorf("%d notices of confirmed reached the seller, want only the order that was placed", got)
	}
}

func testOldChatsAreForgotten(t *testing.T, f fixture) {
	t.Helper()

	sc := f.chatScene(t)
	kept := f.placeOne(sc.customer, t, sc.offer)
	old := f.placeOne(sc.customer, t, sc.offer)

	for _, o := range []order.Order{kept, old} {
		mustSend(sc.customer, t, f, "", o.ID, "Xin chào")
		mustSend(sc.staff, t, f, "", o.ID, "Chào bạn")
	}

	// Its window ended 31 days ago, against 29 days ago for the other.
	f.shift(t, old.ID, -31*24*time.Hour)
	f.shift(t, kept.ID, -29*24*time.Hour)

	for range 2 { // run twice, it changes nothing more
		if err := f.orders.ForgetOldChats(t.Context()); err != nil {
			t.Fatal(err)
		}
	}

	if left := f.messagesOf(t, old.ID); left != 0 {
		t.Errorf("%d messages remain of the order whose window ended 31 days ago", left)
	}

	if left := f.messagesOf(t, kept.ID); left != 2 {
		t.Errorf("%d messages remain of the order whose window ended 29 days ago, want 2", left)
	}

	f.expectState(t, old.ID, "confirmed", "the order itself is kept") // expiry has not run in this check
}

func (f fixture) messagesOf(t *testing.T, orderID uuid.UUID) int {
	t.Helper()

	var n int
	if err := f.pool.QueryRow(t.Context(), "SELECT count(*) FROM order_messages WHERE order_id = $1", orderID).Scan(&n); err != nil {
		t.Fatal(err)
	}

	return n
}

// TestDeletedCustomerChatsAreForgotten delivers identity's AccountDeletedEvent
// through the outbox, twice as a retry would (SEC-37): the chats of the orders
// the account placed are deleted with their messages, the orders lose the
// name, phone number and Zalo consent and keep the rest (SEC-165), and another
// customer's order and chat stay.
func TestDeletedCustomerChatsAreForgotten(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	f := newFixture(t, pool)
	sc := f.chatScene(t)

	other := f.as(t, "other", platform.RoleCustomer)
	theirs := f.placeOne(other, t, sc.offer)

	mustSend(sc.customer, t, f, "", sc.order.ID, "Xin chào")
	mustSend(sc.staff, t, f, "", sc.order.ID, "Chào bạn")
	mustSend(other, t, f, "", theirs.ID, "Xin chào")

	if _, err := pool.Exec(t.Context(), `UPDATE order_orders SET zalo_consent_at = now() WHERE id = $1`, sc.order.ID); err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	order.RegisterListeners(events, f.orders)

	if err := events.Start(t.Context()); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.WithoutCancel(t.Context()), 10*time.Second)
		defer cancel()

		if err := events.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	caller, _ := platform.CallerFrom(sc.customer)

	for range 2 {
		if err := pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
			return platform.Publish(t.Context(), tx, events, identity.AccountDeletedEvent{AccountID: caller.AccountID})
		}); err != nil {
			t.Fatal(err)
		}
	}

	deadline := time.Now().Add(15 * time.Second)

	for f.messagesOf(t, sc.order.ID) != 0 {
		if time.Now().After(deadline) {
			t.Fatal("the deleted account's chat is still there")
		}

		time.Sleep(100 * time.Millisecond)
	}

	if left := f.messagesOf(t, theirs.ID); left != 1 {
		t.Errorf("%d messages remain of another customer's chat, want 1", left)
	}

	checkContactsForgotten(t, pool, deadline, sc.order.ID, theirs.ID)
}

// checkContactsForgotten waits until the deleted account's order holds no name,
// phone or consent, keeping its total, and checks that another's kept them.
func checkContactsForgotten(t *testing.T, pool *pgxpool.Pool, deadline time.Time, mine, theirs uuid.UUID) {
	t.Helper()

	for time.Now().Before(deadline) && contactOf(t, pool, mine).name != "" {
		time.Sleep(100 * time.Millisecond)
	}

	if c := contactOf(t, pool, mine); c.name != "" || c.phone != "" || c.zalo || !c.forgotten || c.total == 0 {
		t.Errorf("the deleted account's order holds %+v, want no name, phone or consent, and its total", c)
	}

	if c := contactOf(t, pool, theirs); c.name == "" || c.phone == "" || c.forgotten {
		t.Errorf("another customer's order lost its contact: %+v", c)
	}
}

// contact is what an order holds of who placed it.
type contact struct {
	name, phone     string
	zalo, forgotten bool
	total           int64
}

func contactOf(t *testing.T, pool *pgxpool.Pool, id uuid.UUID) contact {
	t.Helper()

	var c contact
	if err := pool.QueryRow(t.Context(), `SELECT customer_name, customer_phone, zalo_consent_at IS NOT NULL,
		contact_forgotten_at IS NOT NULL, total_vnd FROM order_orders WHERE id = $1`, id).
		Scan(&c.name, &c.phone, &c.zalo, &c.forgotten, &c.total); err != nil {
		t.Fatal(err)
	}

	return c
}
