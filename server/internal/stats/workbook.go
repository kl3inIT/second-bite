package stats

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/xuri/excelize/v2"

	"github.com/kl3inIT/second-bite/server/internal/offer"
)

// The workbook's sheets, in Vietnamese as the CSV is.
const (
	sheetSummary  = "Tổng quan"
	sheetDays     = "Theo ngày và cửa hàng"
	sheetKinds    = "Theo loại món"
	sheetDiscount = "Mức giảm giá"
	sheetDishes   = "Món"
	sheetFailures = "Đơn không thành"
	sheetSlots    = "Thứ và giờ"
)

// contentTypeXLSX is a workbook's media type.
const contentTypeXLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

// kindWords are the kinds of dish as the app words them in Vietnamese.
var kindWords = map[offer.Kind]string{
	offer.KindBakery: "Bánh", offer.KindPreparedFood: "Món chín", offer.KindIngredients: "Nguyên liệu",
	offer.KindDrinks: "Đồ uống", offer.KindMixedBox: "Hộp tổng hợp", offer.KindDessert: "Tráng miệng",
	offer.KindSnacks: "Ăn vặt", offer.KindProduce: "Rau củ quả", offer.KindOther: "Khác",
}

// kindOrder is the order the app lists the kinds in.
var kindOrder = []offer.Kind{
	offer.KindBakery, offer.KindPreparedFood, offer.KindIngredients, offer.KindDrinks, offer.KindMixedBox,
	offer.KindDessert, offer.KindSnacks, offer.KindProduce, offer.KindOther,
}

var bandWords = map[string]string{
	DiscountFree: "Miễn phí", DiscountFrom70: "Giảm từ 70%", DiscountFrom50: "Giảm 50–69%",
	DiscountFrom30: "Giảm 30–49%", DiscountUnder30: "Giảm dưới 30%",
}

var endingWords = map[string]string{
	"cancelled": "Khách huỷ", "expired": "Hết giờ, khách không đến",
	"refused_not_suitable": "Quán từ chối: món không còn phù hợp", "refused_wrong_items": "Quán từ chối: sai món",
	"refused_no_answer": "Quán từ chối: không nghe máy", "refused_no_show": "Quán từ chối: khách không đến",
	"refused_late": "Quán từ chối: quá giờ", "refused_sold_out": "Quán từ chối: hết món",
	"refused_other": "Quán từ chối: lý do khác", "refused_withdrawn": "Quán đã rút bài",
}

var weekdayWords = []string{"Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"}

type sheet struct {
	name string
	rows [][]any
}

// reportWorkbook writes the report and its analysis as an .xlsx workbook: a
// summary, the CSV's rows, then a sheet per part of the analysis. Figures are
// numbers, so the sponsor can add them up; names are text, never formulas.
func reportWorkbook(r Report, a Analysis, oneStore bool) ([]byte, error) {
	f := excelize.NewFile()
	defer f.Close() //nolint:errcheck // an in-memory file holds nothing to release

	sheets := []sheet{
		{sheetSummary, summaryRows(r, oneStore)},
		{sheetDays, cells(reportRows(r, oneStore, func(name string) string { return name }))},
		{sheetKinds, kindRows(a)},
		{sheetDiscount, discountRows(a)},
		{sheetDishes, dishRows(a)},
		{sheetFailures, failureRows(a)},
		{sheetSlots, slotRows(a)},
	}

	for i, s := range sheets {
		if err := addSheet(f, i, s); err != nil {
			return nil, err
		}
	}

	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("writing the workbook: %w", err)
	}

	return buf.Bytes(), nil
}

// addSheet writes s as the workbook's i-th sheet; the first takes the place
// of the sheet a new workbook starts with.
func addSheet(f *excelize.File, i int, s sheet) error {
	if i == 0 {
		if err := f.SetSheetName("Sheet1", s.name); err != nil {
			return fmt.Errorf("naming the sheet %q: %w", s.name, err)
		}
	} else if _, err := f.NewSheet(s.name); err != nil {
		return fmt.Errorf("adding the sheet %q: %w", s.name, err)
	}

	for row, values := range s.rows {
		cell, err := excelize.CoordinatesToCellName(1, row+1)
		if err != nil {
			return fmt.Errorf("naming a cell: %w", err)
		}

		if err := f.SetSheetRow(s.name, cell, &values); err != nil {
			return fmt.Errorf("writing the sheet %q: %w", s.name, err)
		}
	}

	return nil
}

// cells turns the CSV's text into cells: whole numbers become numbers.
func cells(rows [][]string) [][]any {
	out := make([][]any, len(rows))
	for i, row := range rows {
		out[i] = make([]any, len(row))

		for j, text := range row {
			if n, err := strconv.ParseInt(text, 10, 64); err == nil {
				out[i][j] = n
			} else {
				out[i][j] = text
			}
		}
	}

	return out
}

// share is part of whole in whole percent, or a dash when there is none.
func share(part, whole int) any {
	if whole <= 0 {
		return "–"
	}

	return (part*100 + whole/2) / whole
}

