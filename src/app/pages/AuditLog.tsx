import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Calendar, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

type ActionType = "create" | "update" | "delete" | "login" | "logout" | "approve" | "reject";

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  userId: string;
  action: ActionType;
  target: string;
  targetId: string;
  detail: string;
  before?: any;
  after?: any;
  ipAddress: string;
}

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("7days");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Mock audit log data
  const auditLogs: AuditEntry[] = [
    {
      id: "AUD-001",
      timestamp: new Date("2026-04-12T14:30:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "approve",
      target: "Complaint",
      targetId: "CMP-003",
      detail: "Chấp nhận khiếu nại từ Lê Văn Cường về tính sai phí",
      before: { status: "pending" },
      after: { status: "approved", adminNote: "Đã xác minh và hoàn trả 6,000 VNĐ" },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-002",
      timestamp: new Date("2026-04-12T13:15:00"),
      user: "Nhân viên vận hành",
      userId: "USR-005",
      action: "update",
      target: "ParkingSpot",
      targetId: "A-15",
      detail: "Ghi đè trạng thái ô đỗ A-15 từ 'occupied' sang 'empty'",
      before: { status: "occupied", sensorStatus: "active" },
      after: { status: "empty", manualOverride: true, reason: "Cảm biến báo sai" },
      ipAddress: "192.168.1.105",
    },
    {
      id: "AUD-003",
      timestamp: new Date("2026-04-12T11:45:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "create",
      target: "User",
      targetId: "USR-008",
      detail: "Tạo tài khoản người dùng mới cho khách tham quan",
      after: {
        name: "Khách tham quan",
        email: "visitor01@gmail.com",
        role: "visitor",
        status: "active"
      },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-004",
      timestamp: new Date("2026-04-12T10:20:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "update",
      target: "PricingRule",
      targetId: "SR-2",
      detail: "Cập nhật giá gửi xe cho sinh viên khung giờ 4-8h",
      before: { pricePerHour: 2000, maxPerDay: 15000 },
      after: { pricePerHour: 2500, maxPerDay: 15000 },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-005",
      timestamp: new Date("2026-04-12T09:30:00"),
      user: "Nhân viên vận hành",
      userId: "USR-005",
      action: "login",
      target: "System",
      targetId: "LOGIN-SESSION-001",
      detail: "Đăng nhập vào hệ thống qua HCMUT_SSO",
      ipAddress: "192.168.1.105",
    },
    {
      id: "AUD-006",
      timestamp: new Date("2026-04-11T18:00:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "reject",
      target: "Complaint",
      targetId: "CMP-005",
      detail: "Từ chối khiếu nại của Hoàng Văn Em",
      before: { status: "pending" },
      after: {
        status: "rejected",
        adminNote: "Không hoàn tiền do đây là lỗi chủ quan của người dùng"
      },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-007",
      timestamp: new Date("2026-04-11T16:30:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "update",
      target: "User",
      targetId: "USR-004",
      detail: "Thay đổi trạng thái người dùng Phạm Thị Dung",
      before: { status: "active" },
      after: { status: "blocked", reason: "Vi phạm quy định gửi xe" },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-008",
      timestamp: new Date("2026-04-11T15:15:00"),
      user: "Nhân viên vận hành",
      userId: "USR-005",
      action: "update",
      target: "Device",
      targetId: "SEN-A-015",
      detail: "Khởi động lại cảm biến A-15",
      before: { status: "offline", lastOnline: "2026-04-11T14:20:00" },
      after: { status: "online", lastOnline: "2026-04-11T15:15:00" },
      ipAddress: "192.168.1.105",
    },
    {
      id: "AUD-009",
      timestamp: new Date("2026-04-11T14:00:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "delete",
      target: "PricingRule",
      targetId: "VS-3",
      detail: "Xóa quy tắc giá không còn sử dụng cho khách",
      before: { timeRangeStart: 12, timeRangeEnd: 18, pricePerHour: 7000 },
      ipAddress: "192.168.1.100",
    },
    {
      id: "AUD-010",
      timestamp: new Date("2026-04-11T10:00:00"),
      user: "Admin System",
      userId: "USR-007",
      action: "login",
      target: "System",
      targetId: "LOGIN-SESSION-002",
      detail: "Đăng nhập vào hệ thống qua HCMUT_SSO",
      ipAddress: "192.168.1.100",
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleViewDetail = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setShowDetailDialog(true);
  };

  const getActionBadge = (action: ActionType) => {
    const config = {
      create: { label: "Tạo mới", className: "bg-green-100 text-green-800" },
      update: { label: "Cập nhật", className: "bg-blue-100 text-blue-800" },
      delete: { label: "Xóa", className: "bg-red-100 text-red-800" },
      login: { label: "Đăng nhập", className: "bg-purple-100 text-purple-800" },
      logout: { label: "Đăng xuất", className: "bg-gray-100 text-gray-800" },
      approve: { label: "Chấp nhận", className: "bg-green-100 text-green-800" },
      reject: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    };
    return <Badge className={config[action].className}>{config[action].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi lịch sử hoạt động và thay đổi trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo người dùng, hành động..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo loại hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hành động</SelectItem>
                <SelectItem value="create">Tạo mới</SelectItem>
                <SelectItem value="update">Cập nhật</SelectItem>
                <SelectItem value="delete">Xóa</SelectItem>
                <SelectItem value="login">Đăng nhập</SelectItem>
                <SelectItem value="logout">Đăng xuất</SelectItem>
                <SelectItem value="approve">Chấp nhận</SelectItem>
                <SelectItem value="reject">Từ chối</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead className="text-right">Xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {log.timestamp.toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.timestamp.toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{log.target}</p>
                      <p className="text-xs text-gray-500">{log.targetId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-md">{log.detail}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleViewDetail(log)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết hoạt động #{selectedEntry?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hoạt động trong hệ thống
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Thời gian</p>
                  <p className="font-medium">
                    {selectedEntry.timestamp.toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Người thực hiện</p>
                  <p className="font-medium">{selectedEntry.user}</p>
                  <p className="text-xs text-gray-500">{selectedEntry.userId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hành động</p>
                  {getActionBadge(selectedEntry.action)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Đối tượng</p>
                  <p className="font-medium">{selectedEntry.target}</p>
                  <p className="text-xs text-gray-500">{selectedEntry.targetId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">IP Address</p>
                  <p className="font-mono text-sm">{selectedEntry.ipAddress}</p>
                </div>
              </div>

              {/* Detail */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Mô tả chi tiết</p>
                <p className="text-sm p-3 bg-gray-50 rounded-lg">{selectedEntry.detail}</p>
              </div>

              {/* Before/After */}
              {(selectedEntry.before || selectedEntry.after) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedEntry.before && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Trước khi thay đổi</p>
                      <pre className="text-xs p-3 bg-red-50 rounded-lg border border-red-200 overflow-auto">
                        {JSON.stringify(selectedEntry.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedEntry.after && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Sau khi thay đổi</p>
                      <pre className="text-xs p-3 bg-green-50 rounded-lg border border-green-200 overflow-auto">
                        {JSON.stringify(selectedEntry.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
