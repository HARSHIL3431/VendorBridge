# VendorBridge

> Smart Procurement & Vendor Management Platform for RFQ, Quotation Comparison, Approval Workflows, Purchase Orders, and Invoice Management.

## Overview

VendorBridge is a full-stack Procurement ERP designed to digitize and automate the entire procurement lifecycle for organizations.

The platform enables procurement teams to onboard vendors, create RFQs, collect quotations, compare bids, manage approval workflows, generate purchase orders, and create invoices through a centralized dashboard.

The system eliminates manual procurement bottlenecks, improves transparency, and accelerates decision-making through role-based workflows and real-time data management.

---

## Key Features

### Authentication & Authorization

* JWT-based authentication
* Secure role-based access control
* Protected API endpoints
* User profile management

### Vendor Management

* Vendor onboarding and registration
* Vendor profile management
* Vendor status tracking
* Vendor directory search

### RFQ Management

* Create and manage Request for Quotations
* Define quantities, requirements, and deadlines
* Track RFQ lifecycle
* Vendor participation management

### Quotation Management

* Vendor quotation submission
* Quote updates and revisions
* Vendor-specific quotation tracking

### Quotation Comparison Engine

* Automatic quotation comparison
* Lowest-price identification
* Delivery timeline comparison
* Centralized evaluation dashboard

### Approval Workflow

* Manager approval process
* Approval history tracking
* Procurement governance

### Purchase Orders

* Generate purchase orders from approved quotations
* Purchase order tracking
* Procurement lifecycle visibility

### Invoice Management

* Invoice generation
* PDF invoice download
* Email invoice delivery
* Invoice history tracking

### Dashboard & Analytics

* Procurement overview dashboard
* Vendor statistics
* Active RFQ monitoring
* Pending approval tracking
* Recent activity feed

---

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Base UI
* Axios
* SWR
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Nodemailer
* PDF Generation

### Documentation

* Swagger OpenAPI Documentation

---

## Project Structure

```text
VendorBridge/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## User Roles

### ADMIN

* Manage vendors
* Register users
* Access dashboard analytics

### PROCUREMENT_OFFICER

* Create RFQs
* Compare quotations
* Generate purchase orders
* Generate invoices

### MANAGER

* Approve quotations
* Review procurement decisions

### VENDOR

* View RFQs
* Submit quotations
* Track quotation status

---

## API Summary

### Authentication

* POST `/api/auth/login`
* POST `/api/auth/register`
* GET `/api/auth/me`

### Vendors

* GET `/api/vendors`
* GET `/api/vendors/:id`
* POST `/api/vendors`
* PUT `/api/vendors/:id`
* DELETE `/api/vendors/:id`

### RFQs

* GET `/api/rfqs`
* GET `/api/rfqs/:id`
* POST `/api/rfqs`
* PUT `/api/rfqs/:id`
* DELETE `/api/rfqs/:id`

### Quotations

* GET `/api/quotations`
* GET `/api/quotations/:id`
* POST `/api/quotations`
* PUT `/api/quotations/:id`

### Comparisons

* GET `/api/comparisons/:rfqId`

### Approvals

* GET `/api/approvals`
* GET `/api/approvals/:id`
* POST `/api/approvals`

### Purchase Orders

* GET `/api/purchase-orders`
* GET `/api/purchase-orders/:id`
* POST `/api/purchase-orders`

### Invoices

* GET `/api/invoices`
* GET `/api/invoices/:id`
* POST `/api/invoices`
* GET `/api/invoices/:id/pdf`
* POST `/api/invoices/:id/send-email`

### Dashboard

* GET `/api/dashboard/stats`

---

## Setup Guide

### Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npx tsx prisma/seed.ts

npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Swagger Documentation:

```text
http://localhost:5000/api/docs
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL=
JWT_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

Refer to:

```text
backend/.env.example
```

for the complete configuration.

---

## End-to-End Workflow

```text
Login
   ↓
Vendor Management
   ↓
Create RFQ
   ↓
Submit Quotations
   ↓
Compare Quotations
   ↓
Manager Approval
   ↓
Generate Purchase Order
   ↓
Generate Invoice
   ↓
Download PDF / Send Email
```

---

## Documentation

* Swagger API Documentation: `/api/docs`
* API Specification: `VendorBridge_API_Documentation.docx`

---

## Team

### Backend Development

* API Design
* Database Design
* Authentication
* Business Logic

### Frontend Development

* UI/UX Design
* Dashboard Development
* API Integration

### Testing & Integration

* End-to-End Validation
* Workflow Testing
* API Verification

---

## Project Status

✅ Full Frontend–Backend Integration Completed

✅ 30 API Endpoints Implemented

✅ JWT Authentication

✅ Role-Based Access Control

✅ Swagger Documentation

✅ PDF Invoice Generation

✅ Email Integration

✅ PostgreSQL + Prisma ORM

✅ Production-Ready Monorepo Architecture
