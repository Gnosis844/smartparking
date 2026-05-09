import { Link } from "react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h1>
      <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/">
        <Button className="bg-[#0055A4] hover:bg-[#003d7a]">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}
