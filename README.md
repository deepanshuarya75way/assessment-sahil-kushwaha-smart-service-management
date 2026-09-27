# Smart Service Management

An AI-powered, production-grade SaaS service request and support management platform built with modern web technologies, strict role-based access control (RBAC), and automated lifecycle state machines.

---

## 1. Project Overview

**Smart Service Management** provides organizations with a unified, dual-experience platform designed to eliminate chaos in handling IT, maintenance, and departmental service requests:
1. **Public Marketing Website:** A marketing portal featuring Home, About, Solutions/Services, How It Works, System Features, Contact, Physical Location, and Role-Gated Authentication portals.
2. **Authenticated Service Management Application:** Dedicated, security-hardened workspaces tailored for **Requesters (Users)**, verified **Support Engineers (Staff)**, and a centralized **Primary Administrator (Dispatcher/Manager)**.

The platform bridges requester self-service with intelligent workload dispatching, automated natural-language classification, strict lifecycle enforcement, and transparent timeline auditing.

---

## 2. Problem Statement

Traditional customer service and internal helpdesk workflows often suffer from:
- **Misclassified Tickets:** Users misjudge ticket priority or assign requests to incorrect technical departments, causing delayed initial responses.
- **Role Permission Creep:** Support personnel or administrators inadvertently creating customer tickets with invalid data or bypassing customer validations.
- **Uncontrolled Support Access:** Unverified staff members self-registering without verification, leading to security and credential risks.
- **Ambiguous Ticket Progression:** Tickets get lost in ambiguous states without an auditable progression trail or clear reason when an assignment is declined.
- **Scattered Communication:** Critical troubleshooting discussions are separated from ticket status records, leaving users uncertain about the status of their service requests.

Smart Service Management solves these operational bottlenecks through strict role governance, an automated 5-state lifecycle, sub-second natural language ticket analysis, and private staff credential verification.

---

## 3. Features

- **🌐 Dual-Experience Platform:** Public informational pages explaining architectural solutions and operational benefits, cleanly partitioned from authenticated internal workspaces.
- **🎫 Collision-Proof Sequential Ticket Numbering:** High-volume sequential ticket identifiers (e.g., `TICK-1001`, `TICK-1002`) generated with atomic MongoDB counters.
- **🤖 Sub-Second AI Ticket Classification:** Natural language inference evaluates problem descriptions to recommend the ideal Category, initial Priority, and handling Department before ticket creation.
- **🔄 Deterministic 5-State Lifecycle:** A state machine enforcing sequential progression: `PENDING` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
- **🪪 Private Staff Credential Verification:** Support engineer registration requires an Employee ID, official email, department, job role, and an uploaded verification document (stored securely in a private directory with MIME-type filtering and size limits).
- **🛡️ Single Primary Administrator Policy:** Exactly one primary administrator controls global dispatching, staff verification approvals, and account access. Arbitrary admin registration is blocked at both the API and database levels.
- **📊 Real-Time Operational Analytics:** Real-time metrics tracking total volume, status distributions, resolution velocities, and staff workloads via MongoDB aggregation pipelines.
- **💬 Real-Time Threaded Comments & Audit Logging:** Threaded discussion history and an immutable `TicketHistory` collection recording every assignment, status change, and rejection reason with exact actor attribution.
- **🚪 Clean Session Termination:** Secure JWT logout immediately revokes local tokens and routes users back to the public homepage.

---

## 4. User Roles

The platform enforces strict Role-Based Access Control (RBAC).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROLE GOVERNANCE MATRIX                          │
├──────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Capability       │ USER            │ STAFF           │ ADMIN           │
├──────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Create Request   │ ✅ Yes (Only)   │ ❌ Blocked (403) │ ❌ Blocked (403) │
│ View Workspace   │ Customer Portal │ Staff Queue     │ Admin Dashboard │
│ Accept / Reject  │ N/A             │ ✅ Yes (Reason) │ Dispatch Only   │
│ Close Ticket     │ ✅ Confirm Close│ ❌ Resolve Only │ ❌ Reassign     │
│ Review Staff ID  │ N/A             │ N/A             │ ✅ Approve/Deny │
│ User Management  │ N/A             │ N/A             │ ✅ Full Control │
└──────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### A. USER (Service Requester)
- **Role Purpose:** End customers or employees needing service assistance.
- **Creation Exclusivity:** The service request creation flow belongs exclusively to the `USER` role.
- **Key Responsibilities:**
  - Submit service requests with title, description, location, and department.
  - Review AI classification recommendations before submission.
  - Track real-time progress on interactive timelines.
  - Add clarification comments.
  - Formally confirm resolution to transition tickets to `CLOSED`.

