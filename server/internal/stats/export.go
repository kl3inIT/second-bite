package stats

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// bom tells Excel the file is UTF-8, so the stores' names keep their marks.
const bom = "\xEF\xBB\xBF"

// The words of the file, in Vietnamese: it is pasted into the sponsor's sheet.
var csvHeader = []string{
	"Ngày", "Cửa hàng", "Lượt mở trang", "Người mở", "Lượt vào từ QR", "Món đăng", "Phần đăng",
	"Đơn giữ", "Phần giữ", "Đơn đã lấy", "Phần đã lấy", "Đơn huỷ", "Quán từ chối", "Khách không đến",
	"Tỉ lệ lấy (%)", "Tiền thu tại quầy (đồng)", "Tài khoản mới", "Khách đặt lần đầu",
}

const (
	csvSite  = "Cả trang"
	csvTotal = "Tổng"
)

// reportCSV writes r as one row per day and store, under a row for the whole
// site on each day when no store was chosen, and a row of the range's totals
// last; the rows read like the screen, with names, never identifiers (Spree's
// exports). It starts with a byte order mark, and a name a spreadsheet would
// run as a formula is written as text (OWASP's CSV injection).
func reportCSV(r Report, oneStore bool) ([]byte, error) {
	var buf bytes.Buffer

	buf.WriteString(bom)

	w := csv.NewWriter(&buf)
	w.UseCRLF = true // as Excel writes it

	rows := [][]string{csvHeader}

	for _, d := range r.Days {
		day := d.Day.Format(time.DateOnly)

		if !oneStore {
			rows = append(rows, csvRow(day, csvSite, d.Counts, true))
		}

		for _, sd := range r.StoreDays {
			if sd.Day.Equal(d.Day) {
				rows = append(rows, csvRow(day, safe(sd.Name), sd.Counts, false))
			}
		}
	}

	rows = append(rows, csvRow(csvTotal, "", r.Totals, !oneStore))

	if err := w.WriteAll(rows); err != nil { // WriteAll flushes and reports the writer's error
		return nil, fmt.Errorf("writing the report as CSV: %w", err)
	}

	return buf.Bytes(), nil
}

// csvRow writes c; the new accounts and customers only on a row of the whole
// site, as a store has none of its own (SEC-192).
func csvRow(day, name string, c Counts, site bool) []string {
	share := ""
	if c.Held > 0 {
		share = strconv.Itoa((c.Collected*100 + c.Held/2) / c.Held)
	}

	accounts, customers := "", ""
	if site {
		accounts, customers = strconv.Itoa(c.NewAccounts), strconv.Itoa(c.NewCustomers)
	}

	return []string{
		day, name,
		strconv.Itoa(c.Views), strconv.Itoa(c.People), strconv.Itoa(c.QRViews),
		strconv.Itoa(c.Offers), strconv.Itoa(c.UnitsPosted),
		strconv.Itoa(c.Held), strconv.Itoa(c.UnitsHeld), strconv.Itoa(c.Collected), strconv.Itoa(c.UnitsCollected),
		strconv.Itoa(c.Cancelled), strconv.Itoa(c.Refused), strconv.Itoa(c.Expired),
		share, strconv.FormatInt(c.CollectedVND, 10),
		accounts, customers,
	}
}

// safe writes text a spreadsheet would read as a formula, starting with =, +,
// -, @, a tab or a carriage return, behind an apostrophe, so it shows as typed.
func safe(text string) string {
	if text != "" && strings.ContainsRune("=+-@\t\r", rune(text[0])) {
		return "'" + text
	}

	return text
}

// csvName names the file by its days.
func csvName(r Report) string {
	return fmt.Sprintf("bao-cao-%s-den-%s.csv", r.Since.Format(time.DateOnly), r.Until.Format(time.DateOnly))
}
