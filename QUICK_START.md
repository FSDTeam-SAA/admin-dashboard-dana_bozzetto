# Quick Start Guide - Admin Dashboard

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env.local` file in the root directory:

```env
# Next.js & NextAuth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXTPUBLICBASEURL=http://localhost:3000

# Optional: Database URL if using database auth
DATABASE_URL=your-database-url
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## First Time Login

### Test Credentials
```
Email: admin@gmail.com
Password: password123
```

### Login Flow
1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials
3. Click "Sign in"
4. You'll be redirected to the dashboard at `/dashboard`

---

## Dashboard Navigation

### Main Menu (Sidebar)
- **Dashboard** - Overview and KPIs
- **Projects** - Project management
- **Finance** - Financial tracking (Proposals, Estimates, Invoices, Contracts)
- **Clients** - Client management
- **Team Members** - Staff management
- **Messages** - Communication
- **Documents** - File management
- **Settings** - Application settings
- **Logout** - Sign out

### Quick Actions
- Create new project: Click "+ Add New Project" on Projects page
- Add task: Navigate to Projects > Tasks > "+ Add Task"
- Create invoice: Finance > Invoices tab > "+ Create New Invoices"
- Manage team: Team Members > "+ Add New Member"

---

## Key Features

### Projects Page
- **List View:** Paginated table showing all projects
- **Sorting:** Click column headers to sort (if implemented)
- **Search:** Use search box to filter projects
- **Add Project:** Click button to open modal
- **View Details:** Click "View Details" button
- **Edit:** Click edit icon (if available)
- **Delete:** Click delete icon with confirmation

### Finance Page
- **Multiple Tabs:**
  - Proposals (4 items)
  - Estimates (2 items)
  - Invoices (2 items)
  - Contracts (2 items)
- **Create:** Click "+ Create New" button
- **Line Items:** Add description, quantity, rate
- **Auto Calculate:** Amount updates automatically
- **Tax & Discount:** Apply percentage or fixed amount
- **Status:** Change payment/approval status

### Messages
- **Conversations:** Left sidebar shows all conversations
- **Chat View:** Select conversation to open chat
- **Send Message:** Type in input and click send
- **Search:** Find conversations by name or content

### Settings
- **Company Profile:** Update company information
- **Security:** Change password with current password verification
- **Notifications:** View and manage all notifications

---

## Common Tasks

### Create a New Project
1. Go to **Projects**
2. Click **"+ Add New Project"** button
3. Fill in form:
   - Project Name
   - Project Number
   - Select Client from dropdown
   - Enter Budget Amount
   - Set Start Date
   - Set End Date
   - Add Project Description
   - Upload project photo (optional)
   - Assign Team Members
4. Click **"Add Project"**

### Add a Task to Project
1. Go to **Projects** > **Tasks**
2. Click **"+ Add New Task"** button
3. Fill in form:
   - Select Milestone
   - Enter Task Name
   - Select Team Member
   - Set Start Date
   - Set End Date
4. Click **"Add Task"**

### Create an Invoice
1. Go to **Finance** > **Invoices** tab
2. Click **"+ Create New Invoices"** button
3. Fill in form:
   - Select Client
   - Select Project
   - Set Issue Date
   - Set Due Date
   - Add Line Items (Click "+ Add More")
4. Calculate totals:
   - Subtotal (auto)
   - Apply Tax %
   - Apply Discount
   - Total (auto)
5. Click **"Add Invoice"**

### Add Team Member
1. Go to **Team Members**
2. Click **"+ Add New Member"** button
3. Fill in form:
   - Select existing team member
   - Assign to project
4. Click **"Add Member"**

### Update Company Profile
1. Go to **Settings**
2. Click **Company Profile** tab
3. Update fields:
   - Company Name
   - Company Address
   - Email
   - Phone
4. Click **"Save Changes"**

### Change Password
1. Go to **Settings**
2. Click **Security** tab
3. Fill in form:
   - Current Password
   - New Password
   - Confirm Password
4. Click **"Save Changes"**

---

## API Integration

### Base URL
All API calls use: `process.env.NEXTPUBLICBASEURL`

### Available Endpoints

#### Projects
```
GET    /api/projects              - List all projects
POST   /api/projects              - Create project
PUT    /api/projects/{id}         - Update project
DELETE /api/projects/{id}         - Delete project
```

