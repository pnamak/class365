export const USER_ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
} as const;

export type DbUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ALL_ROLES: DbUserRole[] = Object.values(USER_ROLES);

/** Map DB role → Class 365 UI role. */
export function toAppRole(
  role: string,
): "admin" | "teacher" | "student" | "parent" {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "admin";
    case USER_ROLES.TEACHER:
      return "teacher";
    case USER_ROLES.STUDENT:
      return "student";
    case USER_ROLES.PARENT:
      return "parent";
    default:
      return "teacher";
  }
}

export function toDbRole(
  role: "admin" | "teacher" | "student" | "parent",
): DbUserRole {
  switch (role) {
    case "admin":
      return USER_ROLES.ADMIN;
    case "teacher":
      return USER_ROLES.TEACHER;
    case "student":
      return USER_ROLES.STUDENT;
    case "parent":
      return USER_ROLES.PARENT;
  }
}
