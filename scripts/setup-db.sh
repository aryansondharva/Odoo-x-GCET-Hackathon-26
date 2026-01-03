#!/bin/bash

# PostgreSQL Database Setup Script for HRMS Application
# This script helps set up the database and populate it with initial data

echo "🚀 HRMS PostgreSQL Database Setup"
echo "================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it with your database credentials."
    echo "📝 Copy .env.example to .env and update the values."
    exit 1
fi

# Load environment variables
source .env

echo "📋 Database Configuration:"
echo "   Host: ${DB_HOST:-localhost}"
echo "   Port: ${DB_PORT:-5432}"
echo "   Database: ${DB_NAME:-hrms_db}"
echo "   User: ${DB_USER:-username}"

# Test database connection
echo ""
echo "🔍 Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your credentials."
    echo "💡 Make sure PostgreSQL is running and the database exists."
    exit 1
fi

# Create schema
echo ""
echo "🏗️  Creating database schema..."
if psql "$DATABASE_URL" -f lib/schema.sql; then
    echo "✅ Schema created successfully"
else
    echo "❌ Schema creation failed"
    exit 1
fi

# Seed initial data
echo ""
echo "🌱 Seeding initial data..."
if psql "$DATABASE_URL" -f lib/seed.sql; then
    echo "✅ Initial data seeded successfully"
else
    echo "❌ Data seeding failed"
    exit 1
fi

# Verify setup
echo ""
echo "🔍 Verifying setup..."
USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')
ATTENDANCE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM attendance;" | tr -d ' ')
LEAVE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM leave_requests;" | tr -d ' ')
PAYROLL_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM payroll;" | tr -d ' ')

echo "📊 Database Statistics:"
echo "   Users: $USER_COUNT"
echo "   Attendance Records: $ATTENDANCE_COUNT"
echo "   Leave Requests: $LEAVE_COUNT"
echo "   Payroll Records: $PAYROLL_COUNT"

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📝 Demo Accounts:"
echo "   Admin: hr1@example.com / HR@12345"
echo "   Admin: hr2@example.com / HR@54321"
echo "   Employee: emp1@example.com / Emp@12345"
echo ""
echo "🚀 You can now start the application with: npm run dev"
