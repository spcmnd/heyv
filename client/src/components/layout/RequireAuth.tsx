import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../providers/authContext.ts";
import FullPageSpinner from "../FullPageSpinner.tsx";

function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
