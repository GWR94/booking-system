import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import axios from "../utils/axiosConfig";
import dayjs, { Dayjs } from "dayjs";
import { SessionTimes } from "../pages/Booking";

type Bays = "1" | "2" | "3" | "4";

export interface SlotsContextType {
  availableTimeSlots: {
    [key: string]: AvailableTimeSlot[];
  };
  selectedDate: Dayjs;
  selectedSession: SessionTimes;
  selectedBay: Bays | null;
  searchedSlot: TimeSlot | null;
  getUniqueSlot: (slotId: number) => void;
  setSelectedBay: (bay: Bays) => void;
  setSelectedDate: (date: Dayjs) => void;
  setSelectedSession: (session: SessionTimes) => void;
  isLoading: boolean;
  allSlotsForDay: TimeSlot[];
}

export interface SlotsProviderProps {
  children: React.ReactNode;
}

const SlotsContext = createContext<SlotsContextType | null>(null);

// Define TypeScript interfaces for type safety
interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  bayId: number;
}

interface AvailableTimeSlot {
  bayId: number;
  startTime: string;
  endTime: string;
  slot: TimeSlot;
}

interface TimeSlotBookingProps {
  timeSlots: TimeSlot[];
  selectedDate: Dayjs;
  selectedSession: SessionTimes;
  handleBooking: (slots: number[]) => Promise<boolean>;
}

export const SlotsProvider: React.FC<SlotsProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isLoading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionTimes>(1);
  const [selectedBay, setSelectedBay] = useState<Bays | null>(null);
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [searchedSlot, setSearchedSlot] = useState<TimeSlot | null>(null);

  const getAvailableTimeSlots = (
    timeSlots: TimeSlot[],
    selectedDate: Dayjs,
    session: number
  ): Record<number, AvailableTimeSlot[]> => {
    const sessionDuration = session * 60 * 60 * 1000;
    const formattedDate = selectedDate.toISOString().split("T")[0];

    const availableSlots = timeSlots.filter(
      (slot: TimeSlot) =>
        slot.status === "available" && slot.startTime.startsWith(formattedDate)
    );

    setAllSlots(availableSlots);

    const baySlots: Record<number, TimeSlot[]> = {};
    availableSlots.forEach((slot) => {
      if (!baySlots[slot.bayId]) {
        baySlots[slot.bayId] = [];
      }
      baySlots[slot.bayId].push(slot);
    });

    const availableTimeslots: Record<number, AvailableTimeSlot[]> = {};
    Object.keys(baySlots).forEach((bayId) => {
      const continuousSlots = findContinuousSlots(
        baySlots[Number(bayId)],
        sessionDuration,
        session
      );
      availableTimeslots[Number(bayId)] = continuousSlots;
    });

    return availableTimeslots;
  };

  const findContinuousSlots = (
    slots: TimeSlot[],
    requiredDuration: number,
    session: number
  ): AvailableTimeSlot[] => {
    const sortedSlots = [...slots].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const continuousSlots: AvailableTimeSlot[] = [];

    for (let i = 0; i <= sortedSlots.length - session; i++) {
      const startSlot = sortedSlots[i];
      const endSlot = sortedSlots[i + session - 1];

      const startTime = new Date(startSlot.startTime);
      const endTime = new Date(endSlot.endTime);
      const duration = endTime.getTime() - startTime.getTime();

      if (duration === requiredDuration) {
        continuousSlots.push({
          bayId: startSlot.bayId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          slot: startSlot,
        });
      }
    }
    return continuousSlots;
  };

  const availableTimeSlots = useMemo(
    () => getAvailableTimeSlots(timeSlots, selectedDate, selectedSession),
    [timeSlots, selectedDate, selectedSession]
  );

  useEffect(() => {
    // Fetch available slots for the selected date (current date as default)
    const getAvailableSlots = async () => {
      try {
        // console.log(selectedDate);
        const { data } = await axios.get(`/api/slots`, {
          params: {
            from: dayjs(selectedDate).startOf("day").toDate(),
            to: dayjs(selectedDate).endOf("day").toDate(),
          },
        });
        setTimeSlots(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    };
    getAvailableSlots();
  }, [selectedDate]);

  const getUniqueSlot = async (slotId: number) => {
    const slot = allSlots.filter((slot) => slot.id === slotId)[0];
    if (slot) setSearchedSlot(slot);

    const { data } = await axios.get("/api/slots", {
      params: {
        id: slotId
      }
    });
    setSearchedSlot(data.slot)

  }

  const value: SlotsContextType = {
    allSlotsForDay: allSlots,
    availableTimeSlots,
    selectedDate,
    selectedSession,
    selectedBay,
    searchedSlot,
    setSelectedDate: (date: Dayjs) => setSelectedDate(date),
    setSelectedSession: (session: SessionTimes) => setSelectedSession(session),
    setSelectedBay: (bay: Bays) => setSelectedBay(bay),
    getUniqueSlot: (slotId: number) => getUniqueSlot(slotId),
    isLoading,
  };
  return (
    <SlotsContext.Provider value={value}>{children}</SlotsContext.Provider>
  );
};

export const useSlots = (): SlotsContextType => {
  const context = useContext(SlotsContext);
  if (!context) {
    throw new Error("useSlots most be used within a SlotsProvider");
  }
  return context;
};
