import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  Eye,
  MapPinned,
  RefreshCw,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

type SlotStatus = "available" | "occupied" | "warning" | "maintenance";

type SlotItem = {
  code: string;
  floor: string;
  zone: string;
  lastUpdate: string;
  status: SlotStatus;
  note?: string;
};

const slotSeed: SlotItem[] = [
  { code: "A-01", floor: "Tầng 1", zone: "Khu A", status: "occupied", lastUpdate: "19:21", note: "Xe ra vào bình thường" },
  { code: "A-02", floor: "Tầng 1", zone: "Khu A", status: "available", lastUpdate: "19:20" },
  { code: "A-03", floor: "Tầng 1", zone: "Khu A", status: "warning", lastUpdate: "19:19", note: "Cảm biến dao động trạng thái" },
  { code: "A-04", floor: "Tầng 1", zone: "Khu A", status: "maintenance", lastUpdate: "18:58", note: "Đang kiểm tra đầu đọc" },
  { code: "A-05", floor: "Tầng 1", zone: "Khu A", status: "occupied", lastUpdate: "19:18" },
  { code: "A-06", floor: "Tầng 1", zone: "Khu A", status: "available", lastUpdate: "19:18" },
  { code: "B-01", floor: "Tầng 1", zone: "Khu B", status: "occupied", lastUpdate: "19:17" },
  { code: "B-02", floor: "Tầng 1", zone: "Khu B", status: "warning", lastUpdate: "19:16", note: "Mất heartbeat 2 lần" },
  { code: "B-03", floor: "Tầng 1", zone: "Khu B", status: "occupied", lastUpdate: "19:15" },
  { code: "B-04", floor: "Tầng 1", zone: "Khu B", status: "available", lastUpdate: "19:14" },
  { code: "C-01", floor: "Tầng 2", zone: "Khu C", status: "available", lastUpdate: "19:13" },
  { code: "C-02", floor: "Tầng 2", zone: "Khu C", status: "occupied", lastUpdate: "19:13" },
  { code: "C-03", floor: "Tầng 2", zone: "Khu C", status: "available", lastUpdate: "19:12" },
  { code: "C-04", floor: "Tầng 2", zone: "Khu C", status: "warning", lastUpdate: "19:11", note: "Sai lệch dữ liệu hình ảnh và cảm biến" },
  { code: "C-05", floor: "Tầng 2", zone: "Khu C", status: "occupied", lastUpdate: "19:10" },
  { code: "C-06", floor: "Tầng 2", zone: "Khu C", status: "maintenance", lastUpdate: "18:45", note: "Ngắt nguồn để kiểm tra" },
];

const alerts = [
  { id: 1, title: "03 ô cần kiểm tra", description: "A-03, B-02 và C-04 có tín hiệu không ổn định.", tone: "warning" },
  { id: 2, title: "01 ô đang bảo trì", description: "A-04 đang được kỹ thuật xử lý, chưa mở lại cho người dùng.", tone: "default" },
  { id: 3, title: "Lần đồng bộ gần nhất", description: "19:21 hôm nay · nguồn dữ liệu từ gateway tầng 1.", tone: "neutral" },
];

