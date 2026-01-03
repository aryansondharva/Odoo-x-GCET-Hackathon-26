import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")?.toLowerCase()
    const department = searchParams.get("department")
    const status = searchParams.get("status")

    // Try database first
    try {
      let whereClause = "WHERE status = 'active'"
      let queryParams: any[] = []
      let paramIndex = 1

      if (search) {
        whereClause += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(email) LIKE $${paramIndex} OR LOWER(employee_id) LIKE $${paramIndex} OR LOWER(position) LIKE $${paramIndex})`
        queryParams.push(`%${search}%`)
        paramIndex++
      }

      if (department && department !== "all") {
        whereClause += ` AND department = $${paramIndex}`
        queryParams.push(department)
        paramIndex++
      }

      if (status && status !== "all") {
        whereClause += ` AND status = $${paramIndex}`
        queryParams.push(status)
        paramIndex++
      }

      const result = await query(
        `SELECT id, employee_id, name, email, role, department, position, phone, profile_picture, join_date, salary, company_name, status 
         FROM users ${whereClause} ORDER BY name`,
        queryParams
      )

      return NextResponse.json(
        {
          success: true,
          employees: result.rows,
          total: result.rows.length,
        },
        { status: 200 },
      )
    } catch (dbError: any) {
      // Fallback to localStorage if database is not available
      if (dbError.message.includes('Database not configured')) {
        console.log('Database not available, using localStorage fallback')
        
        // Get employees from localStorage
        const storedEmployees = JSON.parse(localStorage.getItem("hr_employees") || "[]")
        const mockEmployees = [
          {
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
            status: "active",
            profilePicture: null
          },
          {
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
            status: "active",
            profilePicture: null
          },
        ]
        
        let allEmployees = [...mockEmployees, ...storedEmployees]
        
        // Apply filters
        if (search) {
          allEmployees = allEmployees.filter(
            (emp) =>
              emp.name.toLowerCase().includes(search) ||
              emp.email.toLowerCase().includes(search) ||
              emp.employeeId.toLowerCase().includes(search) ||
              emp.position.toLowerCase().includes(search)
          )
        }

        if (department && department !== "all") {
          allEmployees = allEmployees.filter((emp) => emp.department === department)
        }

        if (status && status !== "all") {
          allEmployees = allEmployees.filter((emp) => emp.status === status)
        }

        return NextResponse.json(
          {
            success: true,
            employees: allEmployees,
            total: allEmployees.length,
          },
          { status: 200 },
        )
      } else {
        throw dbError
      }
    }
  } catch (error: any) {
    console.error("Get employees error:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, department, position, phone, salary, profilePicture, companyName } = await request.json()

    if (!name || !email || !role || !department || !position) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    // Check if employee already exists
    const existingEmployee = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingEmployee.rows.length > 0) {
      return NextResponse.json({ error: "Employee with this email already exists" }, { status: 409 })
    }

    // Generate employee ID
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1] || ""
    const year = new Date().getFullYear()
    const serial = String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    const employeeId = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${year}${serial}`.toUpperCase()

    // Insert new employee
    const result = await query(
      `INSERT INTO users (employee_id, name, email, role, department, position, phone, salary, profile_picture, company_name, join_date, password, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'default123', 'active') 
       RETURNING id, employee_id, name, email, role, department, position, phone, salary, profile_picture, company_name, join_date, status`,
      [
        employeeId,
        name,
        email,
        role,
        department,
        position,
        phone || null,
        salary || null,
        profilePicture || null,
        companyName || null,
        new Date().toISOString().split('T')[0]
      ]
    )

    return NextResponse.json(
      { 
        success: true, 
        employee: result.rows[0],
        message: "Employee created successfully"
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Create employee error:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    const { name, email, role, department, position, phone, salary, profilePicture, status } = await request.json()

    // Update employee
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           role = COALESCE($3, role), 
           department = COALESCE($4, department), 
           position = COALESCE($5, position), 
           phone = COALESCE($6, phone), 
           salary = COALESCE($7, salary), 
           profile_picture = COALESCE($8, profile_picture), 
           status = COALESCE($9, status)
       WHERE id = $10 
       RETURNING id, employee_id, name, email, role, department, position, phone, salary, profile_picture, company_name, join_date, status`,
      [name, email, role, department, position, phone, salary, profilePicture, status, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(
      { 
        success: true, 
        employee: result.rows[0],
        message: "Employee updated successfully"
      }
    )
  } catch (error: any) {
    console.error("Update employee error:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    // Delete employee (this will cascade delete related records)
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Employee ${result.rows[0].name} deleted successfully`
      }
    )
  } catch (error: any) {
    console.error("Delete employee error:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}
