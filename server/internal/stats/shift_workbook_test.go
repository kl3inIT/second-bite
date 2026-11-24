package stats

import (
	"bytes"
	"slices"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
)

// The pilot's figures the tests read more than once.
const (
	laParis     = "La Paris"
	breadName   = "Bánh mì"
	sunday22    = "22-11-2026"
	breadWindow = "16:59–17:30"
)

// vn is a time of 22 to 24 November 2026 in Vietnam.
func vn(day, hour, minute int) time.Time {
	return time.Date(2026, time.November, day, hour, minute, 0, 0, vietnam)
}

// shiftDays are three days of the pilot: on the 22nd Cô Ba posts 10 bánh mì
// at 16:59 (the afternoon's) and La Paris 6 cakes at 17:00 (the evening's),
// which nobody orders on the app; on the 23rd nothing; on the 24th Cô Ba 4 at
// 18:30. Its orders: on the bánh mì, 3 collected, 2 expired, 1 refused for no
// show and 4 cancelled; on the 24th, 2 collected by a phone that collected
// on the 22nd too, and 1 still open.
func shiftDays() ([]offer.Post, []order.Order) {
	coBaID, parisID := uuid.New(), uuid.New()
	banhMi, cake, late := uuid.New(), uuid.New(), uuid.New()

	posts := []offer.Post{
		{ID: banhMi, SellerID: coBaID, SellerName: coBa, Name: breadName, Units: 10, WindowStart: vn(22, 16, 59), WindowEnd: vn(22, 17, 30)},
		{ID: cake, SellerID: parisID, SellerName: laParis, Name: "Bánh ngọt", Units: 6, WindowStart: vn(22, 17, 0), WindowEnd: vn(22, 19, 0)},
		{ID: late, SellerID: coBaID, SellerName: coBa, Name: "Xôi", Units: 4, WindowStart: vn(24, 18, 30), WindowEnd: vn(24, 20, 0)},
	}

	ordered := func(n int64, status order.Status, phone string, offerID uuid.UUID, units int, start, end time.Time) order.Order {
		o := order.Order{
			Number: n, SellerID: coBaID, SellerName: coBa, Status: status,
			Contact:     order.Contact{Name: "Khách " + phone, Phone: phone},
			Lines:       []order.Line{{OfferID: offerID, Name: breadName, Units: units}},
			WindowStart: start, WindowEnd: end, CreatedAt: start.Add(-2 * time.Hour),
		}
		if offerID == late {
			o.Lines[0].Name = "Xôi"
		}

		if status == order.StatusCollected {
			o.CollectedBy = order.SideSeller
		}

		return o
	}

	orders := []order.Order{
		ordered(24001, order.StatusCollected, "0912000001", banhMi, 2, vn(22, 16, 59), vn(22, 17, 30)),
		ordered(24002, order.StatusCollected, "0912000002", banhMi, 1, vn(22, 16, 59), vn(22, 17, 30)),
		ordered(24003, order.StatusExpired, "0912000003", banhMi, 2, vn(22, 16, 59), vn(22, 17, 30)),
		ordered(24004, order.StatusCancelled, "0912000004", banhMi, 4, vn(22, 16, 59), vn(22, 17, 30)),
		ordered(24005, order.StatusRefused, "0912000005", banhMi, 1, vn(22, 16, 59), vn(22, 17, 30)),
		ordered(24101, order.StatusCollected, "0912000001", late, 2, vn(24, 18, 30), vn(24, 20, 0)),
		ordered(24102, order.StatusConfirmed, "0912000006", late, 1, vn(24, 18, 30), vn(24, 20, 0)),
	}
	orders[4].RefuseReason = "no_show"
	orders[5].CollectedBy = order.SideCustomer

	return posts, orders
}

func day(d int) time.Time { return time.Date(2026, time.November, d, 0, 0, 0, 0, time.UTC) }

