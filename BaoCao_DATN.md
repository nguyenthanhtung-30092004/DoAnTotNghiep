# BÁO CÁO DỰ ÁN TỐT NGHIỆP

## 1. Môi trường phát triển và triển khai

### 1.1. Công cụ, phần mềm, môi trường lập trình
Quá trình xây dựng hệ thống được thực hiện trên môi trường phát triển với các công cụ và công nghệ tiên tiến nhất nhằm đảm bảo hiệu suất và trải nghiệm người dùng:
- **IDE & Text Editor:** Visual Studio Code (VS Code) với các extension hỗ trợ như ESLint, Prettier.
- **Quản lý mã nguồn (Version Control):** Git và GitHub.
- **Kiểm thử API:** Postman (để kiểm thử các endpoint của hệ thống Backend).
- **Backend Stack:** Node.js, Express.js.
- **Frontend Stack:** React.js (Vite), Redux Toolkit (quản lý state), TailwindCSS (styling), Ant Design & Framer Motion (UI/UX components), Recharts (biểu đồ thống kê).
- **Database:** MongoDB (sử dụng Mongoose ODM).
- **Dịch vụ bên thứ ba (Third-party Services):**
  - **Cloudinary:** Lưu trữ và quản lý hình ảnh sản phẩm, avatar người dùng.
  - **Nodemailer:** Gửi email (OTP xác thực quên mật khẩu, Email xác nhận đơn hàng).
  - **Socket.io:** Xử lý kết nối thời gian thực (Real-time updates) cho trạng thái đơn hàng.
  - **Google Generative AI (Gemini):** Tích hợp Chatbot AI hỗ trợ khách hàng.
  - **VNPAY Sandbox:** Tích hợp cổng thanh toán trực tuyến.

### 1.2. Môi trường triển khai (Deployment)
Hệ thống được thiết kế linh hoạt để có thể triển khai trên nhiều nền tảng đám mây:
- **Backend:** Phù hợp để triển khai lên các nền tảng như **Render**, **Railway**, hoặc **AWS EC2**. Môi trường chạy sử dụng Node.js, kết nối với MongoDB Cloud (MongoDB Atlas).
- **Frontend:** Xây dựng dạng Single Page Application (SPA), dễ dàng triển khai lên **Vercel**, **Netlify**, hoặc **Firebase Hosting**.
- Quá trình CI/CD có thể được tự động hóa thông qua **GitHub Actions** để tự động build và deploy mỗi khi có sự thay đổi mã nguồn trên nhánh chính (main).

---

## 2. Các chức năng đã triển khai

Hệ thống được chia thành hai phân hệ chính: **Phân hệ Người dùng (Client)** và **Phân hệ Quản trị (Admin)**.

### 2.1. Phân hệ Người dùng (Client)
- **Quản lý Tài khoản (Auth & Profile):**
  - Đăng ký, đăng nhập an toàn bằng JWT.
  - Quên mật khẩu với quy trình xác thực mã OTP qua Email.
  - Cập nhật thông tin cá nhân (Tên, Số điện thoại) và thay đổi mật khẩu.
- **Trải nghiệm Mua sắm:**
  - Hiển thị danh sách Sản phẩm, Danh mục (Categories), và Thương hiệu (Brands).
  - Lọc và tìm kiếm sản phẩm nâng cao (theo giá, danh mục, thương hiệu, đánh giá).
  - Xem chi tiết sản phẩm và đọc/viết Đánh giá (Reviews) có hình ảnh.
- **Giỏ hàng & Khuyến mãi:**
  - Quản lý giỏ hàng (thêm, sửa số lượng, xóa sản phẩm).
  - Áp dụng mã giảm giá (Coupons) với các điều kiện động (áp dụng theo danh mục, thương hiệu, hoặc tổng giá trị đơn hàng).
