# Database Setup Guide

## 🚀 Quick Setup Instructions

### Step 1: Update Your .env File
Your `.env` file needs to be updated with your PostgreSQL credentials. Here's what you need to add:

```env
# Database Configuration
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/hrms_db"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="hrms_db"
DB_USER="YOUR_USERNAME"
DB_PASSWORD="YOUR_PASSWORD"
DB_SSL="false"

# Connection Pool Settings
DB_MIN_CONNECTIONS="2"
DB_MAX_CONNECTIONS="10"
```

### Step 2: Create Database
Create the PostgreSQL database named `hrms_db`:

```bash
# Using psql
createdb hrms_db

# Or using PostgreSQL command line
psql -c "CREATE DATABASE hrms_db;"
```

### Step 3: Test Connection
Test if the database connection works:

```bash
# Test the database health check
curl http://localhost:3000/api/db-health
```

### Step 4: Run Database Setup (Optional)
If you want to set up the database schema and seed data:

```bash
# Run the setup script (if you have PostgreSQL tools)
psql "postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/hrms_db" -f lib/schema.sql
psql "postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/hrms_db" -f lib/seed.sql
```

## 🔧 What If Database Isn't Set Up?

The application is designed to work with or without the database:

### ✅ With Database
- Full PostgreSQL integration
- Persistent data storage
- Real-time updates
- Proper session management

### ✅ Without Database (Current State)
- Uses localStorage fallback
- Mock authentication
- Basic functionality works
- Photo upload works (files saved locally)

## 🎯 Current Status

Your application is currently running in **fallback mode** because:
- Database credentials aren't configured in `.env`
- The database may not be created yet
- Connection settings may be incorrect

### 🔄 How to Switch to Database Mode

1. **Update .env** with your PostgreSQL credentials
2. **Create the database** `hrms_db`
3. **Restart the application** (`npm run dev`)
4. **Test the connection** at `/api/db-health`

## 📱 Demo Accounts (Fallback Mode)

If database isn't set up, you can use these demo accounts:

- **Admin**: `hr1@example.com` / `HR@12345`
- **Employee**: `emp1@example.com` / `Emp@12345`

## 🛠️ Troubleshooting

### Database Connection Issues
- Check if PostgreSQL is running
- Verify credentials in `.env`
- Ensure database `hrms_db` exists
- Check port 5432 is available

### Common Errors
- `Database not configured` → Update `.env` file
- `Connection refused` → PostgreSQL not running
- `Authentication failed` → Wrong username/password

## 🎉 Next Steps

1. Set up PostgreSQL if not already installed
2. Update your `.env` file with correct credentials
3. Create the `hrms_db` database
4. Test the connection
5. Enjoy full database functionality!

The application will automatically switch to database mode once properly configured.
