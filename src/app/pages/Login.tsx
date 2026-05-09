import { useState } from "react";
import { useNavigate } from "react-router";
import { KeyRound, AlertCircle, Loader2, GraduationCap, Globe } from "lucide-react";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    // MVP: Simplified SSO login - always success after 1s
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-[#003366] text-white p-2 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <span className="font-bold text-[#003366] text-xl hidden sm:block">HCMUT</span>
        </div>
        <h1 className="text-[#003366] font-semibold text-lg md:text-xl text-right">
          Smart Parking Management System
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[8px] shadow-lg w-full max-w-md p-10 flex flex-col items-center">
          <div className="bg-[#003366]/10 p-4 rounded-full mb-6">
            <KeyRound size={32} className="text-[#003366]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#003366] mb-8 text-center">
            Đăng nhập hệ thống
          </h2>

          {/* Error Alert Box */}
          {error && (
            <div className="w-full bg-[#DC3545]/10 border border-[#DC3545] text-[#DC3545] px-4 py-3 rounded-[8px] mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#003366] hover:bg-[#003366]/90 text-white font-medium py-3 px-4 rounded-[8px] flex items-center justify-center gap-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Đang kết nối...</span>
              </>
            ) : (
              <>
                <KeyRound size={20} />
                <span>Đăng nhập qua HCMUT_SSO</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center leading-relaxed">
            Hệ thống sử dụng tài khoản xác thực tập trung của Đại học Bách Khoa
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <button className="hover:text-[#003366] font-medium transition-colors">VN</button>
          <span>|</span>
          <button className="hover:text-[#003366] transition-colors">EN</button>
        </div>
        
        <div className="flex gap-4 items-center text-center sm:text-left">
          <a href="#" className="hover:text-[#003366] transition-colors">Liên hệ kỹ thuật</a>
          <span className="hidden sm:inline">•</span>
          <span>&copy; {new Date().getFullYear()} Bản quyền thuộc về HCMUT</span>
        </div>
      </footer>
    </div>
  );
}