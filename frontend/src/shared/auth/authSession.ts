import { useSyncExternalStore } from "react";
import { getStoredAuthSession, setStoredAuthSession, type StoredAuthSession } from "../api/authStorage";

type AuthSessionState = StoredAuthSession | null;

let authSessionState: AuthSessionState = typeof window === "undefined" ? null : getStoredAuthSession();

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function getAuthSession() {
  return authSessionState;
}

export function setAuthSession(session: StoredAuthSession | null) {
  authSessionState = session;
  setStoredAuthSession(session);
  emitChange();
}

export function clearAuthSession() {
  setAuthSession(null);
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useAuthSession() {
  const session = useSyncExternalStore(subscribe, getAuthSession, getAuthSession);

  return {
    session,
    isAuthenticated: Boolean(session?.accessToken && session?.refreshToken),
  };
}
