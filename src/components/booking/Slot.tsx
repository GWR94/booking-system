import { Button, Container } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

type SlotProps = {
  slot: iSlot;
  handleBooking: (slots: number[]) => void;
};

// TODO
// [ ] set unavailable if time already gone

export type StatusType = "available" | "booked" | "unavailable";
export interface iSlot {
  id: number;
  startTime: Dayjs;
  endTime: Dayjs;
  status: StatusType;
  bookings: Booking[];
  slots: number[];
  bayId: number;
}

interface Booking {
  id: number;
  userId: number;
  slotId: number;
  bookingTime: Dayjs;
  status: StatusType;
  user: User;
  slot: iSlot;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  bookings: Booking[];
}

const Slot = ({ slot, handleBooking }: SlotProps) => {
  return (
    <Container sx={{ my: 1 }}>
      <Button
        onClick={() => handleBooking(slot.slots)}
        disabled={slot.status !== "available"}
        key={slot.id}
        variant="contained"
        fullWidth
      >
        {dayjs(slot.startTime).format("HH:mm")} -{" "}
        {dayjs(slot.endTime).format("HH:mm")} ({slot.status})
      </Button>
    </Container>
  );
};

export default Slot;