// TestShiftReport checks the figures by day and shift: the shift starts at
// 17:00 in Vietnam, the portions held by no order on the app are handed out at
// the counter, a cancelled order counts for nothing, a day without posts has
// no shift, and the people who collected are told apart by phone.
func TestShiftReport(t *testing.T) {
	t.Parallel()

	posts, orders := shiftDays()
	r := shiftReportOf(day(22), day(24), wordAllStores, posts, orders)

	if len(r.Days) != 3 || len(r.Days[0].Shifts) != 2 || len(r.Days[1].Shifts) != 0 || len(r.Days[2].Shifts) != 1 {
		t.Fatalf("days %+v", r.Days)
	}

	checkShiftParts(t, r)

	// The order still open holds its portion: neither collected, not taken nor at the counter.
	if got := r.Days[2].Portions; got != (sharePortions{Posted: 4, App: 2, Counter: 1}) {
		t.Errorf("the 24th %+v", got)
	}

	if r.Portions != (sharePortions{Posted: 20, App: 5, Counter: 11, NotTaken: 3}) || r.Portions.collected() != 16 ||
		r.Stores != 2 || r.People != 2 {
		t.Errorf("the range %+v, %d stores, %d people", r.Portions, r.Stores, r.People)
	}
}

// checkShiftParts reads the 22nd's two shifts.
func checkShiftParts(t *testing.T, r shiftReport) {
	t.Helper()

	afternoon, evening := r.Days[0].Shifts[0], r.Days[0].Shifts[1]

	// 10 bánh mì: 3 collected on the app, 3 not taken (2 expired, 1 refused), 4 at the counter: the 4 cancelled
	// came back to it.
	if afternoon.Shift != shiftAfternoon || afternoon.Portions != (sharePortions{Posted: 10, App: 3, Counter: 4, NotTaken: 3}) ||
		window(afternoon.From, afternoon.To) != breadWindow || afternoon.Stores != 1 {
		t.Errorf("the afternoon %+v", afternoon)
	}

	// A post nobody ordered on the app is handed out at the counter whole.
	if evening.Shift != shiftEvening || evening.Portions != (sharePortions{Posted: 6, Counter: 6}) ||
		evening.Dishes[0].Store != laParis || len(evening.Customers) != 0 {
		t.Errorf("the evening %+v", evening)
	}

	// The cancelled order is not listed; the others are, the earliest window first.
	if got := len(afternoon.Customers); got != 4 || slices.ContainsFunc(r.Customers, func(c customerLine) bool {
		return c.Order.Status == order.StatusCancelled
	}) {
		t.Errorf("%d customers in the afternoon, %d in all, want 4 and 6 without the cancelled", got, len(r.Customers))
	}
}

