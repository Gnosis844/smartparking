import { useState } from "react";
import { Search, Calendar, MapPin, Clock, DollarSign, ChevronDown } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface ParkingRecord {
  id: string;
  date: Date;
  entryTime: string;
  exitTime: string;
  location: string;
  area: string;
  fee: number;
  duration: string;
  vehicleType: "motorbike" | "car";
}

export function ParkingHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("4");
  const [selectedYear, setSelectedYear] = useState("2026");

  // Mock data
  const parkingRecords: ParkingRecord[] = [
    {
      id: "PH-001",
      date: new Date("2026-04-12"),
      entryTime: "07:30",
      exitTime: "17:45",
      location: "Bãi A",
      area: "Khu A1",
      fee: 15000,
      duration: "10h 15m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-002",
      date: new Date("2026-04-11"),
      entryTime: "08:00",
      exitTime: "16:30",
      location: "Bãi B",
      area: "Khu B2",
      fee: 12000,
      duration: "8h 30m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-003",
      date: new Date("2026-04-10"),
      entryTime: "07:45",
      exitTime: "18:00",
      location: "Bãi A",
      area: "Khu A3",
      fee: 16000,
      duration: "10h 15m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-004",
      date: new Date("2026-04-09"),
      entryTime: "08:30",
      exitTime: "12:00",
      location: "Bãi C",
      area: "Khu C1",
      fee: 8000,
      duration: "3h 30m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-005",
      date: new Date("2026-04-08"),
      entryTime: "07:15",
      exitTime: "17:30",
      location: "Bãi A",
      area: "Khu A2",
      fee: 15000,
      duration: "10h 15m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-006",
      date: new Date("2026-04-05"),
      entryTime: "08:00",
      exitTime: "15:45",
      location: "Bãi B",
      area: "Khu B1",
      fee: 12000,
      duration: "7h 45m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-007",
      date: new Date("2026-04-04"),
      entryTime: "07:30",
      exitTime: "18:15",
      location: "Bãi A",
      area: "Khu A1",
      fee: 16000,
      duration: "10h 45m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-008",
      date: new Date("2026-04-03"),
      entryTime: "09:00",
      exitTime: "17:00",
      location: "Bãi C",
      area: "Khu C2",
      fee: 12000,
      duration: "8h 00m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-009",
      date: new Date("2026-04-02"),
      entryTime: "07:45",
      exitTime: "16:30",
      location: "Bãi A",
      area: "Khu A3",
      fee: 13000,
      duration: "8h 45m",
      vehicleType: "motorbike"
    },
    {
      id: "PH-010",
      date: new Date("2026-04-01"),
      entryTime: "08:15",
      exitTime: "18:00",
      location: "Bãi B",
      area: "Khu B3",
      fee: 15000,
      duration: "9h 45m",
      vehicleType: "motorbike"
    },
  ];

  const filteredRecords = parkingRecords.filter(record => {
    const recordMonth = (record.date.getMonth() + 1).toString();
    const recordYear = record.date.getFullYear().toString();

    const matchesDate = recordMonth === selectedMonth && recordYear === selectedYear;

    if (!searchQuery) return matchesDate;

    const query = searchQuery.toLowerCase();
    return matchesDate && (
      record.location.toLowerCase().includes(query) ||
      record.area.toLowerCase().includes(query) ||
      record.id.toLowerCase().includes(query)
    );
  });

  const totalFee = filteredRecords.reduce((sum, record) => sum + record.fee, 0);
  const totalTrips = filteredRecords.length;

  const months = [
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  const years = ["2024", "2025", "2026"];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-6">
      {/* Header */}
      <div className="bg-[#003366] text-white px-4 py-6 sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-semibold mb-4">Lịch sử gửi xe</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo vị trí, khu vực..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-none"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="bg-white border-none">
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-white border-none">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-white p-4 border-l-4 border-[#003366]">
            <p className="text-xs text-gray-500 mb-1">Tổng lượt gửi</p>
            <p className="text-2xl font-bold text-[#003366]">{totalTrips}</p>
            <p className="text-xs text-gray-400 mt-1">lượt</p>
          </Card>
          <Card className="bg-white p-4 border-l-4 border-green-600">
            <p className="text-xs text-gray-500 mb-1">Tổng chi phí</p>
            <p className="text-2xl font-bold text-green-600">
              {(totalFee / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-gray-400 mt-1">VNĐ</p>
          </Card>
        </div>
      </div>

      {/* Parking Records List */}
      <div className="px-4 space-y-3">
        {filteredRecords.length === 0 ? (
          <Card className="bg-white p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có lịch sử gửi xe trong tháng này</p>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="bg-white overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                {/* Date Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#003366]" />
                    <span className="font-semibold text-gray-900">
                      {record.date.toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">#{record.id}</span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2">
                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Thời gian</p>
                      <p className="text-sm font-medium text-gray-900">
                        {record.entryTime} - {record.exitTime}
                        <span className="ml-2 text-xs text-gray-500">({record.duration})</span>
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Vị trí</p>
                      <p className="text-sm font-medium text-gray-900">
                        {record.location} - {record.area}
                      </p>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Phí gửi xe</p>
                        <p className="text-sm font-medium text-gray-900">
                          {record.fee.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Đã thanh toán
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-6"></div>
    </div>
  );
}
