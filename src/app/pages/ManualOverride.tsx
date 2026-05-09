import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RefreshCw, AlertCircle } from "lucide-react";
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

export function ManualOverride() {
  const [selectedArea, setSelectedArea] = useState("A");
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>("occupied");
  const [reason, setReason] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Mock parking spots data
  const generateSpots = (area: string, total: number) => {
    const statuses = ["empty", "occupied", "maintenance", "warning"];
    return Array.from({ length: total }, (_, i) => ({
      id: i + 1,
      code: `${area}-${String(i + 1).padStart(2, "0")}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      area: area,
    }));
  };

  const [spots] = useState(generateSpots(selectedArea, 40));

  const getSpotColor = (status: string, isSelected: boolean) => {
    const baseClasses = "transition-all cursor-pointer";
    if (isSelected) {
      return `${baseClasses} bg-[#0055A4] text-white border-2 border-[#0055A4] shadow-lg scale-105`;
    }
    switch (status) {
      case "empty":
        return `${baseClasses} bg-[#28A745] text-white hover:ring-2 hover:ring-[#28A745] hover:ring-offset-2`;
      case "occupied":
        return `${baseClasses} bg-[#DC3545] text-white hover:ring-2 hover:ring-[#DC3545] hover:ring-offset-2`;
      case "maintenance":
        return `${baseClasses} bg-gray-400 text-white hover:ring-2 hover:ring-gray-400 hover:ring-offset-2`;
      case "warning":
        return `${baseClasses} bg-[#FFC107] text-white hover:ring-2 hover:ring-[#FFC107] hover:ring-offset-2`;
      default:
        return `${baseClasses} bg-gray-300 text-gray-700`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "empty": return "Trống";
      case "occupied": return "Có xe";
      case "maintenance": return "Bảo trì";
      case "warning": return "Cảnh báo";
      default: return status;
    }
  };

  const handleSpotClick = (spotId: number) => {
    setSelectedSpot(spotId);
    setReason("");
  };

  const handleSubmit = () => {
    if (!selectedSpot || !reason.trim()) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    // Here you would make the API call to update the status
    console.log("Override confirmed:", {
      spot: spots.find(s => s.id === selectedSpot),
      newStatus,
      reason,
    });
    setShowConfirmDialog(false);
    setSelectedSpot(null);
    setReason("");
    setNewStatus("occupied");
  };

  const selectedSpotData = spots.find(s => s.id === selectedSpot);

  return (
    <div className="space-y-6">
      {/* Area Selector */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ghi đè trạng thái thủ công</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Chọn khu vực:</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Bãi A</SelectItem>
                    <SelectItem value="B">Bãi B</SelectItem>
                    <SelectItem value="C">Bãi C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tải lại bản đồ
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parking Spots Map */}
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Sơ đồ ô đỗ - Bãi {selectedArea}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#28A745] rounded"></div>
                <span className="text-sm">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#DC3545] rounded"></div>
                <span className="text-sm">Có xe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm">Bảo trì</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FFC107] rounded"></div>
                <span className="text-sm">Cảnh báo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#0055A4] rounded"></div>
                <span className="text-sm">Đang chọn</span>
              </div>
            </div>

            {/* Parking Grid */}
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => handleSpotClick(spot.id)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center
                    font-medium text-xs
                    ${getSpotColor(spot.status, selectedSpot === spot.id)}
                  `}
                >
                  {spot.code.split('-')[1]}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Override Form */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Thông tin ghi đè</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSpotData ? (
              <div className="space-y-4">
                {/* Selected Spot Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ô đỗ được chọn:</div>
                  <div className="text-lg font-bold text-[#0055A4]">{selectedSpotData.code}</div>
                  <div className="text-sm text-gray-600 mt-2">Trạng thái hiện tại:</div>
                  <div className="text-sm font-medium">{getStatusLabel(selectedSpotData.status)}</div>
                </div>

                {/* New Status Selection */}
                <div className="space-y-2">
                  <Label>Trạng thái mới *</Label>
                  <RadioGroup value={newStatus} onValueChange={setNewStatus}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="occupied" id="occupied" />
                      <Label htmlFor="occupied" className="font-normal cursor-pointer">
                        Có xe
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="empty" id="empty" />
                      <Label htmlFor="empty" className="font-normal cursor-pointer">
                        Trống
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintenance" id="maintenance" />
                      <Label htmlFor="maintenance" className="font-normal cursor-pointer">
                        Đang bảo trì
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do ghi đè *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Nhập lý do ghi đè (bắt buộc để đảm bảo tính truy vết)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Staff Info */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Người thực hiện:</div>
                  <div className="text-sm font-medium mt-1">Member E (Nhân viên vận hành)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleString('vi-VN')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                    className="flex-1 bg-[#0055A4] hover:bg-[#003d7a]"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSpot(null);
                      setReason("");
                      setNewStatus("occupied");
                    }}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <AlertCircle className="w-12 h-12 mb-3" />
                <p className="text-sm text-center">
                  Vui lòng chọn một ô đỗ trên sơ đồ để bắt đầu ghi đè trạng thái
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận ghi đè trạng thái</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Bạn có chắc chắn muốn ghi đè trạng thái cho ô đỗ này?</p>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                  <div><strong>Ô đỗ:</strong> {selectedSpotData?.code}</div>
                  <div><strong>Trạng thái hiện tại:</strong> {selectedSpotData && getStatusLabel(selectedSpotData.status)}</div>
                  <div><strong>Trạng thái mới:</strong> {getStatusLabel(newStatus)}</div>
                  <div><strong>Lý do:</strong> {reason}</div>
                  <div><strong>Người thực hiện:</strong> Member E</div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-[#0055A4] hover:bg-[#003d7a]">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
