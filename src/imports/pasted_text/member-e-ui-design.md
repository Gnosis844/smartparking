Dành cho Member E: Dashboard vận hành, Ghi đè trạng thái, Xử lý lỗi thiết bị
PHẦN 1: HIỂU BIẾT VỀ UI DESIGN CHO HỆ THỐNG VẬN HÀNH
Trước khi bắt đầu thiết kế, tôi xin chia sẻ những hiểu biết quan trọng về thiết kế giao diện cho nhân viên vận hành bãi xe.

Đặc điểm của người dùng là nhân viên vận hành, những người làm việc trực tiếp tại bãi xe, thường xuyên phải xử lý nhiều tác vụ cùng lúc, đặc biệt trong giờ cao điểm. Do đó, giao diện cần ưu tiên sự rõ ràng, nhanh chóng và dễ thao tác. Mọi thông tin quan trọng phải hiển thị ngay lập tức mà không cần click sâu.

Ba màn hình tôi được phân công đều phục vụ cho nhân viên vận hành. UI-12 là Dashboard vận hành, nơi nhân viên giám sát toàn bộ hệ thống. UI-15 là màn hình Ghi đè trạng thái, dùng khi cảm biến bị lỗi. UI-16 là màn hình Xử lý lỗi thiết bị, nơi nhân viên tiếp nhận và xử lý các cảnh báo.

Ngoài ba màn hình này, khi khởi tạo một ứng dụng quản lý, cần có các màn hình cơ bản như màn hình đăng nhập và màn hình chính sau đăng nhập. Tuy nhiên, các màn hình đó đã được phân công cho thành viên khác. Với phần việc của tôi, tôi tập trung vào các màn hình dành riêng cho nhân viên vận hành.

PHẦN 2: HƯỚNG DẪN KHỞI TẠO DỰ ÁN TRÊN FIGMA
Trước khi thiết kế từng màn hình, cần khởi tạo dự án Figma với cấu trúc thống nhất cho cả nhóm.

Đầu tiên, tạo một Figma Team mới với tên dự án là IoT-SPMS. Trong đó, tạo một File chính có tên là SPMS_UI_Design.

Trong File này, tạo các Page riêng biệt cho từng thành viên hoặc từng nhóm màn hình. Cụ thể, tạo một Page có tên Member_E_Dashboard để chứa ba màn hình UI-12, UI-15, UI-16.

Về mặt style guide, cần thiết lập các thành phần cơ bản trước khi vẽ bất kỳ màn hình nào. Tạo một Frame đặc biệt gọi là Style Guide để lưu trữ các thành phần dùng chung.

Màu sắc chủ đạo nên sử dụng xanh dương đậm của trường Đại học Bách Khoa, mã màu khoảng 003366 hoặc 0055A4, làm màu primary. Màu xanh lá cây, mã khoảng 28A745, dùng để thể hiện trạng thái bình thường, thiết bị online, còn chỗ trống. Màu cam, mã khoảng FFC107, dùng để cảnh báo mức độ trung bình, sắp đầy. Màu đỏ, mã khoảng DC3545, dùng cho cảnh báo nguy hiểm, thiết bị offline, hết chỗ. Màu xám nhạt, mã khoảng F5F5F5, dùng làm nền cho các card và khu vực. Màu chữ chính là đen đậm, mã 333333, màu chữ phụ là xám, mã 666666.

Về font chữ, sử dụng hệ font Inter hoặc Roboto, đây là hai font phổ biến, dễ đọc và phù hợp với giao diện quản trị. Font size cho tiêu đề chính là 24 pixel, tiêu đề phụ là 18 pixel, nội dung bình thường là 14 pixel, chú thích nhỏ là 12 pixel.

Các thành phần UI cần được tạo thành component để tái sử dụng. Đó là nút bấm với ba trạng thái default, hover, active. Thẻ card có viền bo góc 8 pixel, đổ bóng nhẹ. Bảng hiển thị dữ liệu có header và row xen kẽ màu nền. Thanh trạng thái với các mức độ khác nhau.

