import { type NextRequest, NextResponse } from "next/server"

// Mock employee database
const mockEmployees = [
  {
    id: "1",
    employeeId: "OIHR2022001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "admin",
    department: "HR",
    position: "HR Manager",
    phone: "+1 (555) 123-4567",
    joinDate: "2022-01-15",
    status: "active",
    salary: 95000,
  },
  {
    id: "2",
    employeeId: "OIEX2021001",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "employee",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 234-5678",
    joinDate: "2021-06-20",
    status: "active",
    salary: 120000,
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")?.toLowerCase()
    const department = searchParams.get("department")

    let employees = [...mockEmployees]

    if (search) {
      employees = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search) ||
          emp.employeeId.toLowerCase().includes(search),
      )
    }

    if (department) {
      employees = employees.filter((emp) => emp.department === department)
    }

    return NextResponse.json(
      {
        success: true,
        employees,
        total: employees.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get employees error:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}
