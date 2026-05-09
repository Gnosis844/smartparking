import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, Calendar, TrendingUp, Users, Car, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export function AnalyticsDashboard() {
  const [selectedArea, setSelectedArea] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Mock data for line chart (trend)
  const trendData = [
    { date: "06/04", vehicles: 245, revenue: 3675000 },
    { date: "07/04", vehicles: 268, revenue: 4020000 },
    { date: "08/04", vehicles: 251, revenue: 3765000 },
    { date: "09/04", vehicles: 289, revenue: 4335000 },
    { date: "10/04", vehicles: 312, revenue: 4680000 },
    { date: "11/04", vehicles: 298, revenue: 4470000 },
    { date: "12/04", vehicles: 275, revenue: 4125000 },
  ];

  // Mock data for bar chart (revenue by day)
  const revenueData = [
    { day: "T2", revenue: 4125000 },
    { day: "T3", revenue: 3890000 },
    { day: "T4", revenue: 4250000 },
    { day: "T5", revenue: 4680000 },
    { day: "T6", revenue: 4920000 },
    { day: "T7", revenue: 3420000 },
    { day: "CN", revenue: 2850000 },
  ];

  // Mock data for pie chart (user types)
  const userTypeData = [
    { name: "Sinh viên", value: 1245, color: "#0055A4" },
    { name: "Giảng viên", value: 342, color: "#28A745" },
    { name: "Khách", value: 156, color: "#FFC107" },
  ];

  const totalRevenue = trendData.reduce((sum, item) => sum + item.revenue, 0);
  const totalVehicles = trendData.reduce((sum, item) => sum + item.vehicles, 0);
  const avgOccupancy = 78; // Mock percentage
  const totalUsers = userTypeData.reduce((sum, item) => sum + item.value, 0);

  const handleExportReport = () => {
    toast.success("Đang xuất báo cáo...", {
      description: "File sẽ được tải xuống trong giây lát"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Báo cáo thống kê và phân tích dữ liệu bãi xe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="thisMonth">Tháng này</SelectItem>
              <SelectItem value="lastMonth">Tháng trước</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bãi xe</SelectItem>
              <SelectItem value="A">Bãi A</SelectItem>
              <SelectItem value="B">Bãi B</SelectItem>
              <SelectItem value="C">Bãi C</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExportReport} className="bg-[#003366] hover:bg-[#002244]">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng lượt xe</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalVehicles}</p>
                <p className="text-xs text-gray-500 mt-1">7 ngày qua</p>
              </div>
              <Car className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{avgOccupancy}%</p>
                <p className="text-xs text-gray-500 mt-1">Trung bình</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Người dùng</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Đã đăng ký</p>
              </div>
              <Users className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Vehicle Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng số lượng xe theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString('vi-VN')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#0055A4"
                  strokeWidth={2}
                  name="Số lượt xe"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo ngày trong tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${(value / 1000000).toFixed(1)}M VNĐ`}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#28A745"
                  name="Doanh thu (VNĐ)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - User Types */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ người dùng theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {item.value} ({((item.value / totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-600">Doanh thu trung bình/ngày</span>
                <span className="font-semibold text-green-600">
                  {((totalRevenue / trendData.length) / 1000000).toFixed(2)}M VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-600">Lượt xe trung bình/ngày</span>
                <span className="font-semibold text-blue-600">
                  {Math.round(totalVehicles / trendData.length)} lượt
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-600">Doanh thu cao nhất</span>
                <span className="font-semibold">
                  {(Math.max(...revenueData.map(d => d.revenue)) / 1000000).toFixed(2)}M VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-600">Doanh thu thấp nhất</span>
                <span className="font-semibold">
                  {(Math.min(...revenueData.map(d => d.revenue)) / 1000000).toFixed(2)}M VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-gray-600">Tổng chỗ đỗ</span>
                <span className="font-semibold">120 chỗ</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">Chỗ trống hiện tại</span>
                <span className="font-semibold text-green-600">45 chỗ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
