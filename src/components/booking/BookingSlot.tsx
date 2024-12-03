import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { Booking } from "./ManageBookings";

interface BookingSlotProps {
  booking: Booking;
}

const BookingSlot = ({ booking }: BookingSlotProps) => {
  return (
    <div>
      <Typography variant="h4">
        {dayjs(booking.slot.startTime).format("DD/MM/YYYY - HH:mm") +
          " - " +
          dayjs(booking.slot.endTime).format("HH:mm")}
      </Typography>
    </div>
  );
};

export default BookingSlot;
