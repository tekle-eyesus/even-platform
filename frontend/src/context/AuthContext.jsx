import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../features/auth/services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login Action
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      // Backend returns: { data: { user, accessToken, refreshToken } }
      const { user, accessToken } = response.data;

      // Save to state
      setUser(user);

      // Save token to LocalStorage (for Authorization header)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error; // Throw to Login.jsx to handle UI error state
    }
  };

  // Register Action
  const register = async (userData) => {
    try {
      // Backend returns created user, but usually requires login after
      // Or if your backend logs them in automatically, adjust here.
      // Based on your controller, register returns just the user.
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout Action
  const logout = async () => {
    try {
      await authService.logout(); // Tell backend to clear cookies
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Clear frontend state regardless of backend success
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
