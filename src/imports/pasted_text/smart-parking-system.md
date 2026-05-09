PROMPT CHO FIGMA MAKE 2026 - SMART PARKING MANAGEMENT SYSTEM

Tôi có một dự án Figma với 18 màn hình UI hoàn chỉnh và một Sidebar navigation. Hiện tại các màn hình chỉ là giao diện tĩnh. Tôi cần bạn biến toàn bộ dự án này thành một frontend React hoàn chỉnh có thể preview và tương tác trực tiếp trên Figma Make, với đầy đủ logic xử lý, state management, mock data, và điều hướng. Không cần backend, không cần API thật, tất cả dữ liệu đều hard code trong frontend.

Đây là danh sách 18 màn hình cần xử lý: Login, Dashboard, CardRegistration, ParkingMap, ParkingLotDetails, ParkingHistory, DebtPayment, SubmitComplaint, RequestManagement, LostCardHandling, LostTicketHandling, ManualOverride, DeviceErrorHandling, UserManagement, DeviceManagement, ComplaintManagement, Analytics, PricingConfig, AuditLog.

Sidebar hiện có đã bao gồm các menu item tương ứng. Tôi cần sidebar hoạt động điều hướng chính xác giữa các màn hình.

Bây giờ tôi sẽ mô tả yêu cầu chi tiết cho từng màn hình và từng chức năng.

YÊU CẦU TỔNG THỂ

Thứ nhất, tạo AuthContext quản lý trạng thái đăng nhập. Biến isAuthenticated mặc định false. Biến currentUser lưu thông tin user gồm id, name, role, mssv, email. Hàm login nhận tham số role, set isAuthenticated thành true, lưu user tương ứng. Hàm logout set isAuthenticated thành false, xóa user.

Thứ hai, tạo React Router DOM để điều hướng. Route gốc / kiểm tra isAuthenticated, nếu true chuyển đến /dashboard, nếu false chuyển đến /login. Các route còn lại như đã liệt kê. Sidebar chỉ hiển thị khi đã đăng nhập và không hiển thị ở trang login.

Thứ ba, tạo file mockData.ts chứa tất cả dữ liệu giả lập. Dữ liệu phải đủ để các màn hình hiển thị có nội dung thực, không bị trống. Bao gồm danh sách users, parking lots, parking slots, parking sessions, alerts, devices, complaints, invoices, transactions.

Thứ tư, tạo các custom hook để tái sử dụng logic: useAuth dùng để truy cập auth context, useParkingData dùng để lấy và cập nhật dữ liệu bãi xe, useNotification dùng để hiển thị toast message.

Thứ năm, tạo các component dùng chung: Button với các variant primary, secondary, danger, success, có trạng thái loading. Modal dùng để xác nhận hành động. Toast dùng để hiển thị thông báo thành công hoặc thất bại. Table dùng để hiển thị danh sách dữ liệu. Input và Card tái sử dụng.

YÊU CẦU CHI TIẾT TỪNG MÀN HÌNH

Màn hình Login

Giao diện hiện có nút Đăng nhập qua HCMUT_SSO. Khi nhấn nút, nút chuyển sang trạng thái loading, hiển thị spinner, vô hiệu hóa nút trong 1.5 giây. Sau 1.5 giây, hiển thị một dialog nhỏ cho phép chọn vai trò để demo: Sinh viên, Nhân viên vận hành, Quản trị viên. Khi chọn một vai trò, gọi hàm login với role tương ứng, lưu thông tin user mẫu phù hợp. Sau đó chuyển sang màn hình Dashboard. Nếu không chọn gì, mặc định đăng nhập với role sinh viên. Có hiển thị thông báo lỗi giả lập khi click nút lần đầu? Không, chỉ cần chạy đúng flow như trên.

Màn hình Dashboard

