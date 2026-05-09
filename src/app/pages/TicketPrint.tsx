import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "motion/react";
import {
  Printer,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  ParkingCircle,
  Settings2,
  Eye,
  FileText,
} from "lucide-react";
import { Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────
type VehicleType = "motorbike" | "car" | "truck";
type GateId = "A1" | "A2" | "B1" | "B2";
type ZoneId = "A" | "B" | "C" | "D";

interface TicketData {
  id: string;
  entryTime: string;
  entryDate: string;
  gate: GateId;
  zone: ZoneId;
  vehicleType: VehicleType;
  issuedAt: string;
  barcode: string;
  qrPayload: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const VEHICLE_LABELS: Record<VehicleType, string> = {
  motorbike: "Xe máy",
  car: "Ô tô",
  truck: "Xe tải",
};

const ZONE_DESCRIPTIONS: Record<ZoneId, string> = {
  A: "Khu A – Tầng trệt (Gần cổng A)",
  B: "Khu B – Tầng trệt (Gần cổng B)",
  C: "Khu C – Tầng 1 (Xe máy)",
  D: "Khu D – Tầng 2 (Ô tô)",
};

function generateTicketId(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `VE-${ymd}-${seq}`;
}

function generateBarcode(): string {
  return Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join("");
}

function makeTicket(vehicleType: VehicleType, gate: GateId, zone: ZoneId): TicketData {
  const now = new Date();
  const id = generateTicketId();
  return {
    id,
    entryTime: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    entryDate: now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    gate,
    zone,
    vehicleType,
    issuedAt: now.toISOString(),
    barcode: generateBarcode(),
    qrPayload: `HCMUT-PARKING::${id}::GATE:${gate}::ZONE:${zone}::VT:${vehicleType}::T:${now.toISOString()}`,
  };
}

// ─── Barcode Component ────────────────────────────────────────────────────────
function Barcode({ value }: { value: string }) {
  const bars = value.split("").map((ch, i) => {
    const n = parseInt(ch, 10);
    return { wide: n > 5, idx: i };
  });

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-end gap-px h-14">
        {/* Guard bars */}
        <div className="w-0.5 h-14 bg-black" />
        <div className="w-px h-14 bg-white" />
        <div className="w-0.5 h-14 bg-black" />
        {bars.map((b, i) => (
          <div
            key={i}
            className="bg-black"
            style={{
              width: b.wide ? 3 : 1.5,
              height: i % 3 === 0 ? 56 : 44,
            }}
          />
        ))}
        {/* Inter-character gaps */}
        {bars.map((_, i) =>
          i % 2 === 0 ? (
            <div key={`g${i}`} style={{ width: 2, background: "transparent" }} />
          ) : null
        )}
        {/* Guard bars */}
        <div className="w-0.5 h-14 bg-black" />
        <div className="w-px h-14 bg-white" />
        <div className="w-0.5 h-14 bg-black" />
      </div>
      <div className="font-mono text-xs tracking-widest text-black">
        {value}
      </div>
    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function TicketSep({ dashed = false }: { dashed?: boolean }) {
  return (
    <div className="relative py-1">
      {dashed ? (
        <div className="border-t-2 border-dashed border-gray-400" />
      ) : (
        <div className="border-t-2 border-gray-900" />
      )}
    </div>
  );
}

// ─── The Ticket itself ────────────────────────────────────────────────────────
function ParkingTicket({ ticket }: { ticket: TicketData }) {
  return (
    <div
      id="thermal-ticket"
      className="bg-white text-black flex flex-col"
      style={{
        width: 300,
        fontFamily: "'Courier New', Courier, monospace",
        padding: "16px 14px",
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 pb-3">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-10 h-10 rounded flex items-center justify-center"
            style={{ background: "#0055A4", flexShrink: 0 }}
          >
            <ParkingCircle
              style={{ width: 22, height: 22, color: "white", strokeWidth: 2 }}
            />
          </div>
          <div className="text-left">
            <div
              style={{ fontSize: 13, fontWeight: 900, letterSpacing: 1, color: "#0055A4", lineHeight: 1.2 }}
            >
              BÃI XE HCMUT
            </div>
            <div style={{ fontSize: 8, letterSpacing: 0.5, color: "#444" }}>
              HỆ THỐNG QUẢN LÝ THÔNG MINH
            </div>
          </div>
        </div>
        <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>
          Đại học Bách Khoa – Cơ sở 2, 268 Lý Thường Kiệt, Q.10
        </div>
      </div>

      <TicketSep />

      {/* ── TICKET TYPE ─────────────────────────────────────────── */}
      <div className="text-center py-2.5">
        <div
          style={{
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#000",
          }}
        >
          VÉ GỬI XE KHÁCH VÃNG LAI
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#555",
            marginTop: 2,
            letterSpacing: 0.5,
          }}
        >
          VISITOR PARKING PASS – ONE TIME USE
        </div>
      </div>

      <TicketSep />

      {/* ── TICKET ID ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center py-3 gap-0.5">
        <div style={{ fontSize: 8, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
          Mã vé / Ticket No.
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 2,
            color: "#000",
            lineHeight: 1.2,
          }}
        >
          {ticket.id}
        </div>
      </div>

      <TicketSep dashed />

      {/* ── QR CODE ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center py-4 gap-2">
        <div style={{ fontSize: 8, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
          Quét mã khi ra cổng / Scan at Exit
        </div>
        {/* QR border frame */}
        <div
          style={{
            padding: 6,
            border: "3px solid #000",
            borderRadius: 6,
            background: "white",
            position: "relative",
          }}
        >
          {/* Corner accents */}
          {[
            { top: -2, left: -2, borderTop: "4px solid #0055A4", borderLeft: "4px solid #0055A4", borderRight: "none", borderBottom: "none" },
            { top: -2, right: -2, borderTop: "4px solid #0055A4", borderRight: "4px solid #0055A4", borderLeft: "none", borderBottom: "none" },
            { bottom: -2, left: -2, borderBottom: "4px solid #0055A4", borderLeft: "4px solid #0055A4", borderRight: "none", borderTop: "none" },
            { bottom: -2, right: -2, borderBottom: "4px solid #0055A4", borderRight: "4px solid #0055A4", borderLeft: "none", borderTop: "none" },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                ...style,
                boxSizing: "border-box",
              }}
            />
          ))}
          <QRCodeSVG
            value={ticket.qrPayload}
            size={152}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
            includeMargin={false}
          />
        </div>
        <div style={{ fontSize: 8, color: "#999", textAlign: "center" }}>
          Mã này duy nhất cho lượt gửi xe này
        </div>
      </div>

      <TicketSep dashed />

      {/* ── INFO TABLE ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-0" style={{ paddingTop: 10, paddingBottom: 10 }}>
        {[
          { label: "Giờ vào", value: ticket.entryTime },
          { label: "Ngày", value: ticket.entryDate },
          { label: "Cổng vào", value: `CỔNG ${ticket.gate}` },
          { label: "Loại xe", value: VEHICLE_LABELS[ticket.vehicleType] },
          { label: "Khu vực", value: ZONE_DESCRIPTIONS[ticket.zone] },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between"
            style={{ paddingTop: 4, paddingBottom: 4, borderBottom: "1px solid #eee" }}
          >
            <span style={{ fontSize: 10, color: "#555", minWidth: 72 }}>{row.label}:</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#000", textAlign: "right", flex: 1 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <TicketSep />

      {/* ── WARNINGS ────────────────────────────────────────────── */}
      <div
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {/* Bold warning banner */}
        <div
          style={{
            background: "#000",
            color: "#fff",
            textAlign: "center",
            padding: "5px 8px",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          ⚠ VÉ CHỈ SỬ DỤNG MỘT LẦN
        </div>

        {[
          "• Xuất trình vé khi ra khỏi bãi xe.",
          "• Giữ vé khô ráo, tránh gấp hoặc làm nhòe mã.",
          "• Mất vé: liên hệ nhân viên, áp dụng quy trình",
          "  xử lý vé thất lạc, có thể phát sinh phí phạt.",
          "• Phí phạt mất vé tối thiểu: 50.000 đ.",
          "• Vé hết hiệu lực sau 24 giờ kể từ giờ vào.",
        ].map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 9,
              color: "#333",
              lineHeight: 1.6,
              letterSpacing: 0.2,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <TicketSep />

      {/* ── BARCODE ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center py-3">
        <Barcode value={ticket.barcode} />
      </div>

      <TicketSep />

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1" style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 8, color: "#888", textAlign: "center", letterSpacing: 0.3 }}>
          Powered by IoT-SPMS v2.4.1 • HCMUT © 2025
        </div>
        <div style={{ fontSize: 8, color: "#aaa" }}>
          Cảm ơn bạn đã sử dụng dịch vụ bãi xe
        </div>
      </div>

      {/* ── CUT MARK ────────────────────────────────────────────── */}
      <div style={{ marginTop: 16, position: "relative" }}>
        <div
          style={{
            borderTop: "2px dashed #bbb",
            width: "100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "0 6px",
            fontSize: 9,
            color: "#999",
          }}
        >
          ✂ CẮT ĐÂY
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export function TicketPrint() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("motorbike");
  const [gate, setGate] = useState<GateId>("A1");
  const [zone, setZone] = useState<ZoneId>("A");
  const [ticket, setTicket] = useState<TicketData>(() => makeTicket("motorbike", "A1", "A"));
  const [printing, setPrinting] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    setTicket(makeTicket(vehicleType, gate, zone));
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 1800);
  }, [vehicleType, gate, zone]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #thermal-ticket, #thermal-ticket * { visibility: visible !important; }
          #thermal-ticket {
            position: fixed !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ background: "#F0F2F5" }}>
        {/* ── PAGE HEADER ──────────────────────────────────────────── */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ background: "white", borderColor: "#E0E4EA" }}
        >
          <div className="flex items-center gap-3">
            <Link
              to="/gate-kiosk"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-gray-100"
              style={{ color: "#555" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kiosk cổng
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: "#0055A4" }} />
              <span className="font-semibold text-gray-800">UI-09 – Vé in khách vãng lai</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 hidden sm:block">
            Mô phỏng vé in nhiệt 80mm
          </div>
        </div>

        {/* ── MAIN LAYOUT ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row gap-0">
          {/* ── LEFT: Controls ─────────────────────────────────────── */}
          <div
            className="w-full lg:w-80 shrink-0 border-r flex flex-col"
            style={{ background: "white", borderColor: "#E0E4EA" }}
          >
            <div className="p-5 border-b" style={{ borderColor: "#E0E4EA" }}>
              <div className="flex items-center gap-2 mb-1">
                <Settings2 className="w-4 h-4" style={{ color: "#0055A4" }} />
                <span className="font-semibold text-gray-800">Thông số vé</span>
              </div>
              <p className="text-xs text-gray-500">
                Cấu hình thông tin rồi tạo vé mới để xem trước
              </p>
            </div>

            <div className="flex-1 p-5 space-y-5">
              {/* Vehicle type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Loại phương tiện
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["motorbike", "car", "truck"] as VehicleType[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVehicleType(v)}
                      className="py-2 px-1 rounded-lg text-xs font-semibold border transition-all"
                      style={{
                        background: vehicleType === v ? "#0055A4" : "white",
                        color: vehicleType === v ? "white" : "#555",
                        borderColor: vehicleType === v ? "#0055A4" : "#D1D5DB",
                      }}
                    >
                      {VEHICLE_LABELS[v]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gate */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Cổng vào
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["A1", "A2", "B1", "B2"] as GateId[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGate(g)}
                      className="py-2 rounded-lg text-xs font-bold border transition-all"
                      style={{
                        background: gate === g ? "#0055A4" : "white",
                        color: gate === g ? "white" : "#555",
                        borderColor: gate === g ? "#0055A4" : "#D1D5DB",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Khu vực gợi ý
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["A", "B", "C", "D"] as ZoneId[]).map((z) => (
                    <button
                      key={z}
                      onClick={() => setZone(z)}
                      className="py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all text-left"
                      style={{
                        background: zone === z ? "#EFF6FF" : "white",
                        color: zone === z ? "#0055A4" : "#555",
                        borderColor: zone === z ? "#0055A4" : "#D1D5DB",
                      }}
                    >
                      <span className="font-bold">Khu {z}</span>
                      <br />
                      <span style={{ fontSize: 10, opacity: 0.7 }}>
                        {z === "A" || z === "B" ? "Tầng trệt" : z === "C" ? "Xe máy T1" : "Ô tô T2"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket info */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "#F8FAFC", border: "1px solid #E0E4EA" }}
              >
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Vé hiện tại
                </div>
                <div className="font-mono text-sm font-bold text-gray-900">{ticket.id}</div>
                <div className="text-xs text-gray-500">
                  {ticket.entryDate} — {ticket.entryTime}
                </div>
                <div className="text-xs text-gray-500">
                  Cổng {ticket.gate} · {VEHICLE_LABELS[ticket.vehicleType]} · Khu {ticket.zone}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-5 border-t space-y-3" style={{ borderColor: "#E0E4EA" }}>
              <motion.button
                onClick={handleGenerate}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  background: justGenerated ? "#F0FDF4" : "white",
                  color: justGenerated ? "#16A34A" : "#0055A4",
                  borderColor: justGenerated ? "#86EFAC" : "#0055A4",
                }}
              >
                {justGenerated ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Đã tạo vé mới!
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Tạo vé mới
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handlePrint}
                whileTap={{ scale: 0.97 }}
                disabled={printing}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: printing
                    ? "#6B8CAE"
                    : "linear-gradient(135deg, #0055A4, #003E8A)",
                  boxShadow: printing ? "none" : "0 4px 12px rgba(0,85,164,0.3)",
                }}
              >
                <Printer className="w-4 h-4" />
                {printing ? "Đang mở hộp in..." : "In vé (Ctrl+P)"}
              </motion.button>

              <p className="text-xs text-center text-gray-400">
                Chọn "Save as PDF" hoặc máy in nhiệt 80mm
              </p>
            </div>
          </div>

          {/* ── RIGHT: Ticket Preview ───────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-start p-6 lg:p-10 overflow-auto">
            {/* Preview label */}
            <div className="flex items-center gap-2 mb-6 self-start">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Xem trước vé in
              </span>
              <span
                className="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
                style={{ background: "#FFF3CD", color: "#856404" }}
              >
                Tỷ lệ 1:1 · 300px (≈ 80mm)
              </span>
            </div>

            {/* Paper simulation */}
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, type: "spring", damping: 20 }}
              style={{
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                borderRadius: 4,
                background: "white",
              }}
            >
              <ParkingTicket ticket={ticket} />
            </motion.div>

            {/* Print size note */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div
                className="flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs"
                style={{ background: "white", border: "1px solid #E0E4EA", color: "#6B7280" }}
              >
                <span>📏 Chiều rộng: 80mm (300px màn hình)</span>
                <div className="w-px h-4 bg-gray-200" />
                <span>🖨 Khổ giấy nhiệt tiêu chuẩn</span>
                <div className="w-px h-4 bg-gray-200" />
                <span>⚫ Độ tương phản cao</span>
              </div>
              <div className="text-xs text-gray-400">
                Nhấn <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs">Ctrl+P</kbd> hoặc nút "In vé" để in trực tiếp
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
