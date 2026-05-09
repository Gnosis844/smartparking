import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { ParkingProvider } from "./contexts/ParkingContext";

export default function App() {
  return (
    <ParkingProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ParkingProvider>
  );
}
