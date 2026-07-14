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

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  program: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number;
  advisor: string;
  enrolledAt: string;
  avatar: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  teacher: string;
  students: number;
  schedule: string;
  mode: "in-person" | "hybrid" | "online";
  progress: number;
  term: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  course: string;
  date: string;
  status: AttendanceStatus;
  method: "auto" | "manual" | "biometric";
}

export interface GradeEntry {
  id: string;
  studentName: string;
  course: string;
  assignment: string;
  score: number;
  maxScore: number;
  weight: string;
  submittedAt: string;
}

export interface Invoice {
  id: string;
  studentName: string;
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
  grade: string;
  submittedAt: string;
  status: "review" | "interview" | "documents" | "approved" | "waitlist";
  completeness: number;
}
