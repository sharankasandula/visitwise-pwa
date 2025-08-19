import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Card } from "./ui/Card";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
    specialties: "",
    experience: "",
    education: "",
  });

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: "",
      location: "",
      bio: "",
      specialties: "",
      experience: "",
      education: "",
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">
                Manage your professional profile and information
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                {/* Avatar Section */}
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-center bg-gray-100 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    user.name
                  )}
                </h2>

                <p className="text-gray-600 mb-4">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="text-center bg-gray-100 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    user.email
                  )}
                </p>

                {user.isAnonymous && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 mb-4">
                    Guest User
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-xs text-gray-500">Patients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.9</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-gray-500">Years</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900">+1 (555) 123-4567</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                      placeholder="Enter location"
                    />
                  ) : (
                    <p className="text-gray-900">San Francisco, CA</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Professional Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={3}
                      className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900">
                      Experienced healthcare professional dedicated to providing
                      exceptional patient care with a focus on personalized
                      treatment plans and compassionate service.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.specialties}
                      onChange={(e) =>
                        handleInputChange("specialties", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                      placeholder="Enter your specialties"
                    />
                  ) : (
                    <p className="text-gray-900">
                      Primary Care, Preventive Medicine, Chronic Disease
                      Management
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.experience}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                        placeholder="Years of experience"
                      />
                    ) : (
                      <p className="text-gray-900">5+ years</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.education}
                        onChange={(e) =>
                          handleInputChange("education", e.target.value)
                        }
                        className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
                        placeholder="Degree and institution"
                      />
                    ) : (
                      <p className="text-gray-900">MD, Stanford University</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity & Performance */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Activity & Performance
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">On-time Rate</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">4.9</div>
                  <div className="text-sm text-gray-600">Patient Rating</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">127</div>
                  <div className="text-sm text-gray-600">Active Patients</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
