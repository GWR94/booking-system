// src/App.tsx
import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Booking from "../pages/Booking";
import RegisterUser from "../pages/RegisterUser";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import Landing from "../pages/Landing";
import NavBar from "../components/common/NavBar";
import Profile from "../pages/Profile";

const App: FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/book" element={<Booking />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
