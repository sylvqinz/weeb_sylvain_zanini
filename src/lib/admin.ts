import { request } from "./api";
import { type AuthUser } from "./auth";

export type AdminUser = AuthUser & {
  id?: string | number;
  user_id?: string | number;
  pk?: string | number;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
  created_at?: string;
  is_active?: boolean;
  is_staff?: boolean;
};

type UsersResponse = AdminUser[] | { results?: AdminUser[]; users?: AdminUser[]; data?: AdminUser[] };

function normalizeUsers(data: UsersResponse) {
  if (Array.isArray(data)) {
    return data;
  }

  return data.results || data.users || data.data || [];
}

export function getAdminUserId(user: AdminUser) {
  const value = user.id || user.user_id || user.pk;

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

export function fetchAdminUsers() {
  return request<UsersResponse>("/api/admin/users/").then(normalizeUsers);
}

export function validateAdminUser(userId: string) {
  return request<AdminUser>(`/api/admin/users/${userId}/`, {
    method: "PATCH",
    data: { is_active: true },
  });
}

export function deactivateAdminUser(userId: string) {
  return request<AdminUser>(`/api/admin/users/${userId}/`, {
    method: "PATCH",
    data: { is_active: false },
  });
}
