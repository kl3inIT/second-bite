---
target: "Figma Mobile v2 (51:1423) + sign-in row"
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:D:\\Workspaces\\second-bite\\figma:\\Secondbite\\Mobile v2"
timestamp: 2026-10-19T04-34-16Z
slug: figma-secondbite-mobile-v2
---
Method: dual-agent (A: thiết kế, xem Figma read-only · B: detector + trình duyệt trên web/)

## Design Health Score

| # | Heuristic | Điểm | Vấn đề chính |
|---|---|---|---|
| 1 | Trạng thái hệ thống | 3 | Stepper K6/Q11 tốt; nhãn bước tương lai #8FB3A7 chỉ 2,3:1; chưa có màn "chờ thanh toán"; L2 nút "Xác nhận" trông bấm được khi mới nhập 3/6 số |
| 2 | Khớp đời thực | 3 | Tiếng Việt tự nhiên; nhưng "Túi bánh ngọt bất ngờ", "Hoặc thẻ" (không có thẻ) |
| 3 | Kiểm soát, quay lui | 2 | Khách không huỷ/báo sự cố ở K6, K8; quán không từ chối đơn ở Q10; không hoàn tác ở Q12 |
| 4 | Nhất quán | **1** | 16 bán kính bo góc, 0/219 gắn biến; Be Vietnam 9 cỡ, Bricolage 10 cỡ; chip giảm giá 4 kiểu; frame quy tắc mâu thuẫn DESIGN.md |
| 5 | Phòng lỗi | 2 | Q10 xác nhận đơn một chạm; Q12 bàn giao không nhắc kiểm tra món; K5 cho chọn giao hàng không tồn tại |
| 6 | Nhận ra thay vì nhớ | 3 | Thẻ món theo vào đăng nhập (L1, L5, W1); L2, W2 làm mất |
| 7 | Linh hoạt | 3 | QR hoặc 4 số khi bàn giao; đăng món bằng giọng nói hoặc ảnh; VI·EN |
| 8 | Tối giản | 3 | Sạch, nhưng K1 xếp 6 vùng nội dung trước thẻ món đầu tiên |
| 9 | Phục hồi lỗi | 2 | Chỉ có L3; thiếu hết món, quá giờ, thanh toán lỗi, sai mã ở quầy, AI đọc sai ảnh |
| 10 | Trợ giúp | 2 | Câu hướng dẫn tốt; không có đường báo sự cố |
| **Tổng** | | **24/40** | **Khá: dùng được, nhưng cần làm chặt hệ thống và trạng thái** |

## Design Specificity Verdict

**Đánh giá thiết kế:** khung giao diện cố ý giống foodpanda/ShopeeFood, điều đó ổn (quen tay là mục tiêu). Phần riêng của Second Bite hiện ra rõ ở: vé mã nhận có khía (K6), "Hoa hồng 0đ" và "Quán nhận nếu bán hết 135.000đ" (Q9), "AI đếm được 3", giới hạn chat (K7), nhập 4 số thay quét QR (Q12). Ba thứ kéo ngược lại định vị: (1) "Túi bánh ngọt bất ngờ" ở K1–K8, L1–W2, trong khi PRODUCT.md hứa "hàng có tên, có ảnh, đã xác nhận, không phải túi bất ngờ"; (2) giao hàng được vẽ như đang có (K2, K3, K4, K5, Q10) dù pilot không có; (3) W1, W2 là thẻ đăng nhập giữa trang, sản phẩm nào cũng dùng được.

**Quét tự động:** detector trên mã nguồn `web/src` sạch (0 lỗi, chạy 3 cách). Trong trình duyệt, detect.js báo `flat-type-hierarchy` ở `/vi`, `/en`, `/vi/privacy` và `line-length` ×4 ở `/vi/privacy` (1440 px, 90–98 ký tự/dòng). `flat-type-hierarchy` một phần là báo nhầm (h1 trang chủ là `sr-only`), nhưng gốc của nó là thật và trùng với phát hiện thiết kế: token `title` 16 px bằng `body` 16 px, `headline` chỉ 18 px, nên tiêu đề và thân chữ chỉ khác độ đậm. Figma không quét tự động được; bằng chứng máy chỉ phủ phần web đang dùng token v2.

