import React, { useState } from "react";
import { useAuth } from "context/AuthContext";
import Container from "Components/Container/Container";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  PencilSimple,
  SignOut,
  Warning,
  CheckCircle,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import usePost from "Hooks/usePost";
import useAuthenticatedPost from "Hooks/useAuthenticatedPost";
import { useToast } from "Components/Toast/Toast";

const Profile = () => {
  const { user, isLoggedIn, logout, updateVerification, updateUserProfile } =
    useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const {
    loading: passwordLoading,
    error: passwordError,
    postData: changePassword,
  } = useAuthenticatedPost();
  const {
    loading: profileLoading,
    error: profileError,
    postData: updateProfile,
  } = useAuthenticatedPost();
  const { showToast, ToastComponent } = useToast();

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // If not logged in or still checking, show loading
  if (!isLoggedIn || !user) {
    return (
      <div className="py-secondary lg:py-primary bg-background">
        <Container>
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </Container>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords don't match", "error");
      return;
    }

    try {
      const response = await changePassword(
        "/auth/change-password",
        passwordForm
      );

      if (response.success) {
        showToast("Password changed successfully!", "success");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      // Password change failed
      showToast("Failed to change password. Please try again.", "error");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!profileForm.fullName.trim()) {
      showToast("Full name is required", "error");
      return;
    }

    if (!profileForm.phoneNumber.trim()) {
      showToast("Phone number is required", "error");
      return;
    }

    try {
      const response = await updateProfile("/auth/update-profile", {
        fullName: profileForm.fullName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
      });

      if (response.success) {
        // Update the user in context with new data
        const updatedUserData = response.data.user;
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const newUserData = { ...currentUser, ...updatedUserData };

        // Update localStorage and context
        localStorage.setItem("user", JSON.stringify(newUserData));

        showToast("Profile updated successfully!", "success");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  const handleVerifyEmail = () => {
    navigate("/verify-email", { state: { email: user.email } });
  };

  return (
    <>
      <ToastComponent />
      <div className="py-secondary lg:py-primary bg-background">
        <Container>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row lg:items-center md:items-start justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-secondary mb-1">
                    {user.fullName}
                  </h1>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    {user.verified ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <Warning size={16} className="mr-1" />
                        <span className="text-sm font-medium">Unverified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {!user.verified && (
                  <button
                    onClick={handleVerifyEmail}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Verify Email
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                >
                  <SignOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-gray-100"
              }`}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "password"
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-gray-100"
              }`}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
          </div>

          {/* Content Sections */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <PencilSimple size={24} className="text-primary" />
                <h2 className="text-2xl font-bold text-secondary">
                  Edit Profile
                </h2>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full border border-primary px-2 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full border border-primary px-2 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-gray-300 px-2 py-3 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                {profileError && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {profileError.message}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {profileLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Lock size={24} className="text-primary" />
                <h2 className="text-2xl font-bold text-secondary">
                  Change Password
                </h2>
              </div>

              {!user.verified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Warning size={20} className="text-yellow-600" />
                    <p className="text-yellow-800 font-medium">
                      You need to verify your email address before changing your
                      password.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full border border-primary px-2 py-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:border-gray-300"
                      placeholder="Enter your current password"
                      disabled={!user.verified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeSlash size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full border border-primary px-2 py-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:border-gray-300"
                      placeholder="Enter your new password"
                      disabled={!user.verified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeSlash size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full border border-primary px-2 py-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:border-gray-300"
                      placeholder="Confirm your new password"
                      disabled={!user.verified}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {passwordError.message}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordLoading || !user.verified}
                    className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Profile;
