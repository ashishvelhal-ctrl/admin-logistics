export interface SessionAuthState {
  token: string | null;
  user: string | null;
  roles: string[];
}

export const getAuthFromSessionStorage = (): SessionAuthState => {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return { token: null, user: null, roles: [] };
  }

  const authStorage = sessionStorage.getItem("auth");
  if (!authStorage) return { token: null, user: null, roles: [] };

  try {
    const authState = JSON.parse(authStorage);
    const roles = Array.isArray(authState?.roles)
      ? authState.roles
      : authState?.role
        ? [authState.role]
        : [];

    return {
      token: authState?.token || null,
      user: authState?.user || null,
      roles,
    };
  } catch {
    return { token: null, user: null, roles: [] };
  }
};

export const getRolesFromSessionStorage = (): string[] =>
  getAuthFromSessionStorage().roles;
