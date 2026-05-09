import { useState } from "react";
import { Camera, Upload, X, AlertCircle, CheckCircle, Calendar, MapPin } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface ParkingSession {
  id: string;
  date: Date;
  location: string;
  area: string;
  entryTime: string;
  exitTime: string;
  fee: number;
}

export function SubmitComplaint() {
  const [selectedSession, setSelectedSession] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Mock parking sessions
  const parkingSessions: ParkingSession[] = [
    {
      id: "PH-001",
      date: new Date("2026-04-12"),
      location: "Bãi A",
      area: "Khu A1",
      entryTime: "07:30",
      exitTime: "17:45",
      fee: 15000,
    },
    {
      id: "PH-002",
      date: new Date("2026-04-11"),
      location: "Bãi B",
      area: "Khu B2",
      entryTime: "08:00",
      exitTime: "16:30",
      fee: 12000,
    },
    {
      id: "PH-003",
      date: new Date("2026-04-10"),
      location: "Bãi A",
      area: "Khu A3",
      entryTime: "07:45",
      exitTime: "18:00",
      fee: 16000,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedSession) {
      toast.error("Vui lòng chọn lượt gửi xe");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng mô tả sự cố");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      // Reset form
      setSelectedSession("");
      setDescription("");
      setUploadedImages([]);
    }, 2000);
  };

  const selectedSessionData = parkingSessions.find((s) => s.id === selectedSession);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-6">
      {/* Header */}
      <div className="bg-[#003366] text-white px-4 py-6 shadow-md">
        <h1 className="text-xl font-semibold">Gửi khiếu nại</h1>
        <p className="text-sm opacity-90 mt-1">Báo cáo sự cố về lượt gửi xe của bạn</p>
      </div>

      {/* Form Content */}
      <div className="px-4 mt-4 space-y-4">
        {/* Select Parking Session */}
        <Card className="bg-white p-4">
          <Label htmlFor="session" className="text-sm font-semibold text-gray-900">
            Chọn lượt gửi xe <span className="text-[#DC3545]">*</span>
          </Label>
          <p className="text-xs text-gray-500 mb-3">Chọn lượt gửi xe bị lỗi hoặc có vấn đề</p>

          <Select value={selectedSession} onValueChange={setSelectedSession}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tìm kiếm và chọn lượt gửi xe..." />
            </SelectTrigger>
            <SelectContent>
              {parkingSessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="font-medium">#{session.id}</span>
                      <span className="text-gray-500 ml-2">
                        {session.date.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {session.location} - {session.area}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Session Details */}
          {selectedSessionData && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-900">
                    {selectedSessionData.date.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedSessionData.location} - {selectedSessionData.area}</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {selectedSessionData.entryTime} - {selectedSessionData.exitTime}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Description */}
        <Card className="bg-white p-4">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
            Mô tả sự cố <span className="text-[#DC3545]">*</span>
          </Label>
          <p className="text-xs text-gray-500 mb-3">
            Mô tả chi tiết vấn đề bạn gặp phải
          </p>

          <Textarea
            id="description"
            placeholder="Ví dụ: Tôi đã thanh toán đúng phí nhưng hệ thống vẫn tính là chưa thanh toán. Tôi có biên lai thanh toán qua BKPay lúc 17:30..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{description.length} ký tự</span>
            <span className="text-xs text-gray-400">Tối thiểu 20 ký tự</span>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="bg-white p-4">
          <Label className="text-sm font-semibold text-gray-900">
            Tải lên hình ảnh minh chứng
          </Label>
          <p className="text-xs text-gray-500 mb-3">
            Tối đa 3 hình ảnh (JPG, PNG, tối đa 5MB mỗi ảnh)
          </p>

          {/* Upload Area */}
          <label
            htmlFor="image-upload"
            className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#003366] hover:bg-gray-50 transition-colors"
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadedImages.length >= 3}
            />
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Chọn ảnh để tải lên</p>
            <p className="text-xs text-gray-500 mt-1">hoặc kéo thả ảnh vào đây</p>
          </label>

          {/* Preview Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="bg-amber-50 border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">Lưu ý khi gửi khiếu nại:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>Mô tả rõ ràng, chi tiết vấn đề gặp phải</li>
                <li>Đính kèm ảnh chụp minh chứng nếu có</li>
                <li>Thời gian xử lý khiếu nại: 1-3 ngày làm việc</li>
                <li>Bạn sẽ nhận thông báo kết quả qua ứng dụng</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedSession || description.length < 20}
          className="w-full bg-[#003366] hover:bg-[#002244] text-white py-6 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-3" />
              Gửi khiếu nại
            </>
          )}
        </Button>

        {/* Bottom spacing */}
        <div className="h-4"></div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-center">Gửi khiếu nại thành công!</DialogTitle>
            <DialogDescription className="text-center">
              Khiếu nại của bạn đã được ghi nhận. Chúng tôi sẽ xem xét và phản hồi trong vòng 1-3 ngày làm việc.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="w-full bg-[#003366] hover:bg-[#002244]"
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
