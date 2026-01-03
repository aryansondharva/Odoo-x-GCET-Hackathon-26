# Dayflow - Human Resource Management System (HRMS)

A modern, full-featured HRMS platform built with Next.js 16, React 19, and TypeScript. Dayflow streamlines HR operations with employee management, attendance tracking, leave management, payroll processing, and comprehensive reporting.

## Features

### Authentication & Security
- **Dual Authentication**: Role-based access for Admins and Employees
- **OTP Verification**: Two-factor authentication for secure login and registration
- **Employee ID Generation**: Automatic format (2 letters from name + year + serial)
- **Secure Session Management**: JWT-based tokens with refresh capability
- **Password Management**: Auto-generated passwords with change on first login

### Admin Dashboard
- **Employee Management**: View, search, and manage all employees
- **Analytics Dashboard**: Real-time metrics, charts, and KPIs
- **Attendance Monitoring**: Track daily/weekly attendance with visual charts
- **Leave Request Management**: Review and approve/reject leave requests with comments
- **Payroll Management**: Process salaries, manage deductions and allowances
- **Reports & Export**: Generate and export employee data, attendance, and payroll reports

### Employee Dashboard
- **Personal Dashboard**: Quick overview of attendance, pending leaves, and upcoming payroll
- **Profile Management**: Update personal information and upload documents
- **Leave Requests**: Submit leave requests and track status
- **Attendance**: Mark attendance and view history
- **Payslips**: Access and download previous payslips
- **Document Management**: Upload and manage work-related documents

### Payment Integration
- **Stripe Integration**: Secure payment processing for employee reimbursements
- **Salary Processing**: Automated salary calculations and distributions
- **Tax Management**: Automatic tax deduction calculations
- **Payment History**: Track all payment transactions

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Authentication**: JWT with OTP verification
- **Database**: Compatible with PostgreSQL, MySQL, MongoDB
- **Payment**: Stripe API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dayflow-hrms
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Authentication
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your_secret_key_here
OTP_EXPIRY=600

# Payment
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/hrms
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

**Admin Account:**
- Email: `admin@hrms.com`
- Password: `Admin@123`

**Employee Account:**
- Email: `employee@hrms.com`
- Password: `Employee@123`

## API Documentation

### Authentication Endpoints

#### Generate OTP
```
POST /api/auth/generate-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: { otp: "123456", expiresIn: 600 }
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response: { verified: true, token: "jwt_token" }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "otp": "123456" (optional)
}

Response: { user: {...}, token: "jwt_token" }
```

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "companyName": "Tech Corp",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "Password123!",
  "role": "employee",
  "department": "Engineering",
  "position": "Developer"
}

Response: { user: {...}, token: "jwt_token" }
```

### Employee Endpoints

#### Get All Employees
```
GET /api/employees
Headers: Authorization: Bearer {token}

Response: { employees: [...] }
```

#### Get Employee by ID
```
GET /api/employees/{id}
Headers: Authorization: Bearer {token}

Response: { employee: {...} }
```

#### Update Employee
```
PUT /api/employees/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

Response: { employee: {...} }
```

### Attendance Endpoints

#### Get Attendance
```
GET /api/attendance?startDate=2024-01-01&endDate=2024-01-31
Headers: Authorization: Bearer {token}

Response: { attendance: [...] }
```

#### Mark Attendance
```
POST /api/attendance/mark
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "present",
  "checkInTime": "09:00",
  "checkOutTime": "17:30"
}

Response: { attendance: {...} }
```

### Leave Endpoints

#### Get Leave Requests
```
GET /api/leave-requests
Headers: Authorization: Bearer {token}

Response: { leaveRequests: [...] }
```

#### Submit Leave Request
```
POST /api/leave-requests
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "leaveType": "sick",
  "startDate": "2024-02-10",
  "endDate": "2024-02-12",
  "reason": "Medical appointment"
}

Response: { leaveRequest: {...} }
```

#### Approve/Reject Leave
```
PUT /api/leave-requests/{id}/approve
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "comments": "Approved"
}

Response: { leaveRequest: {...} }
```

### Payroll Endpoints

#### Get Payslips
```
GET /api/payroll/payslips
Headers: Authorization: Bearer {token}

Response: { payslips: [...] }
```

#### Generate Payslip
```
POST /api/payroll/generate
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "employeeId": "OIHR2022001",
  "month": 1,
  "year": 2024
}

Response: { payslip: {...} }
```

### Payment Endpoints

#### Process Payment
```
POST /api/payments/process
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 10000,
  "description": "Salary",
  "paymentMethod": "stripe"
}

Response: { paymentId: "...", status: "success" }
```

## Project Structure

```
dayflow-hrms/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── employees/       # Employee management
│   │   ├── attendance/      # Attendance tracking
│   │   ├── leave/           # Leave management
│   │   ├── payroll/         # Payroll processing
│   │   └── payments/        # Payment processing
│   ├── dashboard/           # Main dashboard
│   ├── profile/             # User profile
│   ├── employees/           # Employee management
│   ├── attendance/          # Attendance tracking
│   ├── leave/               # Leave management
│   ├── leave-requests/      # Leave approval
│   ├── payroll/             # Payroll dashboard
│   └── reports/             # Reporting
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   └── dashboard/           # Dashboard components
├── lib/
│   ├── auth-context.tsx     # Authentication context
│   ├── utils.ts             # Utility functions
│   └── api-client.ts        # API client
├── hooks/                   # Custom React hooks
├── styles/                  # Global styles
├── public/                  # Static assets
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:
```bash
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project" and import your repository

4. Configure environment variables in Vercel settings

5. Click "Deploy"

### Deploy to Other Platforms

For deployment on AWS, Azure, or Docker:
```bash
npm run build
npm start
```

## Configuration

### Email Configuration (SMTP)

To enable email notifications for OTP and leave approvals:

1. Update `.env.local` with your SMTP credentials
2. The system will automatically send emails for:
   - OTP verification
   - Leave request approvals/rejections
   - Salary credit notifications
   - Password reset requests

### Payment Configuration

To enable Stripe payments:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add them to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_KEY`: Publishable key
   - `STRIPE_SECRET_KEY`: Secret key
4. Webhooks will be configured automatically

## Features in Development

- Mobile app (React Native)
- Advanced attendance analytics
- Performance review system
- Employee training management
- Expense management system
- Internal job postings
- Employee referral program
- Integration with calendar systems
- Slack/Teams integration

## Security Best Practices

- All passwords are hashed with bcrypt
- JWTs expire after 24 hours
- OTP codes expire after 10 minutes
- All API requests require authentication
- Sensitive data is encrypted at rest
- HTTPS is enforced in production
- Rate limiting on authentication endpoints
- CSRF protection enabled

## Performance Optimizations

- Server-side rendering for critical pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies for API responses
- Database query optimization
- CDN integration for static assets

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email: support@dayflow-hrms.com
Or create an issue on GitHub.

## Changelog

### Version 1.0.0 (2026-01-03)
- Initial release
- Core HRMS features
- Admin and employee dashboards
- Attendance and leave management
- Payroll processing
- Payment integration
- Document management

---

Built with ❤️ by the Dayflow team
