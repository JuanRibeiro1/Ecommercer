import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, login as apiLogin } from "../config/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await registerUser(name, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isClient: user?.role === "client",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}