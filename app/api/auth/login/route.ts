import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if database is available
    try {
      // Find user by email in database
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      const user = result.rows[0]

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      // Create session token (simplified - in production use JWT)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

      // Store session in database
      await query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000)] // 24 hours
      )

      return NextResponse.json(
        {
          success: true,
          user: userWithoutPassword,
          token,
          expiresIn: 86400,
        },
        { status: 200 },
      )
    } catch (dbError: any) {
      // If database is not available, fallback to mock authentication
      if (dbError.message.includes('Database not configured')) {
        console.log('Database not available, using fallback authentication')
        
        // Fallback to mock users for demo
        const mockUsers = {
          "hr1@example.com": {
            password: "HR@12345",
            user: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              employeeId: "EMP001",
              name: "Alex Chen",
              email: "hr1@example.com",
              role: "admin",
              department: "Human Resources",
              position: "HR Manager",
              phone: "+1234567890",
              joinDate: "2021-01-15",
              salary: 150000,
              companyName: "Tech Excellence Corp",
              status: "active"
            },
          },
          "emp1@example.com": {
            password: "Emp@12345",
            user: {
              id: "550e8400-e29b-41d4-a716-446655440003",
              employeeId: "EMP003",
              name: "James Wilson",
              email: "emp1@example.com",
              role: "employee",
              department: "Engineering",
              position: "Senior Developer",
              phone: "+1234567892",
              joinDate: "2021-03-15",
              salary: 95000,
              companyName: "Tech Excellence Corp",
              status: "active"
            },
          },
        }

        const userRecord = mockUsers[email as keyof typeof mockUsers]

        if (!userRecord || userRecord.password !== password) {
          return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        // Create session token
        const token = Buffer.from(`${userRecord.user.id}:${Date.now()}`).toString('base64')

        return NextResponse.json(
          {
            success: true,
            user: userRecord.user,
            token,
          },
          { status: 200 },
        )
      } else {
        throw dbError
      }
    }
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