Đây là màn hình chính sau khi đăng nhập. Hiển thị bốn card thống kê: tổng số chỗ trống lấy từ tổng availableSlots của tất cả parking lots, số xe đang trong bãi tính bằng tổng totalSlots trừ availableSlots, số xe ra vào hôm nay lấy từ mock parking sessions có ngày hôm nay, doanh thu hôm nay lấy từ các session kết thúc hôm nay nhân với đơn giá. Hiển thị bản đồ bãi xe đơn giản dạng ba card cho bãi A B C, mỗi card hiển thị tên bãi, số chỗ trống, tỷ lệ lấp đầy dạng phần trăm và thanh progress bar màu xanh cam đỏ tùy theo mức độ dưới 50% là xanh, 50 đến 85 là cam, trên 85 là đỏ. Hiển thị danh sách cảnh báo mới nhất gồm 5 cảnh báo lấy từ mock alerts, mỗi cảnh báo có mức độ cao trung bình thấp, nội dung, thời gian. Hiển thị trạng thái thiết bị online/offline lấy từ mock devices, hiển thị số lượng online và offline kèm danh sách ngắn các thiết bị offline.

Màn hình CardRegistration

Giao diện có form đăng ký thẻ RFID. Có một ô input cho mã RFID, mặc định hiển thị placeholder Chờ quét thẻ. Có nút mô phỏng quét thẻ để test, khi nhấn nút Mô phỏng quét, tự động điền mã RFID giả lập vào ô input. Có một khu vực hiển thị thông tin người dùng từ HCMUT_DATACORE: họ tên, MSSV, email, vai trò. Các trường này là read-only, lấy từ currentUser. Có nút Xác nhận để gửi đăng ký. Khi nhấn Xác nhận, kiểm tra mã RFID không được để trống. Nếu hợp lệ, hiển thị toast thông báo Đăng ký thẻ thành công, thẻ đã được kích hoạt, sau đó reset form. Có nút Hủy để quay lại dashboard. Dữ liệu đăng ký được lưu vào mock data của user.

Màn hình ParkingMap

Hiển thị bản đồ tổng quan dạng lưới các ô đỗ. Mỗi ô là một hình chữ nhật nhỏ có màu xanh nếu trống, đỏ nếu có xe, xám nếu bảo trì. Hiển thị tổng số ô trống và tổng số ô của từng khu vực. Khi click vào một ô, hiển thị modal nhỏ hiển thị thông tin chi tiết của ô đó: mã ô, trạng thái, và nếu đang có xe thì hiển thị biển số xe lấy từ parking session đang active tại ô đó. Có bộ lọc để chỉ hiển thị ô trống hoặc ô có xe hoặc tất cả.

Màn hình ParkingLotDetails

Hiển thị sơ đồ chi tiết của một bãi xe cụ thể khi được chọn từ ParkingMap. Có dropdown để chọn bãi A B hoặc C. Hiển thị các tầng nếu có. Mỗi ô đỗ hiển thị mã ô và trạng thái. Có zoom in zoom out bằng nút hoặc chuột. Có chế độ xem danh sách hoặc xem lưới. Dữ liệu lấy từ mock parking slots.

Màn hình ParkingHistory

Hiển thị bảng danh sách lịch sử gửi xe của người dùng hiện tại. Các cột: thời gian vào, thời gian ra, khu vực bãi, số ô đỗ, số tiền, trạng thái thanh toán. Có bộ lọc theo tháng và theo năm. Có nút Xem chi tiết để mở modal hiển thị thông tin đầy đủ của phiên gửi đó. Có nút Xuất PDF để mô phỏng tải file. Dữ liệu lấy từ mock parking sessions của user hiện tại.

Màn hình DebtPayment

Hiển thị tổng số tiền còn nợ của người dùng hiện tại. Hiển thị danh sách các hóa đơn chưa thanh toán, mỗi hóa đơn có kỳ, số tiền, hạn thanh toán. Có nút Thanh toán ngay cho từng hóa đơn hoặc nút Thanh toán tất cả. Khi nhấn thanh toán, hiển thị modal giả lập kết nối BKPay, cho phép chọn phương thức thanh toán (giả lập), sau 1 giây hiển thị thông báo thanh toán thành công, cập nhật trạng thái hóa đơn thành đã thanh toán, cập nhật số tiền còn nợ.

Màn hình SubmitComplaint

