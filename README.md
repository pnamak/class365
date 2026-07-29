# Class 365 — Student Management for Kindy to Year 13

Class 365 is a cloud education platform structured around the full **Kindy → Year 13** pathway (Early Childhood, Primary, Intermediate, Secondary). It unifies student information, attendance, grade management, communications, LMS, CRM, billing, and school-system integrations.

## Key student management features

- **SIS for students** — electives, classes, credits, year level, guardians, pastoral care
- **Attendance tracking** — auto, biometric, and manual rolls by year level
- **Grade management** — OTJs / learning stories, numeric marks, NCEA standards
- **Class schedules** — weekly timetable by band, period, room, and teacher
- **Social learning** — discussions, peer review, projects, and clubs
- **Library** — catalog, loans, reservations, and overdue tracking
- **Health records** — immunisations, allergies, medications, visits, care plans
- **Communication tools** — app, email, SMS, and portal messages by band/year/class/family
- **Billing** — school fees and levies in **Vanuatu Vatu (VT)**
- **Integrations** — MoET Vanuatu, Google/Microsoft Education, assessment feeds, Vatu payments, campus ID

Also included: enrollment CRM, distance learning, alumni, and reporting.

Localized demo campus: **Harbour Academy Port Vila**, Vanuatu.

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

## App routes

| Route | Module |
| --- | --- |
| `/` | Marketing landing |
| `/signin` | Role-based sign in |
| `/dashboard` | Centralized overview |
| `/students` | SIS — students, electives, classes & credits |
| `/enrollment` | Pre-admission |
| `/attendance` | Attendance tracking |
| `/gradebook` | Grade management |
| `/health` | Health records |
| `/communications` | Family / school messaging |
| `/schedule` | Class schedules |
| `/classes` | Classes by year level |
| `/social` | Social learning |
| `/library` | Library & loans |
| `/learning` | Distance learning |
| `/crm` | Admissions CRM |
| `/billing` | Tuition & fees |
| `/alumni` | Alumni network |
| `/integrations` | School system connectors |
| `/reports` | Analytics |

Demo data lives in `src/lib/data.ts`.
