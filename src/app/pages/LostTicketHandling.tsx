import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, Car, Clock, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface ParkingSession {
  id: string;
  licensePlate: string;
  entryTime: Date;
  entryGate: string;
  parkingSpot: string;
  vehicleType: "motorbike" | "car";
  ticketId: string;
  images: {
    entry: string;
    current: string;
  };
}

export function LostTicketHandling() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get("requestId");

  const [licensePlate, setLicensePlate] = useState("");
  const [session, setSession] = useState<ParkingSession | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleSearch = async () => {
    if (!licensePlate.trim()) {
      toast.error("Vui lòng nhập biển số xe");
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const mockSession: ParkingSession = {
        id: "SESSION-20260412-001",
        licensePlate: licensePlate.toUpperCase(),
        entryTime: new Date("2026-04-12T07:30:00"),
        entryGate: "Cổng A",
        parkingSpot: "A-125",
        vehicleType: "motorbike",
        ticketId: "TICKET-001234",
        images: {
          entry: "https://via.placeholder.com/400x300?text=Entry+Photo",
          current: "https://via.placeholder.com/400x300?text=Current+Photo"
        }
      };

      setSession(mockSession);
      setIsSearching(false);
      calculateFee(mockSession);
      toast.success("Tìm thấy phiên gửi xe");
    }, 1000);
  };

  const calculateFee = (session: ParkingSession) => {
    const now = new Date();
    const duration = now.getTime() - session.entryTime.getTime();
    const hours = Math.ceil(duration / (1000 * 60 * 60));

    // Fee structure
    const baseFee = session.vehicleType === "motorbike" ? 5000 : 10000;
    const hourlyRate = session.vehicleType === "motorbike" ? 2000 : 5000;
    const lostTicketPenalty = 10000;

    let fee = baseFee;
    if (hours > 1) {
      fee += (hours - 1) * hourlyRate;
    }
    fee += lostTicketPenalty;

    setCalculatedFee(fee);
  };

  const getDuration = (entryTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - entryTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} giờ ${minutes} phút`;
  };

  const handleConfirmPayment = () => {
    setIsPaid(true);
    toast.success("Đã xác nhận thanh toán");
  };

  const handleCompleteExit = () => {
    toast.success("Đã cho phép xe ra khỏi bãi");
    setTimeout(() => {
      navigate("/request-management");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Xử lý mất vé</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tra cứu phiên gửi xe và tính phí phụ cho xe mất vé
          </p>
          {requestId && (
            <Badge className="mt-2">Yêu cầu #{requestId}</Badge>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate("/request-management")}>
          Quay lại
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu biển số xe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="licensePlate">Biển số xe</Label>
              <Input
                id="licensePlate"
                placeholder="Nhập biển số xe (vd: 59A-12345)"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="uppercase"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-[#0055A4] hover:bg-[#004494]"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      {session && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiên gửi xe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mã phiên</p>
                <p className="font-medium">{session.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Biển số xe</p>
                <p className="font-medium">{session.licensePlate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Loại xe</p>
                <Badge className="bg-blue-100 text-blue-800">
                  {session.vehicleType === "motorbike" ? "Xe máy" : "Ô tô"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cổng vào</p>
                <p className="text-sm">{session.entryGate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Vị trí đỗ</p>
                <p className="text-sm">{session.parkingSpot}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Mã vé</p>
                <p className="text-sm font-mono">{session.ticketId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Thời gian vào</p>
                <p className="text-sm">
                  {session.entryTime.toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Thời gian đỗ</p>
                <p className="text-sm font-medium text-[#0055A4]">
                  {getDuration(session.entryTime)}
                </p>
              </div>
            </div>

            {/* Vehicle Images */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium mb-2">Ảnh khi vào bãi</p>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={session.images.entry}
                    alt="Entry"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Ảnh hiện tại</p>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={session.images.current}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee Calculation */}
      {calculatedFee !== null && (
        <Card className={isPaid ? "border-green-600" : "border-orange-600"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPaid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <DollarSign className="w-5 h-5 text-orange-600" />
              )}
              Tính phí đỗ xe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí cơ bản:</span>
                <span>{session?.vehicleType === "motorbike" ? "5,000" : "10,000"} VNĐ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí theo giờ:</span>
                <span>
                  {Math.ceil((new Date().getTime() - session!.entryTime.getTime()) / (1000 * 60 * 60)) - 1}
                  {" giờ × "}
                  {session?.vehicleType === "motorbike" ? "2,000" : "5,000"} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-sm text-orange-600">
                <span className="font-medium">Phí phạt mất vé:</span>
                <span className="font-medium">10,000 VNĐ</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-[#0055A4]">
                  {calculatedFee.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Lưu ý:</strong> Phí mất vé là 10,000 VNĐ theo quy định của bãi xe.
              </p>
            </div>

            {!isPaid ? (
              <Button
                onClick={handleConfirmPayment}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận đã thanh toán
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Đã thanh toán</p>
                    <p className="text-xs text-green-700">
                      Số tiền: {calculatedFee.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCompleteExit}
                  className="w-full bg-[#0055A4] hover:bg-[#004494]"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Cho phép xe ra khỏi bãi
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
