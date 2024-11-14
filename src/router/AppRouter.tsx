// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Booking from "../pages/Booking";
import RegisterUser from "../pages/RegisterUser";
import Dashboard from "../pages/Dashboard";
import NavBar from "../components/NavBar";

const App: React.FC = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    console.log(token);
    setAuth(token);
    return () => {
      setAuth(null);
    };
  }, []);
  const [auth, setAuth] = useState<string | null>(null);
  return (
    <Router>
      <NavBar
        handleSignOut={() => {
          setAuth(null);
          localStorage.removeItem("jwtToken");
        }}
      />
      <Routes>
        <Route path="/" element={auth ? <Dashboard /> : <Login />} />
        <Route path="/book" element={<Booking token={auth} />} />
        <Route path="/register" element={<RegisterUser />} />
        {/*    <Route path="*" element={<NotFound />} /> Fallback route for 404 */}
      </Routes>
    </Router>
  );
};

export default App;
