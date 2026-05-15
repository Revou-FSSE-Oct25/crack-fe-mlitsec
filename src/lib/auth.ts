import type { AuthResponse, Role, User } from './types';

const TOKEN_KEY = 'barbershop_token';
const USER_KEY = 'barbershop_user';
export const AUTH_EVENT = 'barbershop_auth_changed';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function saveAuth(data: AuthResponse) {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getToken() {
  if (!isBrowser()) return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (!isBrowser()) return null;

  const user = localStorage.getItem(USER_KEY);

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    logout();
    return null;
  }
}

export function logout() {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
  window.location.href = '/login';
}

export function requireRole(role: Role) {
  const user = getUser();
  const token = getToken();

  if (!token || user?.role !== role) {
    window.location.href = '/login';
    return null;
  }

  return user;
}
