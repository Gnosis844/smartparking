import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useParkingData } from "../contexts/ParkingContext";
import { toast } from "sonner";
import {
  DoorOpen,
  DoorClosed,
  Camera,
  CreditCard,
  Car,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Wifi,
  WifiOff,
  Ticket,
  ShieldCheck,
  TriangleAlert,
  LogIn,
} from "lucide-react";

type GateStatus = "open" | "closed" | "error";
type VehicleType = "motorbike" | "car" | "truck";
type AuthMethod = "rfid" | "ticket" | "manual";
type EntryResult = "success" | "failed" | "pending";

interface EntryRecord {
  id: number;
  time: string;
  plate: string;
  vehicleType: VehicleType;
  authMethod: AuthMethod;
  cardId?: string;
  ticketId?: string;
  result: EntryResult;
  lane: string;
  spotAssigned?: string;
}

interface QueuedVehicle {
  id: number;
  plate: string;
  vehicleType: VehicleType;
  waitTime: string;
}

const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  motorbike: "Xe máy",
  car: "Ô tô",
  truck: "Xe tải",
};

const AUTH_METHOD_LABEL: Record<AuthMethod, string> = {
  rfid: "Thẻ RFID",
  ticket: "Vé giấy",
  manual: "Thủ công",
};

const mockRecentEntries: EntryRecord[] = [
  {
    id: 1,
    time: "08:47:22",
    plate: "51F-248.93",
    vehicleType: "car",
    authMethod: "rfid",
    cardId: "RFID-004821",
    result: "success",
    lane: "Làn 1",
    spotAssigned: "A-12",
  },
  {
    id: 2,
    time: "08:45:11",
    plate: "59N-321.45",
    vehicleType: "motorbike",
    authMethod: "rfid",
    cardId: "RFID-001234",
    result: "success",
    lane: "Làn 2",
    spotAssigned: "B-07",
  },
  {
    id: 3,
    time: "08:42:05",
    plate: "51A-999.88",
    vehicleType: "car",
    authMethod: "rfid",
    cardId: "RFID-009912",
    result: "failed",
    lane: "Làn 1",
  },
  {
    id: 4,
    time: "08:39:30",
    plate: "50H-112.67",
    vehicleType: "motorbike",
    authMethod: "ticket",
    ticketId: "TK-20240412-0031",
    result: "success",
    lane: "Làn 2",
    spotAssigned: "C-03",
  },
  {
    id: 5,
    time: "08:36:14",
    plate: "51B-456.21",
    vehicleType: "car",
    authMethod: "rfid",
    cardId: "RFID-005678",
    result: "success",
    lane: "Làn 1",
    spotAssigned: "A-05",
  },
  {
    id: 6,
    time: "08:33:02",
    plate: "59P-789.34",
    vehicleType: "truck",
    authMethod: "manual",
    result: "success",
    lane: "Làn 1",
    spotAssigned: "D-01",
  },
  {
    id: 7,
    time: "08:30:50",
    plate: "51F-000.11",
    vehicleType: "motorbike",
    authMethod: "rfid",
    cardId: "RFID-007743",
    result: "failed",
    lane: "Làn 2",
  },
  {
    id: 8,
    time: "08:28:19",
    plate: "51C-234.56",
    vehicleType: "car",
    authMethod: "rfid",
    cardId: "RFID-002341",
    result: "success",
    lane: "Làn 1",
    spotAssigned: "B-14",
  },
];

const mockQueue: QueuedVehicle[] = [
  { id: 1, plate: "51K-321.10", vehicleType: "motorbike", waitTime: "0:12" },
  { id: 2, plate: "50G-987.65", vehicleType: "car", waitTime: "0:45" },
  { id: 3, plate: "59S-111.22", vehicleType: "motorbike", waitTime: "1:02" },
];

// ─── Simulated "current vehicle at gate" states ──────────────────────────────
type ScanState = "idle" | "detecting" | "verifying" | "approved" | "rejected";