- **Thanh toán & Đơn hàng:**
  - Chọn phương thức thanh toán: Thanh toán khi nhận hàng (COD) hoặc Thanh toán trực tuyến qua cổng VNPAY.
  - Gửi Email xác nhận tự động sau khi đặt hàng thành công.
  - Theo dõi lịch sử và trạng thái đơn hàng. Nhận thông báo cập nhật trạng thái đơn hàng theo thời gian thực (Real-time qua Socket.io).
- **Chatbot AI Trợ lý ảo:**
  - Tích hợp cửa sổ Chatbox thông minh sử dụng AI để trả lời các câu hỏi, tư vấn sản phẩm cho khách hàng ngay trên giao diện web.

### 2.2. Phân hệ Quản trị (Admin Dashboard)
- **Thống kê tổng quan (Analytics):**
  - Cung cấp Dashboard trực quan (sử dụng Recharts) thống kê Doanh thu, số lượng đơn hàng, và người dùng theo thời gian.
- **Quản lý Sản phẩm & Danh mục:**
  - Thêm, sửa, xóa danh mục, thương hiệu và sản phẩm. Quản lý hình ảnh và biến thể sản phẩm.
- **Quản lý Đơn hàng:**
  - Xem danh sách và chi tiết các đơn đặt hàng.
  - Cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang giao, Hoàn thành, Hủy). Thao tác này sẽ tự động bắn sự kiện Socket để cập nhật lên giao diện người mua.
- **Quản lý Mã giảm giá (Coupons):**
  - Tạo các chiến dịch khuyến mãi đa dạng với các ràng buộc khắt khe (phạm vi áp dụng, số lượng, thời hạn sử dụng).
- **Quản lý Người dùng:**
  - Xem danh sách người dùng và thay đổi quyền hạn.

> *Lưu ý: Bạn hãy chụp ảnh màn hình các trang như: Trang chủ, Trang chi tiết sản phẩm, Giỏ hàng, Cổng thanh toán VNPAY, Trang Dashboard Admin và chèn vào mục này trong file Word.*

---

## 3. Kết quả kiểm thử

### 3.1. Phương pháp kiểm thử đã sử dụng
Dự án áp dụng phương pháp **Kiểm thử hộp đen (Black-box testing)** và **Kiểm thử chức năng thủ công (Manual Testing)** để đảm bảo luồng nghiệp vụ hoạt động chính xác từ phía người dùng cuối. 
- **Kiểm thử API (API Testing):** Sử dụng Postman để kiểm tra tính hợp lệ của dữ liệu đầu vào/đầu ra và các mã trạng thái HTTP (200, 400, 401, 500).
- **Kiểm thử hệ thống và giao diện (System & UI Testing):** Đóng vai trò là người dùng cuối và quản trị viên, tương tác trực tiếp trên giao diện trình duyệt để phát hiện lỗi logic và lỗi hiển thị (Responsive).

### 3.2. Bảng Test Case API (Kiểm thử bằng Postman)

Dưới đây là các kịch bản kiểm thử API (API Test Cases) sử dụng công cụ Postman, được thiết kế bám sát theo các Use Case của hệ thống. Quá trình kiểm thử giúp đảm bảo Backend hoạt động chính xác trước khi tích hợp lên Frontend.

#### 3.2.1. Phân hệ Khách vãng lai (Guest)

| Use Case | Chức năng kiểm thử | Method | API Endpoint | Dữ liệu đầu vào (Body/Params) | Kết quả mong đợi (Expected) | Pass/Fail |
|---|---|---|---|---|---|---|
| **UC-GU01** | Lấy danh sách sản phẩm | GET | `/api/products` | `?page=1&limit=10&keyword=ao` | Status 200, trả về mảng sản phẩm kèm thông tin phân trang. | **Pass** |
| **UC-GU01** | Xem chi tiết sản phẩm | GET | `/api/products/:id` | `id` của sản phẩm trên URL | Status 200, trả về đầy đủ thông tin sản phẩm, hình ảnh và danh sách review. | **Pass** |
| **UC-GU02** | Đồng bộ giỏ hàng | POST | `/api/cart/sync` | `[{productId, quantity, variant}]` | Status 200, giỏ hàng từ Local Storage được lưu thành công vào DB cho User sau khi login. | **Pass** |
| **UC-GU03** | Guest Checkout (Đặt hàng không cần tài khoản) | POST | `/api/orders/guest-checkout` | Thông tin người nhận, danh sách SP, phương thức TT | Status 201, tạo đơn hàng thành công, gửi email xác nhận. Trả về `orderId`. | **Pass** |
| **UC-GU04** | Chat với AI Bot | POST | `/api/chats/bot` | `{ "message": "Tư vấn cho tôi áo thun nam" }` | Status 200, hệ thống gọi tới Gemini AI và trả về nội dung tư vấn dưới dạng text. | **Pass** |