Form gửi khiếu nại. Có dropdown chọn lượt gửi xe cần khiếu nại, danh sách lấy từ parking history. Có textarea nhập mô tả khiếu nại, yêu cầu tối thiểu 20 ký tự, hiển thị bộ đếm số ký tự. Có khu vực upload ảnh, hỗ trợ drag and drop hoặc click để chọn, tối đa 3 ảnh, hiển thị preview ảnh sau khi chọn. Có nút Gửi khiếu nại. Khi nhấn gửi, kiểm tra mô tả không được trống và đủ 20 ký tự. Nếu hợp lệ, hiển thị toast thông báo thành công, tạo bản ghi khiếu nại mới trong mock data với trạng thái pending.

Màn hình RequestManagement

Hiển thị danh sách các yêu cầu hỗ trợ từ người dùng bao gồm yêu cầu xử lý thẻ mất và yêu cầu xử lý mất vé. Danh sách được sắp xếp theo thời gian tạo, mới nhất lên đầu. Mỗi yêu cầu hiển thị loại yêu cầu, tên người gửi, thời gian, trạng thái. Có thanh tìm kiếm và bộ lọc theo loại yêu cầu và trạng thái. Khi click vào một yêu cầu, hiển thị modal chi tiết với thông tin đầy đủ của người gửi và nội dung yêu cầu. Trong modal có hai nút Chấp nhận và Từ chối. Khi chấp nhận, chuyển hướng đến màn hình LostCardHandling hoặc LostTicketHandling tùy loại yêu cầu. Khi từ chối, hiển thị dialog yêu cầu nhập lý do từ chối, sau đó cập nhật trạng thái yêu cầu thành rejected.

Màn hình LostCardHandling

Giao diện cho nhân viên xử lý thẻ mất quên hỏng. Có form tìm kiếm user theo MSSV hoặc email. Khi nhập và nhấn Tìm kiếm, hiển thị thông tin user tìm thấy kèm ảnh đại diện giả lập, danh sách thẻ hiện tại và trạng thái thẻ. Có các nút xác minh danh tính: Xác minh qua ảnh và Xác minh qua thông tin cá nhân, mỗi nút khi nhấn hiển thị toast Xác minh thành công. Sau khi xác minh, có các lựa chọn xử lý: Cấp phiên tạm quyền truy cập 1 ngày, Khóa thẻ cũ và tạo yêu cầu cấp thẻ mới. Mỗi hành động khi nhấn đều hiển thị dialog xác nhận và toast thông báo thành công. Ghi log xử lý vào mock data.

Màn hình LostTicketHandling

Giao diện cho nhân viên xử lý khách mất vé. Có form nhập biển số xe. Khi nhập và nhấn Tìm kiếm, tìm kiếm trong mock parking sessions phiên chưa thanh toán có biển số khớp. Hiển thị thông tin chi tiết phiên: giờ vào, thời gian đã gửi, ảnh xe khi vào giả lập, ảnh xe hiện tại giả lập. Tự động tính phí đỗ xe dựa trên thời gian gửi, cộng thêm phí phạt mất vé 10.000 VNĐ, hiển thị tổng số tiền cần thanh toán. Có nút Xác nhận thanh toán. Khi nhấn, hiển thị dialog xác nhận thu tiền, sau đó cập nhật trạng thái phiên thành completed, giải phóng ô đỗ, hiển thị toast thành công.

Màn hình ManualOverride

Hiển thị sơ đồ các ô đỗ xe dưới dạng lưới, mỗi ô hiển thị mã ô và trạng thái hiện tại. Có dropdown chọn khu vực bãi. Khi click vào một ô đỗ, mở form bên cạnh hiển thị thông tin ô hiện tại. Form có dropdown để chọn trạng thái mới: Có xe, Trống, Bảo trì. Có textarea bắt buộc nhập lý do ghi đè. Có nút Xác nhận ghi đè. Khi nhấn xác nhận, hiển thị dialog xác nhận lần cuối hiển thị thông tin thay đổi. Nếu đồng ý, cập nhật trạng thái ô trong mock data, ghi audit log với thông tin người thực hiện, thời gian, lý do. Hiển thị toast thông báo thành công và cập nhật lại sơ đồ.