PHẦN 3: HƯỚNG DẪN THIẾT KẾ UI-12: DASHBOARD VẬN HÀNH
Đây là màn hình quan trọng nhất của nhân viên vận hành, nơi hiển thị tổng quan toàn bộ hệ thống.

Màn hình cần được thiết kế với layout dạng grid, chia làm ba khu vực chính: khu vực thông tin tổng quan ở phía trên, khu vực bản đồ bãi xe ở giữa, và khu vực cảnh báo cùng trạng thái thiết bị ở bên phải hoặc phía dưới tùy theo bố cục.

Khu vực thông tin tổng quan nên bao gồm bốn card hiển thị các chỉ số quan trọng nhất. Card thứ nhất hiển thị tổng số chỗ trống, với con số lớn nổi bật, kèm theo tỷ lệ phần trăm so với tổng dung lượng. Card thứ hai hiển thị số xe đang có trong bãi. Card thứ ba hiển thị số lượng xe ra vào trong ngày, chia làm hai chỉ số nhỏ là xe vào và xe ra. Card thứ tư hiển thị doanh thu tạm tính trong ngày, nếu có tích hợp.

Mỗi card cần có icon minh họa, tiêu đề rõ ràng, và con số được làm nổi bật. Nên có màu sắc phân biệt nhẹ cho từng card.

Khu vực bản đồ bãi xe là phần quan trọng nhất. Cần thiết kế một bản đồ đơn giản hóa của khuôn viên trường, thể hiện các khu vực bãi xe như bãi A, bãi B, bãi C. Mỗi khu vực được biểu diễn bằng một hình chữ nhật hoặc vùng màu, với màu sắc thay đổi theo trạng thái lấp đầy. Màu xanh nếu còn nhiều chỗ trống, màu cam nếu gần đầy, màu đỏ nếu đã đầy.

Khi click vào từng khu vực, có thể hiển thị chi tiết hơn hoặc điều hướng sang màn hình chi tiết. Trên mỗi khu vực, hiển thị rõ số chỗ trống và tổng số chỗ.

Khu vực cảnh báo và trạng thái thiết bị nên được đặt ở bên phải màn hình. Phần cảnh báo hiển thị danh sách các cảnh báo mới nhất, mỗi cảnh báo có biểu tượng cảnh báo, nội dung ngắn gọn, thời gian, và trạng thái đã xử lý hay chưa. Các cảnh báo chưa xử lý cần được tô màu nền đỏ nhạt hoặc cam nhạt để nổi bật.

Phần trạng thái thiết bị hiển thị tổng số thiết bị đang online và offline, kèm theo danh sách ngắn các thiết bị gặp sự cố. Có nút Xem tất cả để chuyển sang màn hình quản lý thiết bị chi tiết.

Ngoài ra, trên cùng của màn hình cần có thanh header hiển thị tên nhân viên đang đăng nhập, thời gian hiện tại, và các nút thông báo, cài đặt. Cũng cần có menu điều hướng bên trái hoặc phía trên để chuyển giữa các chức năng.

PHẦN 4: HƯỚNG DẪN THIẾT KẾ UI-15: GHI ĐÈ TRẠNG THÁI THỦ CÔNG
Màn hình này được sử dụng khi cảm biến bị lỗi hoặc báo sai, nhân viên cần can thiệp thủ công để cập nhật đúng trạng thái của ô đỗ xe.

Bố cục màn hình nên chia làm hai phần chính. Phần bên trái là bản đồ sơ đồ các ô đỗ xe, phần bên phải là form nhập thông tin và xác nhận.

