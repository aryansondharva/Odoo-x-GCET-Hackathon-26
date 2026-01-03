import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { companyName, name, email, phone, password, role, department, position } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Generate employee ID
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1] || ""
    const year = new Date().getFullYear()
    const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    const employeeId = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${year}${serial}`.toUpperCase()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user into database
    const result = await query(
      `INSERT INTO users (employee_id, name, email, password, role, department, position, phone, company_name, join_date, salary, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        employeeId,
        name,
        email,
        hashedPassword,
        role || "employee",
        department,
        position,
        phone || null,
        companyName || null,
        new Date().toISOString().split('T')[0],
        (role || "employee") === 'admin' ? 150000 : 80000, // Default salary based on role
        'active'
      ]
    )

    const newUser = result.rows[0]
    const { password: _, ...userWithoutPassword } = newUser

    // Create session token
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')

    // Store session in database
    await query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [newUser.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000)]
    )

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        token,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
