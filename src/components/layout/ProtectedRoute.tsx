import { Navigate } from "react-router-dom";
import  useAuth from "../../hooks/useAuth";
import AppLayout from "./AppLayout";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <AppLayout>{children}</AppLayout>;
}