Phần bản đồ sơ đồ cần thể hiện chi tiết từng ô đỗ xe trong khu vực đang được chọn. Mỗi ô đỗ được biểu diễn bằng một hình chữ nhật hoặc hình vuông, với màu sắc thể hiện trạng thái hiện tại. Màu xanh cho ô trống, màu đỏ cho ô có xe, màu xám cho ô đang bảo trì, và một màu đặc biệt như cam hoặc vàng cho các ô đang có cảnh báo hoặc cần được kiểm tra.

Trên mỗi ô đỗ, hiển thị mã số ô để dễ nhận biết. Khi nhân viên click vào một ô, ô đó sẽ được highlight và thông tin của ô hiển thị ở phần form bên phải.

Phần form bên phải bao gồm các thành phần sau. Đầu tiên là tiêu đề cho biết đang thực hiện ghi đè cho ô nào, hiển thị mã ô và vị trí. Tiếp theo là các nút radio hoặc dropdown để chọn trạng thái mới, với ba lựa chọn: Có xe, Trống, Đang bảo trì.

Sau đó là ô nhập lý do ghi đè, đây là trường bắt buộc phải nhập để đảm bảo tính truy vết. Ô này nên là textarea để nhân viên có thể nhập nhiều dòng mô tả chi tiết. Bên dưới là ô hiển thị thông tin người thực hiện, tự động lấy từ tài khoản đang đăng nhập.

Cuối cùng là hai nút bấm: nút Xác nhận để thực hiện ghi đè, và nút Hủy để đóng form hoặc quay lại. Khi nhấn Xác nhận, cần có một dialog xác nhận lần cuối hiển thị lại thông tin thay đổi và yêu cầu nhân viên xác nhận một lần nữa.

Phía trên cùng của màn hình, cần có bộ lọc để chọn khu vực bãi xe, vì bãi xe thường có nhiều khu vực khác nhau. Cũng cần có nút Tải lại bản đồ để cập nhật trạng thái mới nhất từ hệ thống.

PHẦN 5: HƯỚNG DẪN THIẾT KẾ UI-16: XỬ LÝ LỖI THIẾT BỊ
Màn hình này là nơi nhân viên tiếp nhận các cảnh báo từ thiết bị IoT và thực hiện các bước xử lý ban đầu trước khi chuyển cho đội kỹ thuật.

Bố cục màn hình nên có hai phần chính. Phần bên trái là danh sách các cảnh báo, phần bên phải là chi tiết cảnh báo và các thao tác xử lý.

Phần danh sách cảnh báo cần hiển thị dưới dạng bảng hoặc danh sách các card, với các cột thông tin quan trọng. Đó là mức độ cảnh báo, được thể hiện bằng icon màu sắc. Thiết bị bị lỗi, hiển thị tên và mã thiết bị. Vị trí của thiết bị để nhân viên biết cần đến đâu kiểm tra. Thời gian phát hiện lỗi. Trạng thái xử lý hiện tại, bao gồm Chưa xử lý, Đang xử lý, Đã xử lý, hoặc Đã chuyển kỹ thuật.

Các cảnh báo chưa xử lý cần được ưu tiên hiển thị lên đầu danh sách và có màu nền nổi bật. Có thể thêm bộ lọc để nhân viên chỉ xem cảnh báo chưa xử lý hoặc cảnh báo theo từng khu vực.

Khi nhân viên click vào một cảnh báo trong danh sách, phần bên phải sẽ hiển thị chi tiết đầy đủ. Phần chi tiết bao gồm các thông tin sau.

Thông tin thiết bị: hiển thị mã thiết bị, loại thiết bị, vị trí lắp đặt, gateway quản lý, và thời gian cuối cùng thiết bị gửi dữ liệu thành công.

Thông tin lỗi: hiển thị loại lỗi, mô tả chi tiết, thời gian phát hiện, và các log liên quan nếu có.

