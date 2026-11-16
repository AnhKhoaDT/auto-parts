# AutoParts Storefront (Web Khách Hàng & Gara)

Giao diện bán hàng trực tuyến dành cho chủ xe (B2C) và gara sửa xe (B2B), xây dựng bằng **Next.js 14 App Router**, **Tailwind CSS** và hỗ trợ **Đa ngôn ngữ (i18n)** không hardcode string.

---

## 📌 Cổng Mạng (Port)
* **Port**: `3000`
* **URL**: `http://localhost:3000`

---

## 🚀 Cách Chạy Ứng Dụng

### Khởi động môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:3000`

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
Tất cả các chuỗi hiển thị, nhãn, nút bấm được quản lý trong thư mục `src/locales/`:
* `src/locales/vi.json`: Từ điển tiếng Việt
* `src/locales/en.json`: Từ điển tiếng Anh
* `src/lib/i18n.ts`: Helper lấy từ điển theo ngôn ngữ

