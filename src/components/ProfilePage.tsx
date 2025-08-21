import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Card } from "./ui/Card";
import { ArrowLeft, User } from "lucide-react";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-8 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold pl-4 text-foreground">
                Profile
              </h1>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="p-8">
          <div className="text-center">
            {/* Avatar Section */}
            <div className="mb-6">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user.photoURL} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-semibold text-card-foreground mb-2">
              {user.name}
            </h2>

            <p className="text-muted-foreground mb-4">{user.email}</p>

            {/* Account Type Badge */}
            {user.isAnonymous ? (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 mb-4">
                Guest User
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 mb-4">
                Google Account
              </span>
            )}

            {/* Account Details */}
            <div className="mt-8 text-left max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Account Type
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.isAnonymous ? "Anonymous Guest" : "Google Sign-in"}
                    </p>
                  </div>
                </div>

                {!user.isAnonymous && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Verified
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Google verified account
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
