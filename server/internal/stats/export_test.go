package stats

import (
	"bytes"
	"encoding/csv"
	"slices"
	"testing"
	"time"

	"github.com/google/uuid"
)

// coBa is a store's name with the marks a spreadsheet must keep.
const coBa = "Bếp Cô Ba"

// twoDays is a report of a quiet Monday and a Tuesday when one store sold
// and another store's owner named it as a formula.
func twoDays() Report {
	monday := time.Date(2026, 10, 19, 0, 0, 0, 0, time.UTC)
	tuesday := monday.AddDate(0, 0, 1)
	quiet := Counts{Views: 3, People: 2}
	sold := Counts{
		Views: 9, People: 4, QRViews: 2, Offers: 1, UnitsPosted: 5, Held: 3, UnitsHeld: 4, Collected: 2,
		UnitsCollected: 3, CollectedVND: 45_000,
	}
	total := sold
	total.addViews(quiet)

	return Report{
		Since: monday, Until: tuesday, Totals: total,
		Days: []DayCounts{{Day: monday, Counts: quiet}, {Day: tuesday, Counts: sold}},
		StoreDays: []StoreDayCounts{
			{Day: tuesday, SellerID: uuid.New(), Name: coBa, Counts: sold},
			{Day: tuesday, SellerID: uuid.New(), Name: "=HYPERLINK(\"http://x\")"},
		},
	}
}

// readCSV reads a file the report wrote, which must start with a byte order
// mark.
func readCSV(t *testing.T, body []byte) [][]string {
	t.Helper()

	if !bytes.HasPrefix(body, []byte("\xEF\xBB\xBF")) {
		t.Fatal("no byte order mark")
	}

	rows, err := csv.NewReader(bytes.NewReader(body[3:])).ReadAll()
	if err != nil {
		t.Fatal(err)
	}

	return rows
}

func TestReportCSV(t *testing.T) {
	t.Parallel()

	r := twoDays()

	body, err := reportCSV(r, false)
	if err != nil {
		t.Fatal(err)
	}

	rows := readCSV(t, body)

	names := make([]string, len(rows))
	for i, row := range rows {
		names[i] = row[0] + " " + row[1]
	}

	want := []string{
		"Ngày Cửa hàng", "2026-10-19 Cả trang", "2026-10-20 Cả trang", "2026-10-20 " + coBa,
		"2026-10-20 '=HYPERLINK(\"http://x\")", "Tổng ",
	}
	if !slices.Equal(names, want) {
		t.Fatalf("rows %q, want %q", names, want)
	}

	if store := rows[3]; store[2] != "9" || store[7] != "3" || store[9] != "2" || store[14] != "67" || store[15] != "45000" {
		t.Errorf("the store's row %q", store)
	}

	if empty := rows[1]; empty[14] != "" {
		t.Errorf("a day without orders has a share %q", empty[14])
	}
}

func TestReportCSVOfOneStore(t *testing.T) {
	t.Parallel()

	r := twoDays()

	alone, err := reportCSV(r, true)
	if err != nil {
		t.Fatal(err)
	}

	if rows := readCSV(t, alone); len(rows) != 4 || rows[1][1] != coBa {
		t.Errorf("one store's file %q, want its rows and the totals without the whole site's", rows)
	}

	if got := csvName(r); got != "bao-cao-2026-10-19-den-2026-10-20.csv" {
		t.Errorf("named %q", got)
	}
}

func TestSafe(t *testing.T) {
	t.Parallel()

	for in, want := range map[string]string{
		"Bếp Cô Ba": "Bếp Cô Ba", "=1+1": "'=1+1", "+84 912": "'+84 912", "-2": "'-2", "@SUM(A1)": "'@SUM(A1)",
		"\tx": "'\tx", "": "", "Quán 24/7": "Quán 24/7",
	} {
		if got := safe(in); got != want {
			t.Errorf("safe(%q) = %q, want %q", in, got, want)
		}
	}
}
