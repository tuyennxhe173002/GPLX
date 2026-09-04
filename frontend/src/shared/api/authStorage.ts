const ACCESS_TOKEN_KEY = "gplx_access_token";
const REFRESH_TOKEN_KEY = "gplx_refresh_token";
const AUTH_USER_KEY = "gplx_auth_user";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role?: UserRole;
  status?: "ACTIVE" | "DISABLED" | "LOCKED";
  mustChangePassword?: boolean;
  permissions?: string[];
  lastLoginAt?: string;
  createdAt?: string;
};

export type StoredAuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    return;
  }
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredAuthUser(): AuthUser | null {
  const raw = window.localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function setStoredAuthUser(user: AuthUser | null) {
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredAuthSession(): StoredAuthSession | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const user = getStoredAuthUser();

  if (!accessToken || !refreshToken || !user) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export function setStoredAuthSession(session: StoredAuthSession | null) {
  setAccessToken(session?.accessToken ?? null);
  setRefreshToken(session?.refreshToken ?? null);
  setStoredAuthUser(session?.user ?? null);
}
