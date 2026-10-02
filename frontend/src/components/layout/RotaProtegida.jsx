import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RotaProtegida({ children }) {
  const { estaAutenticado } = useAuth();
  const local = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ de: local.pathname }} />;
  }
  return children;
}
