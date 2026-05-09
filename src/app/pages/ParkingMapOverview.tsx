import { useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  Car,
  Clock3,
  Filter,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  TriangleAlert,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

type LotStatus =
  | "available"
  | "nearly-full"
  | "full"
  | "maintenance";
type LotSize = "regular" | "compact";

type ParkingLot = {
  id: string;
  name: string;
  area: string;
  available: number;
  total: number;
  entry: string;
  eta: string;
  status: LotStatus;
  top: string;
  left: string;
  size?: LotSize;
};

const lots: ParkingLot[] = [
  {
    id: "A",
    name: "Bãi A",
    area: "Khu nhà A1",
    available: 42,
    total: 80,
    entry: "Cổng phía Đông",
    eta: "2 phút",
    status: "available",
    top: "8%",
    left: "8%",
  },
  {
    id: "B",
    name: "Bãi B",
    area: "Khu nhà B2",
    available: 11,
    total: 64,
    entry: "Cổng trung tâm",
    eta: "4 phút",
    status: "nearly-full",
    top: "8%",
    left: "58%",
  },
  {
    id: "C",
    name: "Bãi C",
    area: "Sau thư viện",
    available: 0,
    total: 48,
    entry: "Cổng phía Tây",
    eta: "6 phút",
    status: "full",
    top: "52%",
    left: "16%",
  },
  {
    id: "D",
    name: "Bãi D",
    area: "Nhà thi đấu",
    available: 24,
    total: 60,
    entry: "Cổng ký túc xá",
    eta: "5 phút",
    status: "available",
    top: "52%",
    left: "60%",
  },
  {
    id: "VIP",
    name: "Bãi VIP",
    area: "Khối hành chính",
    available: 6,
    total: 12,
    entry: "Cổng nội bộ",
    eta: "1 phút",
    status: "maintenance",
    top: "30%",
    left: "38%",
    size: "compact",
  },
];

const realtimeEvents = [
  {
    id: 1,
    title: "Bãi B chuyển sang mức gần đầy",
    time: "1 phút trước",
    tone: "warning",
  },
  {
    id: 2,
    title: "Cảm biến C-08 mất heartbeat",
    time: "3 phút trước",
    tone: "danger",
  },
  {
    id: 3,
    title: "Điều hướng sang Bãi D cho 4 xe mới",
    time: "5 phút trước",
    tone: "default",
  },
];

const suggestions = [
  {
    from: "Bãi B",
    to: "Bãi A",
    reason: "Còn 42 chỗ trống, khoảng cách gần",
  },
  {
    from: "Bãi C",
    to: "Bãi D",
    reason: "Lưu lượng thấp hơn ở khung giờ hiện tại",
  },
];

export function ParkingMapOverview() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | LotStatus
  >("all");

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesSearch = `${lot.name} ${lot.area}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || lot.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totals = useMemo(() => {
    const total = lots.reduce((sum, lot) => sum + lot.total, 0);
    const available = lots.reduce(
      (sum, lot) => sum + lot.available,
      0,
    );
    const occupied = total - available;
    return { total, available, occupied };
  }, []);

  const getStatusMeta = (status: LotStatus) => {
    switch (status) {
      case "available":
        return {
          label: "Còn chỗ",
          chip: "bg-green-50 text-green-700 border-green-200",
          block:
            "bg-green-100/90 border-green-300 text-green-950",
          dot: "bg-[#28A745]",
        };
      case "nearly-full":
        return {
          label: "Gần đầy",
          chip: "bg-amber-50 text-amber-700 border-amber-200",
          block:
            "bg-amber-100/90 border-amber-300 text-amber-950",
          dot: "bg-[#FFC107]",
        };
      case "full":
        return {
          label: "Hết chỗ",
          chip: "bg-red-50 text-red-700 border-red-200",
          block: "bg-red-100/90 border-red-300 text-red-950",
          dot: "bg-[#DC3545]",
        };
      default:
        return {
          label: "Bảo trì",
          chip: "bg-slate-100 text-slate-700 border-slate-200",
          block:
            "bg-slate-100/95 border-slate-300 text-slate-900",
          dot: "bg-slate-500",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333333]">
            Bản đồ bãi xe
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi trạng thái từng bãi theo thời gian thực,
            kèm gợi ý điều hướng khi một khu sắp đầy.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bãi xe hoặc khu vực..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="justify-start">
            <Filter className="h-4 w-4" />
            Bộ lọc nâng cao
          </Button>
          <Button className="bg-[#0055A4] hover:bg-[#004080]">
            <RefreshCw className="h-4 w-4" />
            Đồng bộ realtime
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-50 p-3 text-[#0055A4]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#333333]">
                {lots.length}
              </div>
              <p className="text-sm text-gray-500">
                Bãi đang giám sát
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-green-50 p-3 text-[#28A745]">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#333333]">
                {totals.available}
              </div>
              <p className="text-sm text-gray-500">
                Chỗ trống toàn khuôn viên
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-50 p-3 text-[#FFC107]">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#333333]">
                {totals.occupied}
              </div>
              <p className="text-sm text-gray-500">
                Chỗ đang sử dụng
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-50 p-3 text-[#DC3545]">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#333333]">
                {realtimeEvents.length}
              </div>
              <p className="text-sm text-gray-500">
                Sự kiện cần lưu ý
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Card className="overflow-hidden bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Sơ đồ khuôn viên và trạng thái bãi xe
                </CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Nhấn vào từng bãi để điều hướng sang màn hình
                  chi tiết hoặc kiểm tra năng lực tiếp nhận.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "available", label: "Còn chỗ" },
                  { key: "nearly-full", label: "Gần đầy" },
                  { key: "full", label: "Hết chỗ" },
                  { key: "maintenance", label: "Bảo trì" },
                ].map((item) => {
                  const active = statusFilter === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setStatusFilter(
                          item.key as typeof statusFilter,
                        )
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                        active
                          ? "border-[#0055A4] bg-[#EAF2FB] text-[#0055A4]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
              <div className="rounded-2xl border border-gray-200 bg-[#F7F9FC] p-3 sm:p-5">
                <div className="relative h-[400px] sm:h-[500px] lg:h-[560px] overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-[linear-gradient(90deg,#eef2f7_1px,transparent_1px),linear-gradient(#eef2f7_1px,transparent_1px)] bg-[size:28px_28px] bg-white">
                  <div className="absolute left-[5%] top-[10%] h-[8%] w-[88%] rounded-full bg-gray-100" />
                  <div className="absolute left-[6%] top-[70%] h-[8%] w-[84%] rounded-full bg-gray-100" />
                  <div className="absolute left-[43%] top-[16%] h-[56%] w-[12%] rounded-full bg-gray-100" />

                  <div className="absolute left-[7%] top-[86%] rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                    Cổng chính
                  </div>
                  <div className="absolute right-[6%] top-[10%] rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                    Thư viện / Nhà học
                  </div>
                  <div className="absolute left-[45%] top-[6%] -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                    Trục đường trung tâm
                  </div>

                  {filteredLots.map((lot) => {
                    const meta = getStatusMeta(lot.status);
                    const fillRatio = Math.round(
                      (lot.available / lot.total) * 100,
                    );
                    const isCompact = lot.size === "compact";

                    return (
                      <button
                        key={lot.id}
                        type="button"
                        className={`absolute rounded-xl sm:rounded-2xl border text-left shadow-sm transition-transform duration-200 hover:z-10 hover:-translate-y-1 hover:shadow-md ${meta.block} ${
                          isCompact
                            ? "w-32 sm:w-44 px-3 sm:px-4 py-3 sm:py-4"
                            : "w-40 sm:w-52 px-3 sm:px-5 py-3 sm:py-5"
                        }`}
                        style={{ top: lot.top, left: lot.left }}
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <div className="text-base sm:text-lg font-semibold leading-tight">
                              {lot.name}
                            </div>
                            <div className="mt-1 text-xs sm:text-sm opacity-80 truncate">
                              {lot.area}
                            </div>
                          </div>
                          <span
                            className={`mt-1 h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full ${meta.dot}`}
                          />
                        </div>
                        <div className="mt-3 sm:mt-5 flex items-end gap-1 sm:gap-2">
                          <span className="text-2xl sm:text-4xl font-semibold leading-none">
                            {lot.available}
                          </span>
                          <span className="pb-0.5 sm:pb-1 text-sm sm:text-base opacity-80">
                            / {lot.total}
                          </span>
                        </div>
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-80">
                          {meta.label} · {fillRatio}%
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#28A745]" />{" "}
                    Còn chỗ
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#FFC107]" />{" "}
                    Gần đầy
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#DC3545]" />{" "}
                    Hết chỗ
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-slate-500" />{" "}
                    <span className="hidden sm:inline">Bảo trì / hạn chế truy cập</span>
                    <span className="sm:hidden">Bảo trì</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <Card className="border border-gray-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Gợi ý điều hướng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {suggestions.map((item) => (
                      <div
                        key={`${item.from}-${item.to}`}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-[#333333]">
                              {item.from} → {item.to}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.reason}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Danh sách bãi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filteredLots.map((lot) => {
                      const meta = getStatusMeta(lot.status);
                      return (
                        <div
                          key={`list-${lot.id}`}
                          className="rounded-xl border border-gray-100 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-[#333333]">
                                {lot.name}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {lot.area}
                              </div>
                            </div>
                            <Badge className={meta.chip}>
                              {meta.label}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1.5">
                              <Navigation className="h-4 w-4" />{" "}
                              {lot.entry}
                            </span>
                            <span>{lot.eta}</span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Phản hồi realtime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {realtimeEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        event.tone === "danger"
                          ? "bg-red-50 text-red-600"
                          : event.tone === "warning"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-[#0055A4]"
                      }`}
                    >
                      {event.tone === "danger" ? (
                        <TriangleAlert className="h-4 w-4" />
                      ) : (
                        <BellRing className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#333333]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Trạng thái kết nối</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                <div>
                  <div className="text-sm font-medium text-green-800">
                    Thiết bị online
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-green-900">
                    84
                  </div>
                </div>
                <Wifi className="h-5 w-5 text-green-700" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
                <div>
                  <div className="text-sm font-medium text-red-800">
                    Thiết bị offline
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-red-900">
                    3
                  </div>
                </div>
                <WifiOff className="h-5 w-5 text-red-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}