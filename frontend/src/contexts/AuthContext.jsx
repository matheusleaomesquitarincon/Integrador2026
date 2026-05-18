import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HttpError } from "../services/http";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authService
      .fetchMe()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (!(err instanceof HttpError) || err.status !== 401) {
          console.error("Falha ao buscar /me:", err);
        }
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (login, password) => {
    const data = await authService.login({ login, password });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await authService.register({ username, email, password });
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout falhou:", err);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: !!user }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  }
  return ctx;
};
