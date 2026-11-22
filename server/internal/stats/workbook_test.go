package stats

import (
	"bytes"
	"testing"

	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
)

// TestReportWorkbook opens the workbook of twoDays and reads its sheets: the
// summary's figures are numbers, the store named as a formula stays text, and
// the analysis fills its sheets.
func TestReportWorkbook(t *testing.T) {
	t.Parallel()

	a := Analysis{
		Kinds:     map[offer.Kind]Portions{offer.KindBakery: {Posted: 5, Collected: 3}},
		Discounts: map[string]Portions{DiscountFrom50: {Posted: 5, Collected: 3}},
		TopSold:   []DishRank{{Name: "Bánh mì", SellerName: coBa, Unit: "cái", Posted: 5, Collected: 3}},
		Orders: order.Analysis{
			Slots:    []order.Slot{{Weekday: 2, Hour: 19, Held: 3, Collected: 2}},
			Failures: map[string]int{"expired": 1},
		},
	}

	body, err := reportWorkbook(twoDays(), a, false)
	if err != nil {
		t.Fatal(err)
	}

	f, err := excelize.OpenReader(bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close() //nolint:errcheck // read from memory

	want := []string{sheetSummary, sheetDays, sheetKinds, sheetDiscount, sheetDishes, sheetFailures, sheetSlots}
	if got := f.GetSheetList(); len(got) != len(want) || got[0] != sheetSummary || got[6] != sheetSlots {
		t.Fatalf("sheets %q, want %q", got, want)
	}

	checkWorkbookSummary(t, f)
	checkWorkbookAnalysis(t, f)

	if got := workbookName(twoDays()); got != "bao-cao-2026-10-19-den-2026-10-20.xlsx" {
		t.Errorf("named %q", got)
	}
}

// readCell reads one cell of the workbook.
func readCell(t *testing.T, f *excelize.File, sheet, cell string) string {
	t.Helper()

	v, err := f.GetCellValue(sheet, cell)
	if err != nil {
		t.Fatal(err)
	}

	return v
}

// checkWorkbookSummary: the summary's figures are numbers and its labels
// text, and a store named as a formula stays text.
func checkWorkbookSummary(t *testing.T, f *excelize.File) {
	t.Helper()

	// Phần đăng is the summary's eighth row; twoDays posted 5 portions.
	if readCell(t, f, sheetSummary, "A8") != wordUnitsPosted || readCell(t, f, sheetSummary, "B8") != "5" {
		t.Errorf("the summary's portions posted: %q %q", readCell(t, f, sheetSummary, "A8"), readCell(t, f, sheetSummary, "B8"))
	}

	// excelize writes a number without a type, and text as a shared or inline string.
	if kind, err := f.GetCellType(sheetSummary, "B8"); err != nil || isText(kind) {
		t.Errorf("a figure is text: %v, %v", kind, err)
	}

	if kind, _ := f.GetCellType(sheetSummary, "A8"); !isText(kind) {
		t.Errorf("a label is not text: %v", kind)
	}

	if name := readCell(t, f, sheetDays, "B5"); name != "=HYPERLINK(\"http://x\")" {
		t.Errorf("the store named as a formula reads %q", name)
	}

	if formula, _ := f.GetCellFormula(sheetDays, "B5"); formula != "" {
		t.Errorf("a name became the formula %q", formula)
	}
}

func isText(kind excelize.CellType) bool {
	return kind == excelize.CellTypeSharedString || kind == excelize.CellTypeInlineString
}

// checkWorkbookAnalysis: the analysis fills its sheets.
func checkWorkbookAnalysis(t *testing.T, f *excelize.File) {
	t.Helper()

	if readCell(t, f, sheetKinds, "A2") != "Bánh" || readCell(t, f, sheetDishes, "B2") != "Bánh mì" ||
		readCell(t, f, sheetFailures, "A2") != "Hết giờ, khách không đến" {
		t.Error("the analysis' sheets")
	}

	if readCell(t, f, sheetSlots, "B1") != "19h" || readCell(t, f, sheetSlots, "A3") != "Thứ ba" ||
		readCell(t, f, sheetSlots, "B3") != "3" {
		t.Error("the weekday and hour sheet")
	}
}
