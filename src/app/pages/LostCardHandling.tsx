import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, User, CreditCard, Check, X, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface UserInfo {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  faculty: string;
  cardId: string;
  cardStatus: "active" | "lost" | "expired";
  registrationDate: Date;
  photo: string;
}

export function LostCardHandling() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get("requestId");

  const [searchType, setSearchType] = useState<"studentId" | "email">("studentId");
  const [searchValue, setSearchValue] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"photo" | "info" | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // MVP: Mock search function - only MSSV 123456 works
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Vui lòng nhập thông tin tra cứu");
      return;
    }

    setIsSearching(true);
    setUserInfo(null);
    setIsVerified(false);
    setVerificationMethod(null);

    // Simulate API call
    setTimeout(() => {
      // MVP: Only MSSV 123456 is valid
      if (searchValue === "123456") {
        const mockUser: UserInfo = {
          studentId: "123456",
          fullName: "Nguyễn Văn An",
          email: "an.nguyen@hcmut.edu.vn",
          phone: "0901234567",
          faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
          cardId: "RFID-123456-001",
          cardStatus: "lost",
          registrationDate: new Date("2024-09-15"),
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnNguyen123"
        };

        setUserInfo(mockUser);
        toast.success("Tìm thấy thông tin người dùng", {
          style: { background: '#28A745', color: 'white', border: 'none' }
        });
      } else {
        toast.error("Không tìm thấy người dùng với MSSV này", {
          style: { background: '#DC3545', color: 'white', border: 'none' }
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleVerify = (method: "photo" | "info") => {
    setVerificationMethod(method);
  };

  const handleConfirmVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (verified) {
      toast.success("Xác minh danh tính thành công!", {
        style: { background: '#28A745', color: 'white', border: 'none' }
      });
    } else {
      toast.error("Xác minh thất bại");
      setVerificationMethod(null);
    }
  };

  const handleIssueTemporaryAccess = () => {
    toast.success("Đã cấp quyền truy cập 1 ngày cho người dùng", {
      style: { background: '#28A745', color: 'white', border: 'none' }
    });
    // MVP: Don't navigate, just show success
  };

  const handleIssueNewCard = () => {
    toast.success("Đã tạo yêu cầu cấp thẻ mới cho người dùng");
    setTimeout(() => {
      navigate("/request-management");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Xử lý thẻ mất/quên</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tra cứu và xác minh thông tin người dùng để xử lý thẻ mất hoặc quên
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
          <CardTitle>Tra cứu thông tin người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                variant={searchType === "studentId" ? "default" : "outline"}
                onClick={() => setSearchType("studentId")}
                className={searchType === "studentId" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                Theo MSSV
              </Button>
              <Button
                variant={searchType === "email" ? "default" : "outline"}
                onClick={() => setSearchType("email")}
                className={searchType === "email" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                Theo Email
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="search">
                {searchType === "studentId" ? "Mã số sinh viên" : "Địa chỉ email"}
              </Label>
              <Input
                id="search"
                placeholder={
                  searchType === "studentId"
                    ? "Nhập MSSV (vd: 2012345)"
                    : "Nhập email (vd: student@hcmut.edu.vn)"
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

      {/* User Info Section */}
      {userInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {/* Photo */}
              <div className="col-span-1">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={userInfo.photo}
                    alt={userInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  onClick={() => handleVerify("photo")}
                  disabled={isVerified}
                  variant="outline"
                  className="w-full mt-3"
                >
                  Xác minh qua ảnh
                </Button>
              </div>

              {/* Info */}
              <div className="col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Họ và tên</p>
                    <p className="font-medium">{userInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">MSSV</p>
                    <p className="font-medium">{userInfo.studentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{userInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm">{userInfo.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Khoa</p>
                    <p className="text-sm">{userInfo.faculty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mã thẻ RFID</p>
                    <p className="text-sm font-mono">{userInfo.cardId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trạng thái thẻ</p>
                    <Badge
                      className={
                        userInfo.cardStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {userInfo.cardStatus === "active" ? "Hoạt động" : "Mất/Hết hạn"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ngày đăng ký</p>
                    <p className="text-sm">
                      {userInfo.registrationDate.toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button
                    onClick={() => handleVerify("info")}
                    disabled={isVerified}
                    variant="outline"
                    className="w-full"
                  >
                    Xác minh qua thông tin cá nhân
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Section */}
      {verificationMethod && !isVerified && (
        <Card className="border-[#0055A4]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#0055A4]" />
              Xác minh danh tính
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              {verificationMethod === "photo"
                ? "So sánh ảnh trên hệ thống với giấy tờ tùy thân của người dùng (CCCD, thẻ sinh viên, ...)"
                : "Yêu cầu người dùng cung cấp thông tin cá nhân để xác minh (ngày sinh, địa chỉ, ...)"}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleConfirmVerification(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Xác minh thành công
              </Button>
              <Button
                onClick={() => handleConfirmVerification(false)}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Không khớp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Section */}
      {isVerified && (
        <Card className="border-green-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              Đã xác minh thành công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Chọn hành động xử lý cho người dùng:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleIssueTemporaryAccess}
                className="bg-[#0055A4] hover:bg-[#004494]"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Cấp quyền truy cập tạm thời
              </Button>
              <Button
                onClick={handleIssueNewCard}
                variant="outline"
              >
                <User className="w-4 h-4 mr-2" />
                Tạo yêu cầu cấp thẻ mới
              </Button>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Lưu ý:</strong> Quyền truy cập tạm thời có hiệu lực trong 24 giờ.
                Yêu cầu cấp thẻ mới sẽ được gửi đến bộ phận quản lý thẻ.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
