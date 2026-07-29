export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  password: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: "USR-ADMIN",
    name: "Elena Hale",
    email: "admin@class365.edu",
    role: "admin",
    title: "Registrar · Admin",
    avatar: "EH",
    password: "demo123",
  },
  {
    id: "USR-TEACHER",
    name: "Raj Singh",
    email: "teacher@class365.edu",
    role: "teacher",
    title: "Faculty · CSC & STEM",
    avatar: "RS",
    password: "demo123",
  },
  {
    id: "USR-STUDENT",
    name: "Maya Chen",
    email: "student@class365.edu",
    role: "student",
    title: "Year 11 · NCEA STEM",
    avatar: "MC",
    password: "demo123",
  },
  {
    id: "USR-PARENT",
    name: "Daniel Chen",
    email: "parent@class365.edu",
    role: "parent",
    title: "Parent of Maya Chen",
    avatar: "DC",
    password: "demo123",
  },
];

export const ROLE_META: Record<
  UserRole,
  { label: string; description: string; accent: string }
> = {
  admin: {
    label: "Admin",
    description: "Full campus access — SIS, LMS, CRM, billing, and reports.",
    accent: "teal",
  },
  teacher: {
    label: "Teacher",
    description: "Classes, grades, attendance, and family communications.",
    accent: "amber",
  },
  student: {
    label: "Student",
    description: "Classes, grades, attendance, and live learning sessions.",
    accent: "ink",
  },
  parent: {
    label: "Parent",
    description: "Child progress, attendance, grades, and billing overview.",
    accent: "coral",
  },
};

/** Routes each role can access within the platform. */
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    "/dashboard",
    "/reports",
    "/students",
    "/enrollment",
    "/attendance",
    "/gradebook",
    "/health",
    "/communications",
    "/schedule",
    "/classes",
    "/social",
    "/library",
    "/learning",
    "/crm",
    "/billing",
    "/alumni",
    "/integrations",
  ],
  teacher: [
    "/dashboard",
    "/students",
    "/attendance",
    "/gradebook",
    "/health",
    "/communications",
    "/schedule",
    "/classes",
    "/social",
    "/library",
    "/learning",
  ],
  student: [
    "/dashboard",
    "/attendance",
    "/gradebook",
    "/communications",
    "/schedule",
    "/classes",
    "/social",
    "/library",
    "/learning",
  ],
  parent: [
    "/dashboard",
    "/attendance",
    "/gradebook",
    "/health",
    "/communications",
    "/schedule",
    "/library",
    "/billing",
    "/classes",
  ],
};

export const AUTH_STORAGE_KEY = "class365.auth.user";

export function authenticate(
  email: string,
  password: string,
): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === normalized);
  if (!user || user.password !== password) return null;
  return user;
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const allowed = ROLE_ROUTES[role];
  return allowed.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export type SafeUser = Omit<AuthUser, "password">;

export function toSafeUser(user: AuthUser): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
  };
}
