import { type NextRequest, NextResponse } from "next/server"

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

    // Generate employee ID
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1] || ""
    const year = new Date().getFullYear()
    const serial = String(Math.floor(Math.random() * 10000)).padStart(3, "0")
    const employeeId = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${year}${serial}`.toUpperCase()

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId,
      name,
      email,
      role: role || "employee",
      department,
      position,
      phone,
      companyName,
      joinDate: new Date().toISOString().split("T")[0],
    }

    // TODO: Hash password and store in database
    // TODO: Send verification email
    const token = `jwt_${Date.now()}_${email}`

    return NextResponse.json(
      {
        success: true,
        user: newUser,
        token,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
