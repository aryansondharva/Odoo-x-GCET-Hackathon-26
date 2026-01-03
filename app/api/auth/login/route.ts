import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const mockUsers = {
  "admin@hrms.com": {
    password: "Admin@123",
    user: {
      id: "1",
      employeeId: "OIHR2022001",
      name: "Sarah Johnson",
      email: "admin@hrms.com",
      role: "admin",
      department: "HR",
      position: "HR Manager",
    },
  },
  "employee@hrms.com": {
    password: "Employee@123",
    user: {
      id: "2",
      employeeId: "OIEX2021001",
      name: "Alex Chen",
      email: "employee@hrms.com",
      role: "employee",
      department: "Engineering",
      position: "Senior Developer",
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const userRecord = mockUsers[email as keyof typeof mockUsers]

    if (!userRecord || userRecord.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // TODO: Generate proper JWT in production
    const token = `jwt_${Date.now()}_${email}`

    return NextResponse.json(
      {
        success: true,
        user: userRecord.user,
        token,
        expiresIn: 86400,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
