# AutoParts Platform (Next.js + Golang)

Hệ sinh thái thương mại điện tử chuyên sâu cho phụ tùng ô tô & xe cơ giới, mạng xã hội kỹ thuật xe hơi, cổng B2B Garage và Hệ thống Quản trị WebAdmin tập trung.

---

## 📌 Bảng Phân Bổ Cổng (Ports) Của Dự Án

| Phân hệ | Thư mục | Cổng (Port) | Địa chỉ URL Local |
| :--- | :--- | :---: | :--- |
| **Backend Go (API)** | `backend/` | **`8080`** | `http://localhost:8080` |
| **Storefront Web (Khách)** | `web/` | **`3000`** | `http://localhost:3000` |
| **Admin Portal (Quản trị)** | `admin/` | **`3001`** | `http://localhost:3001` |
| **Database (PostgreSQL)** | Cloud Supabase | *Cloud* | Không chiếm port trên máy tính |

---

## 🚀 Hướng Dẫn Chạy Từng Phân Hệ

### 1. Khởi động Backend (Golang API)
```bash
cd backend
./run.sh
```
*Server sẽ lắng nghe tại `http://localhost:8080`. Endpoint kiểm tra: `http://localhost:8080/health`.*

---

### 2. Khởi động Web Khách Hàng (Next.js Storefront)
```bash
cd web
npm run dev
```
*Mở trình duyệt truy cập: `http://localhost:3000`.*

---

### 3. Khởi động Web Quản Trị (Next.js Admin Portal)
```bash
cd admin
npm run dev
```
*Mở trình duyệt truy cập: `http://localhost:3001`.*

---

## 📂 Cấu Trúc Dự Án

```text
auto-parts/
├── backend/          # Golang Core API (Clean Architecture, chi, pgxpool, jwt)
├── web/              # Next.js 14 Storefront (Mobile-first, i18n, Tailwind CSS)
├── admin/            # Next.js 14 Admin Portal (Fitment Matrix, Inventory, RBAC)
├── docs/             # Tài liệu kiến trúc, danh sách tài khoản test (git-ignored)
├── steering/         # Bộ quy chuẩn kiến trúc & phong cách phát triển dự án
├── AGENTS.md         # Universal Agent Instructions cho mọi IDE/AI Assistant
└── .gitignore        # Cấu hình loại trừ file nhạy cảm và build outputs
```
