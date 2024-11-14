import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Slot, { iSlot } from "../components/Slot";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid2 as Grid,
} from "@mui/material";
import GenerateSlots from "../components/GenerateSlots";

interface BookingProps {
  token: string | null;
}

type SessionTimes = 1 | 2 | 3 | 4;
const Booking = ({ token }: BookingProps) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [slots, setSlots] = useState<iSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionTime, setSessionTime] = useState<SessionTimes>(1);

  const handleSessionChange = () => {};

  // Function to check availability for the chosen duration
  const checkAvailability = (startIndex, duration) => {
    // Ensure there are enough subsequent slots for the selected duration
    for (let i = 0; i < duration; i++) {
      const slot = slots[startIndex + i];
      if (!slot || slot.status === "booked") return false;
    }
    return true;
  };

  const handleBooking = async (slotId: number) => {
    const { data } = await axios.post(
      "/api/booking",
      { slotId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set the content type if necessary
        },
      }
    );
    fetch(`/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Booking confirmed!");
        setSlots((prevSlots: iSlot[]) =>
          prevSlots.map((slot: iSlot) =>
            slot.id === slotId ? { ...slot, status: "booked" } : slot
          )
        );
      })
      .catch((error) => console.error("Error making booking:", error));
  };

  return (
    <Container>
      <DatePicker
        label="Booking Date"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Dayjs)}
      />
      <FormControl>
        <InputLabel id="session-label">Session Length</InputLabel>
        <Select
          labelId="session-label"
          id="session"
          value={sessionTime}
          label="Session Length"
          onChange={(e) => {
            setSessionTime(e.target.value as SessionTimes);
            handleSessionChange();
          }}
        >
          <MenuItem value={1}>1 Hour</MenuItem>
          <MenuItem value={2}>2 Hours</MenuItem>
          <MenuItem value={3}>3 Hours</MenuItem>
          <MenuItem value={4}>All Slots</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="h4">Available Slots</Typography>
      <GenerateSlots selectedDate={selectedDate} session={sessionTime} />
    </Container>
  );
};

export default Booking;
