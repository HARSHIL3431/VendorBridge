__VendorBridge__

API Documentation

*Procurement & Vendor Management ERP*

__Version__

v1\.0

__Base URL__

http://localhost:5000/api

__Auth__

Bearer JWT \(Authorization header\)

__Format__

application/json \(except PDF endpoint\)

# __01  Quick Reference ΓÇö All Endpoints__

__Method__

__Endpoint__

__Description__

__Roles__

__POST__

/auth/login

Login

Public

__POST__

/auth/register

Register user

ADMIN

__GET__

/auth/me

Get current user

All Roles

__GET__

/vendors

List all vendors

ADMIN, PROCUREMENT\_OFFICER

__GET__

/vendors/:id

Get vendor detail

ADMIN, PROCUREMENT\_OFFICER

__POST__

/vendors

Create vendor

ADMIN

__PUT__

/vendors/:id

Update vendor

ADMIN

__DELETE__

/vendors/:id

Delete vendor

ADMIN

__GET__

/rfqs

List all RFQs

All Roles

__GET__

/rfqs/:id

Get RFQ detail

All Roles

__POST__

/rfqs

Create RFQ

PROCUREMENT\_OFFICER

__PUT__

/rfqs/:id

Update RFQ

PROCUREMENT\_OFFICER

__DELETE__

/rfqs/:id

Delete RFQ

PROCUREMENT\_OFFICER

__GET__

/quotations

List quotations

All Roles

__GET__

/quotations/:id

Get quotation detail

All Roles

__POST__

/quotations

Submit quotation

VENDOR

__PUT__

/quotations/:id

Update quotation

VENDOR

__GET__

/comparisons/:rfqId

Compare quotations for RFQ

PROCUREMENT\_OFFICER, ADMIN

__GET__

/approvals

List approvals

MANAGER, ADMIN

__GET__

/approvals/:id

Get approval detail

MANAGER, ADMIN

__POST__

/approvals

Approve/reject quotation

MANAGER

__GET__

/purchase\-orders

List purchase orders

All Roles

__GET__

/purchase\-orders/:id

Get PO detail

All Roles

__POST__

/purchase\-orders

Generate PO

PROCUREMENT\_OFFICER

__GET__

/invoices

List invoices

All Roles

__GET__

/invoices/:id

Get invoice detail

All Roles

__POST__

/invoices

Generate invoice

PROCUREMENT\_OFFICER

__GET__

/invoices/:id/pdf

Download invoice PDF

All Roles

__POST__

/invoices/:id/send\-email

Email invoice

PROCUREMENT\_OFFICER, ADMIN

__GET__

/dashboard/stats

Dashboard KPI stats

All Roles

# __02  General Rules__

## __Standard Response Format__

__Success Response__

\{

  "success": true,

  "message": "Operation successful",

  "data": \{ \}

\}

__Error Response__

\{

  "success": false,

  "message": "Error description"

\}

## __Authentication__

*Γä╣  All endpoints except POST /auth/login are protected\. Send the JWT in every request\.*

__Header__

Authorization: Bearer <token>

__Token from__

POST /auth/login  ΓåÆ  data\.token

__Storage__

localStorage  \(key: vendorbridge\_token\)

__Axios Setup \(frontend\)__

// axiosInstance\.ts

import axios from 'axios';

 

const api = axios\.create\(\{

  baseURL: process\.env\.NEXT\_PUBLIC\_API\_URL,

\}\);

 

