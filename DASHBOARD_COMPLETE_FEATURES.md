# Admin Dashboard - Complete Features Documentation

## Overview
This document outlines all the features and pages implemented in the fully functional admin dashboard built with Next.js 16, NextAuth, TanStack Query, Axios interceptors, and Sonner notifications.

---

## Authentication System

### Pages
- **Login** (`/auth/login`)
  - Email/password authentication
  - Remember me functionality
  - Forgot password link
  - Toast notifications for feedback

- **Forgot Password** (`/auth/forgot-password`)
  - Email submission for password reset
  - Verification link sent to email

- **OTP Verification** (`/auth/otp`)
  - 6-digit OTP input
  - Resend OTP functionality
  - Time-based validation

- **Reset Password** (`/auth/reset-password`)
  - New password creation
  - Password confirmation
  - Token-based validation

### Configuration
- **NextAuth Setup** (`/app/api/auth/[...nextauth]/route.ts`)
  - JWT-based authentication
  - Token refresh mechanism
  - Session management with accessToken, role, and userId

- **Auth Middleware** (`/proxy.ts`)
  - Route protection for authenticated pages
  - Redirect to login for unauthorized users
  - Public route whitelist

- **Axios Interceptor** (`/lib/api.ts`)
  - Automatic token injection in request headers
  - Token refresh on 401 responses
  - Centralized error handling

---

## Dashboard Pages

### 1. Dashboard Overview (`/dashboard`)
**Features:**
- 5 KPI cards showing:
  - Total Clients
  - Total Projects
  - Total Invoices
  - Total Revenue
  - Total Sales
- Project Status Pie Chart (Completed, Active, In Progress, On Hold)
- Message Activity Line Chart
- Financial Trends Bar Chart (Monthly Paid vs Unpaid)
- Calendar with project events
- Skeleton loaders for all components
- Real-time data from API

**Components:**
- `dashboard/kpi-card.tsx` - Reusable KPI display
- `dashboard/chart-card.tsx` - Wrapper for charts
- `dashboard/charts/project-status-chart.tsx` - Pie chart
- `dashboard/charts/message-activity-chart.tsx` - Line chart
- `dashboard/charts/financial-trends-chart.tsx` - Bar chart
- `dashboard/calendar.tsx` - Event calendar
- `dashboard/skeletons/dashboard-skeleton.tsx` - Loading state

---

### 2. Projects Management (`/dashboard/projects`)
**Features:**
- Paginated project list (10 items per page)
- Project cards showing:
  - Project number and name
  - Client information with avatar
  - Start and end dates
  - Budget amount
  - Action buttons (View Details, Edit, Delete)
- Add New Project modal
- Search and filter functionality
- Skeleton loaders for table
- Full CRUD operations via API

**Components:**
- `dashboard/projects/projects-list.tsx` - Project table
- `dashboard/projects/add-project-modal.tsx` - Create form
- `dashboard/skeletons/projects-skeleton.tsx` - Loading state
- `dashboard/pagination.tsx` - Reusable pagination

**API Endpoints:**
- GET `/api/projects` - List projects
- POST `/api/projects` - Create project
- PUT `/api/projects/{id}` - Update project
- DELETE `/api/projects/{id}` - Delete project

---

### 3. Tasks Management (`/dashboard/projects/tasks`)
**Features:**
- Paginated task list
- Create new task modal with:
  - Milestone selection
  - Task name
  - Team member assignment
  - Start and end dates
- Edit task modal
- Task status and priority indicators
- Skeleton loaders
- Two-click delete confirmation

**Components:**
- `dashboard/projects/tasks-list.tsx` - Task table
- `dashboard/projects/add-task-modal.tsx` - Create task
- `dashboard/projects/edit-task-modal.tsx` - Edit task
- `dashboard/skeletons/tasks-skeleton.tsx` - Loading state
- `dashboard/delete-confirm-dialog.tsx` - Delete confirmation

**API Endpoints:**
- GET `/api/tasks` - List tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task

---

### 4. Clients Management (`/dashboard/clients`)
**Features:**
- Client list with pagination
- Client cards showing:
  - Client name and company
  - Contact email and phone
  - Avatar image
  - Total projects assigned
- Add New Client modal
- Edit and delete functionality
- Search functionality
- Client status indicators

