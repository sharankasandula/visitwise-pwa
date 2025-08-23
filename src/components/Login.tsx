import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import {
  signInWithGoogle,
  signInAnonymously,
  clearError,
} from "../store/slices/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Alert, AlertDescription } from "./ui/Alert";
import {
  Loader2,
  Chrome,
  User,
  Heart,
  Stethoscope,
  Calendar,
  Users,
} from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleGoogleSignIn = () => {
    dispatch(clearError());
    showSuccess(
      "Signing in...",
      "Please wait while we authenticate you with Google."
    );
    dispatch(signInWithGoogle() as any);
  };

  const handleAnonymousSignIn = () => {
    dispatch(clearError());
    showSuccess("Signing in...", "Welcome! You're signing in as a guest user.");
    dispatch(signInAnonymously() as any);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background px-4 relative overflow-hidden">
      {/* Background Art Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <div
          className="absolute top-20 left-10 text-primary/20 animate-bounce"
          style={{ animationDelay: "0s" }}
        >
          <Heart className="w-16 h-16" />
        </div>
        <div
          className="absolute top-32 right-16 text-secondary/20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <Stethoscope className="w-12 h-12" />
        </div>
        <div
          className="absolute bottom-32 left-20 text-accent/20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          <Calendar className="w-14 h-14" />
        </div>
        <div
          className="absolute bottom-20 right-24 text-primary/20 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Users className="w-10 h-10" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* App Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-pacifico bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            VisitWise
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Smart Patient Management
          </p>
        </div>

        <Card className="w-full backdrop-blur-sm bg-card border border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-muted-foreground mb-2">
              Welcome Back! 👋
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to access your patient management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="mr-3 h-5 w-5" />
                )}
                Continue with Google
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">
                  or
                </span>
              </div>
            </div>

            <button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-muted hover:from-accent/90 hover:to-muted/90 text-accent-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-border/50"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <User className="mr-3 h-5 w-5" />
                )}
                Continue as Guest
              </div>
            </button>

            {/* Feature Highlights */}
            <div className="pt-4 border-t border-border/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Patient Care
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Smart Scheduling
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Better Health
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-2 leading-relaxed">
              By continuing, you agree to our{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={() => navigate("/terms")}
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={() => navigate("/privacy")}
              >
                Privacy Policy
              </span>
              .
              <br />
              <span className="text-accent-foreground">
                Guest users have limited access to features.
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for healthcare professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