## Overall Impression

Luồng bàn giao (K6 ↔ Q11/Q12) là phần tốt nhất, kể một câu chuyện liền mạch cho cả khách và quán. Điểm yếu lớn nhất không nằm ở thẩm mỹ mà ở hệ thống: chữ, bo góc, chip giảm giá đều trôi, và các trạng thái tiền và thất bại chưa được vẽ. Cơ hội lớn nhất: chuẩn hoá token ngay bây giờ, trước khi code nhân bản sự trôi này.

## What's Working

1. **Bàn giao hai phía khớp nhau:** vé mã, stepper, "Mã chỉ dùng một lần" (K6) với quét hoặc 4 số, nhật ký đơn, "quán nhận đủ 45.000đ" (Q11/Q12).
2. **Microcopy trung thực, đúng nguyên tắc:** "Hoa hồng 0đ", các câu giới hạn AI (K3, Q9), giới hạn chat (K7), câu chống lừa đảo (L2/L3).
3. **Đăng nhập giữ ngữ cảnh:** L1, L5, W1 hiện túi đang đặt; sheet L5 đúng mẫu "đăng nhập lúc cần hành động"; L4 xử lý email Google không đảm bảo, ca ít đội làm.

## Priority Issues

**[P0] Thiếu trạng thái tiền và thất bại (K5→K6, Q10, Q12)**
- Tại sao: "Đơn không bao giờ trông thành công trước khi thành công." Không có các màn này thì không thể code thanh toán chuyển khoản, hết hàng, từ chối cho prototype 23/10.
- Sửa: màn VietQR "Chờ thanh toán" có đếm ngược và kết quả hết giờ; K4 hết món/quá giờ dùng band "Đã hết"; Q10 thêm "Từ chối" kèm lý do; Q12 sai mã/mã hết hạn; màn "Đã nhận" cho khách; K8 trống.
- Lệnh: `/impeccable harden`

**[P1] Hệ thống trôi: chữ, bo góc, màu, chip (mọi frame)**
- Tại sao: sắp chuẩn hoá token; frame quy tắc và DESIGN.md đang nói khác nhau (top bar 17 vs 18, thân 14 vs 16, nút chính brand/700 vs brand/800, nút phụ trắng viền vs brand/100). Detector web cũng bắt được thang chữ phẳng (title = body = 16 px).
- Sửa: một thang chữ 13 vai trò (đã lập), bo góc gắn biến (8/12/14/16/20/24/full), collection `Theme` đặt tên theo vai trò, một kiểu chip giảm giá (lime), Bricolage chỉ cho số (bỏ ở tên món K4 và tên quán L5).
- Lệnh: `/impeccable typeset` rồi `/impeccable polish`

**[P1] Tương phản và cỡ chữ dưới chuẩn AA**
- Tại sao: khách dùng điện thoại cũ, buổi tối; AA là cam kết.
- Chi tiết: giá gốc #7D8C87 (3,5:1) ở ~15 lớp (K1–K5, K7, Q9, Q11, Q12, L1, L4, L5, W1), trái "Faint Rule"; placeholder tìm kiếm K1; nhãn stepper tương lai 2,3:1, 11 px; ~70 lớp chữ 10–11 px; chip 36 px, segmented 40 px dưới 44 px.
- Sửa: chuyển sang `muted-foreground`, sàn 12 px, vùng chạm 44 px.
- Lệnh: `/impeccable audit` rồi `/impeccable typeset`

