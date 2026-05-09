import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Download,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

type DeviceStatus = "online" | "offline" | "warning";
type DeviceType = "Cảm biến" | "Gateway" | "Barrier" | "Camera";

type DeviceItem = {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  firmware: string;
  heartbeat: string;
  status: DeviceStatus;
  hasHistory: boolean;
};

const devices: DeviceItem[] = [
  { id: "SEN-A-015", name: "Cảm biến ô A-15", type: "Cảm biến", location: "Bãi A · Tầng 1", firmware: "v2.3.1", heartbeat: "10 giây trước", status: "online", hasHistory: true },
  { id: "SEN-B-022", name: "Cảm biến ô B-22", type: "Cảm biến", location: "Bãi B · Tầng 1", firmware: "v2.2.8", heartbeat: "Mất 3 phút", status: "warning", hasHistory: true },
  { id: "GW-A-01", name: "Gateway A-01", type: "Gateway", location: "Bãi A · Phòng kỹ thuật", firmware: "v1.8.0", heartbeat: "18 giây trước", status: "online", hasHistory: true },
  { id: "BAR-C-01", name: "Barrier Cổng C", type: "Barrier", location: "Bãi C · Cổng chính", firmware: "v3.0.2", heartbeat: "Mất 12 phút", status: "offline", hasHistory: true },
  { id: "CAM-A-02", name: "Camera A-02", type: "Camera", location: "Bãi A · Cổng vào", firmware: "v5.4.1", heartbeat: "1 phút trước", status: "online", hasHistory: false },
  { id: "GW-D-01", name: "Gateway D-01", type: "Gateway", location: "Bãi D · Tủ mạng", firmware: "v1.7.9", heartbeat: "5 phút trước", status: "warning", hasHistory: true },
];

export function DeviceManagement() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | DeviceType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DeviceStatus>("all");
  const [warningOnly, setWarningOnly] = useState(false);
  const [targetDevice, setTargetDevice] = useState<DeviceItem | null>(null);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesQuery = `${device.id} ${device.name} ${device.location}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "all" || device.type === typeFilter;
      const matchesStatus = statusFilter === "all" || device.status === statusFilter;
      const matchesWarning = !warningOnly || device.status !== "online";
      return matchesQuery && matchesType && matchesStatus && matchesWarning;
    });
  }, [query, typeFilter, statusFilter, warningOnly]);

  const stats = useMemo(() => {
    return devices.reduce(
      (acc, device) => {
        acc.total += 1;
        acc[device.status] += 1;
        return acc;
      },
      { total: 0, online: 0, offline: 0, warning: 0 },
    );
  }, []);

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return { label: "Online", className: "border-green-200 bg-green-50 text-green-700", icon: <Wifi className="h-3.5 w-3.5" /> };
      case "offline":
        return { label: "Offline", className: "border-red-200 bg-red-50 text-red-700", icon: <WifiOff className="h-3.5 w-3.5" /> };
      default:
        return { label: "Cảnh báo", className: "border-amber-200 bg-amber-50 text-amber-700", icon: <AlertTriangle className="h-3.5 w-3.5" /> };
    }
  };

  const handleAskDelete = (device: DeviceItem) => {
    setTargetDevice(device);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#333333]">Quản lý thiết bị IoT</h1>
            <p className="mt-1 text-sm text-gray-600">
              Theo dõi heartbeat, phiên bản firmware, trạng thái kết nối và bảo vệ dữ liệu lịch sử khi thao tác xóa thiết bị.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Xuất danh sách
            </Button>
            <Button className="bg-[#0055A4] hover:bg-[#004080]">
              <Plus className="h-4 w-4" />
              Thêm thiết bị
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><div className="text-sm text-gray-500">Tổng thiết bị</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{stats.total}</div></div><Cpu className="h-5 w-5 text-[#0055A4]" /></CardContent></Card>
          <Card className="bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><div className="text-sm text-gray-500">Online</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{stats.online}</div></div><CheckCircle2 className="h-5 w-5 text-[#28A745]" /></CardContent></Card>
          <Card className="bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><div className="text-sm text-gray-500">Cảnh báo</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{stats.warning}</div></div><ShieldAlert className="h-5 w-5 text-[#FFC107]" /></CardContent></Card>
          <Card className="bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><div className="text-sm text-gray-500">Offline</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{stats.offline}</div></div><Activity className="h-5 w-5 text-[#DC3545]" /></CardContent></Card>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle>Danh sách thiết bị</CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Bộ lọc được chia rõ theo loại thiết bị, trạng thái kết nối và nhóm cảnh báo để dễ thao tác hơn.
                </p>
              </div>
              <div className="relative w-full xl:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo mã, tên hoặc vị trí..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">Loại thiết bị</div>
                <div className="flex flex-wrap gap-2">
                  {(["all", "Cảm biến", "Gateway", "Barrier", "Camera"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTypeFilter(item)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        typeFilter === item
                          ? "border-[#0055A4] bg-[#EAF2FB] text-[#0055A4]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item === "all" ? "Tất cả" : item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">Trạng thái kết nối</div>
                <div className="flex flex-wrap gap-2">
                  {(["all", "online", "warning", "offline"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatusFilter(item)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        statusFilter === item
                          ? "border-[#0055A4] bg-[#EAF2FB] text-[#0055A4]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item === "all" ? "Tất cả" : item === "online" ? "Online" : item === "offline" ? "Offline" : "Cảnh báo"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">Cảnh báo</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setWarningOnly(false)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      !warningOnly
                        ? "border-[#0055A4] bg-[#EAF2FB] text-[#0055A4]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Hiển thị tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setWarningOnly(true)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      warningOnly
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Chỉ thiết bị cần chú ý
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F7F9FC]">
                  <TableRow>
                    <TableHead className="px-4">Thiết bị</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead>Heartbeat</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="px-4 text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => {
                    const status = getStatusBadge(device.status);
                    return (
                      <TableRow key={device.id}>
                        <TableCell className="px-4">
                          <div>
                            <div className="font-medium text-[#333333]">{device.name}</div>
                            <div className="text-xs text-gray-500">{device.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{device.type}</TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>{device.firmware}</TableCell>
                        <TableCell>{device.heartbeat}</TableCell>
                        <TableCell>
                          <Badge className={status.className}>{status.icon}{status.label}</Badge>
                        </TableCell>
                        <TableCell className="px-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Xem</Button>
                            <Button variant="outline" size="sm">Sửa</Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleAskDelete(device)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!targetDevice} onOpenChange={(open) => !open && setTargetDevice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {targetDevice?.hasHistory ? "Không thể xóa thiết bị có lịch sử" : "Xác nhận xóa thiết bị"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {targetDevice?.hasHistory
                ? `Thiết bị ${targetDevice?.id} đã phát sinh bản ghi lịch sử và audit log. Hãy chuyển sang trạng thái ngừng sử dụng thay vì xóa vật lý để tránh mất dữ liệu.`
                : `Thiết bị ${targetDevice?.id} chưa có dữ liệu lịch sử. Bạn có thể xóa khỏi danh sách nếu chắc chắn không còn sử dụng.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            {targetDevice?.hasHistory ? (
              <AlertDialogAction className="bg-[#0055A4] hover:bg-[#004080]">Đánh dấu ngừng sử dụng</AlertDialogAction>
            ) : (
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">Xóa thiết bị</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