**Components:**
- `dashboard/clients/clients-list.tsx` - Client table
- `dashboard/clients/add-client-modal.tsx` - Create form
- `dashboard/skeletons/clients-skeleton.tsx` - Loading state

**API Endpoints:**
- GET `/api/clients` - List clients
- POST `/api/clients` - Create client
- PUT `/api/clients/{id}` - Update client
- DELETE `/api/clients/{id}` - Delete client

---

### 5. Team Members (`/dashboard/team-members`)
**Features:**
- Team member list with pagination
- Display:
  - Member name and email
  - Role/position
  - Avatar
  - Active status
  - Project assignments
- Add team member modal
- Remove members from projects
- Filter by role

**Components:**
- `dashboard/team/team-members-list.tsx` - Team table
- `dashboard/team/add-team-member-modal.tsx` - Add form
- `dashboard/skeletons/team-skeleton.tsx` - Loading state

**API Endpoints:**
- GET `/api/users?role=team_member` - List team members
- POST `/api/team-members` - Add member
- PUT `/api/team-members/{id}` - Update member
- DELETE `/api/team-members/{id}` - Remove member

---

### 6. Financial Management (`/dashboard/finance`)
**Features:**
- Tabbed interface for:
  1. **Proposals** (4 items)
     - Proposal ID and client
     - Project linked
     - Amount
     - Status (Pending/Approved)
     - Creation date

  2. **Estimates** (2 items)
     - Estimate ID
     - Client and project
     - Estimated amount
     - Status tracking

  3. **Invoices** (2 items)
     - Invoice ID
     - Client information
     - Project reference
     - Amount due
     - Payment status (Paid/Unpaid)

  4. **Contracts** (2 items)
     - Contract ID
     - Client details
     - Project scope
     - Contract value
     - Status

- Create/Edit forms for each type
- Line items with:
  - Description
  - Quantity
  - Rate
  - Auto-calculated amount
- Tax and discount calculations
- Status badges with color coding
- Delete confirmation
- PDF export functionality

**Components:**
- `dashboard/finance/finance-list.tsx` - Finance table
- `dashboard/finance/add-finance-modal.tsx` - Create/Edit form
- `dashboard/skeletons/finance-skeleton.tsx` - Loading state

**API Endpoints:**
- GET `/api/finance/{type}` - List by type
- POST `/api/finance/{type}` - Create item
- PUT `/api/finance/{type}/{id}` - Update item
- DELETE `/api/finance/{type}/{id}` - Delete item

---

### 7. Messages (`/dashboard/messages`)
**Features:**
- Conversation list with:
  - Contact name/group
  - Last message preview
  - Timestamp
  - Unread indicator
  - Avatar
- Chat interface showing:
  - Message thread
  - Sender information
  - Message timestamps
  - Sender vs. receiver styling
- Message input with:
  - Text input
  - Send button
  - File attachment support
- Search conversations
- Mark as read functionality

**Components:**
- Integrated in main page with mock data

---

### 8. Settings (`/dashboard/settings`)
**Features:**

#### Company Profile Tab
- Company name editing
- Address management
- Email configuration
- Phone number
- Save changes button
- Validation and error handling

#### Security Tab
- Change password form
- Current password verification
- New password with strength indicator
- Password confirmation
- Show/hide password toggle
- Validation (8+ characters, match confirmation)

#### Notifications Tab
- Notification list with filtering:
  - All notifications
  - Unread only
- Notification types:
  - Document uploads
  - Task completions
  - Approval requests
  - Messages
- Notification actions:
  - Mark as read
  - Delete
- Notification timestamps
- Unread count badge

**Components:**
- `dashboard/settings/company-profile.tsx` - Company settings
- `dashboard/settings/security-settings.tsx` - Password change
- `dashboard/settings/notification-settings.tsx` - Notification center

**API Endpoints:**
- PUT `/api/settings/profile` - Update company info
- POST `/api/auth/change-password` - Change password
- GET `/api/notifications` - List notifications
- DELETE `/api/notifications/{id}` - Delete notification

---

### 9. Documents (`/dashboard/documents`)
**Features:**
- Document list with pagination
- File information display:
  - File name with icon
  - File type (PDF, DWG, Excel, Word)
  - File size
  - Project association
  - Uploaded by
  - Upload date
