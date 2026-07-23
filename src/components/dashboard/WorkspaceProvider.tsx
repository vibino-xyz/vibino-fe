"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  api,
  type Organization,
  type OrganizationMembership,
  type Role,
  type User,
} from "@/lib/api";
import {
  authorized,
  clearSession,
  getAccessToken,
  getRefreshToken,
  setStoredUser,
  setTokens,
} from "@/lib/session";
import { LogoMark } from "@/components/ui/Logo";

interface WorkspaceContextValue {
  user: User;
  organization: Organization;
  role: Role;
  isManager: boolean;
  memberCount: number;
  memberships: OrganizationMembership[];
  switching: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (user: User) => void;
  updateOrganization: (organization: Organization) => void;
  signOut: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return value;
}

interface LoadedState {
  user: User;
  current: OrganizationMembership;
  memberships: OrganizationMembership[];
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<LoadedState | null>(null);
  const [fatal, setFatal] = useState(false);
  const [switching, setSwitching] = useState(false);

  const load = useCallback(async (): Promise<LoadedState> => {
    const [user, current, list] = await Promise.all([
      authorized((token) => api.me(token)),
      authorized((token) => api.currentOrganization(token)),
      authorized((token) => api.listOrganizations(token)),
    ]);
    setStoredUser(user);
    return { user, current, memberships: list.organizations };
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth");
      return;
    }

    let active = true;
    load()
      .then((loaded) => {
        if (!active) return;
        // No active organization yet → finish onboarding first.
        if (!loaded.current?.organization) {
          router.replace("/onboarding");
          return;
        }
        setState(loaded);
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        router.replace("/auth");
        setFatal(true);
      });

    return () => {
      active = false;
    };
  }, [router, load]);

  const refresh = useCallback(async () => {
    const loaded = await load();
    setState(loaded);
  }, [load]);

  const switchOrganization = useCallback(
    async (organizationId: string) => {
      setSwitching(true);
      try {
        const { tokens } = await authorized((token) =>
          api.switchOrganization(organizationId, token),
        );
        setTokens(tokens);
        const loaded = await load();
        setState(loaded);
      } finally {
        setSwitching(false);
      }
    },
    [load],
  );

  const updateUser = useCallback((user: User) => {
    setStoredUser(user);
    setState((prev) => (prev ? { ...prev, user } : prev));
  }, []);

  const updateOrganization = useCallback((organization: Organization) => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            current: { ...prev.current, organization },
            memberships: prev.memberships.map((m) =>
              m.organization.id === organization.id
                ? { ...m, organization }
                : m,
            ),
          }
        : prev,
    );
  }, []);

  const signOut = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        // Best-effort; clear locally regardless.
      }
    }
    clearSession();
    router.replace("/auth");
  }, [router]);

  if (fatal) return null;

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <LogoMark size={32} />
          <span className="text-[13px] text-fg-subtle">Loading your workspace…</span>
        </div>
      </div>
    );
  }

  const role = state.current.role;
  const value: WorkspaceContextValue = {
    user: state.user,
    organization: state.current.organization,
    role,
    isManager: role === "OWNER" || role === "ADMIN",
    memberCount: state.current.member_count,
    memberships: state.memberships,
    switching,
    switchOrganization,
    refresh,
    updateUser,
    updateOrganization,
    signOut,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
