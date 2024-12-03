import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid2 as Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { SessionTimes } from "../../pages/Booking";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useSlots } from "../../context/SlotContext";

dayjs.extend(advancedFormat);

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
}

interface TimeSlotBookingProps {
  handleBooking: (slots: number[]) => Promise<boolean>;
}

const TimeSlotBooking: React.FC<TimeSlotBookingProps> = () => {
  const { availableTimeSlots, selectedSession, selectedDate } = useSlots();
  const [selectedBay, setSelectedBay] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<AvailableTimeSlot | null>(null);

  const handleBaySelection = (bayId: number) => {
    setSelectedBay(bayId);
  };

  const handleTimeSlotSelection = (timeSlot: AvailableTimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const renderAvailableBays = () => {
    console.log(availableTimeSlots);
    return Object.keys(availableTimeSlots).map((bayId) => (
      <Grid size={{ xs: 6, md: 3 }} key={bayId}>
        <Button
          variant={selectedBay === parseInt(bayId) ? "contained" : "outlined"}
          color="primary"
          fullWidth
          onClick={() => handleBaySelection(parseInt(bayId))}
        >
          Bay {bayId}
        </Button>
      </Grid>
    ));
  };

  const renderAvailableTimeSlots = () => {
    if (!selectedBay) return null;
    console.log(selectedBay);

    const bayTimeSlots =
      selectedSession === 4
        ? Object.values(availableTimeSlots).flat()
        : availableTimeSlots[selectedBay] || [];

    return bayTimeSlots.map((timeSlot, index) => (
      <Grid size={{ xs: 12, md: 6 }} key={index}>
        <Button
          variant={selectedTimeSlot === timeSlot ? "contained" : "outlined"}
          color="secondary"
          fullWidth
          onClick={() => handleTimeSlotSelection(timeSlot)}
        >
          {dayjs(timeSlot.startTime).format("hh:mm a") +
            " - " +
            dayjs(timeSlot.endTime).format("hh:mm a")}
        </Button>
      </Grid>
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Select a Bay
      </Typography>
      <Grid container spacing={2}>
        {renderAvailableBays()}
      </Grid>

      {selectedBay && (
        <>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Select a Time Slot
          </Typography>
          <Grid container spacing={2}>
            {renderAvailableTimeSlots()}
          </Grid>
        </>
      )}

      {selectedTimeSlot && (
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6">Booking Summary</Typography>
          <Typography>
            Bay: {selectedBay}
            <br />
            Date: {selectedDate.format("dddd Do MMM YYYY")}
            <br />
            Time: {dayjs(selectedTimeSlot.startTime).format("hh:mm a")} -
            {dayjs(selectedTimeSlot.endTime).format("hh:mm a")}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Confirm Booking
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default TimeSlotBooking;
