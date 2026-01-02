# referkaro

> Get referred. Get hired.

A modern, referral-based job board that connects people who can refer with those seeking career opportunities. Built with Next.js 14, TypeScript, Tailwind CSS, and Appwrite.

![referkaro](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Appwrite](https://img.shields.io/badge/Appwrite-14-f02e65)

## 🚀 Features

### Core Functionality

- **Role-based Access Control** - Three distinct user roles with specific permissions
- **Job Referral System** - Referrers post jobs, applicants apply, admin moderates
- **Application Tracking** - Real-time status updates for applications
- **Admin Moderation** - Content review and user management

### Technical Highlights

- Server Components by default for optimal performance
- Type-safe with TypeScript throughout
- Dark mode first design system
- Mobile-responsive layouts
- Secure authentication with Appwrite

## 🏗 Architecture

```
referkaro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── dashboard/         # Role-based dashboards
│   │   │   ├── applicant/     # Applicant views
│   │   │   ├── referrer/      # Referrer views
│   │   │   └── admin/         # Admin views
│   │   ├── jobs/              # Public job listings
│   │   └── apply/             # Application flow
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── jobs/              # Job-related components
│   │   └── applications/      # Application components
│   └── lib/
│       ├── appwrite/          # Appwrite client & API
│       ├── hooks/             # React hooks
│       ├── types/             # TypeScript types
│       └── utils.ts           # Utility functions
├── scripts/
│   └── setup-appwrite.ts      # Database setup script
└── public/                    # Static assets
```

## 👥 User Roles

### Applicant

- Browse approved job referrals
- Apply to jobs with cover message and resume link
- Track application status (pending → approved/rejected)
- View only their own applications

### Referrer

- Post job referral opportunities
- Jobs require admin approval before going live
- View and manage applications to their jobs
- Approve or reject applicants

### Admin

- Approve/reject pending job posts
- View platform-wide statistics
- Manage users (activate/deactivate)
- Full access to all data

## 🔐 Permissions Model

| Action                | Applicant | Referrer      | Admin |
| --------------------- | --------- | ------------- | ----- |
| View approved jobs    | ✅        | ✅            | ✅    |
| Apply to jobs         | ✅        | ❌            | ❌    |
| Post jobs             | ❌        | ✅            | ❌    |
| View own applications | ✅        | ❌            | ✅    |
| View job applications | ❌        | ✅ (own jobs) | ✅    |
| Approve/reject jobs   | ❌        | ❌            | ✅    |
| Manage users          | ❌        | ❌            | ✅    |

## 📊 Data Model

### Users Collection

```typescript
{
  $id: string;
  email: string;
  name: string;
  role: 'applicant' | 'referrer' | 'admin';
  company?: string;
  bio?: string;
  linkedIn?: string;
  isActive: boolean;
}
```

### Jobs Collection

```typescript
{
  $id: string;
  company: string;
  role: string;
  description: string;
  referralNotes: string;
  location: "remote" | "hybrid" | "onsite";
  status: "pending" | "approved" | "rejected";
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
}
```

### Applications Collection

```typescript
{
  $id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
  resumeLink: string;
  status: "pending" | "approved" | "rejected";
}
```

## 🛠 Setup

### Prerequisites

- Node.js 18.17+
- Appwrite account (cloud.appwrite.io or self-hosted)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/referkaro.git
cd referkaro
npm install
```

### 2. Configure Appwrite

1. Create a new project in [Appwrite Console](https://cloud.appwrite.io)
2. Enable Email/Password authentication
3. Create an API key with Database permissions

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

NEXT_PUBLIC_APPWRITE_DATABASE_ID=referkaro_db
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID=jobs
NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID=applications

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=referkaro
```

### 4. Setup Database

```bash
npm run setup:appwrite
```

This creates the database, collections, attributes, and indexes.

### 5. Create Admin User

1. Go to Appwrite Console → Auth → Create User
2. Create a user with email and password
3. Go to Databases → referkaro_db → users
4. Create a document with:
   - Use the auth user's ID as document ID
   - Set `role: "admin"`
   - Set `isActive: true`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

```bash
vercel
```

### Environment Variables for Production

- All `NEXT_PUBLIC_*` variables must be set
- `APPWRITE_API_KEY` is only needed for the setup script

## 🎨 Design Decisions

### Why Appwrite?

- Built-in authentication with role management
- Real-time database with query support
- No need for custom backend server
- Generous free tier for startups

### Why Dark Mode First?

- Reduces eye strain for job seekers spending hours browsing
- Modern, professional aesthetic
- Better perceived performance

### Why Server Components?

- Faster initial page loads
- Reduced client-side JavaScript
- Better SEO for job listings
- Client components only where interactivity is needed

### Security Considerations

- Row-level permissions in Appwrite
- Role verification on both client and server
- No public write access to collections
- Admin actions require explicit role check

## 📁 Route Structure

```
/                       # Landing page
/jobs                   # Public job listings
/jobs/[id]              # Job detail page
/apply/[jobId]          # Application form (applicants only)
/login                  # Sign in
/signup                 # Sign up with role selection
/dashboard/applicant    # Applicant overview
/dashboard/applicant/applications  # Application tracking
/dashboard/referrer     # Referrer overview
/dashboard/referrer/jobs           # Manage jobs
/dashboard/referrer/jobs/new       # Post new job
/dashboard/referrer/applications   # Review applications
/dashboard/admin        # Admin overview
/dashboard/admin/jobs   # Moderate jobs
/dashboard/admin/users  # Manage users
/dashboard/admin/stats  # Platform statistics
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📝 License

MIT License - feel free to use this for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ by [Your Name](https://github.com/yourusername)
