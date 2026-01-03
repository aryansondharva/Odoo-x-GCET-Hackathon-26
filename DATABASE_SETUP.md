# PostgreSQL Database Integration Setup

This guide will help you set up PostgreSQL database integration for the HRMS application, replacing the localStorage-based system with a proper database backend.

## 🚀 Quick Setup

### 1. Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+ 
- npm or yarn

### 2. Database Setup

#### Option A: Using the Setup Script (Recommended)

```bash
# 1. Create environment file
cp .env.example .env

# 2. Update .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/hrms_db"

# 3. Run the setup script
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

#### Option B: Manual Setup

```bash
# 1. Create database
createdb hrms_db

# 2. Run schema creation
psql postgresql://username:password@localhost:5432/hrms_db -f lib/schema.sql

# 3. Seed initial data
psql postgresql://username:password@localhost:5432/hrms_db -f lib/seed.sql
```

### 3. Environment Configuration

Update your `.env` file with the following:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/hrms_db"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="hrms_db"
DB_USER="username"
DB_PASSWORD="password"
DB_SSL="false"

# Connection Pool Settings
DB_MIN_CONNECTIONS="2"
DB_MAX_CONNECTIONS="10"

# JWT Secret (for authentication)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## 📊 Database Schema

### Core Tables

#### Users
- `id` (UUID, Primary Key)
- `employee_id` (VARCHAR, Unique)
- `name`, `email`, `password`
- `role`, `department`, `position`
- `phone`, `profile_picture`
- `join_date`, `salary`, `company_name`
- `status` (active/inactive)
- `created_at`, `updated_at`

#### Attendance
- `id` (UUID, Primary Key)
- `employee_id` (Foreign Key)
- `date`, `status` (present/absent/half-day/leave)
- `check_in`, `check_out`, `notes`

#### Leave Requests
- `id` (UUID, Primary Key)
- `employee_id` (Foreign Key)
- `leave_type`, `start_date`, `end_date`
- `remarks`, `status` (pending/approved/rejected)
- `approver_comments`, `approved_by`, `approved_at`

#### Payroll
- `id` (UUID, Primary Key)
- `employee_id` (Foreign Key)
- `month`, `year`
- `base_salary`, `allowances`, `deductions`
- `net_salary`, `payment_status`, `payment_date`

#### Documents
- `id` (UUID, Primary Key)
- `employee_id` (Foreign Key)
- `document_name`, `document_type`
- `file_path`, `file_size`
- `upload_date`, `expiry_date`, `status`

#### Sessions
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key)
- `token`, `expires_at`

## 🔐 Authentication & Security

### Password Hashing
- Uses bcryptjs for password hashing
- Default password for seeded users: `default123`
- Minimum password length: 8 characters

### Session Management
- Token-based sessions stored in database
- 24-hour session expiration
- Automatic session cleanup

### Security Features
- SQL injection prevention with parameterized queries
- Input validation on all endpoints
- CORS protection (Next.js default)
- Environment variable protection

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees?id={id}` - Update employee
- `DELETE /api/employees?id={id}` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance

### Leave Requests
- `GET /api/leave-requests` - List leave requests
- `POST /api/leave-requests` - Submit leave request
- `PUT /api/leave-requests?id={id}` - Update leave status

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll/generate` - Generate payroll

## 🧪 Demo Accounts

After running the seed script, you can use these accounts:

### Admin Accounts
| Email | Password | Role |
|-------|----------|------|
| `hr1@example.com` | `HR@12345` | Admin |
| `hr2@example.com` | `HR@54321` | Admin |

### Employee Accounts
| Email | Password | Role | Department |
|-------|----------|------|------------|
| `emp1@example.com` | `Emp@12345` | Employee | Engineering |
| `emp2@example.com` | `Emp@12345` | Employee | Product |
| `emp3@example.com` | `Emp@12345` | Employee | Design |

## 🔧 Development vs Production

### Development
- Uses local PostgreSQL instance
- Console logging enabled
- Relaxed SSL settings
- Default passwords for demo

### Production
- Use managed PostgreSQL service
- Disable console logging
- Enable SSL connections
- Change all default secrets
- Use environment-specific configurations

## 🚨 Troubleshooting

### Common Issues

#### Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l

# Test connection manually
psql "postgresql://username:password@localhost:5432/hrms_db"
```

#### Permission Denied
```bash
# Grant permissions to user
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE hrms_db TO username;"
```

#### Migration Errors
```bash
# Check if tables exist
psql "postgresql://username:password@localhost:5432/hrms_db" -c "\dt"

# Drop and recreate if needed
dropdb hrms_db && createdb hrms_db
```

## 📈 Performance Optimization

### Database Indexes
- Primary keys automatically indexed
- Additional indexes on frequently queried columns
- Composite indexes for complex queries

### Connection Pooling
- Configurable min/max connections
- Automatic connection cleanup
- Timeout settings for reliability

### Query Optimization
- Parameterized queries for security
- Efficient JOIN operations
- Proper WHERE clause usage

## 🔄 Migration from localStorage

### Data Migration
```bash
# Export existing data (if needed)
# Run this in browser console before switching
localStorage.getItem('hrms_user')
localStorage.getItem('hr_employees')
```

### Code Changes
The application automatically switches to database-based storage when:
1. Database connection is available
2. Environment variables are properly set
3. Database schema is created

## 📞 Support

For database-related issues:
1. Check PostgreSQL logs
2. Review application logs
3. Verify environment configuration
4. Test database connection manually

## 🗄️ Backup & Recovery

### Backup Database
```bash
pg_dump "postgresql://username:password@localhost:5432/hrms_db" > backup.sql
```

### Restore Database
```bash
psql "postgresql://username:password@localhost:5432/hrms_db" < backup.sql
```

### Automated Backups
Consider setting up automated backups using cron jobs or your hosting provider's backup service.
