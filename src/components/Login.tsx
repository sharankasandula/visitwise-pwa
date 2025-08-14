import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  signInWithGoogle,
  signInAnonymously,
  clearError,
} from "../store/slices/authSlice";
import Button from "./ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Alert, AlertDescription } from "./ui/Alert";
import { Loader2, Chrome, User } from "lucide-react";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleGoogleSignIn = () => {
    dispatch(clearError());
    dispatch(signInWithGoogle());
  };

  const handleAnonymousSignIn = () => {
    dispatch(clearError());
    dispatch(signInAnonymously());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to VisitWise
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access your patient management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
            variant="outline"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleAnonymousSignIn}
            disabled={loading}
            className="w-full"
            variant="secondary"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Continue as Guest
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Guest users have limited access to features.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
