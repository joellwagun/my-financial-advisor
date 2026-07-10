// ProtectedRoute.jsx
// A wrapper component that protects pages from unauthenticated access.
// If the user is not logged in (no token), they get redirected to /login.
// If they are logged in, the page renders normally.

// Navigate = redirects the user to another page
import { Navigate } from "react-router-dom";

// children = the page we want to protect
// e.g. <ProtectedRoute><Dashboard /></ProtectedRoute>
// "children" here is <Dashboard />
export default function ProtectedRoute({ children }) {
  // Check if a JWT token exists in localStorage
  // localStorage.getItem("token") returns:
  //   - the token string if logged in
  //   - null if not logged in
  const token = localStorage.getItem("token");

  // If no token = redirect to login
  // <Navigate> works like navigate() but inside JSX
  // replace={true} means the /login page replaces the current page
  // in browser history (so pressing Back doesn't go back to the protected page)
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  // If token exists = render the actual page
  return children;
}
