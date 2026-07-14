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
} from "lucide-react";

export const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/reports", label: "Reporting", icon: LineChart },
    ],
  },
  {
    label: "SIS",
    items: [
      { href: "/students", label: "Students", icon: School },
      { href: "/enrollment", label: "Enrollment", icon: UserPlus },
      { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/gradebook", label: "Gradebook", icon: BookOpen },
    ],
  },
  {
    label: "LMS",
    items: [
      { href: "/courses", label: "Courses", icon: GraduationCap },
      { href: "/learning", label: "Distance Learning", icon: MonitorPlay },
    ],
  },
  {
    label: "CRM & Finance",
    items: [
      { href: "/crm", label: "Admissions CRM", icon: Users },
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/alumni", label: "Alumni", icon: UsersRound },
    ],
  },
] as const;
