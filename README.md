# Atrium — Cloud Education Management Platform

Atrium unifies a **Student Information System (SIS)**, **Learning Management System (LMS)**, and **Customer Relationship Management (CRM)** into one centralized campus dashboard.

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

Open [http://localhost:3000](http://localhost:3000). Use **Enter the platform** or go directly to `/dashboard`.

## App routes

| Route | Module |
| --- | --- |
| `/` | Marketing landing |
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