export function ParkingLotDetail() {
  const [floor, setFloor] = useState("Tất cả");
  const [zone, setZone] = useState("Tất cả");
  const [showWarningsOnly, setShowWarningsOnly] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotItem>(slotSeed[2]);

  const filteredSlots = useMemo(() => {
    return slotSeed.filter((slot) => {
      const matchesFloor = floor === "Tất cả" || slot.floor === floor;
      const matchesZone = zone === "Tất cả" || slot.zone === zone;
      const matchesWarning = !showWarningsOnly || slot.status === "warning";
      return matchesFloor && matchesZone && matchesWarning;
    });
  }, [floor, zone, showWarningsOnly]);

  const counts = useMemo(() => {
    return slotSeed.reduce(
      (acc, slot) => {
        acc[slot.status] += 1;
        return acc;
      },
      { available: 0, occupied: 0, warning: 0, maintenance: 0 },
    );
  }, []);

  const statusMeta = (status: SlotStatus) => {
    switch (status) {
      case "available":
        return {
          label: "Trống",
          card: "bg-green-50 text-green-800 border-green-200",
          tile: "bg-[#28A745] text-white hover:shadow-md",
        };
      case "occupied":
        return {
          label: "Có xe",
          card: "bg-red-50 text-red-800 border-red-200",
          tile: "bg-[#DC3545] text-white hover:shadow-md",
        };
      case "warning":
        return {
          label: "Cần kiểm tra",
          card: "bg-amber-50 text-amber-800 border-amber-200",
          tile: "bg-[#FFC107] text-[#333333] hover:shadow-md",
        };
      default:
        return {
          label: "Bảo trì",
          card: "bg-slate-100 text-slate-800 border-slate-200",
          tile: "bg-slate-400 text-white hover:shadow-md",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333333]">Chi tiết bãi xe</h1>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi tình trạng từng ô đỗ, cảnh báo tại chỗ và thao tác ghi đè thủ công khi cần.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">Gần đầy</Badge>
          <Button variant="outline">
            <MapPinned className="h-4 w-4" />
            Quay lại bản đồ
          </Button>
          <Button className="bg-[#0055A4] hover:bg-[#004080]">
            <RefreshCw className="h-4 w-4" />
            Tải lại dữ liệu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-gray-500">Ô trống</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{counts.available}</div></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-gray-500">Ô có xe</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{counts.occupied}</div></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-gray-500">Ô cảnh báo</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{counts.warning}</div></CardContent></Card>
        <Card className="bg-white shadow-sm"><CardContent className="p-5"><div className="text-sm text-gray-500">Ô bảo trì</div><div className="mt-2 text-3xl font-semibold text-[#333333]">{counts.maintenance}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_360px]">
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle>Sơ đồ ô đỗ · Bãi A</CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Hiển thị theo tầng, khu vực và chế độ lọc chỉ các ô đang cần xử lý.
                </p>
              </div>
              <div className="space-y-3">
                <Tabs value={floor} onValueChange={setFloor} className="w-full">
                  <TabsList className="w-full justify-start overflow-auto">
                    {["Tất cả", "Tầng 1", "Tầng 2"].map((item) => (
                      <TabsTrigger key={item} value={item} className="px-4">{item}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <div className="flex flex-wrap gap-2">
                  {["Tất cả", "Khu A", "Khu B", "Khu C"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setZone(item)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        zone === item
                          ? "border-[#0055A4] bg-[#EAF2FB] text-[#0055A4]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowWarningsOnly((value) => !value)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      showWarningsOnly
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Chỉ slot lỗi
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
              {filteredSlots.map((slot) => {
                const meta = statusMeta(slot.status);
                const active = selectedSlot.code === slot.code;
                return (
                  <button
                    key={slot.code}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-[#0055A4] ring-2 ring-[#B7D1EE]"
                        : "border-transparent"
                    } ${meta.tile}`}
                  >
                    <div className="text-xs font-medium opacity-80">{slot.zone}</div>
                    <div className="mt-2 text-lg font-semibold">{slot.code}</div>
                    <div className="mt-3 text-xs opacity-85">Cập nhật: {slot.lastUpdate}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {(["available", "occupied", "warning", "maintenance"] as SlotStatus[]).map((status) => {
                const meta = statusMeta(status);
                return (
                  <div key={status} className={`rounded-xl border px-4 py-3 text-sm ${meta.card}`}>
                    {meta.label}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Cảnh báo & chi tiết slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${item.tone === "warning" ? "bg-amber-50 text-amber-600" : item.tone === "default" ? "bg-blue-50 text-[#0055A4]" : "bg-slate-100 text-slate-600"}`}>
                      {item.tone === "warning" ? <AlertTriangle className="h-4 w-4" /> : item.tone === "default" ? <ShieldAlert className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#333333]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Ô đang chọn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`rounded-2xl border p-4 ${statusMeta(selectedSlot.status).card}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm opacity-80">Mã ô</div>
                    <div className="mt-1 text-2xl font-semibold">{selectedSlot.code}</div>
                  </div>
                  <Badge className={statusMeta(selectedSlot.status).card}>{statusMeta(selectedSlot.status).label}</Badge>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 text-sm text-gray-600">
                <div className="flex items-center justify-between py-2"><span>Tầng</span><span className="font-medium text-[#333333]">{selectedSlot.floor}</span></div>
                <div className="flex items-center justify-between py-2"><span>Khu vực</span><span className="font-medium text-[#333333]">{selectedSlot.zone}</span></div>
                <div className="flex items-center justify-between py-2"><span>Cập nhật cuối</span><span className="font-medium text-[#333333]">{selectedSlot.lastUpdate}</span></div>
                <div className="border-t border-dashed border-gray-200 pt-3 text-xs leading-5 text-gray-500">
                  {selectedSlot.note ?? "Không có ghi chú bổ sung cho slot này."}
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7F9FC] p-4 text-sm text-gray-600">
                Chọn thao tác phù hợp để xem lịch sử cảm biến hoặc mở quy trình ghi đè thủ công cho ô này.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-[#0055A4] hover:bg-[#004080]">
                  <Wrench className="h-4 w-4" />
                  Ghi đè trạng thái
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4" />
                  Xem lịch sử
                </Button>
                <Button variant="outline" className="col-span-2 justify-between">
                  Mở ticket kỹ thuật
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
