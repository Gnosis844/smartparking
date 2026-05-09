import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Search, Eye, Check, X, Calendar, User, Image as ImageIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

type ComplaintStatus = "pending" | "approved" | "rejected";

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  submittedDate: Date;
  description: string;
  images: string[];
  location: string;
  status: ComplaintStatus;
  adminNote?: string;
}

export function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState<"all" | ComplaintStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNote, setAdminNote] = useState("");

  // Mock complaints data
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "CMP-001",
      userId: "USR-12345",
      userName: "Nguyễn Văn An",
      sessionId: "PH-001",
      submittedDate: new Date("2026-04-12T08:30:00"),
      description: "Tôi đã thanh toán đúng phí 15,000 VNĐ qua BKPay lúc 17:30 nhưng hệ thống vẫn hiển thị chưa thanh toán. Tôi có screenshot giao dịch thành công từ ứng dụng BKPay.",
      images: [
        "https://via.placeholder.com/400x300?text=Payment+Receipt",
        "https://via.placeholder.com/400x300?text=System+Error"
      ],
      location: "Bãi A - Khu A1",
      status: "pending",
    },
    {
      id: "CMP-002",
      userId: "USR-23456",
      userName: "Trần Thị Bình",
      sessionId: "PH-015",
      submittedDate: new Date("2026-04-11T14:20:00"),
      description: "Barrier không mở sau khi quét thẻ RFID. Tôi đã thử quét lại 3 lần nhưng vẫn không mở. Phải chờ nhân viên bảo vệ can thiệp mất 15 phút.",
      images: [
        "https://via.placeholder.com/400x300?text=Barrier+Stuck"
      ],
      location: "Bãi B - Cổng ra",
      status: "pending",
    },
    {
      id: "CMP-003",
      userId: "USR-34567",
      userName: "Lê Văn Cường",
      sessionId: "PH-023",
      submittedDate: new Date("2026-04-11T09:15:00"),
      description: "Hệ thống tính sai phí. Tôi gửi xe từ 8h đến 12h (4 tiếng) nhưng hệ thống tính 8 tiếng và thu phí 16,000 VNĐ thay vì 10,000 VNĐ.",
      images: [],
      location: "Bãi C - Khu C2",
      status: "approved",
      adminNote: "Đã xác minh và hoàn trả 6,000 VNĐ vào tài khoản BKPay của người dùng."
    },
    {
      id: "CMP-004",
      userId: "USR-45678",
      userName: "Phạm Thị Dung",
      sessionId: "PH-031",
      submittedDate: new Date("2026-04-10T16:45:00"),
      description: "Camera không chụp được biển số xe khi vào bãi. Khi ra bãi gặp khó khăn vì không có ảnh biển số trong hệ thống.",
      images: [
        "https://via.placeholder.com/400x300?text=Camera+Issue",
        "https://via.placeholder.com/400x300?text=No+Plate+Detected"
      ],
      location: "Bãi A - Cổng vào",
      status: "pending",
    },
    {
      id: "CMP-005",
      userId: "USR-56789",
      userName: "Hoàng Văn Em",
      sessionId: "PH-042",
      submittedDate: new Date("2026-04-10T11:00:00"),
      description: "Yêu cầu hoàn tiền vì đã gửi nhầm bãi A nhưng muốn chuyển sang bãi B.",
      images: [],
      location: "Bãi A - Khu A2",
      status: "rejected",
      adminNote: "Không hoàn tiền do đây là lỗi chủ quan của người dùng, không phải lỗi hệ thống."
    },
    {
      id: "CMP-006",
      userId: "USR-67890",
      userName: "Vũ Thị Phương",
      sessionId: "PH-055",
      submittedDate: new Date("2026-04-09T13:30:00"),
      description: "Cảm biến báo sai chỗ đỗ. Tôi đỗ ở A-25 nhưng hệ thống hiển thị A-52, làm tôi mất 20 phút tìm xe.",
      images: [
        "https://via.placeholder.com/400x300?text=Wrong+Location"
      ],
      location: "Bãi A - Khu A2",
      status: "approved",
      adminNote: "Đã xác nhận lỗi cảm biến A-25. Kỹ thuật đã sửa chữa và bồi thường 10,000 VNĐ."
    },
  ]);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesTab = activeTab === "all" || complaint.status === activeTab;
    const matchesSearch = searchQuery === "" ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    approved: complaints.filter(c => c.status === "approved").length,
    rejected: complaints.filter(c => c.status === "rejected").length,
  };

  const handleViewDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailDialog(true);
    setActionType(null);
    setAdminNote(complaint.adminNote || "");
  };

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type);
  };

  const confirmAction = () => {
    if (!selectedComplaint || !actionType) return;

    setComplaints(complaints.map(c =>
      c.id === selectedComplaint.id
        ? {
            ...c,
            status: actionType === "approve" ? "approved" : "rejected",
            adminNote: adminNote
          }
        : c
    ));

    toast.success(
      actionType === "approve"
        ? "Đã chấp nhận khiếu nại"
        : "Đã từ chối khiếu nại"
    );

    setShowDetailDialog(false);
    setSelectedComplaint(null);
    setActionType(null);
    setAdminNote("");
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    const config = {
      pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Đã chấp nhận", className: "bg-green-100 text-green-800" },
      rejected: { label: "Đã từ chối", className: "bg-red-100 text-red-800" },
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Quản lý khiếu nại</h1>
        <p className="text-sm text-gray-500 mt-1">
          Xem và xử lý khiếu nại từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tất cả</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-yellow-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã chấp nhận</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-red-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã từ chối</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-[#0055A4] hover:bg-[#004494]" : ""}
              >
                Tất cả
              </Button>
              <Button
                variant={activeTab === "pending" ? "default" : "outline"}
                onClick={() => setActiveTab("pending")}
                className={activeTab === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                Chờ xử lý
              </Button>
              <Button
                variant={activeTab === "approved" ? "default" : "outline"}
                onClick={() => setActiveTab("approved")}
                className={activeTab === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Đã chấp nhận
              </Button>
              <Button
                variant={activeTab === "rejected" ? "default" : "outline"}
                onClick={() => setActiveTab("rejected")}
                className={activeTab === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Đã từ chối
              </Button>
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã, user, mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KN</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Mô tả sự cố</TableHead>
                <TableHead>Ảnh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{complaint.userName}</p>
                        <p className="text-xs text-gray-500">{complaint.userId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {complaint.submittedDate.toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-md">
                      {complaint.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    {complaint.images.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">{complaint.images.length} ảnh</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Không có</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(complaint)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      {complaint.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setActionType("approve");
                              setShowDetailDialog(true);
                            }}
                            className="bg-[#28A745] hover:bg-[#218838]"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Chấp nhận
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setActionType("reject");
                              setShowDetailDialog(true);
                            }}
                            className="bg-[#DC3545] hover:bg-[#c82333]"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Từ chối
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khiếu nại #{selectedComplaint?.id}</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết và xử lý khiếu nại
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Người gửi</Label>
                  <p className="font-medium">{selectedComplaint.userName}</p>
                  <p className="text-sm text-gray-500">{selectedComplaint.userId}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Ngày gửi</Label>
                  <p className="font-medium">
                    {selectedComplaint.submittedDate.toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Phiên gửi xe</Label>
                  <p className="font-medium">{selectedComplaint.sessionId}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Vị trí</Label>
                  <p className="font-medium">{selectedComplaint.location}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-gray-500">Mô tả sự cố</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Images */}
              {selectedComplaint.images.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Ảnh minh chứng</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {selectedComplaint.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Evidence ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <Label className="text-xs text-gray-500">Trạng thái</Label>
                <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
              </div>

              {/* Admin Note */}
              {actionType && (
                <div>
                  <Label htmlFor="adminNote">
                    Ghi chú xử lý <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="adminNote"
                    placeholder="Nhập lý do chấp nhận/từ chối..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {selectedComplaint.adminNote && !actionType && (
                <div>
                  <Label className="text-xs text-gray-500">Ghi chú của Admin</Label>
                  <p className="text-sm mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    {selectedComplaint.adminNote}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {actionType ? (
              <>
                <Button variant="outline" onClick={() => setActionType(null)}>
                  Quay lại
                </Button>
                <Button
                  onClick={confirmAction}
                  disabled={!adminNote.trim()}
                  className={
                    actionType === "approve"
                      ? "bg-[#28A745] hover:bg-[#218838]"
                      : "bg-[#DC3545] hover:bg-[#c82333]"
                  }
                >
                  {actionType === "approve" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Xác nhận chấp nhận
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Xác nhận từ chối
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                {selectedComplaint?.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleAction("approve")}
                      className="bg-[#28A745] hover:bg-[#218838]"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Chấp nhận
                    </Button>
                    <Button
                      onClick={() => handleAction("reject")}
                      className="bg-[#DC3545] hover:bg-[#c82333]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
