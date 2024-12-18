import { Container } from "@mui/material";
import GenerateSlots from "../components/booking/GenerateSlots";
import { useAuth } from "../context/AuthContext";
import SessionPicker from "../components/booking/SessionPicker";
import ManageBookings from "../components/booking/ManageBookings";
import LoadingSpinner from "../components/common/LoadingSpinner";

export type SessionTimes = 1 | 2 | 3 | 4;
const Booking = () => {
  const { isLoading } = useAuth();
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <SessionPicker />
        {isLoading ? <LoadingSpinner /> : (
          <>
            <GenerateSlots />
            <ManageBookings />
          </>
        )}
      </Container>
    </>
  );
};

export default Booking;
