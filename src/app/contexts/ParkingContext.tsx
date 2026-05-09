import { createContext, useContext, useState, ReactNode } from "react";

interface ParkingContextType {
  availableSpots: number;
  totalSpots: number;
  decreaseSpots: () => void;
  increaseSpots: () => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: ReactNode }) {
  const [availableSpots, setAvailableSpots] = useState(45);
  const totalSpots = 120;

  const decreaseSpots = () => {
    setAvailableSpots((prev) => Math.max(0, prev - 1));
  };

  const increaseSpots = () => {
    setAvailableSpots((prev) => Math.min(totalSpots, prev + 1));
  };

  return (
    <ParkingContext.Provider
      value={{ availableSpots, totalSpots, decreaseSpots, increaseSpots }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParkingData() {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error("useParkingData must be used within ParkingProvider");
  }
  return context;
}
