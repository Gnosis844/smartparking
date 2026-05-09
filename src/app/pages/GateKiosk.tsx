import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Ticket,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  WifiOff,
  Printer,
  DoorOpen,
  DoorClosed,
  Wifi,
  Camera,
  CircleDot,
  Car,
  Phone,
  RefreshCw,
  ChevronRight,
  Loader2,
  Ban,
  ParkingCircle,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type KioskState =
  | "idle"
  | "rfid_scanning"
  | "rfid_success"
  | "error_invalid_card"
  | "error_debt"
  | "error_full"
  | "error_device"
  | "ticket_printing"
  | "ticket_success";

interface ZoneInfo {
  id: string;
  name: string;
  available: number;
  total: number;
}

interface RFIDSuccessData {
  name: string;
  studentId: string;
  cardId: string;
  vehicleType: string;
  plate: string;
  validUntil: string;
  spotAssigned: string;
  entryTime: string;
}

interface TicketData {
  ticketId: string;
  issuedAt: string;
  vehicleType: string;
  barcode: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const zones: ZoneInfo[] = [
  { id: "A", name: "Khu A", available: 15, total: 80 },
  { id: "B", name: "Khu B", available: 32, total: 80 },
  { id: "C", name: "Khu C", available: 4, total: 40 },
  { id: "D", name: "Khu D (Ô tô)", available: 9, total: 30 },
];

const rfidSuccessScenarios: RFIDSuccessData[] = [
  {
    name: "Nguyễn Văn An",
    studentId: "2111234",
    cardId: "RFID-004821",
    vehicleType: "Xe máy",
    plate: "51F-248.93",
    validUntil: "31/12/2025",
    spotAssigned: "B-14",
    entryTime: "",
  },
  {
    name: "Trần Thị Bình",
    studentId: "2209876",
    cardId: "RFID-007743",
    vehicleType: "Xe máy",
    plate: "59N-321.45",
    validUntil: "30/06/2025",
    spotAssigned: "A-07",
    entryTime: "",
  },
];

function generateTicketId(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `VE-${ymd}-${seq}`;
}

function generateBarcode(): string {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulsingRing({ color }: { color: string }) {
  return (
    <span className="relative flex h-4 w-4">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60`}
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-4 w-4"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function BarrierIcon({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {open ? (
        <DoorOpen className="w-5 h-5 text-emerald-400" />
      ) : (
        <DoorClosed className="w-5 h-5 text-red-400" />
      )}
      <span
        className={`text-sm font-semibold ${open ? "text-emerald-400" : "text-red-400"}`}
      >
        {open ? "ĐANG MỞ" : "ĐÓNG"}
      </span>
    </div>
  );
}

function ZoneBadge({ zone }: { zone: ZoneInfo }) {
  const ratio = zone.available / zone.total;
  const color =
    ratio >= 0.3
      ? "text-emerald-400 border-emerald-700 bg-emerald-900/30"
      : ratio >= 0.1
      ? "text-amber-400 border-amber-700 bg-amber-900/30"
      : "text-red-400 border-red-700 bg-red-900/30";
  return (
    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg border ${color}`}>
      <span className="text-xs opacity-70">{zone.name}</span>
      <span className="text-lg font-bold leading-tight">{zone.available}</span>
      <span className="text-xs opacity-50">chỗ trống</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GateKiosk() {
  const [state, setState] = useState<KioskState>("idle");
  const [barrierOpen, setBarrierOpen] = useState(false);
  const [cameraOnline, setCameraOnline] = useState(true);
  const [rfidOnline, setRfidOnline] = useState(true);
  const [networkOnline, setNetworkOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(0);
  const [rfidData, setRfidData] = useState<RFIDSuccessData | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clearTimers = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = useCallback((seconds: number, onDone: () => void) => {
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          onDone();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  const resetToIdle = useCallback(() => {
    clearTimers();
    setBarrierOpen(false);
    setScanProgress(0);
    setState("idle");
  }, []);

  // RFID scanning simulation
  const handleRfidSwipe = () => {
    if (state !== "idle") return;
    if (!rfidOnline || !networkOnline) {
      setState("error_device");
      startCountdown(8, resetToIdle);
      return;
    }
    setState("rfid_scanning");
    setScanProgress(0);
    // progress animation
    let p = 0;
    const prog = setInterval(() => {
      p += 10;
      setScanProgress(p);
      if (p >= 100) clearInterval(prog);
    }, 120);

    setTimeout(() => {
      clearInterval(prog);
      setScanProgress(100);
      // Random outcome: success 60%, invalid 20%, debt 20%
      const r = Math.random();
      if (r < 0.6) {
        const data = rfidSuccessScenarios[Math.floor(Math.random() * rfidSuccessScenarios.length)];
        setRfidData({
          ...data,
          entryTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
        setState("rfid_success");
        setBarrierOpen(true);
        startCountdown(6, resetToIdle);
      } else if (r < 0.8) {
        setState("error_invalid_card");
        startCountdown(8, resetToIdle);
      } else {
        setState("error_debt");
        startCountdown(8, resetToIdle);
      }
    }, 1400);
  };

  // Ticket printing
  const handlePrintTicket = () => {
    if (state !== "idle") return;
    if (!networkOnline) {
      setState("error_device");
      startCountdown(8, resetToIdle);
      return;
    }
    // Check if full
    const totalAvailable = zones.reduce((s, z) => s + z.available, 0);
    if (totalAvailable <= 3) {
      setState("error_full");
      startCountdown(8, resetToIdle);
      return;
    }
    setState("ticket_printing");
    setTimeout(() => {
      setTicketData({
        ticketId: generateTicketId(),
        issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        vehicleType: "Xe máy",
        barcode: generateBarcode(),
      });
      setState("ticket_success");
      setBarrierOpen(true);
      startCountdown(7, resetToIdle);
    }, 2200);
  };

  // Demo triggers
  const triggerState = (s: KioskState) => {
    clearTimers();
    setBarrierOpen(false);
    setScanProgress(0);
    if (s === "rfid_success") {
      const data = rfidSuccessScenarios[0];
      setRfidData({ ...data, entryTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) });
      setBarrierOpen(true);
      setState(s);
      startCountdown(6, resetToIdle);
    } else if (s === "ticket_success") {
      setTicketData({ ticketId: generateTicketId(), issuedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), vehicleType: "Xe máy", barcode: generateBarcode() });
      setBarrierOpen(true);
      setState(s);
      startCountdown(7, resetToIdle);
    } else if (s === "error_device" || s === "error_full" || s === "error_invalid_card" || s === "error_debt") {
      setState(s);
      startCountdown(8, resetToIdle);
    } else {
      setState(s);
    }
    setShowDemoPanel(false);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

  const isError = state.startsWith("error_");
  const isSuccess = state === "rfid_success" || state === "ticket_success";

  return (
    <div
      className="min-h-screen flex flex-col select-none overflow-hidden"
      style={{ background: "linear-gradient(160deg, #060E1A 0%, #0A1628 60%, #071020 100%)" }}
    >
      {/* ── TOP STATUS BAR ─────────────────────────────────────────────────── */}
      <header
        className="px-6 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "#1A2D45", background: "rgba(10,22,40,0.9)" }}
      >
        {/* Gate identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#0055A4" }}
          >
            <ParkingCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">CỔNG VÀO A1</div>
            <div className="text-xs" style={{ color: "#6B8CAE" }}>
              Bãi xe HCMUT – Cơ sở 2
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="text-center hidden sm:block">
          <div className="text-2xl font-mono font-bold text-white tracking-wider">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs capitalize" style={{ color: "#6B8CAE" }}>
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Barrier + Device status */}
        <div className="flex items-center gap-4 flex-wrap">
          <BarrierIcon open={barrierOpen} />
          <div className="w-px h-8 hidden md:block" style={{ background: "#1A2D45" }} />
          <div className="flex items-center gap-3">
            {/* Camera */}
            <button
              onClick={() => setCameraOnline((v) => !v)}
              className="flex items-center gap-1.5 group"
              title="Toggle camera (demo)"
            >
              <Camera className={`w-4 h-4 ${cameraOnline ? "text-emerald-400" : "text-red-400"}`} />
              <span className={`text-xs ${cameraOnline ? "text-emerald-400" : "text-red-400"}`}>
                {cameraOnline ? "CAM" : "CAM!"}
              </span>
            </button>
            {/* RFID */}
            <button
              onClick={() => setRfidOnline((v) => !v)}
              className="flex items-center gap-1.5"
              title="Toggle RFID (demo)"
            >
              <CreditCard className={`w-4 h-4 ${rfidOnline ? "text-emerald-400" : "text-red-400"}`} />
              <span className={`text-xs ${rfidOnline ? "text-emerald-400" : "text-red-400"}`}>
                RFID
              </span>
            </button>
            {/* Network */}
            <button
              onClick={() => setNetworkOnline((v) => !v)}
              className="flex items-center gap-1.5"
              title="Toggle network (demo)"
            >
              {networkOnline ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </button>
          </div>
          <div className="w-px h-8 hidden lg:block" style={{ background: "#1A2D45" }} />
          {/* Zone availability */}
          <div className="hidden lg:flex items-center gap-2">
            {zones.map((z) => (
              <ZoneBadge key={z.id} zone={z} />
            ))}
          </div>
        </div>
      </header>

      {/* Zone row on mobile/tablet */}
      <div
        className="lg:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto border-b"
        style={{ borderColor: "#1A2D45", background: "rgba(10,22,40,0.8)" }}
      >
        {zones.map((z) => (
          <ZoneBadge key={z.id} zone={z} />
        ))}
      </div>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isSuccess
              ? "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)"
              : isError
              ? "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(0,85,164,0.08) 0%, transparent 70%)",
            transition: "background 0.5s ease",
          }}
        />

        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {/* ─── IDLE STATE ─────────────────────────────────────────────── */}
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    Chào mừng đến bãi xe HCMUT
                  </h2>
                  <p className="mt-2 text-lg" style={{ color: "#6B8CAE" }}>
                    Vui lòng chọn phương thức vào cổng
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* RFID Panel */}
                  <motion.button
                    onClick={handleRfidSwipe}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!rfidOnline}
                    className="relative rounded-3xl p-8 flex flex-col items-center gap-5 text-center cursor-pointer transition-all overflow-hidden"
                    style={{
                      background: rfidOnline
                        ? "linear-gradient(135deg, #0D1E35 0%, #0F2540 100%)"
                        : "rgba(30,30,30,0.5)",
                      border: `2px solid ${rfidOnline ? "#1A4A80" : "#2A2A2A"}`,
                      boxShadow: rfidOnline
                        ? "0 0 40px rgba(0,85,164,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "none",
                    }}
                  >
                    {rfidOnline && (
                      <div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity rounded-3xl"
                        style={{ background: "linear-gradient(135deg, rgba(0,85,164,0.1) 0%, transparent 100%)" }}
                      />
                    )}
                    {/* Pulse rings */}
                    {rfidOnline && (
                      <div className="relative">
                        <div
                          className="absolute -inset-6 rounded-full opacity-20 animate-ping"
                          style={{ background: "#0055A4", animationDuration: "2s" }}
                        />
                        <div
                          className="absolute -inset-3 rounded-full opacity-20 animate-ping"
                          style={{ background: "#0055A4", animationDuration: "2s", animationDelay: "0.3s" }}
                        />
                        <div
                          className="w-24 h-24 rounded-2xl flex items-center justify-center relative"
                          style={{ background: "linear-gradient(135deg, #0055A4, #003E8A)" }}
                        >
                          <CreditCard className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                    {!rfidOnline && (
                      <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: "#1A1A1A" }}>
                        <CreditCard className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <div className={`text-2xl font-bold ${rfidOnline ? "text-white" : "text-gray-600"}`}>
                        QUẸT THẺ RFID
                      </div>
                      <div className="mt-2 text-base" style={{ color: rfidOnline ? "#6B8CAE" : "#3A3A3A" }}>
                        {rfidOnline
                          ? "Đặt thẻ gần đầu đọc để vào cổng"
                          : "Đầu đọc RFID đang ngoại tuyến"}
                      </div>
                      {rfidOnline && (
                        <div
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{ background: "#0055A4", color: "white" }}
                        >
                          Dành cho sinh viên & cán bộ
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {/* Visitor / QR Ticket Panel */}
                  <motion.div
                    className="relative rounded-3xl p-8 flex flex-col items-center gap-5 text-center overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0D2420 0%, #0F2B25 100%)",
                      border: "2px solid #1A4A40",
                      boxShadow: "0 0 40px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="relative">
                      <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                      >
                        <Ticket className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">KHÁCH VÃNG LAI</div>
                      <div className="mt-2 text-base" style={{ color: "#6B8CAE" }}>
                        Nhận vé giấy để vào & thanh toán khi ra
                      </div>
                    </div>
                    <motion.button
                      onClick={handlePrintTicket}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-xl font-bold text-white transition-all"
                      style={{
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                      }}
                    >
                      <Printer className="w-6 h-6" />
                      IN VÉ
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─── RFID SCANNING ──────────────────────────────────────────── */}
            {state === "rfid_scanning" && (
              <motion.div
                key="rfid_scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 py-8"
              >
                <div className="relative">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 animate-ping"
                      style={{
                        borderColor: "#0055A4",
                        opacity: 0.3 / i,
                        transform: `scale(${1 + i * 0.4})`,
                        animationDuration: `${1.2 + i * 0.3}s`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: "linear-gradient(135deg, #0055A4, #003E8A)",
                      boxShadow: "0 0 60px rgba(0,85,164,0.5)",
                    }}
                  >
                    <CreditCard className="w-14 h-14 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-white">Đang đọc thẻ...</div>
                  <div className="mt-2 text-lg" style={{ color: "#6B8CAE" }}>
                    Vui lòng giữ thẻ gần đầu đọc
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-80 max-w-full">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1A2D45" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #0055A4, #60A5FA)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="text-center mt-2 text-sm" style={{ color: "#6B8CAE" }}>
                    Đang xác thực...
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── RFID SUCCESS ───────────────────────────────────────────── */}
            {state === "rfid_success" && rfidData && (
              <motion.div
                key="rfid_success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, type: "spring", damping: 20 }}
                className="space-y-6"
              >
                {/* Success header */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      boxShadow: "0 0 60px rgba(16,185,129,0.5)",
                    }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-4xl font-bold text-white">
                        Xin chào, {rfidData.name}!
                      </div>
                      <div className="text-xl mt-1" style={{ color: "#10B981" }}>
                        Thẻ hợp lệ – Được phép vào cổng
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Info grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  {[
                    { label: "MSSV/Mã CB", value: rfidData.studentId, icon: <CircleDot className="w-4 h-4" /> },
                    { label: "Phương tiện", value: `${rfidData.vehicleType} – ${rfidData.plate}`, icon: <Car className="w-4 h-4" /> },
                    { label: "Ô được phân", value: rfidData.spotAssigned, icon: <ParkingCircle className="w-4 h-4" /> },
                    { label: "Giờ vào", value: rfidData.entryTime, icon: <Zap className="w-4 h-4" /> },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl p-4"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-1" style={{ color: "#10B981" }}>
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <div className="text-lg font-bold text-white">{item.value}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Barrier animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl p-5 flex items-center justify-between"
                  style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <DoorOpen className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">BARRIER ĐANG MỞ</div>
                      <div className="text-sm" style={{ color: "#6B8CAE" }}>
                        Vui lòng đi vào từ từ và an toàn
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold" style={{ color: "#10B981" }}>
                      {countdown}s
                    </div>
                    <div className="text-xs" style={{ color: "#6B8CAE" }}>
                      Tự đóng sau
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ─── TICKET PRINTING ────────────────────────────────────────── */}
            {state === "ticket_printing" && (
              <motion.div
                key="ticket_printing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 py-8"
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    boxShadow: "0 0 60px rgba(16,185,129,0.4)",
                  }}
                >
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  >
                    <Printer className="w-14 h-14 text-white" />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 text-3xl font-bold text-white">
                    <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
                    Đang in vé...
                  </div>
                  <div className="mt-3 text-lg" style={{ color: "#6B8CAE" }}>
                    Vui lòng chờ vé được phát hành từ khe in bên dưới
                  </div>
                </div>
                {/* Animated paper coming out */}
                <div className="relative w-48">
                  <div className="h-8 rounded-t-lg" style={{ background: "#1A2D45" }} />
                  <motion.div
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="rounded-b-lg overflow-hidden"
                    style={{ background: "#F8F8F0" }}
                  >
                    <div className="p-3 text-center">
                      <div className="text-xs text-gray-400 font-mono">HCMUT PARKING</div>
                      <div className="flex justify-center gap-0.5 mt-2">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div
                            key={i}
                            className="rounded-sm"
                            style={{
                              width: 3,
                              height: i % 3 === 0 ? 24 : 16,
                              background: "#1A1A1A",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─── TICKET SUCCESS ──────────────────────────────────────────── */}
            {state === "ticket_success" && ticketData && (
              <motion.div
                key="ticket_success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, type: "spring", damping: 18 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 0 60px rgba(16,185,129,0.5)" }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div className="text-4xl font-bold text-white">Vé đã được phát hành!</div>
                    <div className="text-xl mt-1" style={{ color: "#10B981" }}>
                      Vui lòng lấy vé và giữ cẩn thận
                    </div>
                  </motion.div>
                </div>

                {/* Ticket visual */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center"
                >
                  <div
                    className="rounded-2xl p-6 w-full max-w-sm relative overflow-hidden"
                    style={{ background: "#F8F8F0", color: "#1A1A1A" }}
                  >
                    {/* Ticket holes */}
                    <div className="absolute left-0 top-1/2 w-4 h-8 -translate-x-2 rounded-r-full" style={{ background: "#0A1628" }} />
                    <div className="absolute right-0 top-1/2 w-4 h-8 translate-x-2 rounded-l-full" style={{ background: "#0A1628" }} />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-500">BÃI XE HCMUT – CƠ SỞ 2</div>
                      <div className="text-2xl font-bold mt-1 text-gray-900">{ticketData.ticketId}</div>
                    </div>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Giờ vào:</span> <span className="font-semibold">{ticketData.issuedAt}</span></div>
                      <div><span className="text-gray-500">Loại xe:</span> <span className="font-semibold">{ticketData.vehicleType}</span></div>
                    </div>
                    <div className="border-t border-dashed border-gray-300 my-3" />
                    {/* Barcode */}
                    <div className="flex justify-center gap-0.5 my-2">
                      {Array.from({ length: 28 }, (_, i) => (
                        <div
                          key={i}
                          className="rounded-sm"
                          style={{ width: 3, height: i % 4 === 0 ? 36 : 24, background: "#1A1A1A" }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-xs font-mono text-gray-500 mt-1">
                      {ticketData.barcode}
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-3">
                      Xuất trình vé khi ra cổng – Mất vé phí 50.000đ
                    </div>
                  </div>
                </motion.div>

                {/* Barrier open banner */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)" }}
                >
                  <div className="flex items-center gap-3">
                    <DoorOpen className="w-8 h-8 text-emerald-400" />
                    <div>
                      <div className="text-xl font-bold text-emerald-400">BARRIER ĐANG MỞ</div>
                      <div className="text-sm" style={{ color: "#6B8CAE" }}>Đi vào an toàn</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold" style={{ color: "#10B981" }}>{countdown}s</div>
                    <div className="text-xs" style={{ color: "#6B8CAE" }}>Tự đóng sau</div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ─── ERROR: INVALID CARD ─────────────────────────────────────── */}
            {state === "error_invalid_card" && (
              <motion.div
                key="error_invalid"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, type: "spring", damping: 18 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                  className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #DC2626, #B91C1C)", boxShadow: "0 0 60px rgba(220,38,38,0.5)" }}
                >
                  <XCircle className="w-14 h-14 text-white" />
                </motion.div>
                <div>
                  <div className="text-4xl font-bold text-white">Thẻ không hợp lệ</div>
                  <div className="text-xl mt-2" style={{ color: "#F87171" }}>
                    Thẻ RFID chưa đăng ký hoặc đã hết hạn sử dụng
                  </div>
                </div>
                <ErrorActions countdown={countdown} />
              </motion.div>
            )}

            {/* ─── ERROR: DEBT ─────────────────────────────────────────────── */}
            {state === "error_debt" && (
              <motion.div
                key="error_debt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, type: "spring", damping: 18 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                  className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #D97706, #B45309)", boxShadow: "0 0 60px rgba(217,119,6,0.5)" }}
                >
                  <Ban className="w-14 h-14 text-white" />
                </motion.div>
                <div>
                  <div className="text-4xl font-bold text-white">Tài khoản có công nợ</div>
                  <div className="text-xl mt-2" style={{ color: "#FCD34D" }}>
                    Vui lòng thanh toán công nợ trước khi vào bãi
                  </div>
                </div>
                <div
                  className="rounded-2xl p-4 max-w-md mx-auto"
                  style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.4)" }}
                >
                  <div className="text-lg font-bold text-amber-400">Số tiền cần thanh toán</div>
                  <div className="text-3xl font-bold text-white mt-1">75.000 đ</div>
                  <div className="text-sm mt-2" style={{ color: "#6B8CAE" }}>
                    Thanh toán tại quầy hoặc qua ứng dụng BKPark
                  </div>
                </div>
                <ErrorActions countdown={countdown} />
              </motion.div>
            )}

            {/* ─── ERROR: FULL ─────────────────────────────────────────────── */}
            {state === "error_full" && (
              <motion.div
                key="error_full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, type: "spring", damping: 18 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                  className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #DC2626, #B91C1C)", boxShadow: "0 0 60px rgba(220,38,38,0.4)" }}
                >
                  <ParkingCircle className="w-14 h-14 text-white" />
                </motion.div>
                <div>
                  <div className="text-4xl font-bold text-white">Bãi xe đã đầy</div>
                  <div className="text-xl mt-2" style={{ color: "#F87171" }}>
                    Tất cả các khu vực hiện không còn chỗ trống
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  {zones.map((z) => (
                    <div key={z.id} className="rounded-xl p-3" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)" }}>
                      <div className="text-sm text-red-400">{z.name}</div>
                      <div className="text-2xl font-bold text-white">{z.available}</div>
                      <div className="text-xs" style={{ color: "#6B8CAE" }}>chỗ trống</div>
                    </div>
                  ))}
                </div>
                <ErrorActions countdown={countdown} />
              </motion.div>
            )}

            {/* ─── ERROR: DEVICE OFFLINE ───────────────────────────────────── */}
            {state === "error_device" && (
              <motion.div
                key="error_device"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, type: "spring", damping: 18 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                  className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 0 60px rgba(124,58,237,0.4)" }}
                >
                  <WifiOff className="w-14 h-14 text-white" />
                </motion.div>
                <div>
                  <div className="text-4xl font-bold text-white">Thiết bị mất kết nối</div>
                  <div className="text-xl mt-2" style={{ color: "#C4B5FD" }}>
                    Hệ thống đang gặp sự cố – Vui lòng thử lại sau
                  </div>
                </div>
                <div
                  className="rounded-2xl p-4 max-w-md mx-auto"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <CreditCard className={`w-5 h-5 ${rfidOnline ? "text-emerald-400" : "text-red-400"}`} />
                      <span className="text-sm text-white">RFID: {rfidOnline ? "OK" : "Lỗi"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {networkOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
                      <span className="text-sm text-white">Mạng: {networkOnline ? "OK" : "Mất KN"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className={`w-5 h-5 ${cameraOnline ? "text-emerald-400" : "text-red-400"}`} />
                      <span className="text-sm text-white">Camera: {cameraOnline ? "OK" : "Lỗi"}</span>
                    </div>
                  </div>
                </div>
                <ErrorActions countdown={countdown} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-3 flex items-center justify-between flex-wrap gap-2 border-t"
        style={{ borderColor: "#1A2D45", background: "rgba(10,22,40,0.9)" }}
      >
        <div className="flex items-center gap-4">
          <PulsingRing color="#10B981" />
          <span className="text-sm" style={{ color: "#6B8CAE" }}>
            Hệ thống hoạt động bình thường
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ color: "#6B8CAE" }}>
          <Phone className="w-4 h-4" />
          <span className="text-sm">Hỗ trợ nhân viên: <strong className="text-white">0283 864 7256</strong> – Ext. 201</span>
        </div>
        <div className="text-xs" style={{ color: "#3A5470" }}>
          IoT-SPMS v2.4.1 – HCMUT © 2025
        </div>
      </footer>

      {/* ── DEMO CONTROL PANEL ─────────────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {showDemoPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 rounded-2xl p-4 shadow-2xl text-sm"
              style={{ background: "#0D1E35", border: "1px solid #1A2D45", minWidth: 230 }}
            >
              <div className="text-white font-semibold mb-3 text-xs uppercase tracking-wider" style={{ color: "#6B8CAE" }}>
                Demo – Kích hoạt trạng thái
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "✅ RFID Thành công", s: "rfid_success" as KioskState, color: "#10B981" },
                  { label: "🎫 In vé thành công", s: "ticket_success" as KioskState, color: "#10B981" },
                  { label: "❌ Thẻ không hợp lệ", s: "error_invalid_card" as KioskState, color: "#EF4444" },
                  { label: "💰 Có công nợ", s: "error_debt" as KioskState, color: "#F59E0B" },
                  { label: "🚗 Bãi đầy", s: "error_full" as KioskState, color: "#EF4444" },
                  { label: "📡 Mất kết nối", s: "error_device" as KioskState, color: "#8B5CF6" },
                  { label: "↩️ Về màn hình chờ", s: "idle" as KioskState, color: "#6B8CAE" },
                ].map((item) => (
                  <button
                    key={item.s}
                    onClick={() => triggerState(item.s)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setShowDemoPanel((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: showDemoPanel ? "#1A2D45" : "#0055A4",
            color: "white",
            border: "1px solid #2A4A6A",
          }}
        >
          <RefreshCw className={`w-4 h-4 ${showDemoPanel ? "rotate-180" : ""} transition-transform`} />
          Demo
        </button>
      </div>
    </div>
  );
}

// ─── Shared Error Actions Component ──────────────────────────────────────────
function ErrorActions({ countdown }: { countdown: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="flex flex-col items-center gap-3"
    >
      <div
        className="rounded-2xl px-6 py-4 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <Phone className="w-6 h-6 text-white shrink-0" />
        <div>
          <div className="text-base font-semibold text-white">Liên hệ nhân viên hỗ trợ</div>
          <div className="text-sm" style={{ color: "#6B8CAE" }}>
            Quầy hỗ trợ bên phải cổng hoặc gọi: <strong className="text-white">Ext. 201</strong>
          </div>
        </div>
      </div>
      <div className="text-base" style={{ color: "#6B8CAE" }}>
        Tự động trở về sau{" "}
        <span className="text-white font-bold text-xl">{countdown}</span> giây
      </div>
    </motion.div>
  );
}
