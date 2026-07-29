export type StudentStatus = "active" | "pending" | "withdrawn" | "alumni";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";
export type LeadStage =
  | "inquiry"
  | "tour"
  | "application"
  | "accepted"
  | "enrolled"
  | "lost";

/** Full Kindy → Year 13 pathway used across the SIS. */
export type YearLevel =
  | "Kindy"
  | "Year 1"
  | "Year 2"
  | "Year 3"
  | "Year 4"
  | "Year 5"
  | "Year 6"
  | "Year 7"
  | "Year 8"
  | "Year 9"
  | "Year 10"
  | "Year 11"
  | "Year 12"
  | "Year 13";

export type SchoolBand =
  | "Early Childhood"
  | "Primary"
  | "Intermediate"
  | "Secondary";

export type MessageChannel = "email" | "sms" | "app" | "portal";
export type MessageAudience =
  | "all-school"
  | "band"
  | "year-level"
  | "class"
  | "family";

export type IntegrationStatus = "connected" | "syncing" | "error" | "available";

export interface Student {
  id: string;
  name: string;
  email: string;
  yearLevel: YearLevel;
  band: SchoolBand;
  homeroom: string;
  program: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number;
  advisor: string;
  guardian: string;
  guardianEmail: string;
  enrolledAt: string;
  avatar: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  teacher: string;
  yearLevels: YearLevel[];
  band: SchoolBand;
  students: number;
  schedule: string;
  mode: "in-person" | "hybrid" | "online";
  progress: number;
  term: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  yearLevel: YearLevel;
  course: string;
  date: string;
  status: AttendanceStatus;
  method: "auto" | "manual" | "biometric";
}

export interface GradeEntry {
  id: string;
  studentName: string;
  yearLevel: YearLevel;
  course: string;
  assignment: string;
  score: number;
  maxScore: number;
  weight: string;
  submittedAt: string;
  scale: "numeric" | "otj" | "ncea";
}

export interface Invoice {
  id: string;
  studentName: string;
  yearLevel: YearLevel;
  description: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  stage: LeadStage;
  interest: string;
  yearLevel: YearLevel;
  lastContact: string;
  score: number;
}

export interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  program: string;
  employer: string;
  location: string;
  engagement: "high" | "medium" | "low";
  donated: number;
}

export interface LiveSession {
  id: string;
  title: string;
  course: string;
  yearLevels: YearLevel[];
  host: string;
  startsAt: string;
  duration: string;
  attendees: number;
  status: "live" | "upcoming" | "ended";
}

export interface EnrollmentApplication {
  id: string;
  applicant: string;
  program: string;
  yearLevel: YearLevel;
  submittedAt: string;
  status: "review" | "interview" | "documents" | "approved" | "waitlist";
  completeness: number;
}

export interface Message {
  id: string;
  subject: string;
  from: string;
  audience: MessageAudience;
  target: string;
  channel: MessageChannel;
  sentAt: string;
  opens: number;
  status: "sent" | "scheduled" | "draft";
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  lastSync: string;
}
