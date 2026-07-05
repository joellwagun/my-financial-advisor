// Navbar.jsx
// The top navigation bar shown on all protected pages (Dashboard, Upload, Expenses).
// Has links to navigate between pages and a logout button.

import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();

  // useLocation tells us the current URL path
  // We use this to highlight the active link
  const location = useLocation();

  // Check if a path is the current page
  const isActive = (path) => location.pathname === path;

  // Logout — clear the token and go to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="border-b px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-7 h-7 bg-[#EEEDFE] rounded-lg flex items-center justify-center text-base">
          💼
        </div>
        <span className="text-sm font-medium">FinAdvisor</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <Button
          variant={isActive("/dashboard") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant={isActive("/upload") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/upload")}
        >
          Upload
        </Button>
        <Button
          variant={isActive("/expenses") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </Button>
        <Button
          variant={isActive("/chat") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => navigate("/chat")}
        >
          Chat
        </Button>
      </div>

      {/* Logout */}
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
}
