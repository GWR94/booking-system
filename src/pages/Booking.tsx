import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import dayjs from "dayjs";
import { Container, Typography } from "@mui/material";
import GenerateSlots from "../components/booking/GenerateSlots";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/common/NavBar";
import SessionPicker from "../components/booking/SessionPicker";
import ManageBookings from "../components/booking/ManageBookings";

export type SessionTimes = 1 | 2 | 3 | 4;
const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [sessionTime, setSessionTime] = useState<SessionTimes>(1);
  const [slots, setSlots] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch available slots for the selected date (current date as default)
    const getAvailableSlots = async (from?: Date) => {
      // console.log(selectedDate);
      const { data } = await axios.get(`/api/slots`, {
        params: {
          from: dayjs(selectedDate).startOf("day").toDate(),
          to: dayjs(selectedDate).endOf("day").toDate(),
        },
      });
      setSlots(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    getAvailableSlots();
  }, [selectedDate]);

  const handleBooking = async (slots: number[]): Promise<boolean> => {
    try {
      const slotId = slots[0];
      console.log(user);
      // slots.forEach(async (slotId) => {
      const { data } = await axios.post(`/api/bookings`, {
        userId: user?.id,
        slotId,
      });
      console.log(data, user?.id, slotId);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <SessionPicker />
        <Typography variant="h4">Available Slots</Typography>
        <GenerateSlots
          handleBooking={(slots: number[]) => handleBooking(slots)}
        />
        <ManageBookings />
      </Container>
    </>
  );
};

export default Booking;
