import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  MapPin, 
  Wifi, 
  WifiOff,
  CheckCircle,
  RefreshCw,
  Send,
  Wrench
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

type AlertStatus = "pending" | "processing" | "resolved" | "forwarded";
type AlertSeverity = "high" | "medium" | "low";

interface DeviceAlert {
  id: number;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  location: string;
  errorType: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  detectedAt: string;
  lastOnline: string;
  gateway: string;
}

export function DeviceErrorHandling() {
  const [selectedAlert, setSelectedAlert] = useState<DeviceAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [processingNote, setProcessingNote] = useState("");

  // Mock alerts data
  const [alerts] = useState<DeviceAlert[]>([
    {
      id: 1,
      deviceId: "SEN-A-015",
      deviceName: "Cảm biến A-15",
      deviceType: "Parking Sensor",
      location: "Bãi A, Ô 15",
      errorType: "Mất kết nối",
      description: "Thiết bị không phản hồi sau 5 lần ping liên tiếp",
      severity: "high",
      status: "pending",
      detectedAt: "2026-03-26 14:35:00",
      lastOnline: "2026-03-26 14:20:00",
      gateway: "GW-A-01",
    },
    {
      id: 2,
      deviceId: "BAR-C-01",
      deviceName: "Barrier Gate C",
      deviceType: "Barrier Gate",
      location: "Cổng Bãi C",
      errorType: "Lỗi cơ học",
      description: "Barrier không đóng hoàn toàn, cảm biến vị trí báo lỗi",
      severity: "high",
      status: "processing",
      detectedAt: "2026-03-26 14:15:00",
      lastOnline: "2026-03-26 14:40:00",
      gateway: "GW-C-01",
    },
    {
      id: 3,
      deviceId: "SEN-B-022",
      deviceName: "Cảm biến B-22",
      deviceType: "Parking Sensor",
      location: "Bãi B, Ô 22",
      errorType: "Dữ liệu không chính xác",
      description: "Cảm biến liên tục đổi trạng thái giữa có xe và trống",
      severity: "medium",
      status: "pending",
      detectedAt: "2026-03-26 13:50:00",
      lastOnline: "2026-03-26 14:40:00",
      gateway: "GW-B-02",
    },
    {
      id: 4,
      deviceId: "CAM-A-02",
      deviceName: "Camera A-02",
      deviceType: "CCTV Camera",
      location: "Bãi A, Cổng vào",
      errorType: "Chất lượng hình ảnh kém",
      description: "Độ phân giải giảm xuống thấp, có thể do ống kính bị bẩn",
      severity: "low",
      status: "pending",
      detectedAt: "2026-03-26 12:30:00",
      lastOnline: "2026-03-26 14:40:00",
      gateway: "GW-A-01",
    },
    {
      id: 5,
      deviceId: "SEN-A-08",
      deviceName: "Cảm biến A-08",
      deviceType: "Parking Sensor",
      location: "Bãi A, Ô 08",
      errorType: "Pin yếu",
      description: "Mức pin còn 15%, cần thay pin sớm",
      severity: "medium",
      status: "forwarded",
      detectedAt: "2026-03-26 10:00:00",
      lastOnline: "2026-03-26 14:35:00",
      gateway: "GW-A-01",
    },
    {
      id: 6,
      deviceId: "GW-B-01",
      deviceName: "Gateway B-01",
      deviceType: "IoT Gateway",
      location: "Bãi B",
      errorType: "Mất kết nối internet",
      description: "Gateway mất kết nối mạng, các cảm biến trong vùng không gửi được dữ liệu",
      severity: "high",
      status: "resolved",
      detectedAt: "2026-03-26 09:15:00",
      lastOnline: "2026-03-26 11:30:00",
      gateway: "N/A",
    },
  ]);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "low":
        return <Info className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    const labels = {
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
    };
    return <Badge variant={variants[severity] as any}>{labels[severity]}</Badge>;
  };

  const getStatusBadge = (status: AlertStatus) => {
    const config = {
      pending: { label: "Chưa xử lý", className: "bg-red-100 text-red-800" },
      processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-800" },
      resolved: { label: "Đã xử lý", className: "bg-green-100 text-green-800" },
      forwarded: { label: "Đã chuyển kỹ thuật", className: "bg-purple-100 text-purple-800" },
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const filteredAlerts = filterStatus === "all" 
    ? alerts 
    : alerts.filter(a => a.status === filterStatus);

  const pendingCount = alerts.filter(a => a.status === "pending").length;
  const offlineCount = alerts.filter(a => a.errorType === "Mất kết nối").length;
  const maintenanceCount = alerts.filter(a => a.status === "forwarded").length;

  const handleMarkProcessing = () => {
    if (selectedAlert) {
      console.log("Marking as processing:", selectedAlert.id);
      // API call would go here
    }
  };

  const handlePingDevice = () => {
    if (selectedAlert) {
      console.log("Pinging device:", selectedAlert.deviceId);
      // API call would go here
    }
  };

  const handleResolve = () => {
    if (selectedAlert && processingNote.trim()) {
      console.log("Resolving alert:", { alertId: selectedAlert.id, note: processingNote });
      // API call would go here
      setProcessingNote("");
    }
  };

  const handleForward = () => {
    if (selectedAlert && processingNote.trim()) {
      console.log("Forwarding to technical team:", { alertId: selectedAlert.id, note: processingNote });
      // API call would go here
      setProcessingNote("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cảnh báo chưa xử lý</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{pendingCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thiết bị offline</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{offlineCount}</p>
              </div>
              <WifiOff className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang bảo trì</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{maintenanceCount}</p>
              </div>
              <Wrench className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách cảnh báo</CardTitle>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chưa xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="resolved">Đã xử lý</SelectItem>
                  <SelectItem value="forwarded">Đã chuyển kỹ thuật</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Thiết bị</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Lỗi</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedAlert?.id === alert.id ? "bg-blue-50" : ""
                      } ${
                        alert.status === "pending" ? "bg-red-50/30" : ""
                      }`}
                    >
                      <TableCell>{getSeverityIcon(alert.severity)}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{alert.deviceName}</div>
                        <div className="text-xs text-gray-500">{alert.deviceId}</div>
                      </TableCell>
                      <TableCell className="text-sm">{alert.location}</TableCell>
                      <TableCell className="text-sm">{alert.errorType}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(alert.detectedAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Alert Detail & Actions */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Chi tiết cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAlert ? (
              <div className="space-y-4">
                {/* Device Info */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-700">Thông tin thiết bị</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã thiết bị:</span>
                      <span className="font-medium">{selectedAlert.deviceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <span className="font-medium">{selectedAlert.deviceType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vị trí:</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedAlert.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gateway:</span>
                      <span className="font-medium">{selectedAlert.gateway}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Online cuối:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selectedAlert.lastOnline).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Info */}
                <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-700">Thông tin lỗi</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-600">Mức độ:</span>
                      {getSeverityBadge(selectedAlert.severity)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại lỗi:</span>
                      <span className="font-medium">{selectedAlert.errorType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mô tả chi tiết:</span>
                      <p className="mt-1 text-gray-800">{selectedAlert.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phát hiện:</span>
                      <span className="font-medium">
                        {new Date(selectedAlert.detectedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Processing Notes */}
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú xử lý *</Label>
                  <Textarea
                    id="note"
                    placeholder="Ghi lại những gì đã làm để xử lý sự cố..."
                    value={processingNote}
                    onChange={(e) => setProcessingNote(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Thao tác xử lý</h4>
                  
                  {selectedAlert.status === "pending" && (
                    <Button 
                      onClick={handleMarkProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Bắt đầu xử lý
                    </Button>
                  )}

                  <Button 
                    onClick={handlePingDevice}
                    variant="outline"
                    className="w-full"
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Ping thiết bị
                  </Button>

                  <Button 
                    onClick={handlePingDevice}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Khởi động lại thiết bị
                  </Button>

                  <Button 
                    onClick={handleResolve}
                    disabled={!processingNote.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đã khắc phục
                  </Button>

                  <Button 
                    onClick={handleForward}
                    disabled={!processingNote.trim()}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Chuyển kỹ thuật
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Info className="w-12 h-12 mb-3" />
                <p className="text-sm text-center">
                  Chọn một cảnh báo từ danh sách để xem chi tiết và xử lý
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
