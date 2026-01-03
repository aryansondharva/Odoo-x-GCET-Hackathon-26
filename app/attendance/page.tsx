"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAttendance, mockEmployees } from "@/lib/mock-data"
import { Calendar, CheckCircle2, XCircle, Clock3 } from "lucide-react"
import { useState } from "react"

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedEmployee, setSelectedEmployee] = useState(user?.employeeId)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  if (!user) return null

  const isAdmin = user.role === "admin"
  const displayEmployeeId = isAdmin && selectedEmployee ? selectedEmployee : user.employeeId

  const employeeAttendance = mockAttendance.filter((a) => a.employeeId === displayEmployeeId)
  const todayAttendance = employeeAttendance.find((a) => a.date === selectedDate)

  const attendanceStats = {
    present: employeeAttendance.filter((a) => a.status === "present").length,
    absent: employeeAttendance.filter((a) => a.status === "absent").length,
    halfDay: employeeAttendance.filter((a) => a.status === "half-day").length,
    leave: employeeAttendance.filter((a) => a.status === "leave").length,
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      present: {
        color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
        icon: <CheckCircle2 className="w-4 h-4" />,
      },
      absent: {
        color: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
        icon: <XCircle className="w-4 h-4" />,
      },
      "half-day": {
        color: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
        icon: <Clock3 className="w-4 h-4" />,
      },
      leave: {
        color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
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
        {/* Filters */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filter Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Select Employee</label>
                  <select
                    value={selectedEmployee || ""}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    {mockEmployees.map((emp) => (
                      <option key={emp.id} value={emp.employeeId}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Present", value: attendanceStats.present, color: "bg-green-100 dark:bg-green-900" },
            { label: "Absent", value: attendanceStats.absent, color: "bg-red-100 dark:bg-red-900" },
            { label: "Half Day", value: attendanceStats.halfDay, color: "bg-orange-100 dark:bg-orange-900" },
            { label: "Leave", value: attendanceStats.leave, color: "bg-blue-100 dark:bg-blue-900" },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Check-In/Out Card */}
        {todayAttendance && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>{selectedDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{getStatusBadge(todayAttendance.status)}</p>
                  </div>
                </div>
                {todayAttendance.checkIn && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Check In</p>
                      <p className="text-xl font-bold">{todayAttendance.checkIn}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Check Out</p>
                      <p className="text-xl font-bold">{todayAttendance.checkOut}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Last 10 records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium">Date</th>
                    <th className="text-left py-3 px-3 font-medium">Status</th>
                    <th className="text-left py-3 px-3 font-medium">Check In</th>
                    <th className="text-left py-3 px-3 font-medium">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAttendance.slice(0, 10).map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-3 px-3">{record.date}</td>
                      <td className="py-3 px-3">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-3 text-muted-foreground">{record.checkIn || "-"}</td>
                      <td className="py-3 px-3 text-muted-foreground">{record.checkOut || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
