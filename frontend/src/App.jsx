// App.jsx
// Defines all the routes in the app.
// Public routes = anyone can visit (Homepage, Login, Register)
// Protected routes = only logged in users can visit (Dashboard, Upload, Expenses, Chat)

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Expenses from "./pages/Expenses";
import Chat from "./pages/Chat";
import ExpenseDetail from "./pages/ExpenseDetail";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
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

        {/* :id is a dynamic parameter = matches any expense ID in the URL
            e.g. /expenses/abc-123 : id = "abc-123" */}
        <Route
          path="/expenses/:id"
          element={
            <ProtectedRoute>
              <ExpenseDetail />
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