Màn hình DeviceErrorHandling

Hiển thị bảng danh sách các cảnh báo lỗi thiết bị. Các cột: mức độ cảnh báo, tên thiết bị, vị trí, thời gian, trạng thái xử lý. Mức độ cao có màu đỏ, trung bình màu cam, thấp màu vàng. Có bộ lọc theo mức độ và theo trạng thái chưa xử lý đã xử lý. Khi click vào một cảnh báo, hiển thị panel chi tiết bên cạnh hoặc modal. Panel hiển thị thông tin đầy đủ về thiết bị: mã thiết bị, loại thiết bị, firmware version, lịch sử kết nối, log lỗi. Có các nút thao tác xử lý: Ping thiết bị, Khởi động lại thiết bị, Đánh dấu đã khắc phục, Chuyển cho đội kỹ thuật. Ping và Khởi động lại hiển thị loading 1 giây rồi toast kết quả thành công hoặc thất bại giả lập. Đánh dấu đã khắc phục sẽ đóng cảnh báo. Chuyển kỹ thuật tạo một ticket bảo trì mới trong mock data.

Màn hình UserManagement

Hiển thị bảng danh sách người dùng với các cột: MSSV, họ tên, email, vai trò, trạng thái tài khoản, trạng thái thẻ. Có thanh tìm kiếm theo tên hoặc MSSV. Có nút Thêm người dùng mở form thêm mới user vào mock data. Mỗi dòng có nút Sửa và nút Khóa/Mở tài khoản. Khi nhấn Khóa, hiển thị dialog xác nhận và cập nhật trạng thái user thành locked, không thể đăng nhập. Có nút Đồng bộ từ DATACORE giả lập, khi nhấn hiển thị toast Đồng bộ thành công 5 user mới và thêm vào danh sách.

Màn hình DeviceManagement

Hiển thị bảng danh sách thiết bị IoT với các cột: mã thiết bị, tên thiết bị, loại sensor/gateway/barrier/led, vị trí lắp đặt, trạng thái online/offline. Có nút Thêm thiết bị mở form nhập mã thiết bị, loại, vị trí. Có nút Sửa và nút Vô hiệu hóa cho từng thiết bị. Có nút Ping kiểm tra kết nối cho từng thiết bị, khi nhấn hiển thị kết quả ping giả lập success hoặc failed sau 1 giây. Dữ liệu lấy từ mock devices, mỗi lần thêm hoặc vô hiệu hóa đều cập nhật mock data.

Màn hình ComplaintManagement

Hiển thị bốn stats cards: tổng số khiếu nại, số chờ xử lý, số đã chấp nhận, số đã từ chối. Các stats này tính toán từ mock complaints. Có tabs để lọc khiếu nại theo trạng thái. Hiển thị bảng danh sách khiếu nại với các cột: mã khiếu nại, người gửi, lượt gửi liên quan, mô tả tóm tắt, số lượng ảnh đính kèm, trạng thái, thời gian. Mỗi dòng có nút Xem chi tiết và nút Xử lý. Nút Xử lý mở modal cho phép chọn Chấp nhận hoặc Từ chối. Nếu chấp nhận, hiển thị form nhập ghi chú, sau đó cập nhật trạng thái complaint thành approved, nếu liên quan đến phí thì cập nhật lại invoice amount trong mock data. Nếu từ chối, hiển thị form nhập lý do từ chối, cập nhật trạng thái thành rejected. Có nút Gửi thông báo kết quả đến người dùng giả lập hiển thị toast.

Màn hình Analytics

Hiển thị các biểu đồ thống kê sử dụng thư viện Recharts hoặc tương thích với Figma. Biểu đồ lưu lượng xe theo giờ trong ngày dạng line chart. Biểu đồ doanh thu theo tháng dạng bar chart. Biểu đồ tỷ lệ lấp đầy theo khu vực dạng pie chart. Có date range picker để chọn khoảng thời gian xem báo cáo. Có nút Xuất báo cáo dạng CSV giả lập, khi nhấn hiển thị toast Đã tải xuống báo cáo. Dữ liệu cho biểu đồ lấy từ mock parking sessions và invoices.

