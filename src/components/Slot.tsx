import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

type SlotProps = {
  slot: iSlot;
  handleBooking: (id: number) => void;
};

// TODO
// [ ] set unavailable if time already gone

type Status = "available" | "booked" | "unavailable";
export interface iSlot {
  id: number;
  startTime: Dayjs;
  endTime: Dayjs;
  status: Status;
  bookings: Booking[];
  slots: number[];
}

interface Booking {
  id: number;
  userId: number;
  slotId: number;
  bookingTime: Dayjs;
  status: Status;
  user: User;
  slot: iSlot;
}

interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  bookings: Booking[];
}

const Slot = ({ slot, handleBooking }: SlotProps) => {
  // console.log(JSON.stringify(slot));
  return (
    <Button
      onClick={() => handleBooking(slot.id)}
      disabled={slot.status !== "available"}
      key={slot.id}
      variant="contained"
      sx={{ mb: 2 }}
    >
      {dayjs(slot.startTime).format("HH:mm")} -{" "}
      {dayjs(slot.endTime).format("HH:mm")} ({slot.status})
    </Button>
  );
};

export default Slot;
