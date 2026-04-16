import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status } = useSelector(
    (state) => state.auth
  );
  
  const token = localStorage.getItem("token");

  if (status === "loading") return <div>Loading...</div>;

  return (isAuthenticated || token) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;