import { Container, Typography } from "@mui/material";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../context/AuthContext";
import BookingSlot from "./BookingSlot";
import { StatusType, iSlot } from "./Slot";

export interface Booking {
  id: number;
  userId: number;
  slotId: number;
  bookingTime: Dayjs;
  status: StatusType;
  slot: iSlot;
}

const ManageBookings = () => {
  const { user } = useAuth();

  if (!user?.bookings || user?.bookings.length === 0) return null;

  return (
    <Container>
      <Typography>Manage Bookings</Typography>
      {user.bookings.map((booking: Booking) => (
        <BookingSlot booking={booking} />
      ))}
    </Container>
  );
};

export default ManageBookings;
