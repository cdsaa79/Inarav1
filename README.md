# INARA – MVP 2.2

This repository contains the source code for **INARA**, a digital sustainability intelligence platform.  The goal of the MVP 2.2 release is to make a freemium public portal where visitors can explore a rotating selection of technologies, sign up to run basic simulations, and enable providers to submit new technologies for publication.  Administrators moderate submissions and control the featured project of the day.

## Repository layout

* `apps/web/` – the Next.js application (frontend and API routes)
  * `app/` – pages and layouts using the **app router**
  * `app/api/` – serverless route handlers implementing REST‑ish endpoints
  * `app/dashboard/` – consumer zone pages
  * `app/provider/` – provider dashboard pages
  * `app/admin/` – admin console pages
  * `components/` – reusable React components
  * `lib/` – shared utilities such as Prisma client and authentication config
  * `prisma/` – schema and seed script
* `docs/` – design documentation and seed data
* `.github/` – GitHub actions for CI/CD to Vercel

The PRD is located at `docs/INARA_MVP2_2_PRD.docx` and should be treated as the source of truth.  Familiarise yourself with the sitemap, roles, and feature set described there before making changes.

## Setup

1. Copy `.env.example` to `.env` and fill in the environment variables.  For development you can use a local SQLite database (e.g. `DATABASE_URL=file:./dev.db`).  To use Turso/libSQL or Neon Postgres on Vercel, supply the appropriate connection strings and tokens.
2. Install dependencies with pnpm: `pnpm install` (you may need to install pnpm globally first).
3. Push the Prisma schema to your database: `pnpm --filter ./apps/web prisma db push`.
4. Seed the database with initial technologies and vendors: `pnpm --filter ./apps/web prisma db seed`.
5. Start the development server: `pnpm --filter ./apps/web dev`.

## Deployment

This project is configured for deployment on Vercel.  The `vercel.json` file defines which environment variables should be pulled from the Vercel project.  A GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically build and deploy the app when changes are pushed to the `main` branch, using a Vercel token stored in the repository secrets.  You can also deploy manually using the Vercel CLI:

```bash
npx vercel --prod
```

Be sure to configure the environment variables (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`) in your Vercel project settings.

## A note on roles

* **Guest** – public visitors who can view one full technology profile per day via a cookie (`inara_free_view`), browse categories, and are prompted to register.
* **Consumer** – registered users who can create projects, run limited simulations, and generate reports.  Can upgrade to Pro or Enterprise in the future.
* **Provider** – companies or institutions that list technologies.  They can add and edit technologies and track the status of their submissions.
* **Admin** – internal moderators who approve provider submissions, rotate featured projects, and manage users.

## MVP acceptance criteria

The following high‑level behaviours must work end‑to‑end to satisfy the MVP 2.2 specification:

* The landing page shows a rotating *featured project* fetched from `/api/featured`; unregistered users can view one full project per day.
* Consumers can register, log in and create a project.
* Running a simulation returns ROI/payback/CO₂ figures and persists a `Simulation` row.
* Providers can add a technology; an admin approves it, after which it appears in the browse list.
* Admins can rotate the featured project and moderate submissions.
* PDF reports can be downloaded from a saved simulation (not implemented here but left as an exercise).

This repository provides a scaffold that addresses each of these behaviours.  It uses NextAuth for authentication, Prisma as the ORM, and the App Router for API routes.  UI components are deliberately minimal to keep the focus on functionality; you are encouraged to polish the design and extend the feature set in future releases.
