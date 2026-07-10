// App.jsx
// Defines all the routes in the app.
// Public routes = anyone can visit (Homepage, Login, Register)
// Protected routes = only logged in users can visit (Dashboard, Upload, Expenses, Chat)

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Expenses from "./pages/Expenses";
import Chat from "./pages/Chat";

// ProtectedRoute = the gatekeeper component
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES ---
            Anyone can visit these, logged in or not */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PROTECTED ROUTES ---
            Only logged in users can visit these.
            If not logged in = redirected to /login automatically.
            We wrap each page with <ProtectedRoute> </ProtectedRoute> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