- File icons for each type
- Actions:
  - Download document
  - Delete document
- Search functionality
- Filter by project or type

**Components:**
- Integrated in main page

---

## UI Components

### Core Components (shadcn/ui)
- Button
- Input
- Card
- Dialog/Modal
- Tabs
- Pagination
- Avatar
- Badge
- Form elements

### Custom Dashboard Components
- `header.tsx` - Top navigation with user profile
- `sidebar.tsx` - Left navigation menu
- `pagination.tsx` - Custom pagination control
- `kpi-card.tsx` - Dashboard metric card
- `chart-card.tsx` - Chart wrapper
- `delete-confirm-dialog.tsx` - Delete confirmation modal
- `skeletons/` - Loading state components for all pages

---

## Data Management

### TanStack Query (React Query)
- Used for all API data fetching
- Automatic caching and invalidation
- Pagination state management
- Loading and error states
- Refetch on window focus
- Stale-while-revalidate pattern

### Axios Interceptor
- Automatic token injection
- Token refresh on expiration (401)
- Error handling and toast notifications
- Base URL configuration
- Request/response interceptors

### State Management
- React hooks (useState) for local state
- TanStack Query for server state
- Mutations for POST/PUT/DELETE operations
- Query invalidation for real-time updates

---

## Notifications

### Sonner Toast Integration
- Success notifications for create/update/delete operations
- Error notifications with error messages
- Info notifications for user actions
- Automatic dismissal
- Position: bottom-right
- Custom styling

---

## Features Summary

### Authentication & Security
- ✅ NextAuth with JWT tokens
- ✅ Session management with roles
- ✅ Middleware-based route protection
- ✅ Axios interceptor with token refresh
- ✅ Password hashing and verification
- ✅ OTP verification flow

### Data Management
- ✅ TanStack Query caching
- ✅ Pagination on all list pages
- ✅ Search functionality
- ✅ Real-time data updates
- ✅ Error handling and recovery
- ✅ Skeleton loaders for all tables

### User Interface
- ✅ Dark theme with teal accents
- ✅ Responsive design (mobile-first)
- ✅ Modal-based forms
- ✅ Tab-based navigation
- ✅ Icon integration (Lucide React)
- ✅ Image avatars and file icons
- ✅ Status badges with colors

### CRUD Operations
- ✅ Create projects, clients, tasks, team members, finance items
- ✅ Read/list all entities with pagination
- ✅ Update entities with modals
- ✅ Delete with confirmation
- ✅ Bulk actions support

### API Integration
- ✅ Centralized API utilities (`/lib/api.ts`)
- ✅ RESTful endpoints for all resources
- ✅ Error handling
- ✅ Loading states
- ✅ Response validation

---

## File Structure

```
/app
  /auth
    /login
    /forgot-password
    /otp
    /reset-password
  /dashboard
    /projects
      /tasks
    /clients
    /team-members
    /finance
    /messages
    /documents
    /settings

/components
  /dashboard
    /charts
    /clients
    /finance
    /projects
    /settings
    /team
    /skeletons

/lib
  /api.ts

/types
  /next-auth.d.ts
```

---

## Environment Variables

```env
NEXTPUBLICBASEURL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## How to Use

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with the variables above

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access dashboard:**
   - Navigate to `http://localhost:3000/auth/login`
   - Login with admin credentials
   - Dashboard available at `http://localhost:3000/dashboard`

---

## Key Technologies

- **Framework:** Next.js 16 with App Router
- **Authentication:** NextAuth.js with JWT
- **State Management:** TanStack Query + React hooks
- **HTTP Client:** Axios with interceptors
- **UI Library:** shadcn/ui components
- **Styling:** Tailwind CSS
- **Notifications:** Sonner toasts
- **Icons:** Lucide React
- **Form Handling:** React Hook Form
- **Validation:** Zod schemas

---

## Notes

- All components are built with TypeScript
- Responsive design works on mobile, tablet, and desktop
- Skeleton loaders improve perceived performance
- Pagination limits set to 10 items per page
- All forms include validation
- Delete operations require confirmation
- Toast notifications provide user feedback
- API calls are centralized in `/lib/api.ts`
- Environment variables must be set before running

---

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced filtering and sorting
- [ ] Export to PDF/CSV functionality
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] File storage integration
