import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { initializeAuth } from "../store/slices/authSlice";
import Login from "./Login";
import { LoadingScreen } from "./ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Initialize authentication on component mount
    dispatch(initializeAuth() as any);
  }, [dispatch]);

  // Show beautiful loading screen while checking authentication
  if (loading) {
    return (
      <LoadingScreen
        text="Initializing Visitwise..."
        showLogo={true}
        variant="gradient"
      />
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
