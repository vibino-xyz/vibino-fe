/**
 * Typed client for the nexy auth service. All calls go to the same-origin
 * base path (default "/api/nexy") which Next.js proxies to the Go backend, so
 * the browser never makes a cross-origin request.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/nexy";

export type OnboardingStep = "PASSWORD" | "PROFILE" | "ORGANIZATION" | "COMPLETE";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string | null;
  profile_url?: string | null;
  is_verified: boolean;
  onboarding_step: OnboardingStep;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  description: string;
  profile_url: string;
  created_at: string;
  updated_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
}

export interface AuthResult {
  user: User;
  tokens: TokenPair;
}

export interface StartResult {
  next: "LOGIN" | "VERIFY";
}

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role_id: string;
  invited_by: string;
  status: string;
  expires_at: string;
  accepted_at?: string | null;
  created_at: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  tokens: TokenPair;
}

export interface InviteMemberInput {
  email: string;
  role?: string;
}

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface OrganizationMembership {
  organization: Organization;
  role: Role;
  member_count: number;
}

export interface Member {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string | null;
  profile_url?: string | null;
  role: Role;
  is_owner: boolean;
  joined_at: string;
}

export interface InvitationView {
  id: string;
  email: string;
  role: Role;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  invited_by_email: string;
  expires_at: string;
  created_at: string;
}

/** Error carrying the HTTP status so callers can branch on it. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "POST", body, token } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Is nexy running?");
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ?? "Something went wrong. Please try again.";
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const api = {
  start: (email: string) =>
    request<StartResult>("/auth/start", { body: { email } }),

  verify: (email: string, code: string) =>
    request<AuthResult>("/auth/verify", { body: { email, code } }),

  resendOtp: (email: string) =>
    request<void>("/auth/resend-otp", { body: { email } }),

  login: (email: string, password: string) =>
    request<AuthResult>("/auth/login", { body: { email, password } }),

  refresh: (refreshToken: string) =>
    request<AuthResult>("/auth/refresh", { body: { refresh_token: refreshToken } }),

  logout: (refreshToken: string) =>
    request<void>("/auth/logout", { body: { refresh_token: refreshToken } }),

  setPassword: (password: string, token: string) =>
    request<User>("/auth/password", { body: { password }, token }),

  completeProfile: (
    input: { first_name: string; last_name: string; username: string },
    token: string,
  ) => request<User>("/auth/profile", { body: input, token }),

  me: (token: string) => request<User>("/me", { method: "GET", token }),

  createOrganization: (
    input: { name: string; slug: string; description: string },
    token: string,
  ) =>
    request<CreateOrganizationResult>("/onboarding/organization", {
      body: input,
      token,
    }),

  inviteMembers: (invitations: InviteMemberInput[], token: string) =>
    request<{ invitations: Invitation[] }>("/onboarding/invitations", {
      body: { invitations },
      token,
    }),

  // --- workspace (organizations, members, invitations) ---

  listOrganizations: (token: string) =>
    request<{ organizations: OrganizationMembership[] }>("/organizations", {
      method: "GET",
      token,
    }),

  currentOrganization: (token: string) =>
    request<OrganizationMembership>("/organizations/current", {
      method: "GET",
      token,
    }),

  updateOrganization: (
    input: { name: string; description: string },
    token: string,
  ) =>
    request<Organization>("/organizations/current", {
      method: "PATCH",
      body: input,
      token,
    }),

  switchOrganization: (organizationId: string, token: string) =>
    request<{ tokens: TokenPair }>(
      `/organizations/${organizationId}/switch`,
      { method: "POST", token },
    ),

  listMembers: (token: string) =>
    request<{ members: Member[] }>("/members", { method: "GET", token }),

  changeMemberRole: (memberId: string, role: Role, token: string) =>
    request<Member>(`/members/${memberId}`, {
      method: "PATCH",
      body: { role },
      token,
    }),

  removeMember: (memberId: string, token: string) =>
    request<void>(`/members/${memberId}`, { method: "DELETE", token }),

  listInvitations: (token: string) =>
    request<{ invitations: InvitationView[] }>("/invitations", {
      method: "GET",
      token,
    }),

  invite: (invitations: InviteMemberInput[], token: string) =>
    request<{ invitations: Invitation[] }>("/invitations", {
      body: { invitations },
      token,
    }),

  revokeInvitation: (invitationId: string, token: string) =>
    request<void>(`/invitations/${invitationId}`, {
      method: "DELETE",
      token,
    }),
};
