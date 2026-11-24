package stats

import (
	"fmt"
	"time"

	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/order"
)

// The shift workbook's words, in Vietnamese as the report's are.
const (
	sheetShiftSummary = "Tổng hợp"
	wholeDay          = "Cả ngày"
	noOrdersInShift   = "Không có đơn nào trong ca này"
)

// statusWords are the statuses of an order as the screens word them.
var statusWords = map[order.Status]string{
	order.StatusConfirmed: "Đã đặt", order.StatusReady: "Sẵn sàng", order.StatusCollected: "Đã nhận",
	order.StatusCancelled: "Khách huỷ", order.StatusRefused: "Quán từ chối", order.StatusExpired: "Hết giờ, khách không đến",
}

// summaryHeader and orderHeader head the tables of the workbook.
var (
	summaryHeader = []any{"Ca", "Giờ", "Số gian hàng", "Số suất đăng", "Đã nhận", "Không nhận", "Số đơn"}
	orderHeader   = []any{
		"Mã đơn", "Gian hàng", "Khách hàng", "Số điện thoại", "Món đặt", "SL", "Giờ đặt", "Khung nhận", "Trạng thái",
	}
)

// shiftSheet is a sheet with what styles it: the rows of its title, of its
// block titles and of its tables' headers, counted from 1.
type shiftSheet struct {
	sheet
	titles, headers []int
	widths          []float64
}

// shiftWorkbook writes r as an .xlsx workbook: a summary of the range and a
// sheet per day, each with the day's summary and a table per shift of its
// orders and their buyers. Figures are numbers; names, phone numbers and
// times are text, so a phone keeps its zero and nothing a person typed runs as
// a formula.
func shiftWorkbook(r ShiftReport) ([]byte, error) {
	f := excelize.NewFile()
	defer f.Close() //nolint:errcheck // an in-memory file holds nothing to release

	sheets := []shiftSheet{rangeSheet(r)}
	for _, d := range r.Days {
		sheets = append(sheets, daySheet(d))
	}

	title, err := f.NewStyle(&excelize.Style{Font: &excelize.Font{Bold: true, Size: 14}})
	if err != nil {
		return nil, fmt.Errorf("styling the workbook's titles: %w", err)
	}

	header, err := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true},
		Fill:      excelize.Fill{Type: "pattern", Pattern: 1, Color: []string{"D8F0FA"}},
		Alignment: &excelize.Alignment{Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, fmt.Errorf("styling the workbook's headers: %w", err)
	}

	for i, s := range sheets {
		if err := addSheet(f, i, s.sheet); err != nil {
			return nil, err
		}

		if err := styleSheet(f, s, title, header); err != nil {
			return nil, err
		}
	}

	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("writing the shift workbook: %w", err)
	}

	return buf.Bytes(), nil
}

// styleSheet sets the widths and the styles of s.
func styleSheet(f *excelize.File, s shiftSheet, title, header int) error {
	for i, w := range s.widths {
		col, err := excelize.ColumnNumberToName(i + 1)
		if err != nil {
			return fmt.Errorf("naming a column: %w", err)
		}

		if err := f.SetColWidth(s.name, col, col, w); err != nil {
			return fmt.Errorf("sizing the sheet %q: %w", s.name, err)
		}
	}

	for _, row := range s.titles {
		cell := fmt.Sprintf("A%d", row)
		if err := f.SetCellStyle(s.name, cell, cell, title); err != nil {
			return fmt.Errorf("styling the sheet %q: %w", s.name, err)
		}
	}

	for _, row := range s.headers {
		from, to := fmt.Sprintf("A%d", row), fmt.Sprintf("%s%d", lastColumn(s), row)
		if err := f.SetCellStyle(s.name, from, to, header); err != nil {
			return fmt.Errorf("styling the sheet %q: %w", s.name, err)
		}
	}

	return nil
}

// lastColumn names the last column a sheet's tables use.
func lastColumn(s shiftSheet) string {
	name, _ := excelize.ColumnNumberToName(len(s.widths)) //nolint:errcheck // the widths are few

	return name
}

