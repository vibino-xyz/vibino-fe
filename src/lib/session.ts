/**
 * Client-side session storage for the auth tokens returned by nexy.
 *
 * Tokens live in localStorage so the multi-step signup/onboarding flow can
 * carry the access token between pages. `authorized` transparently refreshes an
 * expired access token once before giving up.
 *
 * NOTE: localStorage is readable by any script on the origin. For production,
 * consider moving to httpOnly cookies set by a Next.js route handler.
 */

"use client";

import { api, ApiError, type AuthResult, type OnboardingStep, type TokenPair, type User } from "@/lib/api";

const ACCESS_KEY = "nexy.access_token";
const REFRESH_KEY = "nexy.refresh_token";
const USER_KEY = "nexy.user";

const isBrowser = () => typeof window !== "undefined";

export function setSession(result: AuthResult): void {
  if (!isBrowser()) return;
  setTokens(result.tokens);
  localStorage.setItem(USER_KEY, JSON.stringify(result.user));
}

export function setTokens(tokens: TokenPair): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
}

export function setStoredUser(user: User): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  return isBrowser() ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken(): string | null {
  return isBrowser() ? localStorage.getItem(REFRESH_KEY) : null;
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Runs an access-token-authenticated call, refreshing the token once if the
 * server rejects it with 401. Throws if there is no valid session.
 */
export async function authorized<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new ApiError(401, "Not signed in");

  try {
    return await fn(token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;

    const refreshToken = getRefreshToken();
    if (!refreshToken) throw error;

    const refreshed = await api.refresh(refreshToken);
    setSession(refreshed);
    return fn(refreshed.tokens.access_token);
  }
}

/** Where a user should land given how far they are through onboarding. */
export function routeForStep(step: OnboardingStep): string {
  return step === "COMPLETE" ? "/dashboard" : "/onboarding";
}