**[P1] Nội dung mẫu trái phạm vi và định vị**
- Tại sao: trung thực là nguyên tắc số một; các frame này sẽ được cho 30 quán xem.
- Sửa: đổi "Túi bánh ngọt bất ngờ" thành túi có tên và thành phần dự kiến; bỏ mọi "Giao hàng/Giao được/Tài xế/phí giao"; bỏ "thẻ" ở K5; "Giảm đến 70%" phải tính thật hoặc bỏ; "Bánh nên dùng trong 24 giờ" (K4) ghi là lời của quán; một tên túi thống nhất giữa khách và quán.
- Lệnh: `/impeccable clarify`

**[P2] Luồng quán được nhân bản từ màn khách, chưa thiết kế cho một tay lúc vội**
- Tại sao: lớp còn tên "seg/Tôi tự lấy" (Q9); Q10 có hai nút chính "Xác nhận đơn" giống hệt; Q9 giấu 4 link "Sửa" nhỏ; Q12 không nhắc kiểm tra món; chưa có thu tiền mặt.
- Sửa: chọn ảnh/giọng nói ở đầu Q9; bấm cả hàng để sửa; mỗi thẻ Q10 có cặp xác nhận/từ chối gọn; Q12 thêm "Đã kiểm tra món" và trạng thái đã thu tiền.
- Lệnh: `/impeccable layout` rồi `/impeccable distill`

## Persona Red Flags

**Khách buổi tối, một tay, ồn (Casey):** thời gian còn lại ở K6 là chữ xám nhỏ; không nói gì nếu đến sau 21:30; không chia sẻ mã cho người khác lấy hộ (PRODUCT.md có hứa); chip K2 36 px khó chạm; chú thích "Thường có trong túi" ở K4 bị thanh dưới che.

**Người dùng lần đầu (Jordan):** "bất ngờ" gây câu hỏi "mình sẽ nhận được gì"; banner K1 "Tươi ngon · Chất lượng · Gần bạn" không giải thích vì sao rẻ; khái niệm mã nhận hàng chỉ xuất hiện ở K6; cảnh báo Google ở L4 dài và đáng sợ, đặt trên thẻ món.

**Người nhìn kém (Sam):** mọi giá gốc 3,5:1; nhãn stepper 2,3:1, 11 px; ô hero K1 10–11 px; "Còn 2 túi", "Giao được" ở K2 11 px. Điểm tốt: lỗi L3 và "Mã đúng" Q12 đều có icon kèm chữ.

## Minor Observations

- Ảnh mẫu K7 là bánh mì đen trong khi đơn là croissant; "126 đánh giá" và điểm sao cần nhãn "mẫu"; "Khoảng 3,4 kg" ở K8 cần nguồn.
- Mã đăng nhập 6 số (L2) và mã nhận 4 số (K6/Q12) trông giống nhau, mẫu lại cùng "4-8-2"; nên khác kiểu ô hoặc khác số mẫu.
- L2/W2 mất ngữ cảnh túi; đếm ngược gửi lại 12 px xám dễ bỏ sót.
- W1/W2 không có đường quay lại món, nút ngôn ngữ chỉ có icon, khoảng trống 1440 ~70%.
- Trang `/vi/privacy` trên web: 90–98 ký tự/dòng ở 1440 (detector); h2 bằng cỡ thân chữ.
- Ảnh LCP trang chủ web thiếu `loading="eager"` (cảnh báo Next.js, hiệu năng).
- Chữ frame quy tắc dùng #000000 thô.

## Questions to Consider

1. Nếu túi "có tên, có ảnh, đã xác nhận", sao mọi màn mẫu đều gọi là "bất ngờ"? Đội có đang trượt về mô hình Too Good To Go?
2. K6 là đỉnh cảm xúc nhưng câu chuyện của khách kết thúc ở Q12 của quán. Giây sau khi quán bấm "Xác nhận đã bàn giao", khách thấy gì, và đó có phải lúc khiến họ quay lại?
3. Giao hàng, thanh toán thẻ, "Giảm đến 70%" đều được vẽ nhưng không có thật. Đội có cho 30 quán ở Tasco xem các frame này nguyên trạng vào 23/10 không?
