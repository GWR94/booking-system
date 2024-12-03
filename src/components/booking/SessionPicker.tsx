import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2 as Grid,
  Box,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import React from "react";
import { SessionTimes } from "../../pages/Booking";
import { useSlots } from "../../context/SlotContext";

const SessionPicker = () => {
  const {
    selectedDate,
    selectedSession,
    selectedBay,
    setSelectedBay,
    setSelectedDate,
    setSelectedSession,
  } = useSlots();
  return (
    <Box
      maxWidth="sm"
      sx={{
        background: "#eaecff",
        p: 5,
        m: "0 auto",
        borderRadius: "25px",
        mb: 4,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Pick a session
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        Pick a date and then select how long you wish to be on the simulator for
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
          >
            <DatePicker
              label="Booking Date"
              value={selectedDate}
              format="dddd Do MMM YYYY"
              onChange={(date) => setSelectedDate(date as Dayjs)}
              sx={{ width: "100%" }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="session-label">Session Length</InputLabel>
            <Select
              labelId="session-label"
              id="session"
              value={selectedSession}
              label="Session Length"
              onChange={(e) =>
                setSelectedSession(e.target.value as SessionTimes)
              }
            >
              <MenuItem value={1}>1 Hour</MenuItem>
              <MenuItem value={2}>2 Hours</MenuItem>
              <MenuItem value={3}>3 Hours</MenuItem>
              <MenuItem value={4}>All Slots</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}></Grid>
      </Grid>
    </Box>
  );
};

export default SessionPicker;
