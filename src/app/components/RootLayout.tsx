import { Outlet, Link, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  RefreshCw,
  AlertTriangle,
  Bell,
  Settings,
  User,
  CreditCard,
  ClipboardList,
  History,
  Wallet,
  MessageSquareWarning,
  FileText,
  Users,
  BarChart3,
  DollarSign,
  FileSearch,
  MapPin,
  ParkingCircle,
  Cpu,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

export function RootLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path))
      return true;
    return false;
  };

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { path: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
        { path: "/parking-map", icon: MapPin, label: "Bản đồ bãi xe", exact: false },
      ],
    },
    {
      title: "Gửi xe",
      items: [
        { path: "/entry-gate", icon: LogIn, label: "Vào bãi", exact: false },
        { path: "/exit-gate", icon: LogOut, label: "Ra bãi", exact: false },
        { path: "/user/parking-history", icon: History, label: "Lịch sử gửi xe", exact: false },
        { path: "/user/debt-payment", icon: Wallet, label: "Công nợ & Thanh toán", exact: false },
      ],
    },
    {
      title: "Xử lý",
      items: [
        { path: "/lost-card", icon: CreditCard, label: "Xử lý thẻ mất", exact: false },
        { path: "/lost-ticket", icon: FileText, label: "Xử lý mất vé", exact: false },
        { path: "/override", icon: RefreshCw, label: "Ghi đè trạng thái", exact: false },
        { path: "/device-errors", icon: AlertTriangle, label: "Xử lý lỗi thiết bị", exact: false },
      ],
    },
    {
      title: "Quản lý",
      items: [
        { path: "/user-management", icon: Users, label: "Quản lý người dùng", exact: false },
        { path: "/device-management", icon: Cpu, label: "Quản lý thiết bị", exact: false },
        { path: "/complaint-management", icon: MessageSquareWarning, label: "Xử lý khiếu nại", exact: false },
        { path: "/analytics", icon: BarChart3, label: "Báo cáo", exact: false },
        { path: "/pricing-config", icon: DollarSign, label: "Cấu hình giá", exact: false },
        { path: "/audit-log", icon: FileSearch, label: "Audit Log", exact: false },
      ],
    },
    {
      title: "Khác",
      items: [
        { path: "/card-registration", icon: CreditCard, label: "Đăng ký thẻ", exact: false },
        { path: "/user/submit-complaint", icon: FileText, label: "Gửi khiếu nại", exact: false },
        { path: "/request-management", icon: ClipboardList, label: "Quản lý yêu cầu", exact: false },
        { path: "/parking-lot-detail", icon: ParkingCircle, label: "Chi tiết bãi xe", exact: false },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed lg:static h-full z-50 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
            <h1 className="text-xl font-semibold text-[#0055A4]">
              IoT-SPMS
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống quản lý bãi xe
            </p>
          </div>
          {sidebarCollapsed && (
            <div className="text-xl font-semibold text-[#0055A4] mx-auto">
              IoT
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.title}>
                {!sidebarCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                {sidebarCollapsed && (
                  <div className="flex justify-center mb-2">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.exact
                      ? location.pathname === item.path
                      : isActive(item.path);

                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            active
                              ? "bg-[#0055A4] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          } ${sidebarCollapsed ? "justify-center" : ""}`}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          {!sidebarCollapsed && (
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        <div className="hidden lg:block p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Thu gọn</span>
              </>
            )}
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-[#0055A4] rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Nhân viên vận hành
                </div>
                <div className="text-xs text-gray-500">Member E</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-sm text-gray-600 hidden sm:block">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600 sm:hidden">
                {new Date().toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}