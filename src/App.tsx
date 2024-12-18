import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { SlotsProvider } from "./context/SlotContext";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <SlotsProvider>
          <AppRouter />
        </SlotsProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;
