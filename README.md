# HỌC PHẦN: ĐỒ ÁN CƠ SỞ CÔNG NGHỆ THÔNG TIN

## Đề tài

**XÂY DỰNG NỀN TẢNG KẾT NỐI VIỆC LÀM NGẮN HẠN**

**Lớp tín chỉ:** Đồ án cơ sở Công nghệ Thông tin -1-3-25(N02)

**Giảng viên hướng dẫn:** Trịnh Thanh Bình

## Nhóm thực hiện

**Nhóm 04**

| STT | Họ và tên | Mã sinh viên | Tỉ lệ đóng góp |
| --- | --- | --- | --- |
| 1 | Nguyễn Quế Bắc | 23010574 | 40% |
| 2 | Hoàng Tuấn Kiệt | 23010517 | 30% |
| 3 | Tạ Thành Phú | 22011392 | 30% |

# JobCo / JobConnect

JobCo là nền tảng web kết nối người đăng việc với người tìm việc ngắn hạn. Hệ thống hỗ trợ các quy trình chính như đăng việc, tìm kiếm việc, ứng tuyển, xét duyệt ứng viên, hoàn thành công việc, đánh giá hai chiều và quản trị dữ liệu hệ thống.

Dự án được xây dựng theo mô hình client-server, gồm frontend React và backend REST API sử dụng Node.js, Express và MongoDB.

## Mục tiêu dự án

- Xây dựng hệ thống trung gian giúp người có nhu cầu thuê nhân sự ngắn hạn đăng công việc nhanh chóng.
- Hỗ trợ người tìm việc xem, lọc và ứng tuyển các công việc phù hợp.
- Quản lý tập trung quy trình từ đăng việc, ứng tuyển, chấp nhận ứng viên đến hoàn thành công việc.
- Tạo cơ chế đánh giá uy tín hai chiều giữa người đăng việc và người thực hiện.
- Cung cấp dashboard quản trị để theo dõi người dùng, công việc và dữ liệu hệ thống.

## Chức năng chính

### Người dùng

- Đăng ký, đăng nhập và xác thực bằng JWT.
- Xem và chỉnh sửa thông tin hồ sơ cá nhân.
- Theo dõi điểm đánh giá trung bình và tổng số lượt đánh giá.

### Người đăng việc

- Tạo công việc với các thông tin: tiêu đề, mô tả, yêu cầu, danh mục, địa điểm, lương, hạn ứng tuyển, ngày bắt đầu và ngày kết thúc.
- Quản lý danh sách công việc đã đăng.
- Xem danh sách ứng viên của từng công việc.
- Chấp nhận hoặc từ chối đơn ứng tuyển.
- Đánh dấu công việc đã hoàn thành.
- Đánh giá người thực hiện sau khi công việc hoàn tất.

### Người tìm việc

- Xem danh sách công việc đang mở.
- Tìm kiếm và lọc công việc theo danh mục, địa điểm, từ khóa, mức lương hoặc trạng thái.
- Xem chi tiết công việc.
- Ứng tuyển bằng thư giới thiệu.
- Theo dõi trạng thái các đơn đã ứng tuyển.
- Đánh giá người đăng việc sau khi hoàn thành công việc.

### Quản trị viên

- Xem thống kê tổng quan.
- Quản lý danh sách người dùng.
- Quản lý danh sách công việc.
- Lọc dữ liệu theo vai trò hoặc trạng thái.

## Quy tắc nghiệp vụ nổi bật

- Người dùng không được ứng tuyển vào công việc do chính mình đăng.
- Một người dùng không được ứng tuyển trùng một công việc.
- Công việc chỉ nhận đơn khi trạng thái là `OPEN` và chưa hết hạn ứng tuyển.
- `applicationDeadline >= currentDate`.
- `startDate > applicationDeadline`.
- `endDate >= startDate`.
- Khi một ứng viên được chấp nhận, công việc chuyển sang trạng thái `ASSIGNED`.
- Chỉ được đánh giá sau khi công việc đã hoàn thành.
- Mỗi bên chỉ được đánh giá một lần cho cùng một công việc.

## Công nghệ sử dụng

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- cors
- dotenv

### Frontend

- React
- React Router DOM
- Axios
- React Icons
- CSS theo component/page

### Công cụ phát triển

- npm
- Git
- MongoDB local hoặc MongoDB Atlas

## Cấu trúc thư mục

```txt
JobCo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── docs/
│   ├── ADMIN_GUIDE.md
│   ├── database-schema.md
│   ├── design-specification.md
│   ├── feature_work.md
│   └── project-report-overview.md
├── TEST_LOGIN.md
└── README.md
```

## Yêu cầu cài đặt

- Node.js 16 trở lên.
- npm.
- MongoDB local hoặc tài khoản MongoDB Atlas.

## Cài đặt và chạy dự án

### 1. Cài đặt backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend` và cấu hình:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobconnect
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

Chạy backend:

```bash
npm run dev
```

Backend chạy tại:

```txt
http://localhost:5000
```

API prefix:

```txt
http://localhost:5000/api
```

### 2. Cài đặt frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm start
```

Frontend chạy tại:

```txt
http://localhost:3000
```

### 3. Tạo dữ liệu mẫu

Trong thư mục `backend`, chạy:

```bash
npm run seed
```

## Tài khoản mẫu

### Tài khoản người dùng

```txt
Email: nguyenvanan@gmail.com
Password: password123
```

Các tài khoản người dùng khác dùng cùng mật khẩu `password123`:

```txt
tranthibinh@gmail.com
leminhchau@gmail.com
phamthidung@gmail.com
hoangvanem@gmail.com
```

### Tài khoản quản trị viên

```txt
Email: admin@jobco.com
Password: admin123
```

## Kiểm thử

Kiểm tra backend:

```bash
cd backend
npm test
```

Build frontend:

```bash
cd frontend
npm run build
```

## Tài liệu dự án

- `docs/project-report-overview.md`: tổng quan nội dung phục vụ báo cáo.
- `docs/database-schema.md`: thiết kế cơ sở dữ liệu.
- `docs/design-specification.md`: đặc tả thiết kế giao diện.
- `docs/feature_work.md`: mô tả chi tiết các chức năng.
- `docs/ADMIN_GUIDE.md`: hướng dẫn chức năng quản trị.

## Hướng phát triển

- Bổ sung chat realtime giữa người đăng việc và người tìm việc.
- Thêm thông báo qua email hoặc thông báo trong hệ thống.
- Hỗ trợ upload hình ảnh công việc hoặc ảnh đại diện.
- Tích hợp bản đồ/GPS cho công việc theo địa điểm.
- Phát triển thanh toán trực tuyến.
- Gợi ý công việc hoặc ứng viên phù hợp bằng thuật toán đề xuất.

## Kết luận

JobCo/JobConnect là ứng dụng web phục vụ bài toán kết nối việc làm ngắn hạn. Dự án đáp ứng các chức năng cốt lõi của một nền tảng việc làm ở mức MVP, bao gồm xác thực người dùng, quản lý công việc, quản lý ứng tuyển, đánh giá hai chiều, hồ sơ cá nhân và dashboard quản trị.
