import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
  const userToken = localStorage.getItem("token");
  const location = useLocation();

  return userToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