const scanSequence: ScanState[] = ["idle", "detecting", "verifying", "approved"];
const rejectSequence: ScanState[] = ["idle", "detecting", "verifying", "rejected"];

export function EntryGate() {
  const { decreaseSpots } = useParkingData(); // MVP: Use parking context
  const [gateStatus, setGateStatus] = useState<GateStatus>("closed");
  const [lane1Status, setLane1Status] = useState<GateStatus>("closed");
  const [lane2Status, setLane2Status] = useState<GateStatus>("closed");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [currentPlate, setCurrentPlate] = useState("51F-248.93");
  const [currentCardId, setCurrentCardId] = useState("RFID-004821");
  const [currentVehicleType, setCurrentVehicleType] = useState<VehicleType>("car");
  const [selectedLane, setSelectedLane] = useState<"1" | "2">("1");
  const [entries, setEntries] = useState<EntryRecord[]>(mockRecentEntries);
  const [queue, setQueue] = useState<QueuedVehicle[]>(mockQueue);
  const [todayCount, setTodayCount] = useState(127);
  const [cameraOnline, setCameraOnline] = useState(true);
  const [rfidOnline, setRfidOnline] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Simulate a scan sequence
  const runScan = (sequence: ScanState[]) => {
    let i = 0;
    const step = () => {
      if (i < sequence.length) {
        setScanState(sequence[i]);
        i++;
        setTimeout(step, 900);
      }
    };
    step();
  };

  const handleSimulateEntry = () => {
    runScan(scanSequence);
    setTimeout(() => {
      setGateStatus("open");
      if (selectedLane === "1") setLane1Status("open");
      else setLane2Status("open");
      setTodayCount((c) => c + 1);

      // MVP: Decrease available spots
      decreaseSpots();
      toast.success("Xe vào thành công! Barrier đang mở, số chỗ trống giảm 1.", {
        style: { background: '#28A745', color: 'white', border: 'none' }
      });

      const newEntry: EntryRecord = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        plate: currentPlate,
        vehicleType: currentVehicleType,
        authMethod: "rfid",
        cardId: currentCardId,
        result: "success",
        lane: `Làn ${selectedLane}`,
        spotAssigned: `A-${Math.floor(Math.random() * 30) + 1}`,
      };
      setEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
      // Remove first from queue if any
      setQueue((q) => q.slice(1));
      setTimeout(() => {
        setGateStatus("closed");
        if (selectedLane === "1") setLane1Status("closed");
        else setLane2Status("closed");
        setScanState("idle");
      }, 3000);
    }, 2700);
  };

  const handleSimulateReject = () => {
    runScan(rejectSequence);
    setTimeout(() => {
      const newEntry: EntryRecord = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        plate: currentPlate,
        vehicleType: currentVehicleType,
        authMethod: "rfid",
        cardId: currentCardId,
        result: "failed",
        lane: `Làn ${selectedLane}`,
      };
      setEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
      setTimeout(() => setScanState("idle"), 2000);
    }, 2700);
  };

  const handleManualOpen = () => {
    setGateStatus("open");
    if (selectedLane === "1") setLane1Status("open");
    else setLane2Status("open");
    const newEntry: EntryRecord = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      plate: currentPlate || "—",
      vehicleType: currentVehicleType,
      authMethod: "manual",
      result: "success",
      lane: `Làn ${selectedLane}`,
      spotAssigned: `B-${Math.floor(Math.random() * 20) + 1}`,
    };
    setEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
    setTodayCount((c) => c + 1);
    setTimeout(() => {
      setGateStatus("closed");
      if (selectedLane === "1") setLane1Status("closed");
      else setLane2Status("closed");
    }, 4000);
  };

  const handleManualClose = () => {
    setGateStatus("closed");
    setLane1Status("closed");
    setLane2Status("closed");
  };

  const getGateColor = (status: GateStatus) => {
    switch (status) {
      case "open": return "text-[#28A745]";
      case "closed": return "text-[#DC3545]";
      case "error": return "text-[#FFC107]";
    }
  };

  const getGateBg = (status: GateStatus) => {
    switch (status) {
      case "open": return "bg-green-50 border-green-200";
      case "closed": return "bg-red-50 border-red-200";
      case "error": return "bg-yellow-50 border-yellow-200";
    }
  };

  const getScanBg = () => {
    switch (scanState) {
      case "approved": return "border-green-400 bg-green-50";
      case "rejected": return "border-red-400 bg-red-50";
      case "verifying": return "border-blue-400 bg-blue-50";
      case "detecting": return "border-yellow-400 bg-yellow-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getScanLabel = () => {
    switch (scanState) {
      case "idle": return { label: "Chờ xe vào...", color: "text-gray-500", icon: <Clock className="w-5 h-5" /> };
      case "detecting": return { label: "Đang phát hiện xe...", color: "text-yellow-600", icon: <Car className="w-5 h-5 animate-pulse" /> };
      case "verifying": return { label: "Đang xác thực thẻ...", color: "text-blue-600", icon: <CreditCard className="w-5 h-5 animate-pulse" /> };
      case "approved": return { label: "Xe được phép vào!", color: "text-green-600", icon: <CheckCircle2 className="w-5 h-5" /> };
      case "rejected": return { label: "Từ chối! Thẻ không hợp lệ", color: "text-red-600", icon: <XCircle className="w-5 h-5" /> };
    }
  };

  const scanInfo = getScanLabel();

  const getResultBadge = (result: EntryResult) => {
    switch (result) {
      case "success": return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Vào thành công</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Từ chối</Badge>;
      case "pending": return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">Chờ xử lý</Badge>;
    }
  };

  const getAuthIcon = (method: AuthMethod) => {
    switch (method) {
      case "rfid": return <CreditCard className="w-3.5 h-3.5" />;
      case "ticket": return <Ticket className="w-3.5 h-3.5" />;
      case "manual": return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <LogIn className="w-6 h-6 text-[#0055A4]" />
            Cổng vào – Entry Gate
          </h1>
          <p className="text-sm text-gray-500 mt-1">Giám sát & điều khiển cổng vào bãi xe</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-semibold text-[#0055A4]">{formatTime(currentTime)}</div>
            <div className="text-xs text-gray-500">
              {currentTime.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Xe vào hôm nay</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{todayCount}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-[#0055A4]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Hàng chờ</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{queue.length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Camera</p>
                <p className={`text-sm font-semibold mt-1 ${cameraOnline ? "text-green-600" : "text-red-600"}`}>
                  {cameraOnline ? "Trực tuyến" : "Ngoại tuyến"}
                </p>
              </div>
              <button
                onClick={() => setCameraOnline((v) => !v)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${cameraOnline ? "bg-green-50" : "bg-red-50"}`}
                title="Toggle camera status (demo)"
              >
                {cameraOnline ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-500" />}
              </button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Đầu đọc RFID</p>
                <p className={`text-sm font-semibold mt-1 ${rfidOnline ? "text-green-600" : "text-red-600"}`}>
                  {rfidOnline ? "Trực tuyến" : "Ngoại tuyến"}
                </p>
              </div>
              <button
                onClick={() => setRfidOnline((v) => !v)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${rfidOnline ? "bg-green-50" : "bg-red-50"}`}
                title="Toggle RFID reader status (demo)"
              >
                <CreditCard className={`w-5 h-5 ${rfidOnline ? "text-green-600" : "text-red-500"}`} />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Camera + Detection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Lane selector + Gate controls */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base">Điều khiển cổng vào</CardTitle>
                {/* Lane Tabs */}
                <div className="flex gap-2">
                  {(["1", "2"] as const).map((lane) => (
                    <button
                      key={lane}
                      onClick={() => setSelectedLane(lane)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        selectedLane === lane
                          ? "bg-[#0055A4] text-white border-[#0055A4]"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      Làn {lane}
                      <span
                        className={`ml-1.5 inline-block w-2 h-2 rounded-full ${
                          (lane === "1" ? lane1Status : lane2Status) === "open"
                            ? "bg-green-400"
                            : (lane === "1" ? lane1Status : lane2Status) === "error"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gate Status Banner */}
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${getGateBg(gateStatus)}`}>
                <div className="flex items-center gap-3">
                  {gateStatus === "open" ? (
                    <DoorOpen className={`w-8 h-8 ${getGateColor(gateStatus)}`} />
                  ) : gateStatus === "error" ? (
                    <AlertCircle className={`w-8 h-8 ${getGateColor(gateStatus)}`} />
                  ) : (
                    <DoorClosed className={`w-8 h-8 ${getGateColor(gateStatus)}`} />
                  )}
                  <div>
                    <div className={`font-semibold ${getGateColor(gateStatus)}`}>
                      Barrier – Làn {selectedLane}:{" "}
                      {gateStatus === "open" ? "Đang mở" : gateStatus === "error" ? "Lỗi" : "Đang đóng"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Cổng vào chính – Bãi xe HCMUT
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleManualOpen}
                    disabled={gateStatus === "open"}
                    className="bg-[#28A745] hover:bg-[#218838] text-white"
                  >
                    <DoorOpen className="w-4 h-4 mr-1" />
                    Mở
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleManualClose}
                    disabled={gateStatus === "closed"}
                    variant="destructive"
                  >
                    <DoorClosed className="w-4 h-4 mr-1" />
                    Đóng
                  </Button>
                </div>
              </div>

              {/* Camera Feed */}
              <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                {cameraOnline ? (
                  <>
                    {/* Simulated camera feed with overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 flex items-center justify-center">
                      {/* Road/ground simulation */}
                      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gray-700 opacity-60" />
                      {/* Dashed lane lines */}
                      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-1 h-6 bg-yellow-400 opacity-50 rounded-full" />
                        ))}
                      </div>
                      {/* Vehicle silhouette if detecting/verifying/approved/rejected */}
                      {scanState !== "idle" && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="w-32 h-16 bg-gray-500 rounded-lg opacity-70 relative">
                            <div className="absolute top-2 left-2 right-2 h-6 bg-gray-400 rounded" />
                            <div className="absolute bottom-0 left-3 w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-400" />
                            <div className="absolute bottom-0 right-3 w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* HUD Overlays */}
                    <div className="absolute top-3 left-3 text-xs text-green-400 font-mono bg-black/50 px-2 py-1 rounded">
                      LIVE ● Làn {selectedLane} – CAM-ENTRY-0{selectedLane}
                    </div>
                    <div className="absolute top-3 right-3 text-xs text-white font-mono bg-black/50 px-2 py-1 rounded">
                      {formatTime(currentTime)}
                    </div>
                    {/* Plate detection box */}
                    {(scanState === "detecting" || scanState === "verifying" || scanState === "approved" || scanState === "rejected") && (
                      <div
                        className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded border-2 text-sm font-mono font-bold ${
                          scanState === "approved"
                            ? "border-green-400 text-green-300 bg-green-900/50"
                            : scanState === "rejected"
                            ? "border-red-400 text-red-300 bg-red-900/50"
                            : "border-yellow-400 text-yellow-300 bg-yellow-900/50 animate-pulse"
                        }`}
                      >
                        {currentPlate}
                      </div>
                    )}
                    {/* Corner brackets (scanning box effect) */}
                    {scanState === "detecting" && (
                      <>
                        <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-yellow-400 opacity-70" />
                        <div className="absolute top-12 right-12 w-8 h-8 border-t-2 border-r-2 border-yellow-400 opacity-70" />
                        <div className="absolute bottom-16 left-12 w-8 h-8 border-b-2 border-l-2 border-yellow-400 opacity-70" />
                        <div className="absolute bottom-16 right-12 w-8 h-8 border-b-2 border-r-2 border-yellow-400 opacity-70" />
                      </>
                    )}
                    {/* Green/Red overlay flash */}
                    {scanState === "approved" && (
                      <div className="absolute inset-0 bg-green-500/10 border-4 border-green-400 rounded-xl pointer-events-none" />
                    )}
                    {scanState === "rejected" && (
                      <div className="absolute inset-0 bg-red-500/10 border-4 border-red-400 rounded-xl pointer-events-none" />
                    )}
                    <Camera className="w-8 h-8 text-gray-500 opacity-30" />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <WifiOff className="w-10 h-10" />
                    <span className="text-sm">Camera ngoại tuyến</span>
                  </div>
                )}
              </div>

              {/* Detection Status Bar */}
              <div className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${getScanBg()}`}>
                <div className={`flex items-center gap-2 font-medium ${scanInfo.color}`}>
                  {scanInfo.icon}
                  {scanInfo.label}
                </div>
                {scanState !== "idle" && (
                  <div className="flex gap-1">
                    {(["detecting", "verifying", "approved"] as ScanState[]).map((s, i) => (
                      <div
                        key={s}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          ["detecting", "verifying", "approved", "rejected"].indexOf(scanState) >= i
                            ? scanState === "rejected" && i === 2
                              ? "bg-red-500"
                              : scanState === "approved" && i === 2
                              ? "bg-green-500"
                              : "bg-[#0055A4]"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info & Simulation Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thông tin xe tại cổng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Biển số (giả lập)</label>
                  <input
                    type="text"
                    value={currentPlate}
                    onChange={(e) => setCurrentPlate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
                    placeholder="51F-248.93"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Mã thẻ RFID</label>
                  <input
                    type="text"
                    value={currentCardId}
                    onChange={(e) => setCurrentCardId(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
                    placeholder="RFID-004821"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Loại xe</label>
                  <select
                    value={currentVehicleType}
                    onChange={(e) => setCurrentVehicleType(e.target.value as VehicleType)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055A4]"
                  >
                    <option value="motorbike">Xe máy</option>
                    <option value="car">Ô tô</option>
                    <option value="truck">Xe tải</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSimulateEntry}
                  disabled={scanState !== "idle"}
                  className="bg-[#0055A4] hover:bg-[#004494] text-white flex-1 sm:flex-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Giả lập xe vào (Chấp thuận)
                </Button>
                <Button
                  onClick={handleSimulateReject}
                  disabled={scanState !== "idle"}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Giả lập từ chối
                </Button>
                <Button
                  onClick={() => setScanState("idle")}
                  variant="ghost"
                  size="icon"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Queue + Recent Entries */}
        <div className="space-y-4">
          {/* Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Hàng chờ xe vào</span>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">{queue.length} xe</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {queue.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Car className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Không có xe chờ</p>
                </div>
              ) : (
                queue.map((v, idx) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${
                        idx === 0 ? "bg-[#0055A4]" : "bg-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-medium text-gray-900">{v.plate}</div>
                      <div className="text-xs text-gray-500">{VEHICLE_TYPE_LABEL[v.vehicleType]}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {v.waitTime}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Entry Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Lịch sử xe vào</span>
                <Badge className="bg-blue-50 text-[#0055A4] border-blue-200">{entries.length} lượt</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      entry.result === "failed" ? "bg-red-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {entry.plate}
                          </span>
                          {getResultBadge(entry.result)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-gray-500">
                            {VEHICLE_TYPE_LABEL[entry.vehicleType]}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            {getAuthIcon(entry.authMethod)}
                            {AUTH_METHOD_LABEL[entry.authMethod]}
                          </span>
                          <span className="text-xs text-gray-400">{entry.lane}</span>
                          {entry.spotAssigned && (
                            <span className="text-xs text-[#0055A4]">→ Ô {entry.spotAssigned}</span>
                          )}
                        </div>
                        {entry.cardId && (
                          <div className="text-xs text-gray-400 mt-0.5 font-mono">{entry.cardId}</div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 shrink-0 font-mono">{entry.time}</div>
                    </div>
                    {entry.result === "failed" && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                        <TriangleAlert className="w-3 h-3" />
                        Thẻ không hợp lệ hoặc hết hạn
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