#### 3.2.2. Phân hệ Khách hàng thành viên (User)

| Use Case | Chức năng kiểm thử | Method | API Endpoint | Dữ liệu đầu vào (Body/Params) | Kết quả mong đợi (Expected) | Pass/Fail |
|---|---|---|---|---|---|---|
| **UC-U01** | Đăng ký tài khoản | POST | `/api/auth/register` | `{ "name", "email", "password" }` | Status 201, tạo tài khoản thành công, không trùng email đã có. | **Pass** |
| **UC-U01** | Đăng nhập hệ thống | POST | `/api/auth/login` | `{ "email", "password" }` | Status 200, trả về `accessToken` (JWT) và thông tin User. | **Pass** |
| **UC-U01** | Quên mật khẩu (Gửi OTP) | POST | `/api/auth/forgot-password` | `{ "email" }` | Status 200, hệ thống tự động gửi email chứa mã OTP 6 chữ số. | **Pass** |
| **UC-U02** | Cập nhật hồ sơ | PUT | `/api/users/profile` | Header: `Bearer Token`<br>`{ "name", "phone" }` | Status 200, thông tin user được update trong CSDL. | **Pass** |
| **UC-U03** | Áp dụng mã giảm giá | POST | `/api/coupons/validate` | `{ "code", "cartTotal", "categoryId" }` | Status 200, kiểm tra mã hợp lệ, trả về số tiền được giảm trừ. | **Pass** |
| **UC-U04** | Xem lịch sử đơn hàng | GET | `/api/orders/my-orders` | Header: `Bearer Token` | Status 200, danh sách đơn hàng của riêng user đang đăng nhập. | **Pass** |
| **UC-U04** | Hủy đơn hàng | PUT | `/api/orders/:id/cancel` | Header: `Bearer Token`<br>`{ "reason" }` | Status 200, trạng thái đổi thành `CANCELLED`. Báo lỗi 400 nếu đơn đang giao. | **Pass** |
| **UC-U05** | Gửi đánh giá sản phẩm | POST | `/api/reviews` | `{ "productId", "rating", "comment" }` | Status 201, bình luận được lưu và tự động cập nhật rating trung bình của SP. | **Pass** |
| **UC-U06** | Nhắn tin trực tiếp | POST | `/api/chats` | Header: `Bearer Token`<br>`{ "content" }` | Status 201, tin nhắn được lưu vào DB và phát Socket event tới Admin. | **Pass** |

#### 3.2.3. Phân hệ Quản trị viên (Admin)

