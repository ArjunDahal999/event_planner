/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { authService } from "@/services/auth.service";
import { tokenStore } from "@/utils/token-store";
import { ILoginResponse, LoginUserDTO } from "@event-planner/shared";
import React, { createContext, useCallback, useEffect, useState } from "react";

interface IAuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    payload: LoginUserDTO,
  ) => Promise<{ data: ILoginResponse; message: string }>;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      tokenStore().clearAccessToken();
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (payload: LoginUserDTO) => {
    const { data, message } = await authService().loginWith2FA(payload);
    tokenStore().setAccessToken(data.accessToken);
    setIsAuthenticated(true);
    return {
      data,
      message,
    };
  };

  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to refresh token");
      }
      const d = await res.json();
      const accessToken = d.data.accessToken;
      tokenStore().setAccessToken(accessToken);
      setIsAuthenticated(true);
      return accessToken;
    } catch {
      // logout if access_token has expired
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    silentRefresh().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