### B. STAFF (Service Resolver)
- **Role Purpose:** Verified technical specialists, technicians, and support engineers.
- **Access Rule:** Staff registration requires document upload and remains in `PENDING_VERIFICATION` status until approved by an administrator. Staff are prohibited from creating tickets (blocked in UI and via API `HTTP 403`).
- **Key Responsibilities:**
  - Review dispatched tickets in the dedicated Staff Workspace (`/staff/workspace`).
  - **Accept Assignment:** Moves ticket from `ASSIGNED` to `IN_PROGRESS`.
  - **Reject Assignment:** Requires a mandatory rejection reason; reverts ticket to `PENDING` and alerts management.
  - Log diagnostic actions and provide comprehensive resolution notes upon completion (`RESOLVED`).

### C. ADMIN (Service Manager & Dispatcher)
- **Role Purpose:** Single primary system administrator overseeing service delivery.
- **Creation Rule:** Established exclusively through backend configuration or seed routines. No public registration exists. Admins cannot create customer tickets.
- **Key Responsibilities:**
  - Review staff registration applications and inspect uploaded verification ID cards.
  - Approve or reject staff applications.
  - Dispatch unassigned `PENDING` tickets to qualified staff members.
  - Monitor staff rejection rates and reasons.
  - Manage user account statuses (`ACTIVE` / `INACTIVE`).
  - Inspect operational analytics and team performance.

---

## 5. Ticket Lifecycle

The ticket lifecycle follows an automated, sequential 5-state pipeline. Skipping stages or performing unauthorized transitions is strictly blocked.

```
       [ USER Submits Request ]
                  │
                  ▼
             ┌─────────┐
             │ PENDING │ ◄──────────────────────┐
             └────┬────┘                        │
                  │ (Admin Assigns Staff)       │
                  ▼                             │
            ┌──────────┐   (Staff Rejects       │
            │ ASSIGNED │   with Reason)         │
            └─────┬────┴────────────────────────┘
                  │
                  │ (Staff Accepts Assignment)
                  ▼
          ┌─────────────┐
          │ IN_PROGRESS │
          └───────┬─────┘
                  │ (Staff Enters Resolution Notes)
                  ▼
            ┌──────────┐
            │ RESOLVED │
            └─────┬────┘
                  │ (Requester Confirms Outcome)
                  ▼
             ┌────────┐
             │ CLOSED │
             └────────┘
```

1. **`PENDING`:** New request submitted by a User. Visible in unassigned queues.
2. **`ASSIGNED`:** Assigned to a specific verified staff member by an Admin.
3. **`IN_PROGRESS`:** Staff specialist reviews and explicitly accepts the ticket.
4. **`RESOLVED`:** Work completed by Staff, accompanied by mandatory resolution documentation.
5. **`CLOSED`:** Requester inspects the outcome and confirms satisfaction, permanently archiving the ticket.

Every transition writes an immutable record to the `TicketHistory` audit collection.

---

## 6. AI Ticket Classification

Smart Service Management features an integrated natural language classification engine:
- **Zero-Latency In-Memory Analysis:** Analyzes the requester's title and description to detect key problem indicators, urgency signals, and technical domains.
- **Predictive Attributes:**
  - **Category:** Hardware, Software, Network, Facilities, Access & Security, General Service.
  - **Priority:** Low, Medium, High, Critical.
  - **Department:** IT Support, Facilities Management, Network Operations, Information Security, Human Resources.
- **Pre-Flight User Review:** Recommendations are presented to the user during creation so they can confirm or adjust the classification prior to ticket submission.
- **Fault-Tolerant Fallback:** Designed with sub-1.5 second fallback mechanisms, ensuring ticket creation is never interrupted even during external service anomalies.

---

## 7. Technology Stack

### Frontend
- **Framework:** React 19 (SPA Architecture)
- **Tooling & Bundler:** Vite
- **Routing:** React Router v7
- **Icons & Visuals:** Lucide React
- **Animations:** Motion
- **HTTP Client:** Axios (configured with automated JWT bearer interceptors)
- **Styling:** Vanilla CSS Design System with CSS Custom Properties (Deep Navy & Accent Blue theme)

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Security & Headers:** Helmet, Express Rate Limit, CORS
- **File Uploads:** Multer with MIME verification and private directory storage
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS password hashing

