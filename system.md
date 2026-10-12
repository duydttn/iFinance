# Tài liệu Hệ thống iFinance (system.md)

Tài liệu này hướng dẫn chi tiết cách vận hành, khởi động các dịch vụ và quy trình đóng gói phần mềm iFinance để bàn giao cho khách hàng.

---

## 1. Tổng quan hệ thống

**iFinance** là hệ thống quản lý thu chi nội bộ thông minh, được xây dựng trên nền tảng:
- **Frontend**: React.js + Vite (nằm trong thư mục `client`).
- **Backend**: Node.js + Express (nằm trong thư mục `backend`).
- **Cơ sở dữ liệu**: SQLite (sử dụng `better-sqlite3` và mã hóa `sqlcipher`).
- **Desktop Wrapper**: Electron (nằm trong thư mục `electron`).
- **AI Engine**: Tích hợp AI Studio Engine để xử lý dữ liệu thông minh.

---

## 2. Hướng dẫn khởi động (Dành cho Phát triển)

Để chạy hệ thống trong môi trường phát triển (Development), bạn cần thực hiện các bước sau:

### Bước 1: Cài đặt môi trường
Đảm bảo máy tính đã cài đặt **Node.js** (khuyến nghị v18 trở lên).
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
cd client && npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc (copy từ `.env.example`). Đảm bảo các thông số như `PORT`, `DB_PATH`, `JWT_SECRET` đã được thiết lập.

### Bước 3: Chạy hệ thống
Bạn có thể khởi động toàn bộ hệ thống (gồm Backend, Frontend và Electron) bằng một lệnh duy nhất:
```bash
npm run dev
```
**Lệnh này sẽ thực hiện:**
1. Khởi động Backend Server tại cổng cấu hình (mặc định 3000).
2. Khởi động Vite Dev Server cho Frontend (mặc định cổng 5173).
3. Khởi chạy ứng dụng Electron và tải giao diện từ Vite.

*Lưu ý: Nếu bạn chỉ muốn chạy riêng lẻ:*
- Chạy Backend: `npm run server`
- Chạy Frontend: `npm run client`

---

## 3. Các dịch vụ và Logic khởi tạo

Khi hệ thống khởi động, các service sau sẽ được kích hoạt tự động:

1.  **Backend Service**:
    - Khởi tạo Express App.
    - Kết nối cơ sở dữ liệu SQLite thông qua `loaders/dependencyLoader.js`.
    - Thiết lập Socket.io để giao tiếp thời gian thực.
2.  **AI Service**:
    - Hệ thống kiểm tra sự tồn tại của AI Engine và Model.
    - Nếu hợp lệ, AI Studio Engine sẽ được khởi động ngầm (background) sau 5 giây kể từ khi server chạy.
3.  **Electron Main Process**:
    - Quản lý cửa sổ ứng dụng.
    - Tự động khởi động Backend server nếu chưa chạy.
    - Cung cấp các Bridge API (Preload script) để Frontend giao tiếp với hệ thống (File system, Dialog...).

---

## 4. Quy trình Đóng gói (Packaging)

Để tạo bản cài đặt cuối cùng cho khách hàng, thực hiện theo các bước sau:

### Bước 1: Build Frontend
Chuyển đổi mã nguồn React thành các file tĩnh được tối ưu:
```bash
npm run build:ui
```
*Kết quả sẽ nằm trong thư mục `client/dist`.*

### Bước 2: Đóng gói ứng dụng Electron
Sử dụng `electron-builder` để tạo file cài đặt (`.exe` cho Windows, `.dmg` cho Mac).

- **Đóng gói cho Windows (Phổ biến nhất):**
  ```bash
  npm run build:win
  ```
- **Đóng gói cho tất cả nền tảng:**
  ```bash
  npm run build
  ```

### Bước 3: Kiểm tra kết quả
Sau khi lệnh hoàn tất, bộ cài đặt sẽ nằm trong thư mục:
`dist/iFinance Setup <phiên_bản>.exe`

---

## 5. Bàn giao và Sử dụng (Dành cho Client)

Khi gửi cho khách hàng, bạn chỉ cần gửi file cài đặt trong thư mục `dist`.

### Các bước Client sử dụng:
1.  **Cài đặt**: Chạy file `iFinance Setup.exe`. Ứng dụng sẽ tự động cài đặt vào máy khách hàng.
2.  **Khởi chạy**: Sau khi cài đặt, Client mở ứng dụng từ Shortcut trên Desktop.
3.  **Tự động hóa**: 
    - Khi ứng dụng Electron mở lên, nó sẽ tự động kích hoạt Backend server và AI service ở chế độ ẩn.
    - Client không cần quan tâm đến các lệnh terminal hay cài đặt Node.js thủ công.
4.  **Dữ liệu**: Cơ sở dữ liệu sẽ được khởi tạo tự động tại thư mục dữ liệu ứng dụng (AppData) hoặc theo cấu hình trong `.env` đi kèm.

---

> [!IMPORTANT]
> **Lưu ý bảo mật:** Khi đóng gói cho khách hàng, hãy đảm bảo các file nhạy cảm trong `.env` đã được cấu hình phù hợp cho môi trường Production (ví dụ: tắt chế độ Debug, đổi Secret Key).