#### Tasks
```
GET    /api/tasks                 - List all tasks
POST   /api/tasks                 - Create task
PUT    /api/tasks/{id}            - Update task
DELETE /api/tasks/{id}            - Delete task
```

#### Clients
```
GET    /api/clients               - List all clients
POST   /api/clients               - Create client
PUT    /api/clients/{id}          - Update client
DELETE /api/clients/{id}          - Delete client
```

#### Finance
```
GET    /api/finance/{type}        - List by type (proposal/estimate/invoice/contract)
POST   /api/finance/{type}        - Create item
PUT    /api/finance/{type}/{id}   - Update item
DELETE /api/finance/{type}/{id}   - Delete item
```

#### Authentication
```
POST   /auth/login                - Login with email/password
POST   /auth/logout               - Logout current session
POST   /auth/change-password      - Change password
POST   /auth/forgot-password      - Request password reset
POST   /auth/reset-password       - Reset with token
```

### Authorization Header
All requests automatically include:
```
Authorization: Bearer {accessToken}
```

Token is injected via Axios interceptor and automatically refreshed on expiration.

---

## Pagination

### Default Settings
- **Items per page:** 10
- **Visible pages:** Shows current page and nearby pages
- **Navigation:** Previous, numbered pages, Next

### How to Use
1. Click page number to jump to that page
2. Click "Next" to go to next page
3. Click "Previous" to go to previous page
4. Pagination updates automatically when searching

---

## Status Badges & Colors

### Project Status
- **Completed** - Green
- **Active** - Blue (Teal)
- **In Progress** - Orange
- **On Hold** - Red

### Financial Status
- **Pending** - Yellow
- **Approved** - Green/Blue
- **Paid** - Blue
- **Unpaid** - Red

---

## Troubleshooting

### Login Not Working
- Check email/password are correct
- Ensure NEXTAUTH_SECRET is set
- Clear browser cookies and try again

### API Errors
- Check internet connection
- Verify BASE_URL in env variables
- Check browser console for error details
- Ensure token is valid (check Settings > Security)

### Data Not Loading
- Wait for skeleton loaders to finish
- Try refreshing the page
- Check network tab in DevTools
- Ensure API endpoints are responding

### Styling Issues
- Clear browser cache
- Run `npm run build` then `npm run dev`
- Check Tailwind CSS is properly configured

---

## Development Tips

### Console Logging
The app includes `console.log("[v0] ...")` statements for debugging. These are useful for:
- Tracking API calls
- Inspecting form data
- Monitoring state changes

### Form Validation
All forms include validation for:
- Required fields
- Email format
- Password strength (8+ chars)
- Date ranges
- Amount precision (2 decimals)

### Error Handling
- All API errors show toast notifications
- 401 errors trigger automatic logout
- Network errors are caught and displayed
- Form validation errors are highlighted

---

## Performance Optimization

### Image Optimization
- Use Next.js `Image` component
- Provide appropriate dimensions
- Use `placeholder="blur"` for better UX

### Data Fetching
- TanStack Query caches API responses
- Automatic refetch on window focus
- Manual refetch available via `queryClient`

### Bundle Size
- Code splitting per route
- Dynamic imports for modals
- Tree-shaking for unused code

---

## Security Notes

- Tokens stored in httpOnly cookies
- CSRF protection via NextAuth
- SQL injection prevention via parameterized queries
- XSS protection via React's built-in escaping
- Password hashing with bcrypt (server-side)

---

## Support & Documentation

- **NextAuth Documentation:** https://next-auth.js.org
- **TanStack Query:** https://tanstack.com/query
- **Tailwind CSS:** https://tailwindcss.com
- **Next.js:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## Next Steps

1. ✅ Install and run the project
2. ✅ Login with test credentials
3. ✅ Explore each page and feature
4. ✅ Create sample data (projects, clients, etc.)
5. ✅ Test all CRUD operations
6. ✅ Customize based on your needs
7. ✅ Deploy to production

---

## Project Structure

```
root/
├── app/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Main dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── dashboard/         # Dashboard components
├── lib/
│   ├── api.ts            # Axios setup & endpoints
│   └── utils.ts          # Utility functions
├── types/
│   └── next-auth.d.ts    # NextAuth type definitions
├── proxy.ts              # Middleware for auth
└── package.json
```

Enjoy building with this admin dashboard!
