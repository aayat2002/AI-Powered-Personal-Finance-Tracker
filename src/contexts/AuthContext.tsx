import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterData } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API calls
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation (in real app, this would be server-side)
    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "demo123"
    ) {
      const newUser: User = {
        id: "1",
        name: "Demo User",
        email: credentials.email,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        preferences: {
          currency: "INR",
          timezone: "Asia/Kolkata",
          notifications: true,
        },
        createdAt: new Date("2024-01-01"),
        lastLogin: new Date(),
      };

      setUser(newUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation
    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      preferences: {
        currency: "INR",
        timezone: "Asia/Kolkata",
        notifications: true,
      },
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    // Clear all user-specific data
    localStorage.removeItem("transactions");
    localStorage.removeItem("budgets");
    localStorage.removeItem("goals");
    localStorage.removeItem("categories");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