Khu vực thao tác xử lý: đây là phần quan trọng nhất. Cần có các nút thao tác tương ứng với quy trình xử lý. Nút Kiểm tra thực tế để nhân viên xác nhận đã đến vị trí kiểm tra. Sau khi kiểm tra, nếu thiết bị hoạt động bình thường trở lại, có nút Đã khắc phục để đóng cảnh báo. Nếu cần khởi động lại thiết bị từ xa, có nút Ping thiết bị hoặc Khởi động lại. Nếu lỗi nghiêm trọng cần kỹ thuật viên, có nút Chuyển kỹ thuật để tạo yêu cầu bảo trì.

Ngoài ra, cần có ô nhập ghi chú xử lý để nhân viên ghi lại những gì đã làm, đây cũng là trường bắt buộc để đảm bảo audit log.

Phía trên cùng màn hình, nên có thống kê nhanh về tình trạng thiết bị, ví dụ như tổng số cảnh báo chưa xử lý, số thiết bị đang offline, số thiết bị đang trong bảo trì.

PHẦN 6: HƯỚNG DẪN VỀ TƯƠNG TÁC VÀ ANNOTATION
Khi thiết kế trên Figma, cần chú ý thể hiện các trạng thái tương tác để Figma AI hiểu rõ luồng hoạt động.

Đối với mỗi nút bấm, cần thiết kế ba trạng thái: trạng thái bình thường, trạng thái hover khi di chuột vào, và trạng thái active khi đang nhấn. Điều này giúp người xem hiểu được cảm giác tương tác.

Đối với các phần tử có thể click như ô đỗ trong bản đồ, cần thể hiện trạng thái được chọn, ví dụ như viền đậm hơn hoặc đổ bóng.

Đối với các dialog xác nhận, cần thiết kế riêng một frame thể hiện dialog xuất hiện, với nền mờ phía sau và dialog ở giữa màn hình.

Về annotation, mỗi màn hình cần có một vùng chú thích bên cạnh, giải thích các thành phần chính. Có thể dùng các đường kẻ và số thứ tự để đánh dấu từng khu vực, sau đó liệt kê giải thích ở bên cạnh.

Ví dụ, trên màn hình Dashboard, cần chú thích rõ: khu vực 1 là các chỉ số tổng quan, khu vực 2 là bản đồ bãi xe với màu sắc thể hiện mức độ lấp đầy, khu vực 3 là danh sách cảnh báo với các mức độ ưu tiên, khu vực 4 là trạng thái thiết bị.

Trên màn hình Ghi đè trạng thái, cần chú thích rõ: các ô đỗ với mã số và màu sắc trạng thái, cách chọn ô bằng click, form nhập liệu bên phải với các trường bắt buộc, và quy trình xác nhận hai bước.

Trên màn hình Xử lý lỗi thiết bị, cần chú thích rõ: danh sách cảnh báo với phân loại theo mức độ, khu vực chi tiết cảnh báo, và các nút thao tác tương ứng với từng bước trong quy trình xử lý.

PHẦN 7: LƯU Ý KHI SỬ DỤNG FIGMA AI
Khi sử dụng Figma AI để khởi tạo dự án, bạn cần nhập prompt mô tả chi tiết những gì đã trình bày ở trên.

Đối với dự án tổng thể, bạn nên yêu cầu AI tạo một Style Guide trước, bao gồm bảng màu, font chữ, và các component cơ bản như nút, card, bảng, thanh trạng thái.

Sau đó, yêu cầu AI tạo từng màn hình một, bắt đầu với UI-12 Dashboard vận hành, vì đây là màn hình chính và phức tạp nhất. Khi tạo màn hình, hãy mô tả rõ bố cục, các thành phần, màu sắc, và chức năng của từng khu vực.

Sau khi có màn hình đầu tiên, bạn có thể dùng nó làm template cho các màn hình tiếp theo, chỉ cần điều chỉnh bố cục và nội dung cho phù hợp.

Cuối cùng, kiểm tra lại tính nhất quán giữa các màn hình, đảm bảo cùng một style guide được áp dụng xuyên suốt.

