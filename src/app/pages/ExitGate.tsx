import { useState } from "react";
import { LogOut, CreditCard, CheckCircle2, DollarSign, Car } from "lucide-react";
import { toast } from "sonner";
import { useParkingData } from "../contexts/ParkingContext";

export function ExitGate() {
  const { increaseSpots } = useParkingData();
  const [rfidCode, setRfidCode] = useState("");
  const [step, setStep] = useState<"scan" | "payment" | "success">("scan");
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);

  const handleSimulateScan = () => {
    const mockRfid = "E280689400004000";
    setRfidCode(mockRfid);

    // Mock vehicle and session data
    setVehicleInfo({
      plateNumber: "30A-12345",
      entryTime: "08:30",
      duration: "2 giờ 15 phút",
      parkingFee: 15000,
      lotArea: "Bãi A",
    });

    setStep("payment");
    toast.success("Quét thẻ thành công!", {
      style: { background: '#28A745', color: 'white', border: 'none' }
    });
  };

  const handlePayment = () => {
    // Process payment
    setTimeout(() => {
      increaseSpots(); // Increase available spots
      setStep("success");
      toast.success("Thanh toán thành công! Barrier đang mở...", {
        style: { background: '#28A745', color: 'white', border: 'none' }
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setStep("scan");
        setRfidCode("");
        setVehicleInfo(null);
      }, 3000);
    }, 800);
  };

  const handleReset = () => {
    setStep("scan");
    setRfidCode("");
    setVehicleInfo(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#0055A4] rounded-lg flex items-center justify-center">
          <LogOut className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0055A4]">Cổng ra - Exit Gate</h1>
          <p className="text-sm text-gray-600">Xử lý xe ra khỏi bãi và thanh toán</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {step === "scan" && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                <CreditCard className="w-10 h-10 text-[#0055A4]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Vui lòng quét thẻ RFID
              </h2>
              <p className="text-gray-600">
                Đưa thẻ đến thiết bị đọc để kiểm tra thông tin
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã thẻ RFID
                </label>
                <input
                  type="text"
                  value={rfidCode}
                  onChange={(e) => setRfidCode(e.target.value)}
                  placeholder="Đang chờ quét thẻ..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A4] focus:border-transparent"
                  readOnly
                />
              </div>

              <button
                onClick={handleSimulateScan}
                className="bg-[#0055A4] hover:bg-[#004080] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Mô phỏng quét thẻ
              </button>
            </div>
          </div>
        )}

        {step === "payment" && vehicleInfo && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-[#0055A4]" />
                <h3 className="text-lg font-semibold text-gray-900">Thông tin xe</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Biển số xe</p>
                  <p className="text-base font-semibold text-gray-900">{vehicleInfo.plateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Khu vực</p>
                  <p className="text-base font-semibold text-gray-900">{vehicleInfo.lotArea}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giờ vào</p>
                  <p className="text-base font-semibold text-gray-900">{vehicleInfo.entryTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian gửi</p>
                  <p className="text-base font-semibold text-gray-900">{vehicleInfo.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền cần thanh toán</p>
                    <p className="text-3xl font-bold text-green-700">
                      {vehicleInfo.parkingFee.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Barrier đang mở, vui lòng di chuyển xe ra khỏi bãi
            </p>
            <div className="inline-flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Barrier đang hoạt động...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
