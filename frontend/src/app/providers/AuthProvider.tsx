import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "../../shared/auth/authSession";
import {
  setStoredAuthUser,
  type AuthUser,
  type StoredAuthSession,
} from "../../shared/api/authStorage";
import { getCurrentUser } from "../../features/auth/api/authApi";
import type { AuthResponse } from "../../features/auth/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  permissions: string[];
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  role: null,
  permissions: [],
  can: () => false,
  hasRole: () => false,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredAuthSession | null>(() => getAuthSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentSession = getAuthSession();
    if (!currentSession?.accessToken) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    try {
      const remoteUser = await getCurrentUser();
      const updatedUser: AuthUser = {
        id: remoteUser.id,
        email: remoteUser.email,
        fullName: remoteUser.fullName,
        role: remoteUser.role,
        status: remoteUser.status,
        mustChangePassword: remoteUser.mustChangePassword,
        permissions: remoteUser.permissions,
        lastLoginAt: remoteUser.lastLoginAt ?? undefined,
        createdAt: remoteUser.createdAt,
      };

      setStoredAuthUser(updatedUser);
      setSession({
        accessToken: currentSession.accessToken,
        refreshToken: currentSession.refreshToken,
        user: updatedUser,
      });
    } catch {
      // If fetching fails with auth error, session may be expired
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (response: AuthResponse) => {
    const newSession: StoredAuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user,
    };
    setAuthSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearAuthSession();
    setSession(null);
  };

  const user = session?.user ?? null;
  const isAuthenticated = Boolean(session?.accessToken && session?.user);
  const role = user?.role ?? null;
  const permissions = user?.permissions ?? [];

  const can = (permission: string): boolean => {
    if (!isAuthenticated) return false;
    if (role === "ADMIN") return true;
    return permissions.includes(permission);
  };

  const hasRole = (targetRole: string): boolean => {
    if (!isAuthenticated) return false;
    return role === targetRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        permissions,
        can,
        hasRole,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
