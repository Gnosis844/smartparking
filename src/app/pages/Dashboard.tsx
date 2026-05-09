import { Car, ParkingCircle, TrendingUp, DollarSign, RefreshCw, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useParkingData } from "../contexts/ParkingContext";

export function Dashboard() {
  // MVP: Use parking context for available spots
  const { availableSpots, totalSpots } = useParkingData();

  // Mock data for other stats
  const stats = {
    currentVehicles: totalSpots - availableSpots,
    checkInsToday: 123,
    checkOutsToday: 98,
    revenueToday: 12450000,
  };

  const parkingAreas = [
    { id: "A", name: "Bãi A", available: 15, total: 40, status: "warning" as const },
    { id: "B", name: "Bãi B", available: 25, total: 50, status: "success" as const },
    { id: "C", name: "Bãi C", available: 5, total: 30, status: "danger" as const },
  ];

  const alerts = [
    { id: 1, message: "Cảm biến A-15 mất kết nối", time: "5 phút trước", severity: "high", handled: false },
    { id: 2, message: "Bãi C sắp đầy (83%)", time: "10 phút trước", severity: "medium", handled: false },
    { id: 3, message: "Barrier Gate B lỗi đóng mở", time: "15 phút trước", severity: "high", handled: true },
    { id: 4, message: "Cảm biến B-22 báo sai", time: "30 phút trước", severity: "low", handled: true },
  ];

  const devices = {
    online: 47,
    offline: 3,
    errors: [
      { id: 1, name: "Cảm biến A-15", location: "Bãi A, Ô 15" },
      { id: 2, name: "Gateway B", location: "Bãi B" },
      { id: 3, name: "Barrier Gate C", location: "Cổng Bãi C" },
    ],
  };

  const getAreaColor = (status: string) => {
    switch (status) {
      case "success": return "bg-[#28A745]";
      case "warning": return "bg-[#FFC107]";
      case "danger": return "bg-[#DC3545]";
      default: return "bg-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-50 border-red-200 text-red-800";
      case "medium": return "bg-orange-50 border-orange-200 text-orange-800";
      case "low": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Chỗ trống</CardTitle>
            <ParkingCircle className="w-5 h-5 text-[#28A745]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#333333]">{availableSpots}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((availableSpots / totalSpots) * 100)}% tổng dung lượng ({totalSpots} chỗ)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Xe trong bãi</CardTitle>
            <Car className="w-5 h-5 text-[#0055A4]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#333333]">{stats.currentVehicles}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.currentVehicles / totalSpots) * 100)}% công suất
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Xe ra vào hôm nay</CardTitle>
            <TrendingUp className="w-5 h-5 text-[#FFC107]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#333333]">{stats.checkInsToday + stats.checkOutsToday}</div>
              <span className="text-sm text-gray-500">lượt</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-green-600">↑ Vào: {stats.checkInsToday}</span>
              <span className="text-blue-600">↓ Ra: {stats.checkOutsToday}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doanh thu hôm nay</CardTitle>
            <DollarSign className="w-5 h-5 text-[#28A745]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#333333]">
              {(stats.revenueToday / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.revenueToday.toLocaleString('vi-VN')} VNĐ (tạm tính)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parking Map */}
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bản đồ bãi xe</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tải lại
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {parkingAreas.map((area) => (
                <div
                  key={area.id}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                  style={{ borderColor: area.status === 'success' ? '#28A745' : area.status === 'warning' ? '#FFC107' : '#DC3545' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-[#333333]">{area.name}</h3>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getAreaColor(area.status)}`}></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#333333]">{area.available}</span>
                      <span className="text-gray-500 text-sm">/ {area.total} chỗ</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getAreaColor(area.status)}`}
                        style={{ width: `${(area.available / area.total) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tỷ lệ trống:</span>
                      <span className="font-medium text-[#333333]">
                        {Math.round((area.available / area.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Device Status */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Cảnh báo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 border rounded-lg ${
                      alert.handled ? "bg-gray-50 border-gray-200" : getSeverityColor(alert.severity)
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      {!alert.handled && (
                        <Badge variant="destructive" className="text-xs">Mới</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-3 text-[#0055A4]">
                Xem tất cả cảnh báo →
              </Button>
            </CardContent>
          </Card>

          {/* Device Status */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Trạng thái thiết bị</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{devices.online}</div>
                  <div className="text-xs text-green-600 mt-1">Online</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{devices.offline}</div>
                  <div className="text-xs text-red-600 mt-1">Offline</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Thiết bị gặp sự cố:</p>
                {devices.errors.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-900">{device.name}</p>
                      <p className="text-xs text-red-600">{device.location}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Xem tất cả thiết bị
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
