import React from "react";
import { Link } from "react-router-dom";
import { User } from "@phosphor-icons/react";
import { useAuth } from "context/AuthContext";

const AuthButton = () => {
  const { isLoggedIn, user, loading } = useAuth();

  // Auth button rendered

  // Don't render anything until we've checked if user is logged in
  if (loading) {
    return (
      <div className="flex items-center gap-8">
        <div className="text-secondary bg-secsondary p-[8px] rounded-full flex items-center justify-center">
          <User size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8">
      {isLoggedIn ? (
        <Link
          to="/profile"
          className="text-secondary bg-secondasry p-[8px] rounded-full hover:text-primary flex items-center justify-center relative"
          title="My Profile"
        >
          <User size={24} />
          {/* Green dot for verified users */}
          {user?.verified && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </Link>
      ) : (
        <Link
          to="/login"
          className="text-secondary bg-secondsary p-[8px] rounded-full hover:text-primary flex items-center justify-center"
          title="Login"
        >
          <User size={24} />
        </Link>
      )}
    </div>
  );
};

export default AuthButton;
