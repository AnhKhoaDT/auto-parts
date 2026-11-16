# AutoParts Backend (Golang Core API)

Backend API hiệu năng cao cho hệ thống phụ tùng ô tô xây dựng bằng Golang, áp dụng **Clean Architecture (Hexagonal)**, router **Chi**, kết nối **PostgreSQL (pgxpool)** và bảo mật **JWT + HttpOnly Cookie**.

---

## 📌 Cổng Mạng (Port)
* **Port**: `8080`
* **Health Check**: `http://localhost:8080/health`

---

## 🚀 Cách Chạy Backend

### Bước 1: Kiểm tra cấu hình môi trường
Đảm bảo file `.env` đã có chuỗi kết nối Database Supabase:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.gsaotentgocpuinrhveu.supabase.co:5432/postgres
PORT=8080
JWT_SECRET=autoparts-jwt-secret-key-super-secure-32bytes
REFRESH_SECRET=autoparts-refresh-secret-key-super-secure-32bytes
ENVIRONMENT=development
```

### Bước 2: Chạy Database Migration (Goose)
Để tạo hoặc cập nhật cấu trúc bảng trên Supabase:
```bash
./migrate.sh
```

### Bước 3: Khởi động Server API
Cách 1: Dùng script có sẵn:
```bash
./run.sh
```

Cách 2: Chạy trực tiếp bằng Go toolchain của dự án:
```bash
../.tools/bin/go run ./cmd/api
```

---

## 📡 Danh Sách API Endpoints

### 1. Hệ thống
* `GET /health`: Kiểm tra trạng thái hoạt động server.

### 2. Xác thực & Tài khoản (`/api/v1/auth`)
* `POST /api/v1/auth/register`: Đăng ký tài khoản (hỗ trợ phân quyền `CUSTOMER`, `GARAGE`, `ADMIN`, `STAFF`).
* `POST /api/v1/auth/login`: Đăng nhập, cấp cặp token `access_token` và `refresh_token` vào `HttpOnly` Cookie.
* `GET  /api/v1/auth/me`: Lấy thông tin tài khoản đang đăng nhập (yêu cầu cookie xác thực).
* `POST /api/v1/auth/refresh`: Cấp mới access token từ refresh token.
* `POST /api/v1/auth/logout`: Xóa session cookie trên trình duyệt.

