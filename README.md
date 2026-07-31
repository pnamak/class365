# Class 365 — Student Management for Kindy to Year 13

Class 365 is a cloud education platform structured around the full **Kindy → Year 13** pathway (Early Childhood, Primary, Intermediate, Secondary). It unifies student information, attendance, grade management, communications, LMS, CRM, billing, and school-system integrations.

Backend foundation is adapted from DigitalOcean’s [Sea Notes SaaS starter kit](https://github.com/digitalocean/sea-notes-saas-starter-kit): NextAuth, Prisma, Stripe/Resend/Spaces-ready settings, and App Platform deploy templates.

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

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- **NextAuth (Auth.js)** — credentials sessions (Sea Notes pattern)
- **Prisma + PostgreSQL** — same as Sea Notes / DigitalOcean App Platform
- Lucide icons
- Stripe / Resend / DigitalOcean Spaces env stubs (Sea Notes integrations)

## Getting started

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
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


## Backend API (authenticated)

| Route | Description |
| --- | --- |
| `/api/auth/*` | NextAuth handlers |
| `/api/health` | Liveness |
| `/api/system-status` | Sea Notes–style integration status |
| `/api/students` | SIS students (Prisma) |
| `/api/classes` | School classes |
| `/api/invoices` | Fee invoices (VT) |
| `/api/electives` | Elective offerings |
| `/api/notes` | Sea Notes sample notes |

## Deploy (DigitalOcean App Platform)

Spec: `.do/app.yaml` (Sea Notes–aligned).

1. Create the app from this repo (or sync the app spec).
2. Attach the `class365-db` Postgres component — `DATABASE_URL` is bound as `${class365-db.DATABASE_URL}`.
3. Set **`AUTH_SECRET`** in the App Platform UI (required secret).
4. Deploy. Boot runs `prisma migrate deploy`, seeds demo data only when the DB is empty, then `npm start`.

If an older deploy failed with `the URL must start with the protocol file:`, that was the SQLite schema mismatch — this branch uses PostgreSQL only.

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

UI modules still use rich demo datasets in `src/lib/data.ts`; authenticated APIs persist the same seed into Prisma.
