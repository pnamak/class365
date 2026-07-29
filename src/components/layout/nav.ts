import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Library,
  LineChart,
  MessagesSquare,
  MonitorPlay,
  Plug,
  School,
  Share2,
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
    label: "Student management",
    items: [
      {
        href: "/students",
        label: "SIS · Students",
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
        label: "Grade management",
        icon: BookOpen,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/health",
        label: "Health records",
        icon: HeartPulse,
        roles: ["admin", "teacher", "parent"],
      },
      {
        href: "/communications",
        label: "Communications",
        icon: MessagesSquare,
        roles: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    label: "Learning & campus",
    items: [
      {
        href: "/schedule",
        label: "Class schedules",
        icon: CalendarDays,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/courses",
        label: "Classes",
        icon: GraduationCap,
        roles: ["admin", "teacher", "student", "parent"],
      },
      {
        href: "/social",
        label: "Social learning",
        icon: Share2,
        roles: ["admin", "teacher", "student"],
      },
      {
        href: "/library",
        label: "Library",
        icon: Library,
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
    label: "CRM, finance & systems",
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
      {
        href: "/integrations",
        label: "Integrations",
        icon: Plug,
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
