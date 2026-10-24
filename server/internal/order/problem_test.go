package order_test

import (
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// testProblemReportedAndAnswered: the customer of a collected order reports
// what went wrong once; strangers and the store cannot; the store answers once
// and the customer reads it; each change queues one push (SEC-84).
func testProblemReportedAndAnswered(t *testing.T, f fixture) {
	t.Helper()

	orders, follow := f.withPushes(t)

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	admin := f.as(t, "admin", platform.RoleAdmin)
	shop := f.shop(owner, t, "La Paris")
	croissant := f.post(owner, t, shop, "Croissant", 5, 20_000, time.Now())

	follow("seller:" + shop.String())

	o, err := orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{croissant.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	follow("order:" + o.ID.String())

	if o.CanReportProblem {
		t.Error("an order still to collect can take a problem")
	}

	_, err = orders.ReportProblem(customer, o.ID, "", order.ProblemMissingItem, "")
	mustFail(t, "an order still to collect", err, order.ErrProblemNotAllowed)

	if _, err := orders.HandOver(owner, o.ID); err != nil {
		t.Fatal(err)
	}

	checkReportRefusals(t, f, orders, o.ID)

	_, err = orders.AnswerProblem(owner, o.ID, "Xin lỗi bạn")
	mustFail(t, "an answer before any report", err, order.ErrProblemNotFound)

	reported, err := orders.ReportProblem(customer, o.ID, "", order.ProblemMissingItem, "  thiếu 1 bánh mì chà bông  ")
	if err != nil || reported.Problem == nil || reported.Problem.Kind != order.ProblemMissingItem ||
		reported.Problem.Note != "thiếu 1 bánh mì chà bông" || reported.Problem.AnsweredAt != nil || reported.CanReportProblem {
		t.Fatalf("reported %+v, can report %v, %v", reported.Problem, reported.CanReportProblem, err)
	}

	_, err = orders.ReportProblem(customer, o.ID, "", order.ProblemPoorQuality, "")
	mustFail(t, "reporting twice", err, order.ErrProblemAlreadyReported)

	checkAnswers(t, f, orders, o.ID)

	if read, err := orders.Get(admin, o.ID, ""); err != nil || read.Problem == nil || read.Problem.Answer == "" {
		t.Errorf("admins read the problem: %+v, %v", read.Problem, err)
	}

	number := order.Number(o.Number)
	f.expectPushes(t, o.ID, []pushed{
		{"seller:" + shop.String(), "Đơn mới " + number, "Croissant · lấy "},
		{"seller:" + shop.String(), "Khách báo vấn đề với đơn " + number, "Thiếu món"},
		{"order:" + o.ID.String(), "La Paris đã trả lời", "Về vấn đề bạn báo với đơn " + number},
	})
}

// checkReportRefusals: a report of an unknown kind, with too long a note or a
// control character, or from a stranger or the store is refused.
func checkReportRefusals(t *testing.T, f fixture, orders *order.Service, id uuid.UUID) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)

	for name, err := range map[string]error{
		"an unknown kind": second(orders.ReportProblem(customer, id, "", "late", "")),
		"a note too long": second(orders.ReportProblem(customer, id, "", order.ProblemWrongItem, strings.Repeat("ế", 501))),
		"a control char":  second(orders.ReportProblem(customer, id, "", order.ProblemWrongItem, "thiếu\x00món")),
	} {
		mustFail(t, name, err, order.ErrProblemInvalid)
	}

	_, err := orders.ReportProblem(stranger, id, "", order.ProblemMissingItem, "")
	mustFail(t, "a stranger", err, order.ErrNotFound)

	_, err = orders.ReportProblem(owner, id, "", order.ProblemMissingItem, "")
	mustFail(t, "the store", err, order.ErrNotFound)
}

// checkAnswers: only the store answers, in 1 to 500 letters, once; the
// customer then reads the answer.
func checkAnswers(t *testing.T, f fixture, orders *order.Service, id uuid.UUID) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	stranger := f.as(t, "stranger", platform.RoleCustomer)

	_, err := orders.AnswerProblem(customer, id, "Tự trả lời")
	mustFail(t, "the customer answering", err, order.ErrNotFound)

	_, err = orders.AnswerProblem(stranger, id, "Không phải quán")
	mustFail(t, "a stranger answering", err, order.ErrNotFound)

	for name, answer := range map[string]string{"blank": "   ", "too long": strings.Repeat("a", 501)} {
		_, err = orders.AnswerProblem(owner, id, answer)
		mustFail(t, "an answer "+name, err, order.ErrAnswerInvalid)
	}

	answered, err := orders.AnswerProblem(owner, id, " Xin lỗi bạn, lần tới quán gửi lại 1 bánh mì. ")
	if err != nil || answered.Problem == nil || answered.Problem.Answer != "Xin lỗi bạn, lần tới quán gửi lại 1 bánh mì." ||
		answered.Problem.AnsweredAt == nil {
		t.Fatalf("answered %+v, %v", answered.Problem, err)
	}

	_, err = orders.AnswerProblem(owner, id, "Lần hai")
	mustFail(t, "answering twice", err, order.ErrProblemAlreadyAnswered)

	read, err := orders.Get(customer, id, "")
	if err != nil || read.Problem == nil || read.Problem.Answer != answered.Problem.Answer {
		t.Errorf("the customer reads the answer: %+v, %v", read.Problem, err)
	}
}

// testProblemWithinTwoDays: an expired order takes a problem, as when the store
// was closed, also from a customer without an account holding its access; an
// order collected more than two days ago takes none.
func testProblemWithinTwoDays(t *testing.T, f fixture) {
	t.Helper()

	owner := f.as(t, "owner", platform.RoleCustomer)
	customer := f.as(t, "customer", platform.RoleCustomer)
	shop := f.shop(owner, t, "Panda Chef")
	bao := f.post(owner, t, shop, "Bánh bao", 5, 20_000, time.Now())
	guest := t.Context()

	missed, err := f.orders.Place(guest, key(), uuid.Nil, someone, []order.Wanted{{bao.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	f.shift(t, missed.ID, -3*time.Hour)

	_, err = f.orders.ReportProblem(guest, missed.ID, "", order.ProblemStoreClosed, "")
	mustFail(t, "without its access", err, order.ErrNotFound)

	expired, err := f.orders.ReportProblem(guest, missed.ID, missed.Access, order.ProblemStoreClosed, "")
	if err != nil || expired.Status != order.StatusExpired || expired.Problem == nil || expired.Problem.Kind != order.ProblemStoreClosed {
		t.Fatalf("an expired order: %v %+v, %v", expired.Status, expired.Problem, err)
	}

	late, err := f.orders.Place(customer, key(), uuid.Nil, someone, []order.Wanted{{bao.ID, 1}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := f.orders.HandOver(owner, late.ID); err != nil {
		t.Fatal(err)
	}

	if _, err := f.pool.Exec(t.Context(), `UPDATE order_orders SET collected_at = now() - interval '49 hours' WHERE id = $1`, late.ID); err != nil {
		t.Fatal(err)
	}

	if read, err := f.orders.Get(customer, late.ID, ""); err != nil || read.CanReportProblem {
		t.Errorf("collected 49 hours ago reads as reportable: %v", err)
	}

	_, err = f.orders.ReportProblem(customer, late.ID, "", order.ProblemPoorQuality, "")
	mustFail(t, "collected 49 hours ago", err, order.ErrProblemNotAllowed)
}

// second returns the error of a call that also returns a value.
func second[T any](_ T, err error) error { return err }
