import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  MonitorPlay,
  School,
  Users,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/reports",
        label: "Reporting",
        icon: LineChart,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "SIS",
    items: [
      {
        href: "/students",
        label: "Students",
        icon: School,
        roles: ["admin", "teacher"],
      },
      {
        href: "/enrollment",
        label: "Enrollment",
        icon: UserPlus,
        roles: ["admin"],
      },
      {
        href: "/attendance",
        label: "Attendance",
        icon: ClipboardCheck,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/gradebook",
        label: "Gradebook",
        icon: BookOpen,
        roles: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    label: "LMS",
    items: [
      {
        href: "/courses",
        label: "Courses",
        icon: GraduationCap,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/learning",
        label: "Distance Learning",
        icon: MonitorPlay,
        roles: ["admin", "teacher", "student"],
      },
    ],
  },
  {
    label: "CRM & Finance",
    items: [
      {
        href: "/crm",
        label: "Admissions CRM",
        icon: Users,
        roles: ["admin"],
      },
      {
        href: "/billing",
        label: "Billing",
        icon: CreditCard,
        roles: ["admin", "parent"],
      },
      {
        href: "/alumni",
        label: "Alumni",
        icon: UsersRound,
        roles: ["admin"],
      },
    ],
  },
];

export function navForRole(role: UserRole): NavSection[] {
  return navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}
