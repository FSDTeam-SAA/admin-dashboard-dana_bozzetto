# Admin Dashboard Setup Guide

A pixel-perfect, fully functional admin dashboard built with Next.js 16, shadcn/ui, TanStack Query, Axios, NextAuth, and Sonner toast notifications.

## Features

✅ **Authentication**
- NextAuth integration with JWT tokens
- Login, Forgot Password, OTP Verification, Reset Password flows
- Axios interceptor for automatic token attachment
- Token refresh mechanism

✅ **Dashboard Components**
- KPI cards with metrics
- Interactive charts (Pie, Line, Bar charts using Recharts)
- Calendar with event management
- Project status overview

✅ **Core Modules**
- **Projects**: Create, read, update, delete projects with pagination
- **Clients**: Manage client information with avatars
- **Team Members**: Track team members with roles and projects
- **Finance**: Invoice management with line items and calculations

✅ **Technical Features**
- TanStack Query for server state management
- Axios with request/response interceptors
- Sonner for toast notifications
- Pagination with smart page navigation
- Skeleton loaders for loading states
- Role-based access control (admin/vendor)
- Dark theme with Tailwind CSS

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:5000

# NextAuth Providers (optional)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### How to generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Installation & Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
   - Copy the environment variables section above into your `.env.local` file
   - Update `NEXT_PUBLIC_BASE_URL` with your API endpoint (default: http://localhost:5000)

3. **Run Development Server**
```bash
npm run dev
```

4. **Open Browser**
   - Navigate to http://localhost:3000
   - You'll be redirected to `/auth/login`

## API Endpoints Expected

The dashboard expects these API endpoints from your backend:

### Authentication
- `POST /auth/login` - Login with email & password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Send reset email
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/verify-otp` - Verify OTP code
- `POST /auth/reset-password` - Reset password with token

### Projects
- `GET /api/projects?page=1&limit=10` - Get paginated projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Clients
- `GET /api/users?role=client&page=1&limit=10` - Get paginated clients
- `GET /api/users/:id` - Get single client
- `POST /api/users/client` - Create client (supports FormData for avatar)
- `PUT /api/users/:id` - Update client
- `DELETE /api/users/:id` - Delete client

### Team Members
- `GET /api/users?role=team_member&page=1&limit=10` - Get team members
- `GET /api/users/team-member/:id/dashboard` - Get member dashboard
- `POST /api/users/team-member` - Create team member
- `PUT /api/users/:id` - Update team member
- `DELETE /api/users/:id` - Delete team member

### Finance
- `GET /api/finance?page=1&limit=10` - Get paginated invoices
- `GET /api/finance/:id` - Get single invoice
- `POST /api/finance` - Create invoice
- `PUT /api/finance/:id` - Update invoice
- `DELETE /api/finance/:id` - Delete invoice

### Dashboard
- `GET /api/admin/dashboard/overview` - Get dashboard statistics
- `GET /api/admin/dashboard/projects` - Get project stats
- `GET /api/admin/dashboard/finance` - Get financial trends

## Login Credentials

Use these credentials from the API response or your backend:

```
Email: admin@gmail.com
Password: (from your backend)
```

Expected login response:
```json
{
  "user": {
    "_id": "696b150e94599951b86b4efb",
    "name": "Main Admin",
    "email": "admin@gmail.com",
    "role": "admin",
    "avatar": {
      "public_id": "",
      "url": "https://via.placeholder.com/150"
    }
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

## Project Structure

```
app/
├── auth/
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── otp/page.tsx
│   └── reset-password/page.tsx
├── dashboard/
│   ├── page.tsx (overview)
│   ├── projects/page.tsx
│   ├── clients/page.tsx
│   ├── team-members/page.tsx
│   ├── finance/page.tsx
│   ├── messages/page.tsx
│   └── settings/page.tsx
├── api/auth/[...nextauth]/route.ts
└── layout.tsx

components/
├── dashboard/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── kpi-card.tsx
│   ├── chart-card.tsx
│   ├── calendar.tsx
│   ├── pagination.tsx
│   ├── charts/
│   │   ├── project-status-chart.tsx
│   │   ├── message-activity-chart.tsx
│   │   └── financial-trends-chart.tsx
│   ├── projects/
│   │   ├── projects-list.tsx
│   │   └── add-project-modal.tsx
│   ├── clients/
│   │   ├── clients-list.tsx
│   │   └── add-client-modal.tsx
│   ├── team/
│   │   ├── team-members-list.tsx
│   │   └── add-team-member-modal.tsx
│   ├── finance/
│   │   ├── finance-list.tsx
│   │   └── add-finance-modal.tsx
│   └── skeletons/
│       ├── dashboard-skeleton.tsx
│       ├── projects-skeleton.tsx
│       ├── clients-skeleton.tsx
│       ├── team-skeleton.tsx
│       └── finance-skeleton.tsx

lib/
├── api.ts (Axios setup with interceptors)

types/
└── next-auth.d.ts (Type definitions)

proxy.ts (Next.js 16 middleware)
```

## Key Technologies

- **Next.js 16** - React framework with App Router
- **shadcn/ui** - Component library
- **Tailwind CSS v4** - Styling
- **NextAuth.js** - Authentication
- **TanStack Query** - Server state management
- **Axios** - HTTP client with interceptors
- **Recharts** - Charts and data visualization
- **Sonner** - Toast notifications
- **Lucide Icons** - Icon library

## Customization

### Changing Theme Colors
Edit the color values in components. The theme uses:
- Primary: `teal-600` (#14b8a6)
- Background: `slate-800/900`
- Accent: `slate-700`

### Adding New Pages
1. Create a new folder in `/app/dashboard/`
2. Add `page.tsx` with your content
3. The sidebar will auto-update with menu items if you modify `components/dashboard/sidebar.tsx`

### API Configuration
All API calls are centralized in `lib/api.ts`. Add new endpoints there following the existing pattern.

## Troubleshooting

**Token Expired?**
- The axios interceptor automatically handles token refresh
- If refresh fails, user is redirected to login

**CORS Issues?**
- Ensure your backend allows requests from `http://localhost:3000`
- Check `NEXT_PUBLIC_BASE_URL` is correct

**Image Upload Not Working?**
- Ensure FormData is being used for POST requests with files
- Check backend accepts `multipart/form-data`

## Deployment

1. Update environment variables in your deployment platform
2. Set `NEXTAUTH_URL` to your production domain
3. Ensure `NEXT_PUBLIC_BASE_URL` points to your production API
4. Deploy using `npm run build && npm start`

## Support

For issues or questions:
1. Check the component props and state management
2. Verify API endpoints match your backend
3. Check browser console and network tab for errors
4. Ensure all environment variables are set correctly
