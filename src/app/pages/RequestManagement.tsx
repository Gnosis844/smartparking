import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, User, CreditCard, Ticket, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface Request {
  id: string;
  type: "lost-card" | "lost-ticket";
  userName: string;
  userEmail: string;
  userPhone: string;
  studentId?: string;
  licensePlate?: string;
  timestamp: Date;
  status: "pending" | "accepted" | "rejected";
  description: string;
}

export function RequestManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "lost-card" | "lost-ticket">("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "REQ-001",
      type: "lost-card",
      userName: "Nguyễn Văn An",
      userEmail: "an.nguyen@hcmut.edu.vn",
      userPhone: "0901234567",
      studentId: "2012345",
      timestamp: new Date("2026-04-12T08:30:00"),
      status: "pending",
      description: "Thẻ RFID bị mất khi ra khỏi bãi xe sáng nay"
    },
    {
      id: "REQ-002",
      type: "lost-ticket",
      userName: "Trần Thị Bình",
      userEmail: "binh.tran@hcmut.edu.vn",
      userPhone: "0912345678",
      licensePlate: "59A-12345",
      timestamp: new Date("2026-04-12T09:15:00"),
      status: "pending",
      description: "Làm mất vé xe khi gửi xe vào lúc 7h sáng"
    },
    {
      id: "REQ-003",
      type: "lost-card",
      userName: "Lê Văn Cường",
      userEmail: "cuong.le@hcmut.edu.vn",
      userPhone: "0923456789",
      studentId: "2012347",
      timestamp: new Date("2026-04-12T10:00:00"),
      status: "pending",
      description: "Quên thẻ ở nhà, cần xác minh để lấy xe"
    },
    {
      id: "REQ-004",
      type: "lost-ticket",
      userName: "Phạm Thị Dung",
      userEmail: "dung.pham@hcmut.edu.vn",
      userPhone: "0934567890",
      licensePlate: "51G-67890",
      timestamp: new Date("2026-04-12T11:20:00"),
      status: "pending",
      description: "Vé bị gió thổi mất khi đang chuẩn bị lấy xe"
    }
  ]);

  const filteredRequests = requests
    .filter(req => {
      if (filterType !== "all" && req.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          req.userName.toLowerCase().includes(query) ||
          req.id.toLowerCase().includes(query) ||
          req.userEmail.toLowerCase().includes(query) ||
          (req.studentId && req.studentId.includes(query)) ||
          (req.licensePlate && req.licensePlate.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(req => req.status === "pending")
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setShowDialog(true);
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;

    if (selectedRequest.type === "lost-card") {
      navigate(`/lost-card?requestId=${selectedRequest.id}`);
    } else {
      navigate(`/lost-ticket?requestId=${selectedRequest.id}`);
    }
    setShowDialog(false);
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) return;

    setRequests(prev =>
      prev.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: "rejected" as const }
          : req
      )
    );
    setShowDialog(false);
    setSelectedRequest(null);
  };

  const getTypeIcon = (type: Request["type"]) => {
    return type === "lost-card" ? CreditCard : Ticket;
  };

  const getTypeLabel = (type: Request["type"]) => {
    return type === "lost-card" ? "Thẻ mất/quên" : "Mất vé";
  };

  const getTypeBadgeColor = (type: Request["type"]) => {
    return type === "lost-card" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý yêu cầu xử lý</h1>
        <p className="text-sm text-gray-500 mt-1">
          Xử lý các yêu cầu hỗ trợ từ người dùng
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, MSSV, biển số..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Tất cả
              </Button>
              <Button
                variant={filterType === "lost-card" ? "default" : "outline"}
                onClick={() => setFilterType("lost-card")}
                className={filterType === "lost-card" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Thẻ mất/quên
              </Button>
              <Button
                variant={filterType === "lost-ticket" ? "default" : "outline"}
                onClick={() => setFilterType("lost-ticket")}
                className={filterType === "lost-ticket" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                <Ticket className="w-4 h-4 mr-2" />
                Mất vé
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Không có yêu cầu nào đang chờ xử lý</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => {
            const TypeIcon = getTypeIcon(request.type);
            return (
              <Card
                key={request.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewRequest(request)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                          <Badge className={getTypeBadgeColor(request.type)}>
                            {getTypeLabel(request.type)}
                          </Badge>
                          <span className="text-sm text-gray-500">#{request.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{request.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📱</span>
                            <span>{request.userPhone}</span>
                          </div>
                          {request.studentId && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CreditCard className="w-4 h-4" />
                              <span>MSSV: {request.studentId}</span>
                            </div>
                          )}
                          {request.licensePlate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>🚗</span>
                              <span>Biển số: {request.licensePlate}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{request.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {request.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Request Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
            <DialogDescription>
              Xem thông tin và xác nhận xử lý yêu cầu
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeBadgeColor(selectedRequest.type)}>
                    {getTypeLabel(selectedRequest.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">#{selectedRequest.id}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Người gửi yêu cầu</p>
                    <p className="font-medium">{selectedRequest.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedRequest.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm">{selectedRequest.userPhone}</p>
                  </div>
                  {selectedRequest.studentId && (
                    <div>
                      <p className="text-xs text-gray-500">MSSV</p>
                      <p className="text-sm">{selectedRequest.studentId}</p>
                    </div>
                  )}
                  {selectedRequest.licensePlate && (
                    <div>
                      <p className="text-xs text-gray-500">Biển số xe</p>
                      <p className="text-sm">{selectedRequest.licensePlate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Thời gian gửi</p>
                    <p className="text-sm">
                      {selectedRequest.timestamp.toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mô tả</p>
                    <p className="text-sm">{selectedRequest.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleRejectRequest}>
              Từ chối
            </Button>
            <Button
              onClick={handleAcceptRequest}
              className="bg-[#0055A4] hover:bg-[#004494]"
            >
              Chấp nhận xử lý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
