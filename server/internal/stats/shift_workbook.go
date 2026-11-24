package stats

import (
	"fmt"
	"time"

	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/order"
)

// The words of the workbook by shift (#261), as the sponsor's hand-made
// reports of 22 and 24 November 2026 put them.
const (
	sheetShiftSummary = "Tổng hợp"
	wordWholeDay      = "Cả ngày"
	wordShiftTotal    = "Tổng ca"
	wordPosted        = "Suất đăng"
	wordCollected     = "Đã nhận"
	wordApp           = "Trong đó đặt qua app"
	wordCounter       = "Phát trực tiếp tại quầy"
	wordNotTaken      = "Không nhận"
	dayText           = "02-01-2006"
	clockText         = "15:04"
)

// portionHeader heads the portions of a row, after its own columns.
var portionHeader = []any{wordPosted, wordCollected, wordApp, wordCounter, wordNotTaken}

// customerHeader heads a list of orders on the app, after its STT, day and
// shift when it has them.
var customerHeader = []any{
	"Mã đơn", wordStore, "Khách hàng", "Số điện thoại", "Món", "Số lượng", "Giờ đặt", "Khung giờ nhận",
	"Trạng thái", "Xác nhận bởi",
}

// statusWords are an order's states as the admins' list words them; a
// refused or expired order is worded by how it ended, as "Đơn không thành".
var statusWords = map[order.Status]string{
	order.StatusConfirmed: "Đã xác nhận", order.StatusReady: "Sẵn sàng", order.StatusCollected: "Đã nhận",
	order.StatusExpired: endingWords["expired"],
}

var sideWords = map[order.Side]string{order.SideSeller: "Quán giao", order.SideCustomer: "Khách xác nhận"}

// shiftWorkbook writes r as an .xlsx workbook: "Tổng hợp" first, then a sheet
// per day, "Ngày DD-MM". Figures are numbers; names, phones, days and times
// are text in Vietnam's time, never formulas.
func shiftWorkbook(r shiftReport) ([]byte, error) {
	f := excelize.NewFile()
	defer f.Close() //nolint:errcheck // an in-memory file holds nothing to release

	sheets := []sheet{{sheetShiftSummary, shiftSummaryRows(r)}}
	for _, d := range r.Days {
		sheets = append(sheets, sheet{daySheetName(d.Day), shiftDayRows(r.Scope, d)})
	}

	for i, s := range sheets {
		if err := addSheet(f, i, s); err != nil {
			return nil, err
		}

		if err := f.SetColWidth(s.name, "A", "M", 16); err != nil {
			return nil, fmt.Errorf("widening the sheet %q: %w", s.name, err)
		}
	}

	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("writing the workbook: %w", err)
	}

	return buf.Bytes(), nil
}

// daySheetName names a day's sheet; the range holds at most 92 days, so the
// day and month tell them apart.
func daySheetName(day time.Time) string {
	return "Ngày " + day.Format("02-01")
}

// shiftWorkbookName names the file by its days.
func shiftWorkbookName(r shiftReport) string {
	return fmt.Sprintf("bao-cao-theo-ca-%s-den-%s.xlsx", r.Since.Format(time.DateOnly), r.Until.Format(time.DateOnly))
}

func portionCells(p sharePortions) []any {
	return []any{p.Posted, p.collected(), p.App, p.Counter, p.NotTaken}
}

// window is when a shift's or an order's windows run, in Vietnam.
func window(from, to time.Time) string {
	return from.In(vietnam).Format(clockText) + "–" + to.In(vietnam).Format(clockText)
}

func shiftSummaryRows(r shiftReport) [][]any {
	rows := [][]any{
		{"Báo cáo Second Bite theo ca", r.Since.Format(dayText) + " đến " + r.Until.Format(dayText)},
		{wordStore, r.Scope},
		{"Ca", "Ca chiều: khung nhận bắt đầu trước 17:00; Ca tối: từ 17:00 (giờ Việt Nam)"},
		{},
		append([]any{"Ngày", "Ca", "Khung giờ", "Số cửa hàng"}, portionHeader...),
	}

	for _, d := range r.Days {
		day := d.Day.Format(dayText)

		for _, p := range d.Shifts {
			rows = append(rows, append([]any{day, shiftWords[p.Shift], window(p.From, p.To), p.Stores}, portionCells(p.Portions)...))
		}

		rows = append(rows, append([]any{day, wordWholeDay, "", d.Stores}, portionCells(d.Portions)...))
	}

	rows = append(rows,
		append([]any{csvTotal, "", "", r.Stores}, portionCells(r.Portions)...),
		[]any{},
		[]any{"Người đặt qua app (số điện thoại khác nhau, đơn đã nhận)", r.People},
		[]any{"Suất phát trực tiếp tại quầy", r.Portions.Counter},
		[]any{},
		[]any{"Đơn đặt qua app"},
		append([]any{"STT", "Ngày", "Ca"}, customerHeader...),
	)

	for i, c := range r.Customers {
		rows = append(rows, append([]any{i + 1, c.Day.Format(dayText), shiftWords[c.Shift]}, customerCells(c)...))
	}

	return rows
}

func shiftDayRows(scope string, d shiftDay) [][]any {
	rows := [][]any{
		{"Ngày " + d.Day.Format(dayText), weekdayWords[(int(d.Day.Weekday())+6)%7]},
		{wordStore, scope},
		{},
	}

	if len(d.Shifts) == 0 {
		return append(rows, []any{"Không có suất đăng hay đơn nào trong ngày."})
	}

	rows = append(rows, append([]any{"Ca", "Khung giờ", "Số cửa hàng"}, portionHeader...))
	for _, p := range d.Shifts {
		rows = append(rows, append([]any{shiftWords[p.Shift], window(p.From, p.To), p.Stores}, portionCells(p.Portions)...))
	}

	rows = append(rows, append([]any{wordWholeDay, "", d.Stores}, portionCells(d.Portions)...))

	for _, p := range d.Shifts {
		title := fmt.Sprintf("%s (%s)", shiftWords[p.Shift], window(p.From, p.To))

		rows = append(rows, []any{}, []any{title + " · theo cửa hàng và món"}, append([]any{wordStore, "Món"}, portionHeader...))
		for _, dp := range p.Dishes {
			rows = append(rows, append([]any{dp.Store, dp.Dish}, portionCells(dp.sharePortions)...))
		}

		rows = append(rows, append([]any{wordShiftTotal, ""}, portionCells(p.Portions)...),
			[]any{}, []any{title + " · khách đặt qua app"})

		if len(p.Customers) == 0 {
			rows = append(rows, []any{"Không có đơn đặt qua app."})

			continue
		}

		rows = append(rows, append([]any{"STT"}, customerHeader...))
		for i, c := range p.Customers {
			rows = append(rows, append([]any{i + 1}, customerCells(c)...))
		}
	}

	return rows
}

// customerCells are an order's dish with its customer, as customerHeader
// names them.
func customerCells(c customerLine) []any {
	o := c.Order

	status := statusWords[o.Status]
	if o.Status == order.StatusRefused {
		if status = endingWords["refused_"+string(o.RefuseReason)]; status == "" {
			status = "Quán từ chối"
		}
	}

	return []any{
		order.Number(o.Number), o.SellerName, o.Contact.Name, o.Contact.Phone, c.Dish, c.Units,
		o.CreatedAt.In(vietnam).Format(dayText + " " + clockText), window(o.WindowStart, o.WindowEnd),
		status, sideWords[o.CollectedBy],
	}
}
