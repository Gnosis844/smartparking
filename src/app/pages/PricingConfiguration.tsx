import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "sonner";

type UserType = "student" | "staff" | "visitor";

interface PricingRule {
  id: string;
  timeRangeStart: number; // hours
  timeRangeEnd: number; // hours
  pricePerHour: number;
  maxPerDay: number;
}

export function PricingConfiguration() {
  const [selectedUserType, setSelectedUserType] = useState<UserType>("student");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock pricing rules
  const [pricingRules, setPricingRules] = useState<{ [key in UserType]: PricingRule[] }>({
    student: [
      { id: "SR-1", timeRangeStart: 0, timeRangeEnd: 4, pricePerHour: 2000, maxPerDay: 15000 },
      { id: "SR-2", timeRangeStart: 4, timeRangeEnd: 8, pricePerHour: 2500, maxPerDay: 15000 },
      { id: "SR-3", timeRangeStart: 8, timeRangeEnd: 24, pricePerHour: 2000, maxPerDay: 15000 },
    ],
    staff: [
      { id: "ST-1", timeRangeStart: 0, timeRangeEnd: 4, pricePerHour: 3000, maxPerDay: 20000 },
      { id: "ST-2", timeRangeStart: 4, timeRangeEnd: 8, pricePerHour: 3500, maxPerDay: 20000 },
      { id: "ST-3", timeRangeStart: 8, timeRangeEnd: 24, pricePerHour: 3000, maxPerDay: 20000 },
    ],
    visitor: [
      { id: "VS-1", timeRangeStart: 0, timeRangeEnd: 2, pricePerHour: 5000, maxPerDay: 50000 },
      { id: "VS-2", timeRangeStart: 2, timeRangeEnd: 24, pricePerHour: 6000, maxPerDay: 50000 },
    ],
  });

  const currentRules = pricingRules[selectedUserType];

  const validateRule = (rule: PricingRule): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (rule.timeRangeStart < 0 || rule.timeRangeStart >= 24) {
      newErrors[`${rule.id}-start`] = "Giờ bắt đầu phải từ 0-23";
    }
    if (rule.timeRangeEnd <= 0 || rule.timeRangeEnd > 24) {
      newErrors[`${rule.id}-end`] = "Giờ kết thúc phải từ 1-24";
    }
    if (rule.timeRangeEnd <= rule.timeRangeStart) {
      newErrors[`${rule.id}-range`] = "Giờ kết thúc phải lớn hơn giờ bắt đầu";
    }
    if (rule.pricePerHour <= 0) {
      newErrors[`${rule.id}-price`] = "Giá phải lớn hơn 0";
    }
    if (rule.maxPerDay <= 0) {
      newErrors[`${rule.id}-max`] = "Giá tối đa phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRule = () => {
    const newRule: PricingRule = {
      id: `NEW-${Date.now()}`,
      timeRangeStart: 0,
      timeRangeEnd: 24,
      pricePerHour: 2000,
      maxPerDay: 15000,
    };

    setPricingRules({
      ...pricingRules,
      [selectedUserType]: [...currentRules, newRule],
    });
  };

  const handleDeleteRule = (id: string) => {
    setPricingRules({
      ...pricingRules,
      [selectedUserType]: currentRules.filter(rule => rule.id !== id),
    });
    toast.success("Đã xóa quy tắc");
  };

  const handleUpdateRule = (id: string, field: keyof PricingRule, value: number) => {
    setPricingRules({
      ...pricingRules,
      [selectedUserType]: currentRules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      ),
    });
  };

  const handleSave = () => {
    let allValid = true;
    for (const rule of currentRules) {
      if (!validateRule(rule)) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      toast.error("Vui lòng kiểm tra lại các trường có lỗi");
      return;
    }

    // Check for overlapping time ranges
    for (let i = 0; i < currentRules.length; i++) {
      for (let j = i + 1; j < currentRules.length; j++) {
        const r1 = currentRules[i];
        const r2 = currentRules[j];
        if (
          (r1.timeRangeStart < r2.timeRangeEnd && r1.timeRangeEnd > r2.timeRangeStart) ||
          (r2.timeRangeStart < r1.timeRangeEnd && r2.timeRangeEnd > r1.timeRangeStart)
        ) {
          toast.error("Các khoảng thời gian không được chồng lấn");
          return;
        }
      }
    }

    toast.success("Đã lưu cấu hình giá");
  };

  const getUserTypeLabel = (type: UserType) => {
    const labels = {
      student: "Sinh viên",
      staff: "Giảng viên/Cán bộ",
      visitor: "Khách",
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cấu hình giá gửi xe theo thời gian và loại người dùng
          </p>
        </div>
      </div>

      {/* User Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn loại người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedUserType}
            onValueChange={(value) => setSelectedUserType(value as UserType)}
          >
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Sinh viên</SelectItem>
              <SelectItem value="staff">Giảng viên/Cán bộ</SelectItem>
              <SelectItem value="visitor">Khách</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            Hiện đang cấu hình giá cho: <span className="font-semibold">{getUserTypeLabel(selectedUserType)}</span>
          </p>
        </CardContent>
      </Card>

      {/* Pricing Rules Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bảng cấu hình giá</CardTitle>
            <Button onClick={handleAddRule} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm quy tắc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khoảng thời gian (giờ)</TableHead>
                <TableHead>Giá theo giờ (VNĐ)</TableHead>
                <TableHead>Giá tối đa/ngày (VNĐ)</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <Input
                          type="number"
                          value={rule.timeRangeStart}
                          onChange={(e) =>
                            handleUpdateRule(rule.id, "timeRangeStart", parseInt(e.target.value))
                          }
                          className={`w-20 ${errors[`${rule.id}-start`] || errors[`${rule.id}-range`] ? "border-[#DC3545]" : ""}`}
                          min={0}
                          max={23}
                        />
                      </div>
                      <span>-</span>
                      <div>
                        <Input
                          type="number"
                          value={rule.timeRangeEnd}
                          onChange={(e) =>
                            handleUpdateRule(rule.id, "timeRangeEnd", parseInt(e.target.value))
                          }
                          className={`w-20 ${errors[`${rule.id}-end`] || errors[`${rule.id}-range`] ? "border-[#DC3545]" : ""}`}
                          min={1}
                          max={24}
                        />
                      </div>
                      <span>giờ</span>
                    </div>
                    {(errors[`${rule.id}-start`] || errors[`${rule.id}-end`] || errors[`${rule.id}-range`]) && (
                      <p className="text-xs text-[#DC3545] mt-1">
                        {errors[`${rule.id}-start`] || errors[`${rule.id}-end`] || errors[`${rule.id}-range`]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={rule.pricePerHour}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, "pricePerHour", parseInt(e.target.value))
                      }
                      className={`w-32 ${errors[`${rule.id}-price`] ? "border-[#DC3545]" : ""}`}
                      min={0}
                    />
                    {errors[`${rule.id}-price`] && (
                      <p className="text-xs text-[#DC3545] mt-1">{errors[`${rule.id}-price`]}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={rule.maxPerDay}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, "maxPerDay", parseInt(e.target.value))
                      }
                      className={`w-32 ${errors[`${rule.id}-max`] ? "border-[#DC3545]" : ""}`}
                      min={0}
                    />
                    {errors[`${rule.id}-max`] && (
                      <p className="text-xs text-[#DC3545] mt-1">{errors[`${rule.id}-max`]}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {currentRules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có quy tắc nào. Nhấn "Thêm quy tắc" để bắt đầu.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Calculation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Ví dụ tính phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-900">
            <p className="font-medium">Với cấu hình hiện tại cho {getUserTypeLabel(selectedUserType)}:</p>
            <ul className="list-disc list-inside space-y-2">
              {currentRules.map((rule, index) => (
                <li key={index}>
                  Gửi xe từ {rule.timeRangeStart}h đến {rule.timeRangeEnd}h:{" "}
                  <span className="font-semibold">{rule.pricePerHour.toLocaleString('vi-VN')} VNĐ/giờ</span>
                  {" "}(Tối đa {rule.maxPerDay.toLocaleString('vi-VN')} VNĐ/ngày)
                </li>
              ))}
            </ul>
            <p className="text-xs pt-2 border-t border-blue-300">
              <strong>Lưu ý:</strong> Các khoảng thời gian không được chồng lấn lên nhau.
              Giá tối đa/ngày sẽ được áp dụng khi tổng phí vượt quá mức này.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#003366] hover:bg-[#002244]">
          <Save className="w-4 h-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
