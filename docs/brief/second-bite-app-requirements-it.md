# Second Bite — project requirements for the IT team

Kept as received from the founder on 16 October 2026, a deck of twelve slides in Vietnamese (`Second_Bite_App_Requirements_IT.pptx`). The text of each slide is below; the deck's own link to its storage is not kept. Where it differs from the [project brief](second-bite-project-brief.md) and the kickoff, this deck is the newer statement; the decisions taken from it are in the [pilot domain model](../increments/completed/sec-6-pilot-domain-model/design.md).

## 1. Project requirements dành cho đội IT

**Second Bite — Ứng dụng kết nối thực phẩm chưa bán hết với người mua**

Định hướng phi lợi nhuận. Không thu hoa hồng từ quán. Khách có thể đến lấy hoặc chọn giao hàng.

Giai đoạn hiện tại: prototype minh họa. Chưa có quán tham gia hoặc khách hàng thật.

## 2. Ba loại tài khoản — dữ liệu dùng chung giữa các thiết bị

- **Khách hàng:** Đăng ký, đăng nhập. Tìm món, đặt hàng, theo dõi đơn và chat với quán.
- **Chủ quán:** Tạo gian hàng có tên, địa chỉ, ảnh và liên hệ. Đăng thực phẩm, cập nhật lượng còn và xử lý đơn.
- **Quản trị:** Duyệt quán, xem đơn, xử lý báo lỗi, quản lý tài khoản và xuất báo cáo.
- **Dùng trên nhiều máy:** Quán đăng từ máy A thì khách trên máy B nhìn thấy. Khách đặt thì quán nhận được đơn.

## 3. Yêu cầu chức năng — Quán đăng thực phẩm

- **Nội dung bài đăng:** Tên món hoặc nguyên liệu, ảnh, số lượng và đơn vị, giá bán, khung giờ lấy hàng.
- **Ảnh của quán:** Quán chụp hoặc tải ảnh. Ảnh xuất hiện cùng bài đăng sau khi quán kiểm tra và xác nhận.
- **Quản lý hàng còn:** Thêm, sửa, ẩn món và ngừng bán nhanh. Số lượng giảm khi khách đặt thành công.
- **Quản lý đơn:** Xem đơn mới, xác nhận, báo đã chuẩn bị xong và xác nhận bàn giao cho khách hoặc tài xế.

## 4. Yêu cầu chức năng — Khách tìm món và đặt hàng

- **Tìm và lọc:** Tìm theo tên món, giá, khoảng cách, giờ nhận và cách nhận. Xem lượng còn tại từng quán.
- **Xem chi tiết:** Xem ảnh, thông tin món, giá, địa chỉ, thời gian nhận và ghi chú của quán.
- **Chọn và xác nhận:** Chọn số lượng, đến lấy hoặc giao hàng, địa chỉ và cách thanh toán. Xem tổng tiền trước khi đặt.
- **Theo dõi đơn:** Xem trạng thái, nhận thông báo, chat với quán và dùng mã xác nhận khi nhận hàng.

## 5. AI hỗ trợ chủ quán — ảnh hoặc lời nói tạo bản nháp

- **Nhận thông tin:** Ví dụ: “Tôi có 2 quả táo và 3 gỏi cuốn”, hoặc chụp ảnh thực phẩm. Hỗ trợ tiếng Việt và tiếng Anh.
- **Tạo bản nháp:** AI gợi ý tên và số lượng. Hỏi thêm giá, giờ nhận và thông tin còn thiếu.
- **Quán xác nhận:** Quán kiểm tra, sửa tên hoặc số lượng bằng tay rồi bấm đăng. AI không tự đăng khi chưa được duyệt.
- **Khi AI không chắc:** Yêu cầu kiểm tra lại hoặc nhập tay. AI không xác nhận độ an toàn hay hạn dùng chỉ từ ảnh.

## 6. AI hỗ trợ khách hàng — tìm món bằng chữ hoặc giọng nói

- **Ví dụ yêu cầu:** “Tìm cơm trong 2 km, tổng dưới 60.000đ, giao đến nhà.”
- **Kết quả phù hợp:** Tìm trong hàng đang còn, theo món, khoảng cách, ngân sách và cách nhận. Tổng tiền gồm phí giao nếu có.
- **Trả lời song ngữ:** Trả lời bằng chữ và giọng nói tiếng Việt hoặc tiếng Anh, phù hợp với ngôn ngữ khách dùng.
- **Khách quyết định:** Khách kiểm tra món và tổng tiền trước khi đặt. Nếu AI lỗi, vẫn tìm và đặt bằng thao tác thông thường.

