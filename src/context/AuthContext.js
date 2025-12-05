import { createContext, useState, useContext, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkLoggedIn = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

      // Authentication status loaded

      if (storedIsLoggedIn === "true") {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = (responseData) => {
    const userData = responseData.data.user;
    const userToken = responseData.data.token;

    // Save to state
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Register function
  const register = (responseData) => {
    const userData = responseData.data.user;
    const userToken = responseData.data.token;

    // Save to state
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

  // Update user verification status
  const updateVerification = (verificationStatus) => {
    if (user) {
      const updatedUser = { ...user, verified: verificationStatus };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Update user profile data
  const updateUserProfile = (userData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        updateVerification,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
