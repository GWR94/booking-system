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
import { SessionTimes } from "../../pages/Booking";
import { Bays, useSlots } from "../../context/SlotContext";

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
        m: "0 auto",
        p: 3,
        borderTop: "1px solid #1976d2",
        borderBottom: "1px solid #1976d2",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Find Session
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Select your preferred date and specify the desired duration of your simulator session. <br />
        Picking a specific bay is entirely optional.
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, sm: 12 }} >
          <Box
            sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
          >
            <DatePicker
              label="Booking Date"
              value={selectedDate}
              format="dddd Do MMM 'YY"
              onChange={(date) => setSelectedDate(date as Dayjs)}
              sx={{ width: "100%" }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
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
            </Select>
          </FormControl>

        </Grid>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="session-label">Bay</InputLabel>
            <Select
              labelId="session-label"
              id="session"
              value={selectedBay}
              label="Bay"
              onChange={(e) => setSelectedBay(e.target.value as Bays)}
            >
              <MenuItem value={5}>Any</MenuItem>
              <MenuItem value={1}>Bay 1</MenuItem>
              <MenuItem value={2}>Bay 2</MenuItem>
              <MenuItem value={3}>Bay 3</MenuItem>
              <MenuItem value={4}>Bay 4</MenuItem>

            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionPicker;
