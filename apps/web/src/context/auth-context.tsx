"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_AUTH_KEY = "mcp_builder_auth_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load auth state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis." };
    }
    if (password.length < 6) {
      return { success: false, error: "Mot de passe invalide (6 caractères minimum)." };
    }

    const authedUser: AuthUser = {
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
    };

    setUser(authedUser);
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authedUser));
    } catch (e) {}

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoaded, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
