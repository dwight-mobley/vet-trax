# VetTrax

A pet health management application for tracking your pets and their upcoming vet appointments, vaccinations, medications, and more.

## Features

- **Pet Profiles** — Add and manage multiple pets with photos, breed, weight, height, birth date, and notes
- **Reminders** — Create one-time or recurring reminders across 5 categories: vaccination, appointment, medication, test, and other
- **Reminder History** — Mark reminders as complete and view a log of completed care
- **Email Notifications** — Automated daily email digest of reminders due within the next 10 days
- **Authentication** — Secure sign-up and login with email verification via Supabase Auth

## Tech Stack

| Layer              | Technology              |
| ------------------ | ----------------------- |
| Framework          | Next.js 16 (App Router) |
| Database & Auth    | Supabase (PostgreSQL)   |
| Image Storage      | Cloudinary              |
| Email              | Resend                  |
| Styling            | Tailwind CSS v4         |
| Forms & Validation | React Hook Form + Zod   |
| Deployment         | Vercel                  |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account
- A [Resend](https://resend.com) account

### Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
CRON_SECRET=
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `npm run dev`            | Start the development server                         |
| `npm run build`          | Build for production                                 |
| `npm run generate-types` | Regenerate Supabase TypeScript types and Zod schemas |

## Cron Job

A daily cron job runs at **8:00 AM UTC** via Vercel Cron (`/api/cron/send-reminders`). It emails each user a digest of reminders due within the next 10 days. Requests must include the `CRON_SECRET` as a Bearer token.