| Use Case | Chức năng kiểm thử | Method | API Endpoint | Dữ liệu đầu vào (Body/Params) | Kết quả mong đợi (Expected) | Pass/Fail |
|---|---|---|---|---|---|---|
| **UC-A01** | Thống kê Dashboard | GET | `/api/dashboard/stats` | Header: `Admin Token` | Status 200, trả về tổng doanh thu, tổng đơn hàng, biểu đồ tăng trưởng. | **Pass** |
| **UC-A02** | Khóa/Mở khóa tài khoản | PUT | `/api/users/:id/status` | Header: `Admin Token`<br>`{ "isActive": false }` | Status 200, cập nhật trạng thái User thành vô hiệu hóa. | **Pass** |
| **UC-A03** | Thêm mới danh mục | POST | `/api/categories` | Header: `Admin Token`<br>`{ "name", "desc" }` | Status 201, tạo danh mục thành công, tự động gen `slug`. | **Pass** |
| **UC-A04** | Quản lý thương hiệu | POST | `/api/brands` | Header: `Admin Token`<br>`{ "name", "logo" }` | Status 201, thêm thương hiệu mới thành công. | **Pass** |
| **UC-A05** | Tạo mới sản phẩm | POST | `/api/products` | `FormData` (gồm text và file ảnh) | Status 201, hệ thống upload ảnh lên Cloudinary và lưu SP vào DB. | **Pass** |
| **UC-A06** | Cập nhật tiến độ đơn | PUT | `/api/orders/:id/status` | `{ "status": "SHIPPING" }` | Status 200, đơn đổi sang "Đang giao", gửi event báo cho User qua Socket.io. | **Pass** |
| **UC-A07** | Tạo mã giảm giá | POST | `/api/coupons` | `{ "code", "discount", "type", "expiryDate" }` | Status 201, tạo Coupon với các ràng buộc sử dụng cụ thể (Danh mục, mức giá). | **Pass** |
| **UC-A08** | Kiểm duyệt đánh giá | PUT | `/api/reviews/:id/status` | `{ "status": "hidden" }` | Status 200, đánh giá vi phạm bị ẩn khỏi trang chi tiết sản phẩm. | **Pass** |
| **UC-A09** | Phản hồi Chat | POST | `/api/chats/reply` | `{ "userId", "content" }` | Status 201, gửi tin nhắn trả lời tới User thông qua Socket.io. | **Pass** |

---

## 4. Đánh giá và so sánh

### 4.1. Đánh giá mức độ đạt được
- **Thành công:** Dự án đã xây dựng hoàn thiện một nền tảng thương mại điện tử với đầy đủ các nghiệp vụ quan trọng từ đăng ký, mua sắm đến thanh toán trực tuyến và giao hàng. Giao diện (UI) đẹp mắt, hiện đại và chuẩn Responsive trên thiết bị di động.
- **Khả năng mở rộng:** Kiến trúc phân tách Backend (RESTful API) và Frontend độc lập giúp dự án dễ dàng bảo trì, nâng cấp, và có thể phát triển thêm ứng dụng di động (React Native/Flutter) trong tương lai.

### 4.2. So sánh với các sản phẩm tương tự
- **Hiệu năng:** Khác với các hệ thống xây dựng bằng PHP truyền thống hoặc WordPress/WooCommerce có tốc độ phản hồi trang chậm khi dữ liệu lớn, việc sử dụng hệ sinh thái MERN kết hợp Vite giúp chuyển trang tức thì (SPA), tối đa hoá trải nghiệm mượt mà.
- **Tính năng nổi bật:** Vượt trội hơn các sản phẩm bài tập lớn thông thường nhờ việc tích hợp trực tiếp cổng thanh toán thực tế (VNPAY), hệ thống Email xác thực chuẩn mực, và đặc biệt là sự xuất hiện của **Trợ lý ảo AI** hỗ trợ người dùng theo xu hướng công nghệ mới nhất.

### 4.3. Điểm mạnh và Điểm yếu
**Điểm mạnh:**
- Giao diện thân thiện, hiện đại, tích hợp nhiều animation mượt mà.
- Quy trình mua hàng và thanh toán khép kín, bảo mật và an toàn (sử dụng JWT, mã hoá bcrypt).
- Tương tác thời gian thực cao (Socket.io).
- Admin panel sở hữu biểu đồ phân tích trực quan mạnh mẽ.

**Điểm yếu và hướng phát triển:**
- Ứng dụng SPA (React thuần) chưa được tối ưu tốt nhất cho SEO (Search Engine Optimization) so với việc sử dụng Server-Side Rendering (như Next.js).
- Hệ thống khuyến nghị (Recommendation System) chưa có: Trong tương lai có thể xây dựng thuật toán phân tích hành vi mua sắm của người dùng để gợi ý sản phẩm phù hợp.
- Chưa có tính năng đăng nhập bằng mạng xã hội (Google, Facebook Oauth2).