// TestShiftWorkbook opens the workbook with a real reader: "Tổng hợp" first,
// a sheet per day, the figures numbers, and each order with its customer.
func TestShiftWorkbook(t *testing.T) {
	t.Parallel()

	posts, orders := shiftDays()
	r := shiftReportOf(day(22), day(24), wordAllStores, posts, orders)

	body, err := shiftWorkbook(r)
	if err != nil {
		t.Fatal(err)
	}

	f, err := excelize.OpenReader(bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close() //nolint:errcheck // read from memory

	want := []string{sheetShiftSummary, "Ngày 22-11", "Ngày 23-11", "Ngày 24-11"}
	if got := f.GetSheetList(); !slices.Equal(got, want) {
		t.Fatalf("sheets %q, want %q", got, want)
	}

	if got := shiftWorkbookName(r); got != "bao-cao-theo-ca-2026-11-22-den-2026-11-24.xlsx" {
		t.Errorf("named %q", got)
	}

	summary := rowsOf(t, f, sheetShiftSummary)

	if !slices.Equal(summary[4], []string{"Ngày", "Ca", "Khung giờ", "Số cửa hàng", wordPosted, wordCollected, wordApp, wordCounter, wordNotTaken}) {
		t.Errorf("the summary's header %q", summary[4])
	}

	for _, row := range [][]string{
		{sunday22, "Ca chiều", breadWindow, "1", "10", "7", "3", "4", "3"},
		{sunday22, "Ca tối", "17:00–19:00", "1", "6", "6", "0", "6", "0"},
		{sunday22, wordWholeDay, "", "2", "16", "13", "3", "10", "3"},
		{"23-11-2026", wordWholeDay, "", "0", "0", "0", "0", "0", "0"},
		{csvTotal, "", "", "2", "20", "16", "5", "11", "3"},
		{"Người đặt qua app (số điện thoại khác nhau, đơn đã nhận)", "2"},
		{"Suất phát trực tiếp tại quầy", "11"},
		{
			"1", sunday22, "Ca chiều", "SB-24001", coBa, "Khách 0912000001", "0912000001", breadName, "2",
			sunday22 + " 14:59", breadWindow, "Đã nhận", "Quán giao",
		},
		{
			"4", sunday22, "Ca chiều", "SB-24005", coBa, "Khách 0912000005", "0912000005", breadName, "1",
			sunday22 + " 14:59", breadWindow, "Quán từ chối: khách không đến",
		},
	} {
		if !slices.ContainsFunc(summary, func(got []string) bool { return slices.Equal(got, row) }) {
			t.Errorf("the summary has no row %q", row)
		}
	}

	checkShiftFigures(t, f)
	checkShiftDays(t, f)
}

// checkShiftFigures: a figure is a number and a phone text, its leading zero kept.
func checkShiftFigures(t *testing.T, f *excelize.File) {
	t.Helper()

	if kind, err := f.GetCellType(sheetShiftSummary, "E6"); err != nil || isText(kind) {
		t.Errorf("a figure is text: %v, %v", kind, err)
	}

	cell := findCell(t, f, sheetShiftSummary, "0912000001")
	if kind, _ := f.GetCellType(sheetShiftSummary, cell); !isText(kind) {
		t.Errorf("a phone is not text: %v", kind)
	}
}

// checkShiftDays reads the days' sheets: the shifts' tables by store and dish
// and their customers, and a day without posts.
func checkShiftDays(t *testing.T, f *excelize.File) {
	t.Helper()

	first := rowsOf(t, f, "Ngày 22-11")
	for _, row := range [][]string{
		{"Ngày " + sunday22, "Chủ nhật"},
		{"Ca chiều (" + breadWindow + ") · theo cửa hàng và món"},
		{coBa, breadName, "10", "7", "3", "4", "3"},
		{wordShiftTotal, "", "10", "7", "3", "4", "3"},
		{"Ca tối (17:00–19:00) · theo cửa hàng và món"},
		{laParis, "Bánh ngọt", "6", "6", "0", "6", "0"},
		{"Ca tối (17:00–19:00) · khách đặt qua app"},
		{"Không có đơn đặt qua app."},
		{
			"3", "SB-24003", coBa, "Khách 0912000003", "0912000003", breadName, "2", sunday22 + " 14:59", breadWindow,
			"Hết giờ, khách không đến",
		},
	} {
		if !slices.ContainsFunc(first, func(got []string) bool { return slices.Equal(got, row) }) {
			t.Errorf("the 22nd has no row %q", row)
		}
	}

	if empty := rowsOf(t, f, "Ngày 23-11"); len(empty) != 4 || empty[3][0] != "Không có suất đăng hay đơn nào trong ngày." {
		t.Errorf("the 23rd %q", empty)
	}

	last := rowsOf(t, f, "Ngày 24-11")
	if !slices.ContainsFunc(last, func(got []string) bool {
		return slices.Equal(got, []string{
			"1", "SB-24101", coBa, "Khách 0912000001", "0912000001", "Xôi", "2",
			"24-11-2026 16:30", "18:30–20:00", "Đã nhận", "Khách xác nhận",
		})
	}) {
		t.Errorf("the 24th %q", last)
	}
}

func rowsOf(t *testing.T, f *excelize.File, sheet string) [][]string {
	t.Helper()

	rows, err := f.GetRows(sheet)
	if err != nil {
		t.Fatal(err)
	}

	return rows
}

// findCell names the first cell of sheet holding value.
func findCell(t *testing.T, f *excelize.File, sheet, value string) string {
	t.Helper()

	cells, err := f.SearchSheet(sheet, value)
	if err != nil || len(cells) == 0 {
		t.Fatalf("no cell holds %q: %v", value, err)
	}

	return cells[0]
}
