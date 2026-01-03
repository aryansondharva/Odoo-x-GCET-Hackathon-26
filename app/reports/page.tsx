"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") return null

  const reports = [
    {
      title: "Attendance Report",
      description: "Monthly attendance summary by employee",
      type: "Attendance",
    },
    {
      title: "Leave Report",
      description: "Leave taken and remaining balance",
      type: "Leave",
    },
    {
      title: "Payroll Report",
      description: "Salary distribution and deductions",
      type: "Payroll",
    },
    {
      title: "Employee Roster",
      description: "Complete employee information",
      type: "HR",
    },
  ]

  return (
    <DashboardLayout currentPage="Reports">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>Download HR and payroll reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 mt-3 bg-transparent"
                    onClick={() => console.log("Downloading:", report.title)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
