"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAttendance, mockEmployees } from "@/lib/mock-data"
import { Calendar, CheckCircle2, XCircle, Clock3, TrendingUp, Users, CalendarIcon } from "lucide-react"

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedEmployee, setSelectedEmployee] = useState(user?.employeeId)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  if (!user) return null

  const isAdmin = user.role === "admin"
  const displayEmployeeId = isAdmin && selectedEmployee ? selectedEmployee : user.employeeId

  const employeeAttendance = mockAttendance.filter((a) => a.employeeId === displayEmployeeId)
  
  // Calculate statistics
  const attendanceStats = useMemo(() => {
    const present = employeeAttendance.filter((a) => a.status === "present").length
    const absent = employeeAttendance.filter((a) => a.status === "absent").length
    const halfDay = employeeAttendance.filter((a) => a.status === "half-day").length
    const leave = employeeAttendance.filter((a) => a.status === "leave").length
    const total = present + absent + halfDay + leave
    
    return {
      present,
      absent,
      halfDay,
      leave,
      total,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    }
  }, [employeeAttendance])

  // Get calendar days for selected month
  const getCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i)
      const dateStr = date.toISOString().split('T')[0]
      const attendance = employeeAttendance.find(d => d.date === dateStr)
      
      days.push({
        day: i,
        date: dateStr,
        attendance,
        isToday: date.toDateString() === new Date().toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    return days
  }
  
  const calendarDays = getCalendarDays()
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      present: {
        color: "bg-green-100 text-black border-green-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
      },
      absent: {
        color: "bg-green-100 text-black border-green-200",
        icon: <XCircle className="w-4 h-4" />,
      },
      "half-day": {
        color: "bg-yellow-100 text-black border-yellow-200",
        icon: <Clock3 className="w-4 h-4" />,
      },
      leave: {
        color: "bg-blue-100 text-black border-blue-200",
        icon: <Calendar className="w-4 h-4" />,
      },
    }
    const variant = variants[status] || variants.absent
    return (
      <Badge className={`gap-1.5 ${variant.color} border-0`}>
        {variant.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <DashboardLayout currentPage="Attendance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Attendance Tracking</h1>
          <div className="flex items-center gap-3">
            <Select value={viewMode} onValueChange={(value: "calendar" | "list") => setViewMode(value)}>
              <SelectTrigger className="w-32 bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Filters */}
        {isAdmin && (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base text-black">Filter Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block text-black">Select Employee</label>
                  <Select value={selectedEmployee || ""} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-48 bg-white border-gray-200">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.filter(emp => emp.employeeId && emp.employeeId.trim() !== "").map((emp) => (
                        <SelectItem key={emp.id} value={emp.employeeId}>
                          {emp.name} ({emp.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-black">Month</label>
                    <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                      <SelectTrigger className="w-40 bg-white border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((month, index) => (
                          <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-black">Year</label>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-32 bg-white border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2023, 2024, 2025, 2026].map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-black">{attendanceStats.present}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-black">{attendanceStats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Half Day</p>
                  <p className="text-2xl font-bold text-black">{attendanceStats.halfDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-black">{attendanceStats.attendanceRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-black">{attendanceStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-black">Attendance Calendar</CardTitle>
              <CardDescription className="text-gray-600">{monthNames[selectedMonth]} {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-1">
                {/* Weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square border border-gray-200 p-1
                      ${day ? 'hover:bg-gray-50' : ''}
                      ${day?.isToday ? 'bg-blue-50 border-blue-500' : ''}
                      ${day?.isWeekend ? 'bg-gray-50' : 'bg-white'}
                    `}
                  >
                    {day && (
                      <div className="h-full flex flex-col">
                        <div className="text-sm font-medium text-center mb-1">
                          {day.day}
                        </div>
                        {day.attendance && (
                          <div className="flex-1 flex items-center justify-center">
                            <div className={`w-2 h-2 rounded-full ${
                              day.attendance.status === 'present' ? 'bg-green-500' :
                              day.attendance.status === 'absent' ? 'bg-green-500' :
                              day.attendance.status === 'half-day' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-black">Recent Attendance</CardTitle>
              <CardDescription className="text-gray-600">Last 20 records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeeAttendance.slice(0, 20).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-black w-24">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4" />
                        <span>{record.checkIn || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4" />
                        <span>{record.checkOut || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
