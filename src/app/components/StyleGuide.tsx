import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function StyleGuide() {
  return (
    <div className="space-y-6 p-6 bg-white">
      <div>
        <h1 className="text-2xl font-bold mb-2">IoT-SPMS Style Guide</h1>
        <p className="text-gray-600">Hướng dẫn thiết kế cho hệ thống quản lý bãi xe thông minh</p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng màu chủ đạo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#0055A4] rounded-lg"></div>
              <div className="text-sm font-medium">Primary</div>
              <div className="text-xs text-gray-500">#0055A4</div>
              <div className="text-xs text-gray-600">Xanh dương ĐHBK</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#28A745] rounded-lg"></div>
              <div className="text-sm font-medium">Success</div>
              <div className="text-xs text-gray-500">#28A745</div>
              <div className="text-xs text-gray-600">Bình thường, Online</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#FFC107] rounded-lg"></div>
              <div className="text-sm font-medium">Warning</div>
              <div className="text-xs text-gray-500">#FFC107</div>
              <div className="text-xs text-gray-600">Cảnh báo trung bình</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#DC3545] rounded-lg"></div>
              <div className="text-sm font-medium">Danger</div>
              <div className="text-xs text-gray-500">#DC3545</div>
              <div className="text-xs text-gray-600">Nguy hiểm, Offline</div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#F5F5F5] rounded-lg border"></div>
              <div className="text-sm font-medium">Background</div>
              <div className="text-xs text-gray-500">#F5F5F5</div>
              <div className="text-xs text-gray-600">Nền card</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Font chữ - Inter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-semibold mb-1">Tiêu đề chính - 24px</div>
            <div className="text-xs text-gray-500">font-size: 24px, font-weight: 600</div>
          </div>
          <div>
            <div className="text-xl font-semibold mb-1">Tiêu đề phụ - 18px</div>
            <div className="text-xs text-gray-500">font-size: 18px, font-weight: 600</div>
          </div>
          <div>
            <div className="text-base mb-1">Nội dung bình thường - 14px (base)</div>
            <div className="text-xs text-gray-500">font-size: 14px, font-weight: 400</div>
          </div>
          <div>
            <div className="text-sm mb-1">Chú thích nhỏ - 12px</div>
            <div className="text-xs text-gray-500">font-size: 12px, font-weight: 400</div>
          </div>
        </CardContent>
      </Card>

      {/* Components */}
      <Card>
        <CardHeader>
          <CardTitle>Components cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Cards với viền bo góc 8px:</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white border rounded-lg shadow-sm">Card mẫu</div>
              <div className="p-4 bg-white border rounded-lg shadow-md">Card với shadow</div>
              <div className="p-4 bg-gray-50 border rounded-lg">Card với nền xám</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
