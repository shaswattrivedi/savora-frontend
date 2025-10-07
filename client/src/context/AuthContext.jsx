import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { apiRequest } from "../utils/api.js";

export const AuthContext = createContext();

const STORAGE_KEY = "savora_auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setToken(parsed.token);
      setUser(parsed.user);
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      data: credentials,
    });
    persist(response.token, response.user);
    return response;
  }, [persist]);

  const register = useCallback(async (formData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      data: formData,
    });
    persist(response.token, response.user);
    return response;
  }, [persist]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await apiRequest("/users/me", { token });
        persist(token, response.user);
      } catch (error) {
        console.error("Failed to refresh profile", error);
        logout();
      }
    };

    fetchProfile();
  }, [token, persist, logout]);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const response = await apiRequest("/users/me", { token });
    const nextUser = { ...user, ...response.user };
    persist(token, nextUser);
    return nextUser;
  }, [token, user, persist]);

  const updateProfile = useCallback(async (updates) => {
    if (!token) throw new Error("Not authenticated");
    const response = await apiRequest("/users/update", {
      method: "PUT",
      data: updates,
      token,
    });
    persist(token, response.user);
    return response.user;
  }, [token, persist]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      setUser: (nextUser) => persist(token, nextUser),
    }),
    [token, user, loading, login, register, logout, refreshProfile, updateProfile, persist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