## 7. Yêu cầu chức năng — Bản đồ và giao hàng

- **Tìm đường đến quán:** Hiển thị vị trí quán, khoảng cách từ địa chỉ khách và đường đi. Có điểm bàn giao cụ thể.
- **Chọn giao hàng:** Kiểm tra địa chỉ phục vụ được. Hiển thị phí và giờ nhận dự kiến trước khi xác nhận đơn.
- **Theo dõi tài xế:** Xem trạng thái và vị trí tài xế trên bản đồ khi đối tác cung cấp dữ liệu. Báo rõ nếu chưa có cập nhật.
- **Kết nối đối tác:** Mong muốn kết nối Grab hoặc Xanh SM, hiện chưa có thỏa thuận. Chỉ bật giao thật khi kết nối hoạt động.

## 8. Yêu cầu chức năng — Chat giữa khách và quán

- **Chat theo đơn:** Mỗi đơn có hộp chat riêng để khách và quán trao đổi về món, giờ đến và điểm nhận.
- **Gửi và nhận:** Hỗ trợ tin nhắn chữ, ảnh và thông báo tin mới. Hiển thị thời gian gửi và trạng thái gửi.
- **Đúng người tham gia:** Khách chỉ xem chat của mình. Nhân viên quán chỉ truy cập cuộc chat thuộc quán được phân quyền.
- **Giữ thông tin đơn:** Chat không tự thay giá, số lượng hoặc địa chỉ. Thay đổi đơn cần thao tác xác nhận riêng.

## 9. Yêu cầu chức năng — Số lượng và thời gian nhận

- **Không bán trùng:** Khi hai khách cùng mua phần cuối, hệ thống chỉ xác nhận một đơn.
- **Khung giờ lấy hàng:** Quán ghi rõ giờ sẵn sàng và giờ cuối bàn giao. Khách nhìn thấy trước khi đặt.
- **Ước tính đến kịp:** Dùng thời gian đi đường để báo khách hoặc tài xế có đến kịp không. Phân biệt giờ lấy ở quán và giờ giao đến nhà.
- **Trạng thái rõ ràng:** Chờ xác nhận, đã xác nhận, sẵn sàng, đang giao, hoàn tất hoặc hủy. Gửi thông báo khi có thay đổi.

## 10. Thanh toán và quản trị — không thu hoa hồng từ quán

- **Thanh toán:** QR, thẻ hoặc tiền mặt theo phương thức được hỗ trợ. Hiển thị tiền món, phí giao và phí thanh toán nếu có.
- **Hoa hồng bằng 0:** Không khấu trừ phần trăm tiền bán của quán. Tiền hàng và phí của bên thứ ba hiển thị riêng.
- **Trang quản trị:** Xem quán, người dùng, đơn và trạng thái thanh toán. Tiếp nhận báo lỗi, xem và xử lý yêu cầu hủy hoặc hoàn.
- **Báo cáo:** Xem đơn hoàn tất, tiền hàng, tiền đã thanh toán và số tiền hoàn. Lọc theo quán, ngày và xuất Excel hoặc CSV.

## 11. Yêu cầu chung của bản app

- **Giao diện:** Dễ dùng trên điện thoại và máy tính. Chuyển tiếng Việt / tiếng Anh. Chữ, giá và nút bấm hiển thị rõ.
- **Dữ liệu và tài khoản:** Thông tin đồng bộ giữa khách, quán và quản trị. Mỗi tài khoản chỉ truy cập dữ liệu thuộc quyền của mình.
- **Khi có lỗi:** Báo rõ khi hết hàng, thanh toán lỗi, mất mạng hoặc AI không trả lời. Không để khách hiểu nhầm đơn đã thành công.
- **Kiểm thử hoàn chỉnh:** Kiểm tra toàn bộ: quán đăng hàng, khách tìm và đặt, chat, theo dõi, thanh toán và nhận hàng.

## 12. Prototype tham khảo — bấm vào liên kết để mở trên trình duyệt

- **Các màn hình:** Có vai trò khách, quán và quản trị để hình dung trải nghiệm cần xây.
- **Giới hạn bản demo:** Dữ liệu hiện lưu riêng từng máy. Thanh toán và giao hàng là mô phỏng, AI cần kiểm thử kết nối.
- **Yêu cầu mới:** Phần phí trong demo chưa cập nhật. App cần xây theo tài liệu này: không thu hoa hồng từ quán.
- **Mở prototype Second Bite:** https://second-bite-demo.trung1223.chatgpt.site
