HEAD
# 🚗 Smart Parking Management System (IoT-SPMS)

Hệ thống quản lý bãi xe thông minh dành cho nhân viên vận hành - **MVP Demo Version**

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)

---

## 📖 Giới thiệu

**IoT-SPMS** là hệ thống quản lý bãi xe thông minh tích hợp IoT sensors, RFID readers, và dashboard quản lý realtime cho HCMUT.

**Phiên bản hiện tại:** MVP cho buổi trình diễn  
**Màu chủ đạo:** #0055A4 (HCMUT Blue)  
**Font chữ:** Inter

---

## ✨ Tính năng

### 🎯 Luồng chính (có logic đầy đủ):

1. **Login** - Đăng nhập HCMUT_SSO
2. **Dashboard** - Tổng quan realtime
3. **Vào bãi** - Quét thẻ, giảm số chỗ trống
4. **Ra bãi** - Thanh toán, tăng số chỗ trống  
5. **Xử lý thẻ mất** - Tra cứu MSSV, xác minh, cấp quyền

### 📱 Các màn hình khác (17 pages):

- Bản đồ bãi xe
- Chi tiết bãi xe
- Lịch sử gửi xe
- Công nợ & Thanh toán
- Gửi khiếu nại
- Quản lý người dùng
- Quản lý thiết bị IoT
- Xử lý khiếu nại
- Xử lý lỗi thiết bị
- Báo cáo thống kê
- Cấu hình giá
- Audit Log
- ... và nhiều hơn

---

## 🚀 Quick Start

### Cài đặt dependencies:

```bash
pnpm install
```

### Chạy dev server:

```bash
pnpm dev
```

Mở `http://localhost:3000` trên trình duyệt.

📘 **Chi tiết đầy đủ:** Xem file [SETUP.md](./SETUP.md)

---

## 🎭 Demo nhanh

1. **Login** → Click "Đăng nhập qua HCMUT_SSO" → Vào Dashboard
2. **Vào bãi** → "Giả lập xe vào" → Số chỗ trống giảm ✅
3. **Ra bãi** → "Thanh toán" → Số chỗ trống tăng ✅
4. **Xử lý thẻ mất** → Nhập MSSV **123456** → Tìm thấy user → Cấp quyền ✅

**Test data:** MSSV `123456` → Nguyễn Văn An

---

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI + Radix UI
- **Icons:** Lucide React
- **Router:** React Router v7
- **Notifications:** Sonner
- **Charts:** Recharts
- **QR Code:** qrcode.react
- **Build Tool:** Vite 6

---

## 📁 Cấu trúc

```
src/
├── app/
│   ├── App.tsx              # Root component
│   ├── routes.ts            # Routes configuration
│   ├── contexts/            # State management
│   │   └── ParkingContext.tsx
│   ├── pages/               # 22 pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EntryGate.tsx    # Vào bãi
│   │   ├── ExitGate.tsx     # Ra bãi
│   │   ├── LostCardHandling.tsx
│   │   └── ...
│   └── components/          # Shared components
│       ├── RootLayout.tsx   # Layout + Sidebar
│       └── ui/              # UI primitives
└── styles/
    ├── theme.css            # Tailwind theme
    └── fonts.css            # Font imports
```

---

## 🎨 Design System

### Colors:
- **Primary:** `#0055A4` (HCMUT Blue)
- **Success:** `#28A745`
- **Warning:** `#FFC107`
- **Danger:** `#DC3545`
- **Background:** `#F5F5F5`

### Typography:
- **Font Family:** Inter
- **Base Size:** 16px
- **Scale:** Tailwind default

---

## 🧪 Test Data

- **MSSV hợp lệ:** `123456` (Nguyễn Văn An)
- **Số chỗ trống ban đầu:** 45/120
- **Bãi A:** 15/40 chỗ
- **Bãi B:** 25/50 chỗ
- **Bãi C:** 5/30 chỗ

---

## 📦 Scripts

```bash
pnpm install      # Cài đặt dependencies
pnpm dev          # Chạy dev server
pnpm build        # Build production (nếu cần)
pnpm preview      # Preview production build
```

---

## 🔧 Requirements

- **Node.js:** >= 18.0.0
- **Package Manager:** pnpm (recommended)
- **Browser:** Chrome, Firefox, Edge (latest)

---

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Hướng dẫn chi tiết setup và demo
- [ANALYSIS_AND_PLAN.md](./ANALYSIS_AND_PLAN.md) - Phân tích và kế hoạch phát triển

---

## 🎯 MVP Scope

**✅ Đã hoàn thành:**
- 22 pages UI responsive
- 5 pages luồng chính có logic
- Realtime state synchronization
- Toast notifications
- Grouped sidebar navigation

**❌ Không có trong MVP:**
- Backend API integration
- Real authentication
- IoT sensors connection
- Data persistence
- Multi-user sessions

**Mục tiêu:** Demo UI/UX và luồng chính cho buổi trình diễn

---

## 🐛 Troubleshooting

### Module not found:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port already in use:
Thay đổi port trong `vite.config.ts` → `server: { port: 3001 }`

### Sidebar không hiển thị groups:
Pull code mới nhất, kiểm tra `RootLayout.tsx`

Xem thêm tại [SETUP.md - Troubleshooting](./SETUP.md#-troubleshooting)

---

## 🤝 Contributing

Đây là MVP cho demo. Để phát triển production:

1. Tích hợp backend API
2. Authentication thật (JWT)
3. Database (PostgreSQL)
4. IoT sensors (MQTT/WebSocket)
5. Testing (Vitest + Playwright)
6. CI/CD pipeline

---

## 📄 License

Dự án giáo dục - HCMUT © 2026

---

## 🎓 Team

**Project:** Smart Parking Management System  
**Institution:** Ho Chi Minh City University of Technology  
**Purpose:** IoT System Demonstration

---

**Để bắt đầu, đọc [SETUP.md](./SETUP.md) 📖**

**Demo thành công! 🚀**
=======
# smartparking
7e894a5308be84d4e1b0111281ee34d974c5e93f
