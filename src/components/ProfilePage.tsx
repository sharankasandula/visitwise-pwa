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
              className="flex items-center gap-2 pr-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
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
        <div className="p-8 bg-accent rounded-lg border border-border">
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
              <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm font-medium  mb-4">
                Guest User
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm font-medium  mb-4">
                Google Account
              </span>
            )}

            {/* Account Details */}
            {/* <div className="mt-8 text-left max-w-md mx-auto">
              <div className="space-y-4">

              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
