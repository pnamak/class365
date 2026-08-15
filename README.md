# Class 365

**Class 365** is a school management system for schools in **Vanuatu**, built on [OS4ED openSIS Classic](https://github.com/OS4ED/openSIS-Classic).

Demo campus: **Harbour Academy Port Vila** (Shefa, Vanuatu). Billing/currency context: **Vanuatu Vatu (VT / VUV)**.

## Stack

- PHP 8.2 + Apache
- MariaDB 10.11
- openSIS Classic CE 9.3 modules (students, staff, scheduling, attendance, grades, messaging, …)

## Quick start (Docker)

```bash
docker compose up -d --build
```

Open http://localhost:8080

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `demo123` |

## Coolify deploy

1. Push this branch to GitHub.
2. In Coolify, create an application from this repo with **Docker Compose** build pack (`docker-compose.yml`), **or** run:

```bash
export COOLIFY_URL="https://YOUR-COOLIFY-HOST"
export COOLIFY_TOKEN="2|...."
chmod +x scripts/deploy-coolify.sh
./scripts/deploy-coolify.sh
```

`COOLIFY_URL` must be your Coolify instance base URL (Cloud token alone is not enough for self-hosted; `app.coolify.io` rejected this token as unauthenticated).

## License

openSIS is GPL-2.0 — see `docs/License.txt`.
