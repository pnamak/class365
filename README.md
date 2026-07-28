# Class 365 — Cloud Education Management Platform

Class 365 unifies a **Student Information System (SIS)**, **Learning Management System (LMS)**, and **Customer Relationship Management (CRM)** into one centralized campus dashboard.

## Features

- **Pre-admission enrollment** — application pipeline from inquiry to enrolled
- **Automated attendance** — auto, biometric, and manual capture
- **Gradebook management** — weighted assignments and letter grades
- **Billing** — tuition installments, fees, and overdue tracking
- **Reporting** — cross-module campus KPIs
- **Distance learning** — live sessions tied back to SIS attendance
- **Alumni tracking** — engagement, careers, and giving

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Sign in** or go to `/signin`.

### Demo accounts

Password for all roles: `demo123`

| Role | Email |
| --- | --- |
| Admin | `admin@class365.edu` |
| Teacher | `teacher@class365.edu` |
| Student | `student@class365.edu` |
| Parent | `parent@class365.edu` |

You can also one-click sign in from the role cards on `/signin`.

## App routes

| Route | Module |
| --- | --- |
| `/` | Marketing landing |
| `/signin` | Role-based sign in |
| `/dashboard` | Centralized overview |
| `/students` | SIS directory |
| `/enrollment` | Pre-admission |
| `/attendance` | Attendance |
| `/gradebook` | Grades |
| `/courses` | LMS catalog |
| `/learning` | Distance learning |
| `/crm` | Admissions CRM |
| `/billing` | Tuition & fees |
| `/alumni` | Alumni network |
| `/reports` | Analytics |

Demo data lives in `src/lib/data.ts`.
