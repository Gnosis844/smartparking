import { useState } from "react";
import { Wallet, CreditCard, Shield, CheckCircle, Calendar, MapPin, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface UnpaidSession {
  id: string;
  date: Date;
  location: string;
  area: string;
  entryTime: string;
  exitTime: string;
  amount: number;
  daysOverdue: number;
}

export function DebtPayment() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock unpaid sessions data
  const unpaidSessions: UnpaidSession[] = [
    {
      id: "UNP-001",
      date: new Date("2026-04-10"),
      location: "Bãi A",
      area: "Khu A1",
      entryTime: "07:30",
      exitTime: "17:45",
      amount: 15000,
      daysOverdue: 2
    },
    {
      id: "UNP-002",
      date: new Date("2026-04-08"),
      location: "Bãi B",
      area: "Khu B2",
      entryTime: "08:00",
      exitTime: "16:30",
      amount: 12000,
      daysOverdue: 4
    },
    {
      id: "UNP-003",
      date: new Date("2026-04-05"),
      location: "Bãi A",
      area: "Khu A3",
      entryTime: "07:45",
      exitTime: "18:00",
      amount: 16000,
      daysOverdue: 7
    },
    {
      id: "UNP-004",
      date: new Date("2026-04-03"),
      location: "Bãi C",
      area: "Khu C1",
      entryTime: "08:30",
      exitTime: "15:00",
      amount: 10000,
      daysOverdue: 9
    },
  ];

  const totalDebt = unpaidSessions.reduce((sum, session) => sum + session.amount, 0);

  const handlePayment = () => {
    setShowPaymentDialog(true);
  };

  const confirmPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentDialog(false);
      toast.success("Thanh toán thành công qua BKPay!", {
        description: `Đã thanh toán ${totalDebt.toLocaleString('vi-VN')} VNĐ`,
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Debt Summary Card - Gradient */}
      <div className="bg-gradient-to-br from-[#003366] via-[#004d99] to-[#0066cc] p-6 pb-12 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Công nợ & Thanh toán</h1>
          <Wallet className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm opacity-90 mb-2">Tổng số dư nợ hiện tại</p>
          <p className="text-5xl font-bold mb-1">
            {(totalDebt / 1000).toFixed(0)}
            <span className="text-2xl ml-1">K</span>
          </p>
          <p className="text-sm opacity-75">{totalDebt.toLocaleString('vi-VN')} VNĐ</p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mx-auto">
            <AlertCircle className="w-4 h-4" />
            <span>{unpaidSessions.length} lượt gửi xe chưa thanh toán</span>
          </div>
        </div>
      </div>

      {/* Unpaid Sessions List */}
      <div className="px-4 -mt-8 space-y-3 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết công nợ</h2>

        {unpaidSessions.map((session) => (
          <Card key={session.id} className="bg-white overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#003366]" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {session.date.toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{session.entryTime} - {session.exitTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#003366] text-lg">
                    {session.amount.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-xs text-gray-500">VNĐ</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{session.location} - {session.area}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">#{session.id}</span>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  session.daysOverdue > 7
                    ? 'bg-red-50 text-red-700'
                    : session.daysOverdue > 3
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  Quá hạn {session.daysOverdue} ngày
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Summary Card */}
      <div className="px-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Thanh toán an toàn</p>
                <p className="text-xs text-gray-600">Được bảo mật bởi BKPay</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <span className="text-sm text-gray-600">Phương thức thanh toán</span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">BKPay Wallet</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Tổng thanh toán</span>
            <span className="text-xl font-bold text-[#003366]">
              {totalDebt.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <Button
            onClick={handlePayment}
            className="w-full bg-[#003366] hover:bg-[#002244] text-white py-6 text-lg font-semibold shadow-lg"
          >
            <Wallet className="w-6 h-6 mr-3" />
            Thanh toán qua BKPay
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Giao dịch được mã hóa và bảo mật
          </p>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#003366]" />
              Xác nhận thanh toán
            </DialogTitle>
            <DialogDescription>
              Vui lòng xác nhận thông tin thanh toán
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Số tiền thanh toán</p>
              <p className="text-3xl font-bold text-[#003366]">
                {totalDebt.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượt gửi xe:</span>
                <span className="font-medium">{unpaidSessions.length} lượt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium text-blue-600">BKPay Wallet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí giao dịch:</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Shield className="w-4 h-4 mt-0.5 text-green-600" />
              <p>
                Giao dịch được mã hóa và bảo mật bởi BKPay.
                Thông tin thanh toán của bạn được bảo vệ theo tiêu chuẩn quốc tế.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmPayment}
              disabled={isProcessing}
              className="flex-1 bg-[#003366] hover:bg-[#002244]"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Xác nhận
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
