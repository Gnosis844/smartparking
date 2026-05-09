# 🚀 Hướng dẫn Setup và Chạy Smart Parking Management System

## 📋 Giới thiệu

Đây là MVP (Minimum Viable Product) của **Hệ thống Quản lý Bãi xe Thông minh (IoT-SPMS)** được xây dựng bằng React + TypeScript + Tailwind CSS.

**Mục đích:** Demo cho buổi trình diễn với 5 màn hình luồng chính hoạt động đầy đủ.

---

## 🎯 Tính năng chính (MVP)

### Luồng chính có logic xử lý:

1. ✅ **Login** - Đăng nhập HCMUT_SSO (giả lập)
2. ✅ **Dashboard** - Tổng quan realtime số chỗ trống/xe trong bãi
3. ✅ **Vào bãi (Entry Gate)** - Mô phỏng xe vào, giảm số chỗ trống
4. ✅ **Ra bãi (Exit Gate)** - Thanh toán và tăng số chỗ trống
5. ✅ **Xử lý thẻ mất** - Tra cứu MSSV 123456, xác minh, cấp quyền

### Các màn hình khác (17 pages):
Giữ nguyên giao diện đẹp, chưa có logic xử lý phức tạp (đủ để trình diễn UI).

---

## 💻 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0 (khuyến nghị 20.x LTS)
- **Package Manager**: pnpm (khuyến nghị) hoặc npm
- **Trình duyệt**: Chrome, Firefox, Edge (bản mới nhất)

---

## 📦 Cài đặt

### Bước 1: Giải nén và di chuyển vào thư mục project

```bash
cd smart-parking-system
```

### Bước 2: Cài đặt dependencies

#### Sử dụng pnpm (khuyến nghị):
```bash
pnpm install
```

#### Hoặc sử dụng npm:
```bash
npm install
```

**Lưu ý:** Project này sử dụng pnpm, nếu bạn chưa cài:
```bash
npm install -g pnpm
```

---

## 🚀 Chạy project

### Trên Figma Make (hiện tại)

Project đang chạy sẵn trong môi trường Figma Make. Dev server tự động khởi động, không cần làm gì thêm.

- ✅ Preview tự động
- ✅ Hot reload khi save code
- ✅ Không cần localhost

---

### Sau khi extract code về máy local

**Tất cả các file cần thiết đã có sẵn!** ✅

Project đã bao gồm:
- ✅ `index.html` - HTML entry point
- ✅ `src/main.tsx` - React entry point  
- ✅ `vite.config.ts` - Vite configuration với server config

Bạn chỉ cần:

#### Bước 1: Cài đặt dependencies

```bash
pnpm install
# hoặc
npm install
```

#### Bước 2: Chạy dev server

```bash
pnpm dev
```

hoặc

```bash
npm run dev
```

#### Bước 3: Mở trình duyệt

Dev server sẽ tự động mở `http://localhost:3000`, hoặc bạn có thể truy cập thủ công.

**Done! 🎉** Không cần tạo thêm file nào cả!

---

## 🎭 Demo cho buổi trình diễn

### Kịch bản demo (5-7 phút):

#### 1. **Login** (10 giây)
- Mở trang login
- Click "Đăng nhập qua HCMUT_SSO"
- Chờ 1 giây → vào Dashboard

#### 2. **Dashboard** (30 giây)
- Quan sát 4 cards thống kê
- Chú ý số chỗ trống: **45/120**
- Xem bản đồ 3 bãi xe (A, B, C)
- Xem danh sách cảnh báo

#### 3. **Vào bãi - Entry Gate** (1 phút)
- Click sidebar: **Gửi xe → Vào bãi**
- Click nút "Giả lập xe vào (Chấp thuận)"
- Quan sát:
  - Animation quét thẻ
  - Toast: "Xe vào thành công! Barrier đang mở"
  - Số chỗ trống giảm: **44/120**

#### 4. **Quay lại Dashboard** (20 giây)
- Click "Dashboard" trên sidebar
- Xác nhận số chỗ trống đã cập nhật: **44/120** ✅
- → Realtime sync hoạt động!

#### 5. **Ra bãi - Exit Gate** (1 phút)
- Click sidebar: **Gửi xe → Ra bãi**
- Click "Mô phỏng quét thẻ"
- Xem thông tin xe + phí (15,000 VNĐ)
- Click "Xác nhận thanh toán"
- Quan sát:
  - Toast: "Thanh toán thành công! Barrier đang mở"
  - Số chỗ trống tăng: **45/120**

#### 6. **Xử lý thẻ mất** (1-2 phút)
- Click sidebar: **Xử lý → Xử lý thẻ mất**
- Nhập MSSV: **123456**
- Click "Tìm kiếm"
- → Hiển thị thông tin "Nguyễn Văn An" + ảnh đại diện
- Click "Xác minh qua ảnh"
- Click "Xác nhận" → Toast: "Xác minh danh tính thành công!"
- Click "Cấp phiên tạm" → Toast: "Đã cấp quyền truy cập 1 ngày"

#### 7. **Thử MSSV khác** (30 giây)
- Nhập MSSV khác (vd: 999999)
- Click "Tìm kiếm"
- → Toast lỗi: "Không tìm thấy người dùng" ❌
- → Chứng minh chỉ MSSV 123456 hợp lệ

#### 8. **Khám phá UI các màn hình khác** (1-2 phút)
- Click qua các menu trong sidebar (Quản lý, Báo cáo, etc.)
- Giới thiệu: "17 màn hình còn lại đã có giao diện hoàn chỉnh, chờ tích hợp logic"

---

## 📁 Cấu trúc project