Màn hình PricingConfig

Hiển thị bảng cấu hình giá cho từng nhóm đối tượng: Sinh viên, Giảng viên Cán bộ, Khách vãng lai. Mỗi nhóm có các ô input cho giá theo giờ, giá theo ngày, giá theo tháng. Có khu vực cấu hình khung giờ cao điểm với giá đặc biệt. Có nút Lưu thay đổi. Khi nhấn lưu, hiển thị dialog xác nhận áp dụng chính sách giá mới, lưu vào mock config, hiển thị toast thành công. Có nút Đặt lại về mặc định để khôi phục giá gốc.

Màn hình AuditLog

Hiển thị bảng lịch sử các thao tác quan trọng trong hệ thống. Các cột: thời gian, người thực hiện, hành động, chi tiết, IP giả lập. Có thanh tìm kiếm và bộ lọc theo hành động như thay đổi giá, ghi đè trạng thái, xử lý khiếu nại, quản lý thiết bị, xử lý giao dịch. Có date range picker để lọc theo khoảng thời gian. Có nút Xuất log để tải file CSV giả lập. Dữ liệu audit log được sinh tự động mỗi khi có thao tác quan trọng từ các màn hình khác như ManualOverride, ComplaintManagement, PricingConfig, DeviceManagement, LostCardHandling.

YÊU CẦU VỀ SIDEBAR VÀ ĐIỀU HƯỚNG

Sidebar hiện có cần được cập nhật để hiển thị các menu item tương ứng với danh sách màn hình trên. Menu item đang active cần được highlight khác màu so với các item khác. Sidebar chỉ hiển thị khi người dùng đã đăng nhập. Khi nhấn vào logo trên sidebar, chuyển về dashboard. Khi nhấn vào nút đăng xuất ở cuối sidebar, gọi hàm logout và chuyển về màn hình login.

YÊU CẦU VỀ STATE MANAGEMENT

Sử dụng React Context API cho auth state. Sử dụng useState và useEffect cho các state cục bộ của từng màn hình. Dữ liệu mock được khởi tạo một lần khi app start và có thể thay đổi qua các thao tác thêm sửa xóa từ các màn hình quản lý. Các thay đổi dữ liệu cần được phản ánh ngay lập tức lên các màn hình liên quan.

YÊU CẦU VỀ UI COMPONENTS

Tất cả các nút bấm phải có trạng thái hover. Các nút chính có border radius 8px, padding phù hợp. Các card có border radius 8px, đổ bóng nhẹ. Toast thông báo hiển thị ở góc phải trên cùng, tự động biến mất sau 3 giây. Modal có nền mờ phía sau, đóng được bằng nút X hoặc click ra ngoài. Các form có validation cơ bản, hiển thị lỗi ngay dưới trường input khi dữ liệu không hợp lệ.

YÊU CẦU VỀ RESPONSIVE

Giao diện cần tương thích với màn hình desktop kích thước tối thiểu 1280x720. Sidebar có thể thu gọn lại thành icon khi màn hình nhỏ hơn, nhưng không bắt buộc. Các bảng dữ liệu có thể scroll ngang nếu quá nhiều cột.

YÊU CẦU VỀ HIỆU SUẤT PREVIEW TRÊN FIGMA

Tất cả code phải chạy được ngay trên chế độ preview của Figma Make mà không cần build thêm. Không sử dụng thư viện bên ngoài quá nặng. Recharts hoặc Chart.js có thể được dùng cho biểu đồ nếu Figma Make hỗ trợ. Font sử dụng là Inter và Roboto. Màu sắc chính xanh #003366 và #0055A4, success #28A745, error #DC3545, warning #FFC107, background #F4F7F9.

Bây giờ hãy bắt đầu tạo toàn bộ code cho dự án này với đầy đủ các file và thư mục như đã mô tả. Tất cả code phải nằm trong một dự án React TypeScript duy nhất, sẵn sàng để preview. Hãy trả lời bằng code đầy đủ.