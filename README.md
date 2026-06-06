# VendorBridge

## Project Overview
VendorBridge is a comprehensive Procurement and Vendor Management ERP designed to streamline the request for quotation (RFQ), vendor onboarding, quotation tracking, approval flows, purchase orders, and invoicing processes.

## Architecture
The application is structured as a modern monorepo featuring a decoupled client-server architecture:
- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS, Base UI, hosted in the `frontend/` directory.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, hosted in the `backend/` directory.

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
(Runs on http://localhost:3000)

## Backend Setup
1. `cd backend`
2. `npm install`
3. Set up your `.env` variables using `.env.example`
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npx tsx prisma/seed.ts`
7. `npm run dev`
(Runs on http://localhost:5000)

## Environment Variables
Reference the `backend/.env.example` file.
Required variables include `DATABASE_URL`, `JWT_SECRET`, and SMTP configurations (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).

## API Docs Location
Swagger UI documentation is served natively by the backend at `http://localhost:5000/api/docs`.
Static documentation is available in `VendorBridge_API_Documentation.docx` located in the root.

## Team Structure
- Backend Engineering
- Frontend UI/UX
- QA & Integration Validation