```
smart-parking-system/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Root component
│   │   ├── routes.ts               # Route definitions
│   │   ├── contexts/
│   │   │   └── ParkingContext.tsx  # State management (số chỗ trống)
│   │   ├── pages/                  # 22 pages
│   │   │   ├── Login.tsx           # ✅ Luồng chính
│   │   │   ├── Dashboard.tsx       # ✅ Luồng chính
│   │   │   ├── EntryGate.tsx       # ✅ Luồng chính (Vào bãi)
│   │   │   ├── ExitGate.tsx        # ✅ Luồng chính (Ra bãi)
│   │   │   ├── LostCardHandling.tsx # ✅ Luồng chính
│   │   │   ├── ...                 # 17 pages khác (UI only)
│   │   └── components/
│   │       ├── RootLayout.tsx      # Sidebar + Layout
│   │       └── ui/                 # Shadcn/UI components
│   ├── styles/
│   │   ├── theme.css               # Tailwind theme (màu #0055A4)
│   │   └── fonts.css               # Font Inter
│   └── imports/                    # Assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── SETUP.md                        # File này
```

---

## 🧪 Test data

### MSSV hợp lệ cho Xử lý thẻ mất:
- **123456** → Nguyễn Văn An ✅
- Bất kỳ MSSV nào khác → Không tìm thấy ❌

### Số chỗ trống ban đầu:
- **45/120 chỗ**

### Mock data khác:
- Bãi A: 15/40 chỗ
- Bãi B: 25/50 chỗ  
- Bãi C: 5/30 chỗ
- Xe vào hôm nay: 123 lượt
- Xe ra hôm nay: 98 lượt
- Doanh thu: 12,450,000 VNĐ

---

## 🎨 Theme và colors

- **Primary**: #0055A4 (HCMUT blue)
- **Success**: #28A745
- **Warning**: #FFC107
- **Danger**: #DC3545
- **Background**: #F5F5F5
- **Font**: Inter

---

## 🔧 Troubleshooting

### Lỗi: Module not found

```bash
# Xóa node_modules và reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Lỗi: Port 3000 đã được sử dụng

Thay đổi port trong `vite.config.ts`:

```typescript
server: {
  port: 3001, // Đổi sang port khác
}
```

### Sidebar không hiển thị menu groups

Đảm bảo đã pull code mới nhất, file `RootLayout.tsx` đã được cập nhật với `menuGroups`.

### Số chỗ trống không cập nhật

Kiểm tra:
1. `ParkingContext` đã được import vào `App.tsx`
2. Dashboard, EntryGate, ExitGate đều dùng `useParkingData()`

### Toast không hiển thị

Đảm bảo `<Toaster />` từ `sonner` đã được thêm vào `App.tsx`:

```tsx
import { Toaster } from "sonner";

// Trong return:
<>
  <RouterProvider router={router} />
  <Toaster position="top-right" />
</>
```

---

## 📚 Dependencies chính

```json
{
  "react": "18.3.1",
  "react-router": "7.13.0",
  "tailwindcss": "4.1.12",
  "sonner": "2.0.3",
  "lucide-react": "0.487.0",
  "recharts": "2.15.2",
  "qrcode.react": "4.2.0",
  "@radix-ui/*": "Latest"
}
```

---

## 🚧 Lưu ý khi phát triển tiếp

### Để hoàn thiện production:

1. **Authentication thật:**
   - Tích hợp API HCMUT_SSO
   - JWT token management
   - Protected routes

2. **Backend API:**
   - Thay mock data bằng API calls
   - Quản lý state với React Query hoặc Redux

3. **Database:**
   - PostgreSQL cho parking sessions
   - Redis cho realtime data

4. **IoT Integration:**
   - MQTT broker cho sensors
   - WebSocket cho realtime updates

5. **Testing:**
   - Unit tests (Vitest)
   - E2E tests (Playwright)

6. **Deployment:**
   - Docker containerization
   - CI/CD pipeline
   - Environment variables

---

## 👥 Team & Contact

**Project:** IoT Smart Parking Management System (MVP)  
**Tech Stack:** React 18 + TypeScript + Tailwind CSS v4  
**Build tool:** Vite 6.3.5  
**State:** ParkingContext (useState)  
**Styling:** Tailwind + Shadcn/UI + Radix UI  

**Hỗ trợ:**
- Nếu gặp vấn đề khi chạy project, kiểm tra lại các bước trong phần Troubleshooting
- Đảm bảo Node.js >= 18 và đã cài pnpm

---

## ✅ Checklist trước khi demo

- [ ] Node.js và pnpm đã cài đặt
- [ ] Dependencies đã install xong (`pnpm install`)
- [ ] Dev server chạy được (`pnpm dev`)
- [ ] Mở được trang Login
- [ ] Test flow: Login → Dashboard → Vào bãi → Ra bãi → Xử lý thẻ mất
- [ ] Số chỗ trống cập nhật realtime khi xe vào/ra
- [ ] MSSV 123456 hoạt động ở Xử lý thẻ mất
- [ ] Toast notifications hiển thị đúng
- [ ] Sidebar grouped by categories

---

## 🎯 MVP Scope

**Hoàn thành:**
- ✅ 22 pages UI
- ✅ 5 pages luồng chính có logic
- ✅ Realtime state sync (số chỗ trống)
- ✅ Toast notifications
- ✅ Grouped sidebar navigation
- ✅ Responsive design

**Không có trong MVP:**
- ❌ Backend API
- ❌ Database
- ❌ Authentication thật
- ❌ IoT sensors integration
- ❌ Multi-user sessions
- ❌ Data persistence (refresh mất data)

**Mục tiêu MVP:** Demo UI/UX và 5 màn hình luồng chính cho buổi trình diễn. Đủ để chứng minh concept và user flow.

---

**Chúc bạn demo thành công! 🚀**
