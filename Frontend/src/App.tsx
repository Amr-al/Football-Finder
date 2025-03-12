import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/navbar/Navbar";
import Pitches from "./components/pitches/Pitches";
import PitchDetails from "./components/pitch/PitchDetails";
import UserProfile from "./components/UserProfile/UserProfile";
import AdminProfile from "./components/AdminProfile/AdminProfile";
import UserDashboard from "./components/Dashboard/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material";
import ScrollToTop from "./components/ScrollToTop";
import VerifyOtp from "./components/VerifyOtp/VerifyOtp";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import OwnerDashboard from "./components/OwnerDashboard/OwnerDashboard";
import ProtectedRoute from "./ProtectedRoute";

const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#28a745",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/home" element={<Home />} />

          <Route
            element={<ProtectedRoute allowedRoles={["user"]} redirectTo="/" />}
          >
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
          <Route
            element={<ProtectedRoute allowedRoles={["owner"]} redirectTo="/" />}
          >
            <Route path="/owner-dashboard/:id" element={<OwnerDashboard />} />
            <Route path="/admin-profile/:id" element={<AdminProfile />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/" />}
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/pitches" element={<Pitches />} />
          <Route path="/pitches/:id" element={<Pitches />} />
          <Route path="/pitch/:id" element={<PitchDetails />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
