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

// The words the CSV and the workbook share.
const (
	wordUnitsPosted    = "Phần đăng"
	wordUnitsCollected = "Phần đã lấy"
	wordShareSold      = "Tỉ lệ bán hết (%)"
)

// The words of the file, in Vietnamese: it is pasted into the sponsor's sheet.
var csvHeader = []string{
	"Ngày", "Cửa hàng", "Lượt mở trang", "Người mở", "Lượt vào từ QR", "Món đăng", wordUnitsPosted,
	"Đơn giữ", "Phần giữ", "Đơn đã lấy", wordUnitsCollected, "Đơn huỷ", "Quán từ chối", "Khách không đến",
	"Tỉ lệ lấy (%)", "Tiền thu tại quầy (đồng)", "Tài khoản mới", "Khách đặt lần đầu",
	"Ngày có đăng", "Ngày đăng đủ 7 phần", "Khách nhận đơn", "Khách mua lại",
	"Giá gốc phần đã lấy (đồng)", "Khách tiết kiệm (đồng)", "Bù giảm giá (đồng)", "Thực phẩm được cứu (gam)",
}

const (
	csvSite  = "Cả trang"
	csvTotal = "Tổng"
)

// reportCSV writes r as one row per day and store, under a row for the whole
// site on each day when no store was chosen, a row of the range's totals, and
// a total row per store with its days posted and full days (SEC-200); the rows read like the screen, with names, never identifiers (Spree's
// exports). It starts with a byte order mark, and a name a spreadsheet would
// run as a formula is written as text (OWASP's CSV injection).
func reportCSV(r Report, oneStore bool) ([]byte, error) {
	var buf bytes.Buffer

	buf.WriteString(bom)

	w := csv.NewWriter(&buf)
	w.UseCRLF = true // as Excel writes it

	if err := w.WriteAll(reportRows(r, oneStore, safe)); err != nil { // WriteAll flushes and reports the writer's error
		return nil, fmt.Errorf("writing the report as CSV: %w", err)
	}

	return buf.Bytes(), nil
}

// reportRows are the CSV's rows, its header first, each store's name written
// by name: safe for a CSV, as it is for a workbook, whose cells are never
// read as formulas.
func reportRows(r Report, oneStore bool, name func(string) string) [][]string {
	rows := [][]string{csvHeader}

	for _, d := range r.Days {
		day := d.Day.Format(time.DateOnly)

		if !oneStore {
			rows = append(rows, withImpact(append(csvRow(day, csvSite, d.Counts, true), "", "", "", ""), d.Counts))
		}

		for _, sd := range r.StoreDays {
			if sd.Day.Equal(d.Day) {
				rows = append(rows, withImpact(append(csvRow(day, name(sd.Name), sd.Counts, false), "", "", "", ""), sd.Counts))
			}
		}
	}

	customers, returning := "", ""
	if !oneStore {
		customers, returning = strconv.Itoa(r.Customers), strconv.Itoa(r.Returning)
	}

	rows = append(rows, withImpact(append(csvRow(csvTotal, "", r.Totals, !oneStore), "", "", customers, returning), r.Totals))

	for _, st := range r.Stores {
		rows = append(rows, withImpact(append(csvRow(csvTotal, name(st.Name), st.Counts, false),
			strconv.Itoa(st.DaysPosted), strconv.Itoa(st.FullDays), "", ""), st.Counts))
	}

	return rows
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

// withImpact ends a row with what the collected orders were worth at the
// original price, what the customers saved (the original price less what they
// paid at the counter: the total less the discount), the discounts paid back
// and the grams rescued.
func withImpact(row []string, c Counts) []string {
	return append(row,
		strconv.FormatInt(c.OriginalVND, 10), strconv.FormatInt(savedVND(c), 10),
		strconv.FormatInt(c.DiscountVND, 10), strconv.Itoa(c.GramsCollected))
}

// savedVND is what the customers of the collected orders saved against the
// original price: they paid the total less the discount.
func savedVND(c Counts) int64 {
	return max(c.OriginalVND-(c.CollectedVND-c.DiscountVND), 0)
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
