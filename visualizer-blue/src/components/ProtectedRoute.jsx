import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const isAuthenticated = Boolean(user && JSON.parse(user)?.email);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
