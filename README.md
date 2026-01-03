# Dayflow - Human Resource Management System

> Modern HRMS platform built with Next.js 16, React 19, and TypeScript

![Dayflow](https://img.shields.io/badge/Dayflow-HRMS-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

## Overview

Dayflow is a comprehensive Human Resource Management System that streamlines employee management, attendance tracking, leave management, and payroll processing for modern organizations.

## Quick Start

### Demo Accounts

#### Admin Accounts
| Email | Password | Role |
|-------|----------|------|
| `hr1@example.com` | `HR@12345` | Admin |
| `hr2@example.com` | `HR@54321` | Admin |

#### Employee Accounts
| Email | Password | Role | Department |
|-------|----------|------|------------|
| `emp1@example.com` | `Emp@12345` | Employee | Engineering |
| `emp2@example.com` | `Emp@12345` | Employee | Marketing |
| `emp3@example.com` | `Emp@12345` | Employee | Finance |

## Features

### Core Features
- ✅ **Modern Dashboard**: Real-time analytics and KPIs
- ✅ **Employee Management**: Complete employee directory with search/filter
- ✅ **Attendance Tracking**: Daily and weekly attendance management
- ✅ **Leave Management**: Submit, track, and approve leave requests
- ✅ **Payroll System**: Salary processing and payslip generation
- ✅ **OTP Authentication**: Two-factor authentication for security
- ✅ **Role-based Access**: Separate interfaces for HR and Employees

### Admin Features
- Employee CRUD operations
- Attendance monitoring with analytics
- Leave request approval/rejection
- Payroll management and processing
- Comprehensive reporting and exports

### Employee Features
- Personal dashboard with metrics
- Profile update and document upload
- Leave request submission
- Attendance tracking and history
- Payslip access and download

## Tech Stack

```
Frontend:
- Next.js 16 with App Router
- React 19.2 with hooks
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui components

State Management:
- React Context API
- localStorage for persistence

Authentication:
- JWT with OTP
- Session storage
- Role-based access control
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd dayflow-hrms

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

## Project Structure

```
dayflow-hrms/
├── app/
│   ├── (auth)/              # Auth routes
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard
│   ├── employees/           # Employee management
│   ├── attendance/          # Attendance tracking
│   ├── leave/               # Leave management
│   ├── payroll/             # Payroll dashboard
│   ├── profile/             # User profile
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard-layout.tsx # Dashboard wrapper
│   └── auth-layout.tsx      # Auth wrapper
├── lib/
│   ├── auth-context.tsx     # Auth provider
│   ├── mock-data.ts         # Mock data
│   └── utils.ts             # Utilities
└── README.md               # This file
```

## Usage

### Login Flow
1. Visit http://localhost:3000
2. Click "Login" 
3. Enter demo credentials
4. Auto-redirects to dashboard

### Creating Leave Request
1. Go to Leave Management
2. Click "New Request"
3. Select dates and type
4. Add reason and submit

## Performance Optimizations

- Server-side rendering for critical paths
- Code splitting and lazy loading
- Debounced search and filters
- Optimized re-renders with Context

## Security Features

- OTP-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Secure localStorage usage
- Session management with tokens

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design)

## Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy on Vercel
# Import repository and deploy
```

### Self-hosted
```bash
npm run build
npm start
```

## Troubleshooting

### Auto-login not working
- Check browser localStorage is enabled
- Clear cache and retry

### OTP not received
- OTP is logged to console in demo mode
- Check browser console (F12)

### Import errors
- Delete `node_modules` folder
- Run `npm install` again
- Clear Next.js cache: `rm -rf .next`

## License

MIT License

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/dayflow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/dayflow/discussions)

---

**Built with ❤️ by the Dayflow Team**
