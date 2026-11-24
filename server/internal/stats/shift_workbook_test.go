package stats

import (
	"bytes"
	"testing"

	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
)

// TestShiftWorkbook opens the workbook of a range of two days: a sheet of the
// range and one a day, the figures as numbers, the phone with its zero, a name
// that would be a formula kept as text, and a shift without orders saying so.
func TestShiftWorkbook(t *testing.T) {
	t.Parallel()

	formula := shiftOrder(2, pho, 12, 30, order.StatusCollected, 1)
	formula.Contact.Name = "=HYPERLINK(\"http://example.com\")"
	formula.SellerName = "@Quán"

	r := buildShiftReport(
		ShiftFilter{Since: day, Until: day.AddDate(0, 0, 1), Shifts: DefaultShifts()},
		[]order.Order{shiftOrder(1, pho, 11, 59, order.StatusCollected, 2), formula},
		[]offer.PostDay{{Day: day, SellerID: pho, Units: 9}},
		[][]offer.PostDay{{{Day: day, SellerID: pho, Units: 4}}, {{Day: day, SellerID: pho, Units: 5}}, nil},
	)

	body, err := shiftWorkbook(r)
	if err != nil {
		t.Fatal(err)
	}

	f, err := excelize.OpenReader(bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close() //nolint:errcheck // read from memory

	if got := f.GetSheetList(); len(got) != 3 || got[0] != sheetShiftSummary || got[1] != "Ngày 22-11" || got[2] != "Ngày 23-11" {
		t.Fatalf("sheets %q, want the range's and one a day", got)
	}

	if got := readCell(t, f, "Ngày 22-11", "A1"); got != "Second Bite – Báo cáo ngày 22/11/2026" {
		t.Errorf("the day's title is %q", got)
	}

	checkShiftDaySheet(t, f)

	if got := readCell(t, f, sheetShiftSummary, "A1"); got != "Second Bite – Báo cáo theo ca từ 22/11/2026 đến 23/11/2026" {
		t.Errorf("the range's title is %q", got)
	}

	if got := shiftWorkbookName(r); got != "bao-cao-theo-ca-2026-11-22-den-2026-11-23.xlsx" {
		t.Errorf("named %q", got)
	}
}

// checkShiftDaySheet reads the first day's sheet: its summary and its tables.
func checkShiftDaySheet(t *testing.T, f *excelize.File) {
	t.Helper()

	const sheet = "Ngày 22-11"

	// Row 4 heads the summary; the morning follows, then the afternoon.
	if got := readCell(t, f, sheet, "A5"); got != "Ca sáng" {
		t.Errorf("the first summary row is %q, want Ca sáng", got)
	}

	if kind, err := f.GetCellType(sheet, "C6"); err != nil || isText(kind) {
		t.Errorf("the afternoon's stores are %v (%v), want a number", kind, err)
	}

	if got := readCell(t, f, sheet, "C6"); got != "1" {
		t.Errorf("the afternoon's stores read %q, want 1", got)
	}

	if _, ok := findCell(t, f, sheet, noOrdersInShift); !ok {
		t.Error("the night, with no order, does not say so")
	}

	if cell, ok := findCell(t, f, sheet, "0912345678"); !ok || !isText(cellKind(t, f, sheet, cell)) {
		t.Error("a phone number was written as a number, losing its zero")
	}

	for _, text := range []string{"=HYPERLINK(\"http://example.com\")", "@Quán"} {
		cell, ok := findCell(t, f, sheet, text)
		if !ok {
			t.Fatalf("%q is not in the sheet", text)
		}

		formula, err := f.GetCellFormula(sheet, cell)
		if err != nil || formula != "" || !isText(cellKind(t, f, sheet, cell)) {
			t.Errorf("%q was written as a formula (%q, %v)", text, formula, err)
		}
	}
}

// findCell names the first cell of the sheet that reads as text.
func findCell(t *testing.T, f *excelize.File, sheet, text string) (string, bool) {
	t.Helper()

	rows, err := f.GetRows(sheet)
	if err != nil {
		t.Fatal(err)
	}

	for i, row := range rows {
		for j, v := range row {
			if v != text {
				continue
			}

			cell, err := excelize.CoordinatesToCellName(j+1, i+1)
			if err != nil {
				t.Fatal(err)
			}

			return cell, true
		}
	}

	return "", false
}

func cellKind(t *testing.T, f *excelize.File, sheet, cell string) excelize.CellType {
	t.Helper()

	kind, err := f.GetCellType(sheet, cell)
	if err != nil {
		t.Fatal(err)
	}

	return kind
}
