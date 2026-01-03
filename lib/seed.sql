-- Initial Data Migration for HRMS Application
-- Run this after creating the schema

-- Insert admin users (passwords should be hashed in production)
INSERT INTO users (id, employee_id, name, email, password, role, department, position, phone, join_date, salary, company_name, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'EMP001', 'Alex Chen', 'hr1@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin', 'Human Resources', 'HR Manager', '+1234567890', '2021-01-15', 150000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'EMP002', 'Maria Garcia', 'hr2@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin', 'Human Resources', 'HR Specialist', '+1234567891', '2021-02-01', 120000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'EMP003', 'James Wilson', 'emp1@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Engineering', 'Senior Developer', '+1234567892', '2021-03-15', 95000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'EMP004', 'Emily Rodriguez', 'emp2@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Product', 'Product Manager', '+1234567893', '2021-04-01', 110000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'EMP005', 'David Kim', 'emp3@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Design', 'UI/UX Designer', '+1234567894', '2021-05-15', 85000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440006', 'EMP006', 'Sarah Johnson', 'emp4@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Marketing', 'Marketing Specialist', '+1234567895', '2021-06-01', 75000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440007', 'EMP007', 'Michael Brown', 'emp5@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Engineering', 'DevOps Engineer', '+1234567896', '2021-07-15', 105000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440008', 'EMP008', 'Lisa Wang', 'emp6@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Finance', 'Financial Analyst', '+1234567897', '2021-08-01', 90000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440009', 'EMP009', 'Robert Martinez', 'emp7@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Sales', 'Sales Executive', '+1234567898', '2021-09-15', 80000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440010', 'EMP010', 'Jennifer Lee', 'emp8@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Customer Support', 'Support Manager', '+1234567899', '2021-10-01', 70000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440011', 'EMP011', 'Thomas Anderson', 'emp9@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Engineering', 'Full Stack Developer', '+1234567900', '2021-11-15', 88000.00, 'Tech Excellence Corp', 'active'),
('550e8400-e29b-41d4-a716-446655440012', 'EMP012', 'Amanda Taylor', 'emp10@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'employee', 'Operations', 'Operations Coordinator', '+1234567901', '2021-12-01', 65000.00, 'Tech Excellence Corp', 'active')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert sample attendance records for the current month
INSERT INTO attendance (employee_id, date, status, check_in, check_out) VALUES
('EMP001', '2025-01-01', 'present', '09:00', '17:30'),
('EMP001', '2025-01-02', 'present', '09:15', '17:45'),
('EMP001', '2025-01-03', 'leave', NULL, NULL),
('EMP002', '2025-01-01', 'present', '09:30', '18:00'),
('EMP002', '2025-01-02', 'half-day', '10:00', '14:00'),
('EMP002', '2025-01-03', 'present', '09:00', '17:30'),
('EMP003', '2025-01-01', 'present', '08:45', '17:15'),
('EMP003', '2025-01-02', 'present', '09:00', '17:30'),
('EMP003', '2025-01-03', 'absent', NULL, NULL)
ON CONFLICT (employee_id, date) DO NOTHING;

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, employee_name, leave_type, start_date, end_date, remarks, status) VALUES
('EMP003', 'James Wilson', 'paid', '2025-01-10', '2025-01-12', 'Family vacation', 'approved'),
('EMP004', 'Emily Rodriguez', 'sick', '2025-01-05', '2025-01-06', 'Medical appointment', 'pending'),
('EMP005', 'David Kim', 'paid', '2025-02-01', '2025-02-05', 'Personal work', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample payroll records for December 2024
INSERT INTO payroll (employee_id, employee_name, month, year, base_salary, allowances, deductions, net_salary, payment_status, payment_date) VALUES
('EMP001', 'Alex Chen', 12, 2024, 150000.00, 15000.00, 25000.00, 140000.00, 'processed', '2024-12-31'),
('EMP002', 'Maria Garcia', 12, 2024, 120000.00, 12000.00, 20000.00, 112000.00, 'processed', '2024-12-31'),
('EMP003', 'James Wilson', 12, 2024, 95000.00, 10000.00, 15000.00, 90000.00, 'processed', '2024-12-31'),
('EMP004', 'Emily Rodriguez', 12, 2024, 110000.00, 11000.00, 18000.00, 103000.00, 'processed', '2024-12-31')
ON CONFLICT (employee_id, month, year) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (employee_id, document_name, document_type, file_path, file_size, upload_date, expiry_date) VALUES
('EMP001', 'Employment Contract', 'contract', '/documents/contracts/EMP001_contract.pdf', 1024000, '2021-01-15', '2026-01-15'),
('EMP002', 'Offer Letter', 'offer', '/documents/offers/EMP002_offer.pdf', 512000, '2021-02-01', NULL),
('EMP003', 'Tax Documentation', 'tax', '/documents/tax/EMP003_tax_2024.pdf', 2048000, '2024-12-31', '2025-12-31')
ON CONFLICT DO NOTHING;

-- Note: In production, you should:
-- 1. Use proper password hashing (bcrypt)
-- 2. Generate unique UUIDs for each record
-- 3. Add proper validation and constraints
-- 4. Consider adding audit trails
-- 5. Add proper error handling
