import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { ManualOverride } from "./pages/ManualOverride";
import { DeviceErrorHandling } from "./pages/DeviceErrorHandling";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { CardRegistration } from "./pages/CardRegistration";
import { RequestManagement } from "./pages/RequestManagement";
import { LostCardHandling } from "./pages/LostCardHandling";
import { LostTicketHandling } from "./pages/LostTicketHandling";
import { ParkingHistory } from "./pages/ParkingHistory";
import { DebtPayment } from "./pages/DebtPayment";
import { SubmitComplaint } from "./pages/SubmitComplaint";
import { ComplaintManagement } from "./pages/ComplaintManagement";
import { UserManagement } from "./pages/UserManagement";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { PricingConfiguration } from "./pages/PricingConfiguration";
import { AuditLog } from "./pages/AuditLog";
import { ParkingMapOverview } from "./pages/ParkingMapOverview";
import { ParkingLotDetail } from "./pages/ParkingLotDetail";
import { DeviceManagement } from "./pages/DeviceManagement";
import { EntryGate } from "./pages/EntryGate";
import { ExitGate } from "./pages/ExitGate";
import { GateKiosk } from "./pages/GateKiosk";
import { TicketPrint } from "./pages/TicketPrint";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/gate-kiosk",
    Component: GateKiosk,
  },
  {
    path: "/ticket-print",
    Component: TicketPrint,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "request-management",
        Component: RequestManagement,
      },
      {
        path: "complaint-management",
        Component: ComplaintManagement,
      },
      { path: "user-management", Component: UserManagement },
      { path: "analytics", Component: AnalyticsDashboard },
      {
        path: "pricing-config",
        Component: PricingConfiguration,
      },
      { path: "audit-log", Component: AuditLog },
      {
        path: "user/parking-history",
        Component: ParkingHistory,
      },
      { path: "user/debt-payment", Component: DebtPayment },
      {
        path: "user/submit-complaint",
        Component: SubmitComplaint,
      },
      { path: "lost-card", Component: LostCardHandling },
      { path: "lost-ticket", Component: LostTicketHandling },
      { path: "override", Component: ManualOverride },
      { path: "device-errors", Component: DeviceErrorHandling },
      {
        path: "card-registration",
        Component: CardRegistration,
      },
      { path: "parking-map", Component: ParkingMapOverview },
      {
        path: "parking-lot-detail",
        Component: ParkingLotDetail,
      },
      {
        path: "device-management",
        Component: DeviceManagement,
      },
      { path: "entry-gate", Component: EntryGate },
      { path: "exit-gate", Component: ExitGate },
      { path: "*", Component: NotFound },
    ],
  },
]);