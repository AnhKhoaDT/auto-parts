# AutoParts Admin Portal (Cổng Quản Trị Hệ Thống)

Giao diện quản trị tập trung dành cho ban điều hành, thủ kho và nhân viên kỹ thuật. Xây dựng bằng **Next.js 14 App Router**, **Tailwind CSS**, thiết kế bảng dữ liệu mật độ cao (*High-density*) và hỗ trợ **Đa ngôn ngữ (i18n)**.

---

## 📌 Cổng Mạng (Port)
* **Port**: `3001`
* **URL**: `http://localhost:3001`

---

## 🚀 Cách Chạy Ứng Dụng

### Khởi động môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:3001`

### Kiểm tra lỗi TypeScript & Lint
```bash
npx tsc --noEmit
```

### Build Production
```bash
npm run build
npm run start
```

---

## 🌐 Cấu Trúc Đa Ngôn Ngữ (i18n)
Toàn bộ nhãn menu, tiêu đề cột bảng dữ liệu, nút bấm nằm tại:
* `src/locales/vi.json`: Từ điển tiếng Việt cho Admin
* `src/locales/en.json`: Từ điển tiếng Anh cho Admin
* `src/lib/i18n.ts`: Helper nạp từ điển