// rangeSheet is the first sheet: a row per day and shift, and the totals.
func rangeSheet(r ShiftReport) shiftSheet {
	s := shiftSheet{
		sheet:  sheet{name: sheetShiftSummary},
		widths: []float64{14, 16, 14, 14, 14, 12, 12, 10},
	}

	s.add(rangeTitle(r))
	s.titles = append(s.titles, 1)
	s.add(shiftsLine(r.Shifts))
	s.add()
	s.header(append([]any{"Ngày"}, summaryHeader...))

	for _, d := range r.Days {
		for _, b := range d.Shifts {
			s.add(append([]any{dayText(d.Day)}, summaryRow(b.Name, hours(b.Shift), b.Summary)...)...)
		}

		s.add(append([]any{dayText(d.Day)}, summaryRow(wholeDay, "", d.Summary)...)...)
	}

	s.add(append([]any{"Tổng"}, summaryRow(wholeDay, "", r.Totals)...)...)

	return s
}

// daySheet is a day's sheet: its title, its summary and a table per shift.
func daySheet(d ShiftDay) shiftSheet {
	s := shiftSheet{
		sheet:  sheet{name: "Ngày " + d.Day.Format("02-01")},
		widths: []float64{14, 28, 24, 16, 34, 6, 14, 14, 24},
	}

	s.add("Second Bite – Báo cáo ngày " + dayText(d.Day))
	s.titles = append(s.titles, 1)
	s.add()
	s.add("Tổng hợp cả ngày")
	s.titles = append(s.titles, 3)
	s.header(summaryHeader)

	for _, b := range d.Shifts {
		s.add(summaryRow(b.Name, hours(b.Shift), b.Summary)...)
	}

	s.add(summaryRow(wholeDay, "", d.Summary)...)

	for _, b := range d.Shifts {
		s.add()
		s.add(fmt.Sprintf("%s (%s)", b.Name, hours(b.Shift)))
		s.titles = append(s.titles, len(s.rows))
		s.header(orderHeader)

		if len(b.Orders) == 0 {
			s.add(noOrdersInShift)

			continue
		}

		for _, o := range b.Orders {
			s.add(orderRow(o)...)
		}
	}

	return s
}

// add appends a row; header appends one that is styled as the head of a table.
func (s *shiftSheet) add(values ...any) { s.rows = append(s.rows, values) }

func (s *shiftSheet) header(values []any) {
	s.rows = append(s.rows, values)
	s.headers = append(s.headers, len(s.rows))
}

// summaryRow is a summary's cells after the shift's name and hours.
func summaryRow(name, span string, m ShiftSummary) []any {
	return []any{name, span, m.Stores, m.UnitsPosted, m.UnitsCollected, m.UnitsNotCollected, m.Orders}
}

// orderRow is an order's cells: text but the units.
func orderRow(o ShiftOrder) []any {
	return []any{
		fmt.Sprintf("SB-%d", o.Number), o.Store, o.Customer, o.Phone, o.Dishes, o.Units,
		orderedText(o), hoursOf(o.WindowStart, o.WindowEnd), statusWords[o.Status],
	}
}

// hours writes a shift's span, 06:00–12:00.
func hours(sh Shift) string { return sh.From + "–" + sh.Until }

// hoursOf writes a window's span in Vietnam, 14:00–16:00.
func hoursOf(start, end time.Time) string {
	return start.In(vietnam).Format("15:04") + "–" + end.In(vietnam).Format("15:04")
}

// orderedText is when an order was placed in Vietnam: the time, with the day
// when it was not the window's.
func orderedText(o ShiftOrder) string {
	at := o.OrderedAt.In(vietnam)
	if dayOf(at) != dayOf(o.WindowStart) {
		return at.Format("02/01 15:04")
	}

	return at.Format("15:04")
}

// dayText writes a day as Vietnam writes it.
func dayText(day time.Time) string { return day.Format("02/01/2006") }

func rangeTitle(r ShiftReport) string {
	return "Second Bite – Báo cáo theo ca từ " + dayText(r.Since) + " đến " + dayText(r.Until)
}

// shiftsLine names the shifts a workbook was cut by, as the admin set them.
func shiftsLine(shifts []Shift) string {
	line := "Các ca:"
	for _, sh := range shifts {
		line += fmt.Sprintf(" %s %s;", sh.Name, hours(sh))
	}

	return line
}

// shiftWorkbookName names the file by its days.
func shiftWorkbookName(r ShiftReport) string {
	return fmt.Sprintf("bao-cao-theo-ca-%s-den-%s.xlsx", r.Since.Format(time.DateOnly), r.Until.Format(time.DateOnly))
}
