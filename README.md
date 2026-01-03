# Dayflow - Human Resource Management System (HRMS)

> Modern, feature-rich HRMS platform built with Next.js 16, React 19, and TypeScript

![Dayflow](https://img.shields.io/badge/Dayflow-HRMS-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

## Overview

Dayflow is a comprehensive Human Resource Management System designed for modern organizations. It streamlines employee management, attendance tracking, leave management, payroll processing, and provides powerful analytics tools for HR professionals.

### Color Scheme
- **Primary**: Purple (#800080)
- **Secondary**: Pink (#FF69B4)
- **Neutral**: Black (#000000) & White (#FFFFFF)

## Quick Start

### Demo Accounts

#### HR/Admin Accounts
| Email | Password | Role | Department |
|-------|----------|------|------------|
| `hr1@example.com` | `HR@12345` | Admin | Human Resources |
| `hr2@example.com` | `HR@54321` | Admin | Human Resources |

#### Employee Accounts
| Email | Password | Role | Department | Position |
|-------|----------|------|------------|----------|
| `emp1@example.com` | `Emp@12345` | Employee | Engineering | Senior Developer |
| `emp2@example.com` | `Emp@12345` | Employee | Product | Product Manager |
| `emp3@example.com` | `Emp@12345` | Employee | Design | UI/UX Designer |
| `emp4@example.com` | `Emp@12345` | Employee | Marketing | Marketing Specialist |
| `emp5@example.com` | `Emp@12345` | Employee | Engineering | DevOps Engineer |
| `emp6@example.com` | `Emp@12345` | Employee | Finance | Financial Analyst |
| `emp7@example.com` | `Emp@12345` | Employee | Sales | Sales Executive |
| `emp8@example.com` | `Emp@12345` | Employee | Customer Support | Support Manager |
| `emp9@example.com` | `Emp@12345` | Employee | Engineering | Full Stack Developer |
| `emp10@example.com` | `Emp@12345` | Employee | Operations | Operations Coordinator |

**Pro Tip**: Login credentials are automatically saved in localStorage, so returning users will be automatically logged in on their next visit.

## Features

### Core Features
- ✅ **Modern Dashboard**: Real-time analytics and KPIs
- ✅ **Employee Management**: Complete employee directory with search/filter
- ✅ **Attendance Tracking**: Daily and weekly attendance management
- ✅ **Leave Management**: Submit, track, and approve leave requests
- ✅ **Payroll System**: Salary processing and payslip generation
- ✅ **Document Management**: Upload and manage employee documents
- ✅ **Export Reports**: CSV, JSON, PDF export capabilities
- ✅ **OTP Authentication**: Two-factor authentication for security
- ✅ **Persistent Login**: Auto-login on subsequent visits
- ✅ **Role-based Access**: Separate interfaces for HR and Employees

### Admin Features
- Employee CRUD operations
- Attendance monitoring with analytics
- Leave request approval/rejection
- Payroll management and processing
- Comprehensive reporting and exports
- Employee directory with advanced filters

### Employee Features
- Personal dashboard with metrics
- Profile update and document upload
- Leave request submission
- Attendance tracking and history
- Payslip access and download
- Personal notifications

## Tech Stack

```
Frontend:
- Next.js 16 with App Router
- React 19.2 with hooks
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui components
- Recharts for data visualization

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

# 3. Setup environment (optional)
cp .env.example .env.local

# 4. Run development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

## Project Structure

```
dayflow-hrms/
├── app/
│   ├── (auth)/              # Auth routes
│   │   ├── page.tsx         # Login page
│   │   ├── signup/          # Signup page
│   │   └── layout.tsx       # Auth layout
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard
│   ├── employees/           # Employee management
│   ├── attendance/          # Attendance tracking
│   ├── leave/               # Leave management
│   ├── payroll/             # Payroll dashboard
│   ├── profile/             # User profile
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard-layout.tsx # Dashboard wrapper
│   ├── auth-layout.tsx      # Auth wrapper
│   └── theme-provider.tsx   # Theme setup
├── lib/
│   ├── auth-context.tsx     # Auth provider
│   ├── api-client.ts        # API client
│   ├── export-utils.ts      # Export functions
│   ├── validators.ts        # Form validators
│   └── utils.ts             # Utilities
├── hooks/                   # Custom hooks
├── public/                  # Static assets
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md               # This file
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - New user registration
- `POST /api/auth/generate-otp` - Generate OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance

### Leave
- `GET /api/leave-requests` - List leave requests
- `POST /api/leave-requests` - Submit leave request
- `PUT /api/leave-requests/:id` - Update leave status

### Payroll
- `GET /api/payroll/payslips` - List payslips
- `POST /api/payroll/generate` - Generate payslip

### Payments
- `POST /api/payments/process` - Process payment

## Usage

### Login Flow
```typescript
// Demo login
1. Visit http://localhost:3000
2. Click "Login" 
3. Enter: hr1@example.com / HR@12345
4. Auto-redirects to dashboard
5. Next visit: Auto-login from localStorage
```

### Creating Leave Request
```typescript
1. Go to Leave Management
2. Click "New Request"
3. Select dates and type
4. Add reason (optional)
5. Submit
6. HR receives notification
```

### Exporting Reports
```typescript
1. Go to Reports section
2. Select date range
3. Choose export format (CSV/JSON/PDF)
4. Click Export
5. Download generated file
```

## Performance Optimizations

- Server-side rendering for critical paths
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Dynamic imports for heavy components
- Debounced search and filters
- Optimized re-renders with Context
- CSS minification with Tailwind v4

## Security Features

- OTP-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CSRF protection enabled
- Secure localStorage usage
- Password encryption ready
- Session management with tokens
- Rate limiting on auth endpoints

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

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables
# 5. Deploy
```

### Self-hosted
```bash
npm run build
npm start
```

## Environment Variables

Optional variables for production:

```env
# Authentication
JWT_SECRET=your_secret_key
OTP_EXPIRY=600

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Auto-login not working
- Check browser localStorage is enabled
- Clear cache and retry
- Check dev console for errors

### OTP not received
- OTP is logged to console in demo mode
- Check browser console (F12)
- OTP expires after 10 minutes

### Import errors
- Delete `node_modules` folder
- Run `npm install` again
- Clear Next.js cache: `rm -rf .next`

## Contributing

We welcome contributions! Please follow these steps:

```bash
# 1. Fork repository
# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Commit changes
git commit -m "Add feature"

# 4. Push to branch
git push origin feature/your-feature

# 5. Create Pull Request
```

## Roadmap

### v1.1 (Next)
- [ ] Advanced analytics dashboard
- [ ] Performance reviews
- [ ] Training management
- [ ] Expense management

### v1.2
- [ ] Mobile app (React Native)
- [ ] Slack integration
- [ ] Calendar sync
- [ ] Email notifications

### v2.0
- [ ] Machine learning recommendations
- [ ] Advanced reporting
- [ ] API webhooks
- [ ] Third-party integrations

## FAQ

**Q: Can I use real data?**
A: Yes! The system uses localStorage for demo, but can be connected to a real database (Supabase, PostgreSQL, etc.)

**Q: Is OTP mandatory?**
A: OTP is optional for demo. In production, it can be enforced per policy.

**Q: How many employees can I manage?**
A: Unlimited - depends on your database backend.

**Q: Is mobile app available?**
A: Web is fully responsive. Native apps coming in v1.2.

**Q: Can I customize colors?**
A: Yes! Edit `app/globals.css` color variables.

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- 📧 Email: support@dayflow-hrms.com
- 🐛 Issues: [GitHub Issues](https://github.com/dayflow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/dayflow/discussions)
- 📖 Documentation: [Full Docs](https://docs.dayflow.com)

## Changelog

### v1.0.0 (2026-01-03) - Initial Release
- Core HRMS functionality
- Admin & employee dashboards
- Attendance & leave management
- Payroll processing
- OTP authentication
- Persistent login
- Document management
- Export capabilities

---

**Built with ❤️ by the Dayflow Team**

*Transform your HR operations with Dayflow - Where HR Excellence is Simplified*
