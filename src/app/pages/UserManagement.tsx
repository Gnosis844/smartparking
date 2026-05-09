import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Search, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

type UserRole = "student" | "staff" | "visitor" | "admin" | "operator";
type UserStatus = "active" | "blocked" | "pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  studentId?: string;
  phone: string;
  registeredDate: Date;
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    status: "active" as UserStatus,
    studentId: "",
    phone: "",
  });

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "USR-001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@hcmut.edu.vn",
      role: "student",
      status: "active",
      studentId: "2012345",
      phone: "0901234567",
      registeredDate: new Date("2024-09-01"),
    },
    {
      id: "USR-002",
      name: "Trần Thị Bình",
      email: "binh.tran@hcmut.edu.vn",
      role: "student",
      status: "active",
      studentId: "2012346",
      phone: "0912345678",
      registeredDate: new Date("2024-09-01"),
    },
    {
      id: "USR-003",
      name: "Lê Văn Cường",
      email: "cuong.le@hcmut.edu.vn",
      role: "staff",
      status: "active",
      phone: "0923456789",
      registeredDate: new Date("2024-08-15"),
    },
    {
      id: "USR-004",
      name: "Phạm Thị Dung",
      email: "dung.pham@hcmut.edu.vn",
      role: "student",
      status: "blocked",
      studentId: "2012348",
      phone: "0934567890",
      registeredDate: new Date("2024-09-02"),
    },
    {
      id: "USR-005",
      name: "Hoàng Văn Em",
      email: "em.hoang@hcmut.edu.vn",
      role: "operator",
      status: "active",
      phone: "0945678901",
      registeredDate: new Date("2024-07-01"),
    },
    {
      id: "USR-006",
      name: "Vũ Thị Phương",
      email: "phuong.vu@hcmut.edu.vn",
      role: "student",
      status: "pending",
      studentId: "2012350",
      phone: "0956789012",
      registeredDate: new Date("2026-04-10"),
    },
    {
      id: "USR-007",
      name: "Admin System",
      email: "admin@hcmut.edu.vn",
      role: "admin",
      status: "active",
      phone: "0967890123",
      registeredDate: new Date("2024-01-01"),
    },
    {
      id: "USR-008",
      name: "Khách tham quan",
      email: "visitor01@gmail.com",
      role: "visitor",
      status: "active",
      phone: "0978901234",
      registeredDate: new Date("2026-04-12"),
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    blocked: users.filter(u => u.status === "blocked").length,
    pending: users.filter(u => u.status === "pending").length,
  };

  const handleAddUser = () => {
    setDialogMode("add");
    setFormData({
      name: "",
      email: "",
      role: "student",
      status: "active",
      studentId: "",
      phone: "",
    });
    setShowDialog(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      studentId: user.studentId || "",
      phone: user.phone,
    });
    setShowDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa người dùng ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
      toast.success("Đã xóa người dùng");
    }
  };

  const handleSubmit = () => {
    if (dialogMode === "add") {
      const newUser: User = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        studentId: formData.studentId,
        phone: formData.phone,
        registeredDate: new Date(),
      };
      setUsers([...users, newUser]);
      toast.success("Đã thêm người dùng mới");
    } else if (selectedUser) {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, ...formData }
          : u
      ));
      toast.success("Đã cập nhật thông tin người dùng");
    }
    setShowDialog(false);
  };

  const getRoleBadge = (role: UserRole) => {
    const config = {
      student: { label: "Sinh viên", className: "bg-blue-100 text-blue-800" },
      staff: { label: "Giảng viên", className: "bg-purple-100 text-purple-800" },
      visitor: { label: "Khách", className: "bg-gray-100 text-gray-800" },
      admin: { label: "Admin", className: "bg-red-100 text-red-800" },
      operator: { label: "Vận hành", className: "bg-orange-100 text-orange-800" },
    };
    return <Badge className={config[role].className}>{config[role].label}</Badge>;
  };

  const getStatusBadge = (status: UserStatus) => {
    const config = {
      active: { label: "Hoạt động", className: "bg-[#28A745] text-white" },
      blocked: { label: "Đã khóa", className: "bg-[#DC3545] text-white" },
      pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý người dùng, phân quyền và trạng thái
          </p>
        </div>
        <Button onClick={handleAddUser} className="bg-[#003366] hover:bg-[#002244]">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-green-600">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-red-600">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Đã khóa</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.blocked}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-yellow-600">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Chờ duyệt</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="student">Sinh viên</SelectItem>
                <SelectItem value="staff">Giảng viên</SelectItem>
                <SelectItem value="visitor">Khách</SelectItem>
                <SelectItem value="operator">Vận hành</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="blocked">Đã khóa</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      {user.studentId && (
                        <p className="text-xs text-gray-500">MSSV: {user.studentId}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.registeredDate.toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin người dùng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@hcmut.edu.vn"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>

            <div>
              <Label htmlFor="role">Vai trò *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="staff">Giảng viên</SelectItem>
                  <SelectItem value="visitor">Khách</SelectItem>
                  <SelectItem value="operator">Vận hành</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "student" && (
              <div>
                <Label htmlFor="studentId">MSSV</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="2012345"
                />
              </div>
            )}

            <div>
              <Label htmlFor="status">Trạng thái *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="blocked">Đã khóa</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || !formData.phone}
              className="bg-[#003366] hover:bg-[#002244]"
            >
              {dialogMode === "add" ? "Thêm" : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