func summaryRows(r Report, oneStore bool) [][]any {
	c := r.Totals
	scope := "Tất cả cửa hàng"

	if oneStore && len(r.Stores) == 1 {
		scope = r.Stores[0].Name
	}

	hours := "Cả ngày"
	if !r.Clock.IsZero() {
		hours = r.Clock.From + " đến " + r.Clock.Until
	}

	rows := [][]any{
		{"Báo cáo Second Bite", r.Since.Format(time.DateOnly) + " đến " + r.Until.Format(time.DateOnly)},
		{"Cửa hàng", scope},
		{"Khung giờ nhận", hours},
		{"Người truy cập", c.People},
		{"Lượt mở trang", c.Views},
		{"Lượt vào từ QR", c.QRViews},
		{"Món đăng", c.Offers},
		{wordUnitsPosted, c.UnitsPosted},
		{"Phần được đặt", c.UnitsHeld},
		{wordUnitsCollected, c.UnitsCollected},
		{"Phần dư", max(c.UnitsPosted-c.UnitsCollected, 0)},
		{wordShareSold, share(c.UnitsCollected, c.UnitsPosted)},
		{"Đơn giữ", c.Held},
		{"Đơn đã lấy", c.Collected},
		{"Tỉ lệ lấy (%)", share(c.Collected, c.Held)},
		{"Đơn huỷ", c.Cancelled},
		{"Quán từ chối", c.Refused},
		{"Khách không đến", c.Expired},
		{"Tiền thu tại quầy (đồng)", c.CollectedVND},
		{"Giá gốc phần đã lấy (đồng)", c.OriginalVND},
		{"Khách tiết kiệm (đồng)", savedVND(c)},
		{"Bù giảm giá (đồng)", c.DiscountVND},
		{"Thực phẩm được cứu (gam)", c.GramsCollected},
		{"Phần có ghi cân nặng", c.UnitsWeighed},
	}

	if !oneStore {
		rows = append(rows,
			[]any{"Tài khoản mới", c.NewAccounts}, []any{"Khách đặt lần đầu", c.NewCustomers},
			[]any{"Tổng tài khoản", r.Accounts}, []any{"Khách nhận đơn", r.Customers}, []any{"Khách mua lại", r.Returning})
	}

	return rows
}

func kindRows(a Analysis) [][]any {
	rows := [][]any{{"Loại món", wordUnitsPosted, wordUnitsCollected, wordShareSold}}

	for _, kind := range kindOrder {
		if p, ok := a.Kinds[kind]; ok {
			rows = append(rows, []any{kindWords[kind], p.Posted, p.Collected, share(p.Collected, p.Posted)})
		}
	}

	return rows
}

func discountRows(a Analysis) [][]any {
	rows := [][]any{{"Mức giảm giá", wordUnitsPosted, wordUnitsCollected, wordShareSold}}

	for _, band := range []string{DiscountFree, DiscountFrom70, DiscountFrom50, DiscountFrom30, DiscountUnder30} {
		p := a.Discounts[band]
		rows = append(rows, []any{bandWords[band], p.Posted, p.Collected, share(p.Collected, p.Posted)})
	}

	return rows
}

func dishRows(a Analysis) [][]any {
	rows := [][]any{{"Xếp hạng", "Món", "Cửa hàng", "Đơn vị", wordUnitsPosted, wordUnitsCollected, "Phần dư"}}

	for _, list := range []struct {
		title  string
		dishes []DishRank
	}{{"Bán chạy", a.TopSold}, {"Dư nhiều", a.TopLeftover}} {
		for i, d := range list.dishes {
			rows = append(rows, []any{
				fmt.Sprintf("%s %d", list.title, i+1), d.Name, d.SellerName, d.Unit, d.Posted, d.Collected, d.Posted - d.Collected,
			})
		}
	}

	return rows
}

func failureRows(a Analysis) [][]any {
	rows := [][]any{{"Kết thúc", "Số đơn"}}

	for _, c := range countsBy(a.Orders.Failures) {
		words := endingWords[c.Key]
		if words == "" {
			words = strings.ReplaceAll(c.Key, "_", " ")
		}

		rows = append(rows, []any{words, c.Count})
	}

	return rows
}

// slotRows lays the orders held out by weekday down and hour across.
func slotRows(a Analysis) [][]any {
	first, last := 24, -1
	for _, s := range a.Orders.Slots {
		first, last = min(first, s.Hour), max(last, s.Hour)
	}

	header := []any{"Đơn giữ"}
	for h := first; h <= last; h++ {
		header = append(header, fmt.Sprintf("%dh", h))
	}

	rows := [][]any{header}

	for day := 1; day <= len(weekdayWords); day++ {
		row := []any{weekdayWords[day-1]}

		for h := first; h <= last; h++ {
			held := 0

			for _, s := range a.Orders.Slots {
				if s.Weekday == day && s.Hour == h {
					held = s.Held
				}
			}

			row = append(row, held)
		}

		rows = append(rows, row)
	}

	return rows
}

// workbookName names the file by its days.
func workbookName(r Report) string {
	return strings.TrimSuffix(csvName(r), ".csv") + ".xlsx"
}
