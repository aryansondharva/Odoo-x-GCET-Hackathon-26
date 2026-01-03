"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEmployees } from "@/lib/mock-data"
import { Mail, Phone, Search, Plus, Filter, Users, Building, Calendar } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { AddEmployee } from "@/components/add-employee"

import type { User } from "@/lib/auth-context"

export function EmployeesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  
  // Get all employees: mock data + newly registered users (with unique IDs)
  const allEmployees = useMemo(() => {
    const mockEmps: User[] = [...mockEmployees]
    const localEmps: User[] = JSON.parse(localStorage.getItem("hr_employees") || "[]")
    
    // Create a map to track seen IDs
    const seenIds = new Set<string>()
    const uniqueEmployees: User[] = []
    
    // Add mock employees
    mockEmps.forEach((emp) => {
      if (!seenIds.has(emp.id) && emp.name && emp.email && emp.employeeId) {
        seenIds.add(emp.id)
        // Ensure the employee has a status property
        const empWithStatus = {
          ...emp,
          status: emp.status || "active"
        }
        uniqueEmployees.push(empWithStatus)
      }
    })
    
    // Add localStorage employees with new unique IDs if they don't conflict
    localEmps.forEach((emp) => {
      if (!seenIds.has(emp.id) && emp.name && emp.email && emp.employeeId) {
        seenIds.add(emp.id)
        // Ensure the employee has a status property
        const empWithStatus = {
          ...emp,
          status: emp.status || "active"
        }
        uniqueEmployees.push(empWithStatus)
      }
    })
    
    return uniqueEmployees
  }, [])

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = [...new Set(allEmployees.map(emp => emp.department).filter(dept => dept && dept.trim() !== ""))]
    return depts.sort()
  }, [allEmployees])

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = allEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(emp => emp.department === departmentFilter)
    }

    // Apply status filter (mock status based on employee data)
    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => {
        if (statusFilter === "active") return emp.status !== "inactive"
        if (statusFilter === "inactive") return emp.status === "inactive"
        return true
      })
    }

    // Sort employees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "department":
          return a.department.localeCompare(b.department)
        case "joinDate":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [allEmployees, searchQuery, departmentFilter, statusFilter, sortBy])

  // Calculate statistics
  const stats = useMemo(() => ({
    total: allEmployees.length,
    active: allEmployees.filter(emp => emp.status !== "inactive").length,
    departments: departments.length
  }), [allEmployees, departments])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-black">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-black">{stats.departments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-black">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40 bg-white border-gray-200">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-white border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-white border-gray-200">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddEmployee(true)}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-black">{filteredEmployees.length}</span> of{' '}
          <span className="font-medium text-black">{allEmployees.length}</span> employees
        </p>
        {(searchQuery || departmentFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setDepartmentFilter("all")
              setStatusFilter("all")
              setSortBy("name")
            }}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <Card key={emp.id} className="hover:border-black transition-colors border-gray-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <PhotoUpload
                    currentPhoto={emp.profilePicture}
                    employeeId={emp.employeeId}
                    onPhotoUpdate={(newPhoto) => {
                      // Update the employee's photo in the local state
                      emp.profilePicture = newPhoto
                    }}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-black">{emp.name}</h3>
                    <p className="text-xs text-gray-600 truncate">{emp.position}</p>
                    <p className="text-xs text-gray-500">ID: {emp.employeeId}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white text-black border-gray-300">
                  {emp.status === "inactive" ? "Inactive" : "Active"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white text-xs">
                    {emp.department}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {emp.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/employees/${emp.id}`} className="flex-1">
                  <Button variant="outline" className="w-full text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                  <Mail className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="pt-6 text-center py-12">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">No employees found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || departmentFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No employees have been added yet."}
            </p>
            {(searchQuery || departmentFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setDepartmentFilter("all")
                  setStatusFilter("all")
                  setSortBy("name")
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Add Employee Modal */}
      {showAddEmployee && (
        <AddEmployee
          onClose={() => setShowAddEmployee(false)}
          onSuccess={() => {
            setShowAddEmployee(false)
            // Refresh the employee list
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
