import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, User, Key, Shield, Info, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type RegistrationStep = 1 | 2 | 3;

interface UserData {
  fullName: string;
  studentId: string;
  role: string;
}

export function CardRegistration() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [rfidCode, setRfidCode] = useState<string>("");
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Simulate IoT scanning process
  useEffect(() => {
    if (step === 1 && isScanning) {
      const scanTimer = setTimeout(() => {
        // Simulate scanning a card
        const mockRfid = "E280689400004000";
        setRfidCode(mockRfid);
        setIsScanning(false);
        setIsSuccess(true);
        setError(null);
        
        // Fetch user info from DATACORE
        setUserData({
          fullName: "Nguyễn Văn A",
          studentId: "2010123",
          role: "Sinh viên",
        });

        toast.success("Đọc thẻ thành công. Vui lòng kiểm tra thông tin!", {
          style: { background: '#28A745', color: 'white', border: 'none' }
        });
        
        setTimeout(() => setStep(2), 1500); // Move to confirm step
      }, 3000);
      return () => clearTimeout(scanTimer);
    }
  }, [step, isScanning]);

  const handleConfirm = () => {
    // Simulate API submission
    setTimeout(() => {
      // randomly show success or error
      const simulateError = Math.random() > 0.8; 
      
      if (simulateError) {
        setError("Thẻ này đã được đăng ký bởi người dùng khác.");
        toast.error("Đăng ký thất bại", {
          style: { background: '#DC3545', color: 'white', border: 'none' }
        });
      } else {
        setStep(3);
        toast.success("Đăng ký thẻ thành công. Bạn có thể sử dụng thẻ ngay bây giờ.", {
          style: { background: '#28A745', color: 'white', border: 'none' }
        });
      }
    }, 800);
  };

  const handleCancel = () => {
    setStep(1);
    setRfidCode("");
    setIsScanning(true);
    setIsSuccess(false);
    setUserData(null);
    setError(null);
  };

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#003366] flex items-center gap-3">
          <CreditCard className="w-8 h-8" />
          Liên kết thẻ gửi xe (RFID)
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Đồng bộ thẻ nhận diện với hệ thống lưu trữ tập trung HCMUT_DATACORE
        </p>
      </header>

      {/* Stepper */}
      <div className="mb-10 w-full bg-white p-6 rounded-[8px] shadow-sm flex flex-col md:flex-row items-center justify-between border border-gray-100">
        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#003366]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${step === 1 ? 'bg-[#003366] text-white ring-4 ring-[#003366]/20' : 
              step > 1 ? 'bg-[#28A745] text-white' : 'bg-gray-100'}`}>
            {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
          </div>
          <span className="font-medium text-sm">Quét thẻ</span>
        </div>
        
        <div className={`hidden md:block flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-[#28A745]' : 'bg-gray-100'}`} />
        
        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#003366]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${step === 2 ? 'bg-[#003366] text-white ring-4 ring-[#003366]/20' : 
              step > 2 ? 'bg-[#28A745] text-white' : 'bg-gray-100'}`}>
            {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
          </div>
          <span className="font-medium text-sm">Xác nhận thông tin</span>
        </div>
        
        <div className={`hidden md:block flex-1 h-1 mx-4 rounded ${step >= 3 ? 'bg-[#28A745]' : 'bg-gray-100'}`} />
        
        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-[#003366]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
            ${step === 3 ? 'bg-[#28A745] text-white ring-4 ring-[#28A745]/20' : 'bg-gray-100'}`}>
            3
          </div>
          <span className="font-medium text-sm">Hoàn tất</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Card Reader */}
        <div className="bg-white p-8 rounded-[8px] shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold text-[#003366] mb-6 w-full text-left">Đầu đọc thẻ RFID</h2>
          
          <div className="relative w-48 h-48 mb-8">
            <div className={`absolute inset-0 rounded-2xl border-4 border-dashed transition-colors duration-500 flex flex-col items-center justify-center overflow-hidden
              ${isScanning ? 'border-[#003366]/30 animate-pulse' : 
                isSuccess ? 'border-[#28A745] bg-[#28A745]/5' : 'border-gray-200'}`}
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1754494977436-a5c202306fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNhcmQlMjByZWFkZXJ8ZW58MXx8fHwxNzc0OTM5NzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Card reader illustration" 
                className={`w-full h-full object-cover opacity-80 mix-blend-multiply transition-all ${isScanning ? 'scale-110' : 'scale-100'}`}
              />
              {isScanning && (
                <div className="absolute inset-0 bg-blue-500/10" />
              )}
            </div>
            
            {/* Flashing scanner line effect */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#003366] shadow-[0_0_8px_2px_rgba(0,51,102,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-end">
              <span>Mã định danh RFID</span>
              {isScanning && <span className="text-[#003366] text-xs font-semibold animate-pulse">Đang chờ tín hiệu...</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={rfidCode}
                placeholder="____-____-____-____"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-[8px] text-lg font-mono tracking-widest text-center transition-colors focus:outline-none
                  ${isScanning ? 'border-[#003366]/50 cursor-wait' : 
                    isSuccess ? 'border-[#28A745] bg-[#28A745]/10 text-[#28A745] font-bold shadow-[0_0_0_1px_#28A745]' : 
                    'border-gray-300'}`}
              />
              {isScanning && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#003366] animate-pulse" />
              )}
            </div>
            {error && <p className="mt-2 text-sm text-[#DC3545] flex items-center gap-1.5"><Info size={16}/> {error}</p>}
            
            <div className="mt-4 p-3 bg-[#E9EBEF] rounded-[8px] text-sm text-[#003366] flex items-start gap-2 border border-[#003366]/10">
              <Info className="shrink-0 mt-0.5 w-4 h-4" />
              <p>Mã thẻ được đồng bộ tự động một chiều từ thiết bị đầu cuối IoT qua cổng COM/USB. Trường này không cho phép chỉnh sửa thủ công.</p>
            </div>
          </div>
        </div>

        {/* Right Column: User Info & Actions */}
        <div className="bg-white p-8 rounded-[8px] shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-[#003366] mb-6">Thông tin xác thực (DATACORE)</h2>
          
          <div className="flex-1">
            {userData ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="group">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                    Họ và tên
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100">
                    <div className="bg-[#003366]/10 p-2 rounded-md"><User className="w-5 h-5 text-[#003366]" /></div>
                    <span className="font-semibold text-gray-800 text-lg">{userData.fullName}</span>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                    Mã số (MSSP/MSCB)
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100">
                    <div className="bg-[#003366]/10 p-2 rounded-md"><Key className="w-5 h-5 text-[#003366]" /></div>
                    <span className="font-medium text-gray-700">{userData.studentId}</span>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                    Vai trò
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px] border border-gray-100">
                    <div className="bg-[#003366]/10 p-2 rounded-md"><Shield className="w-5 h-5 text-[#003366]" /></div>
                    <span className="font-medium text-gray-700">{userData.role}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <User className="w-16 h-16 text-gray-200" />
                <p className="text-center">Đang chờ quét thẻ để hiển thị thông tin...</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            {step === 3 ? (
              <button 
                onClick={handleCancel}
                className="px-6 py-2.5 bg-[#003366] text-white font-medium rounded-[8px] hover:bg-[#003366]/90 transition-colors flex items-center gap-2"
              >
                Đăng ký thẻ mới <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  disabled={step === 1}
                  className="px-6 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy thao tác
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={step !== 2}
                  className="px-6 py-2.5 bg-[#28A745] text-white font-medium rounded-[8px] hover:bg-[#28A745]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <CheckCircle2 size={18} />
                  Xác nhận liên kết
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}