### Database & Storage
- **Database:** MongoDB (Local or MongoDB Atlas)
- **Object Modeling:** Mongoose 9 ODM
- **Document Storage:** Private local filesystem storage for staff verification credentials (`backend/uploads/verifications/`)

---

## 8. Frontend Setup

The frontend is located in the `frontend/` directory.

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Create a `.env` file in `frontend/` (refer to `.env.example`):
```env
VITE_API_URL=http://localhost:5001/api
```

### Running Locally
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173`

---

## 9. Backend Setup

The backend server is located in the `backend/` directory.

### Installation
```bash
cd backend
npm install
```

### Environment Configuration
Create a `.env` file in `backend/` (refer to `.env.example`):
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smart_service_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
CLIENT_URL=http://localhost:5173
```

---

## 10. Environment Variables

Below is the reference table of environment variables:

| Variable | Scope | Description | Default / Example |
|---|---|---|---|
| `PORT` | Backend | HTTP port for the Express server | `5001` |
| `NODE_ENV` | Backend | Application execution environment | `development` / `production` |
| `MONGO_URI` | Backend | Connection URI for the MongoDB database | `mongodb://localhost:27017/smart_service_db` |
| `JWT_SECRET` | Backend | Secret key used for signing JWT tokens | Safe cryptographic secret |
| `JWT_EXPIRE` | Backend | Lifespan of user authentication tokens | `24h` |
| `CLIENT_URL` | Backend | Permitted CORS origin matching frontend URL | `http://localhost:5173` |
| `VITE_API_URL` | Frontend | Base URL for REST API endpoints | `http://localhost:5001/api` |

---

## 11. Database Setup

Ensure MongoDB is installed and running locally:
```bash
# Verify MongoDB service status
mongosh --eval "db.adminCommand('ping')"
```

If connecting to MongoDB Atlas, update `MONGO_URI` in `backend/.env` with your cluster connection URI.

### Database Seeding
Seed the database with the initial primary administrator, sample verified staff, customer accounts, and demo service requests:
```bash
cd backend
npm run seed
```

---

## 12. How to Run Locally

Follow these steps to run the complete stack locally:

### Step 1: Start MongoDB
Ensure MongoDB is running locally on port `27017`.

### Step 2: Configure & Start Backend Server
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```
*Backend will start listening on `http://localhost:5001`.*

### Step 3: Configure & Start Frontend Client
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend will launch on `http://localhost:5173`.*

Open your browser and navigate to `http://localhost:5173` to explore the public website and log in to the workspaces.

---

## 13. Demo Accounts

For local demonstration and evaluation, the seed script sets up pre-configured accounts:

| Role | Email Address | Password | Permissions & Workspace |
|---|---|---|---|
| **Primary Administrator** | `admin@example.com` | `AdminPassword123!` | Full admin access: review staff verifications, dispatch tickets, inspect analytics. |
| **Verified Staff Specialist** | `staff@example.com` | `StaffPassword123!` | Service Resolver: accept/reject assignments, update work progress, resolve tickets. |
| **Service Requester (User)** | `user@example.com` | `UserPassword123!` | Service Requester: create service requests with AI classification, confirm closure. |

> **Note on Account Creation:**
> - **Staff Accounts:** Users can register as Staff via the registration tab (`/register`). New staff accounts enter `PENDING_VERIFICATION` and require ID card review and approval by the Administrator before login is enabled.
> - **Admin Accounts:** In alignment with the single primary administrator rule, administrative privileges cannot be self-registered. The Admin account is initialized exclusively via backend configuration and seed data.

---

## 🧪 Testing & Verification

Run the automated integration and regression test suite:
```bash
cd backend
node src/utils/testSuite.js
```
The test suite validates:
- Role boundaries and ticket creation exclusivity (`USER` = 201; `STAFF` & `ADMIN` = 403)
- Public admin registration block (`role=ADMIN` = 403)
- Staff registration and verification document upload
- Pending verification login rejection
- Sequential 5-state lifecycle progression (`PENDING` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`)
- Staff rejection with mandatory reason and queue return
- Audit trail logging in `TicketHistory`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