api\.interceptors\.request\.use\(\(config\) => \{

  const token = localStorage\.getItem\('vendorbridge\_token'\);

  if \(token\) config\.headers\.Authorization = \`Bearer $\{token\}\`;

  return config;

\}\);

 

export default api;

## __HTTP Status Codes__

__200__

Success

__201__

Resource created

__400__

Validation error / bad request

__401__

Missing or invalid token

__403__

Forbidden ΓÇö insufficient role

__404__

Resource not found

__500__

Internal server error

# __03  Authentication__

### __ POST __  __/auth/login__    *Authenticate and receive JWT*

__Auth Required:   Public __

__Request Body__

\{

  "email":    "admin@vendorbridge\.com",

  "password": "password123"

\}

__Success Response  200__

\{

  "success": true,

  "message": "Login successful",

  "data": \{

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.\.\.",

    "user": \{

      "id":    "uuid",

      "name":  "Admin User",

      "email": "admin@vendorbridge\.com",

      "role":  "ADMIN"

    \}

  \}

\}

__Error Responses__

__401__

"Invalid email or password"

__400__

"Email and password are required"

### __ POST __  __/auth/register__    *Create a new user \(Admin only\)*

__Auth Required:   ADMIN __

__Request Body__

\{

  "name":     "John Doe",

  "email":    "john@company\.com",

  "password": "securepassword",

  "role":     "PROCUREMENT\_OFFICER"

\}

*Γä╣  role must be one of: ADMIN | PROCUREMENT\_OFFICER | MANAGER | VENDOR*

__Success Response  201__

\{

  "success": true,

  "message": "User registered successfully",

  "data": \{

    "id":    "uuid",

    "name":  "John Doe",

    "email": "john@company\.com",

    "role":  "PROCUREMENT\_OFFICER"

  \}

\}

### __ GET __  __/auth/me__    *Get currently logged\-in user*

__Auth Required:   All Roles __

__Success Response  200__

\{

  "success": true,

  "data": \{

    "id":    "uuid",

    "name":  "John Doe",

    "email": "john@company\.com",

    "role":  "PROCUREMENT\_OFFICER"

  \}

\}

# __04  Vendor Management__

### __ GET __  __/vendors__    *List all vendors*

__Auth Required:   ADMIN  PROCUREMENT\_OFFICER __

*Γä╣  Supports query params: ?status=ACTIVE  |  ?category=Electronics  |  ?search=ABC*

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":        "uuid",

      "name":      "ABC Suppliers",

      "email":     "abc@supplier\.com",

      "phone":     "9876543210",

      "gstNumber": "22AAAAA0000A1Z5",

      "category":  "Electronics",

      "status":    "ACTIVE"

    \}

  \]

\}

### __ GET __  __/vendors/:id__    *Get a single vendor*

__Auth Required:   ADMIN  PROCUREMENT\_OFFICER __

__Success Response  200__

\{

  "success": true,

  "data": \{

    "id":        "uuid",

    "name":      "ABC Suppliers",

    "email":     "abc@supplier\.com",

    "phone":     "9876543210",

    "gstNumber": "22AAAAA0000A1Z5",

    "category":  "Electronics",

    "status":    "ACTIVE"

  \}

\}

### __ POST __  __/vendors__    *Create a new vendor*

__Auth Required:   ADMIN __

__Request Body__

\{

  "name":      "ABC Suppliers",

  "email":     "abc@supplier\.com",

  "phone":     "9876543210",

  "gstNumber": "22AAAAA0000A1Z5",

  "category":  "Electronics",

  "status":    "ACTIVE"

\}

*Γä╣  status must be: ACTIVE | INACTIVE | BLACKLISTED*

__Success Response  201__

\{

  "success": true,

  "message": "Vendor created successfully",

  "data": \{ "id": "uuid", \.\.\.vendor \}

\}

### __ PUT __  __/vendors/:id__    *Update vendor details*

__Auth Required:   ADMIN __

*Γä╣  Send only the fields you want to update \(partial update supported\)\.*

__Request Body \(all fields optional\)__

\{

  "name":     "Updated Name",

  "status":   "INACTIVE",

  "category": "Office Supplies"

\}

### __ DELETE __  __/vendors/:id__    *Delete a vendor*

__Auth Required:   ADMIN __

*Γä╣  Returns 400 if vendor has linked quotations\.*

__Success Response  200__

\{

  "success": true,

  "message": "Vendor deleted successfully"

\}

# __05  RFQ Management__

### __ GET __  __/rfqs__    *List all RFQs*

__Auth Required:   All Roles __

*Γä╣  VENDOR role sees only RFQs they are assigned to\.*

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":          "uuid",

      "title":       "Laptop Procurement",

      "description": "Need 50 laptops",

      "quantity":    50,

      "deadline":    "2026\-06\-20T00:00:00\.000Z",

      "status":      "OPEN",

      "createdAt":   "2026\-06\-01T10:00:00\.000Z"

    \}

  \]

\}

### __ GET __  __/rfqs/:id__    *Get RFQ with quotations*

__Auth Required:   All Roles __

__Success Response  200__

\{

  "success": true,

  "data": \{

    "id":          "uuid",

    "title":       "Laptop Procurement",

    "description": "Need 50 laptops",

    "quantity":    50,

    "deadline":    "2026\-06\-20T00:00:00\.000Z",

    "status":      "OPEN",

    "quotations":  \[ \]

  \}

\}

### __ POST __  __/rfqs__    *Create a new RFQ*

__Auth Required:   PROCUREMENT\_OFFICER __

__Request Body__

\{

  "title":       "Laptop Procurement",

  "description": "Need 50 laptops for new office",

  "quantity":    50,

  "deadline":    "2026\-06\-20"

\}

*Γä╣  status is auto\-set to OPEN on creation\.*

__Success Response  201__

\{

  "success": true,

  "message": "RFQ created successfully",

  "data": \{ "id": "uuid", "status": "OPEN", \.\.\.rfq \}

\}

### __ PUT __  __/rfqs/:id__    *Update RFQ*

__Auth Required:   PROCUREMENT\_OFFICER __

*Γä╣  Cannot update an RFQ with status CLOSED or AWARDED\.*

__Request Body \(all fields optional\)__

\{

  "title":    "Updated Title",

  "quantity": 75,

  "status":   "CLOSED"

\}

*Γä╣  status values: OPEN | CLOSED | AWARDED*

### __ DELETE __  __/rfqs/:id__    *Delete RFQ*

__Auth Required:   PROCUREMENT\_OFFICER __

*Γä╣  Returns 400 if RFQ has submitted quotations\.*

# __06  Quotation Management__

### __ GET __  __/quotations__    *List quotations*

__Auth Required:   All Roles __

*Γä╣  Filter by RFQ: ?rfqId=uuid  |  Filter by vendor: ?vendorId=uuid*

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":           "uuid",

      "rfqId":        "uuid",

      "vendorId":     "uuid",

      "price":        85000,

      "deliveryDays": 7,

      "notes":        "Fast delivery guaranteed",

      "createdAt":    "2026\-06\-05T08:00:00\.000Z",

      "vendor":       \{ "id": "uuid", "name": "ABC Suppliers" \},

      "rfq":          \{ "id": "uuid", "title": "Laptop Procurement" \}

    \}

  \]

\}

### __ GET __  __/quotations/:id__    *Get single quotation*

__Auth Required:   All Roles __

### __ POST __  __/quotations__    *Submit a quotation*

__Auth Required:   VENDOR __

*Γä╣  A vendor can submit only one quotation per RFQ\.*

__Request Body__

\{

  "rfqId":        "uuid",

  "vendorId":     "uuid",

  "price":        85000,

  "deliveryDays": 7,

  "notes":        "Fast delivery guaranteed"

\}

__Success Response  201__

\{

  "success": true,

  "message": "Quotation submitted successfully",

  "data": \{ "id": "uuid", \.\.\.quotation \}

\}

### __ PUT __  __/quotations/:id__    *Update quotation*

__Auth Required:   VENDOR __

*Γä╣  Only allowed when the RFQ status is still OPEN\.*

# __07  Quotation Comparison__

### __ GET __  __/comparisons/:rfqId__    *Compare all quotations for an RFQ*

__Auth Required:   PROCUREMENT\_OFFICER  ADMIN __

*Γä╣  The lowestPrice flag helps the UI highlight the best price automatically\.*

__Success Response  200__

\{

  "success": true,

  "data": \{

    "rfq": \{

      "id":       "uuid",

      "title":    "Laptop Procurement",

      "quantity": 50

    \},

    "quotations": \[

      \{

        "quotationId":  "uuid",

        "vendorId":     "uuid",

        "vendor":       "ABC Suppliers",

        "price":        85000,

        "deliveryDays": 7,

        "notes":        "Fast delivery",

        "lowestPrice":  true

      \},

      \{

        "quotationId":  "uuid",

        "vendorId":     "uuid",

        "vendor":       "XYZ Ltd",

        "price":        90000,

        "deliveryDays": 5,

        "notes":        "Faster delivery",

        "lowestPrice":  false

      \}

    \]

  \}

\}

*Γä╣  quotationId is required ΓÇö pass it to POST /approvals when approving a winner\.*

# __08  Approval Workflow__

### __ GET __  __/approvals__    *List all approvals*

__Auth Required:   MANAGER  ADMIN __

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":          "uuid",

      "quotationId": "uuid",

      "status":      "APPROVED",

      "remarks":     "Best value for money",

      "approvedBy":  "uuid",

      "createdAt":   "2026\-06\-06T09:00:00\.000Z",

      "quotation": \{

        "vendor": \{ "name": "ABC Suppliers" \},

        "rfq":    \{ "title": "Laptop Procurement" \},

        "price":  85000

      \}

    \}

  \]

\}

### __ GET __  __/approvals/:id__    *Get approval detail*

__Auth Required:   MANAGER  ADMIN __

### __ POST __  __/approvals__    *Approve or reject a quotation*

__Auth Required:   MANAGER __

*Γä╣  approvedBy is extracted automatically from your JWT ΓÇö do not send it in the body\.*

__Request Body__

\{

  "quotationId": "uuid",

  "status":      "APPROVED",

  "remarks":     "Best value for money"

\}

*Γä╣  status must be: APPROVED | REJECTED*

__Success Response  201__

\{

  "success": true,

  "message": "Quotation approved successfully",

  "data": \{

    "id":          "uuid",

    "quotationId": "uuid",

    "status":      "APPROVED",

    "approvedBy":  "uuid"

  \}

\}

__Error Responses__

__400__

"Quotation is already approved"

__403__

"Only MANAGER role can approve quotations"

__404__

"Quotation not found"

# __09  Purchase Orders__

### __ GET __  __/purchase\-orders__    *List all purchase orders*

__Auth Required:   All Roles __

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":          "uuid",

      "poNumber":    "PO\-2026\-001",

      "quotationId": "uuid",

      "status":      "ISSUED",

      "createdAt":   "2026\-06\-06T10:00:00\.000Z",

      "quotation": \{

        "price":        85000,

        "deliveryDays": 7,

        "vendor": \{ "name": "ABC Suppliers" \},

        "rfq":    \{ "title": "Laptop Procurement" \}

      \}

    \}

  \]

\}

### __ GET __  __/purchase\-orders/:id__    *Get PO detail*

__Auth Required:   All Roles __

### __ POST __  __/purchase\-orders__    *Generate a Purchase Order*

__Auth Required:   PROCUREMENT\_OFFICER __

*Γä╣  Only quotations with APPROVED approval status can generate a PO\.*

*Γä╣  poNumber is auto\-generated by the server\.*

__Request Body__

\{

  "quotationId": "uuid"

\}

__Success Response  201__

\{

  "success": true,

  "message": "Purchase Order generated successfully",

  "data": \{

    "id":       "uuid",

    "poNumber": "PO\-2026\-001",

    "status":   "ISSUED"

  \}

\}

__Error Responses__

__400__

"Quotation has not been approved"

__400__

"Purchase Order already exists for this quotation"

# __10  Invoice Management__

### __ GET __  __/invoices__    *List all invoices*

__Auth Required:   All Roles __

__Success Response  200__

\{

  "success": true,

  "data": \[

    \{

      "id":              "uuid",

      "invoiceNumber":   "INV\-2026\-001",

      "purchaseOrderId": "uuid",

      "subtotal":        85000,

      "tax":             15300,

      "total":           100300,

      "status":          "PENDING",

      "createdAt":       "2026\-06\-06T11:00:00\.000Z",

      "purchaseOrder": \{

        "poNumber": "PO\-2026\-001",

        "quotation": \{

          "vendor": \{ "name": "ABC Suppliers" \}

        \}

      \}

    \}

  \]

\}

### __ GET __  __/invoices/:id__    *Get invoice detail*

__Auth Required:   All Roles __

### __ POST __  __/invoices__    *Generate invoice from PO*

__Auth Required:   PROCUREMENT\_OFFICER __

*Γä╣  tax is calculated server\-side at 18% GST\. invoiceNumber is auto\-generated\.*

__Request Body__

\{

  "purchaseOrderId": "uuid"

\}

__Success Response  201__

\{

  "success": true,

  "message": "Invoice generated successfully",

  "data": \{

    "id":            "uuid",

    "invoiceNumber": "INV\-2026\-001",

    "subtotal":      85000,

    "tax":           15300,

    "total":         100300,

    "status":        "PENDING"

  \}

\}

### __ GET __  __/invoices/:id/pdf__    *Download invoice as PDF*

__Auth Required:   All Roles __

__ΓÜá  IMPORTANT: __This endpoint returns a binary PDF file, NOT JSON\. Handle it differently in Axios:

// CORRECT ΓÇö must set responseType: 'blob'

const response = await api\.get\(\`/invoices/$\{id\}/pdf\`, \{

  responseType: 'blob',

\}\);

 

const url    = window\.URL\.createObjectURL\(new Blob\(\[response\.data\]\)\);

const link   = document\.createElement\('a'\);

link\.href    = url;

link\.download = \`invoice\-$\{id\}\.pdf\`;

link\.click\(\);

window\.URL\.revokeObjectURL\(url\);

__Response Headers__

__Content\-Type__

application/pdf

__Content\-Disposition__

attachment; filename=invoice\-INV\-2026\-001\.pdf

### __ POST __  __/invoices/:id/send\-email__    *Send invoice via email*

__Auth Required:   PROCUREMENT\_OFFICER  ADMIN __

__Request Body__

\{

  "email": "vendor@abc\.com"

\}

__Success Response  200__

\{

  "success": true,

  "message": "Invoice sent to vendor@abc\.com successfully"

\}

# __11  Dashboard__

### __ GET __  __/dashboard/stats__    *Get dashboard KPI statistics*

__Auth Required:   All Roles __

*Γä╣  Each role receives the same shape but numbers are scoped to their access level\.*

__Success Response  200__

\{

  "success": true,

  "data": \{

    "totalVendors":      10,

    "activeRfqs":         5,

    "pendingApprovals":   3,

    "totalInvoices":      7,

    "totalPurchaseOrders": 4,

    "recentActivity": \[

      \{

        "type":      "RFQ\_CREATED",

        "message":   "Laptop Procurement RFQ created",

        "createdAt": "2026\-06\-06T09:00:00\.000Z"

      \}

    \]

  \}

\}

# __12  Role Permissions Matrix__

__Feature__

__ADMIN__

__PROCUREMENT
OFFICER__

__MANAGER__

__VENDOR__

Login / Auth

Γ£à

Γ£à

Γ£à

Γ£à

Manage Users

Γ£à

Γ¥î

Γ¥î

Γ¥î

View Vendors

Γ£à

Γ£à

Γ¥î

Γ¥î

Create / Edit Vendors

Γ£à

Γ¥î

Γ¥î

Γ¥î

View RFQs

Γ£à

Γ£à

Γ£à

Γ£à \(own\)

Create / Edit RFQs

Γ£à

Γ£à

Γ¥î

Γ¥î

Submit Quotations

Γ¥î

Γ¥î

Γ¥î

Γ£à

Compare Quotations

Γ£à

Γ£à

Γ¥î

Γ¥î

Approve / Reject

Γ£à

Γ¥î

Γ£à

Γ¥î

Generate PO

Γ£à

Γ£à

Γ¥î

Γ¥î

Generate Invoice

Γ£à

Γ£à

Γ¥î

Γ¥î

Download PDF

Γ£à

Γ£à

Γ£à

Γ£à

Send Invoice Email

Γ£à

Γ£à

Γ¥î

Γ¥î

Dashboard Stats

Γ£à

Γ£à

Γ£à

Γ£à

# __13  Seed Data for Testing__

The backend will provide the following seeded data before integration:

__Entity__

__Count__

__Sample Credentials__

Admin User

1

admin@vendorbridge\.com / admin123

Procurement Officer

1

officer@vendorbridge\.com / officer123

Manager

1

manager@vendorbridge\.com / manager123

Vendor Users

3

vendor1@test\.com / vendor123

Vendors

10

ΓÇö

RFQs

5

ΓÇö

Quotations

15

ΓÇö

Approvals

3

ΓÇö

Purchase Orders

3

ΓÇö

Invoices

3

ΓÇö

# __14  Frontend Integration Notes__

## __Environment Setup__

\# \.env\.local

NEXT\_PUBLIC\_API\_URL=http://localhost:5000/api

## __CORS__

*Γä╣  Backend allows: http://localhost:3000 \(Next\.js default\)\. If you use a different port, tell the backend developer immediately\.*

## __Token Management__

// Save on login

localStorage\.setItem\('vendorbridge\_token', data\.token\);

localStorage\.setItem\('vendorbridge\_user',  JSON\.stringify\(data\.user\)\);

 

// Read role for conditional rendering

const user = JSON\.parse\(localStorage\.getItem\('vendorbridge\_user'\)\);

if \(user\.role === 'MANAGER'\) \{ /\* show approve buttons \*/ \}

 

// Clear on logout

localStorage\.removeItem\('vendorbridge\_token'\);

localStorage\.removeItem\('vendorbridge\_user'\);

## __PDF Download ΓÇö Critical__

*Γä╣  GET /invoices/:id/pdf is the only endpoint that does NOT return JSON\. Always use responseType: 'blob'\. See Section 10 for the full code snippet\.*

## __Quotation Comparison ΓåÆ Approval Flow__

// 1\. Fetch comparison data

const \{ data \} = await api\.get\(\`/comparisons/$\{rfqId\}\`\);

 

// 2\. User picks a winner ΓÇö use quotationId from comparison response

const selected = data\.quotations\[0\]; // e\.g\. lowestPrice === true

 

// 3\. Submit approval

await api\.post\('/approvals', \{

  quotationId: selected\.quotationId,  // ΓåÉ this field is critical

  status:      'APPROVED',

  remarks:     'Best value'

\}\);

