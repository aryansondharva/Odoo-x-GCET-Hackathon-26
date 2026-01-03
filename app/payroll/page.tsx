"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockPayroll, mockEmployees } from "@/lib/mock-data"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

export default function PayrollPage() {
  const { user } = useAuth()
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState(user?.employeeId)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (!user) return null

  const isAdmin = user.role === "admin"
  const displayPayroll = isAdmin ? mockPayroll : mockPayroll.filter((p) => p.employeeId === user.employeeId)
  const currentPayroll = displayPayroll[0]

  const handleDownloadPayslip = async (payrollId: string, month: string, year: number, netSalary: number) => {
    setDownloadingId(payrollId)

    try {
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const payslipContent = `
PAYSLIP
Employee ID: ${user.employeeId}
Employee Name: ${user.name}
Month: ${month} ${year}
Net Salary: $${netSalary.toLocaleString()}
Date: ${new Date().toLocaleDateString()}
      `

      const element = document.createElement("a")
      const file = new Blob([payslipContent], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `Payslip_${month}_${year}_${user.employeeId}.pdf`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <DashboardLayout currentPage="Payroll">
      <div className="space-y-6">
        {/* Employee Filter for Admin */}
        {isAdmin && (
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium">Select Employee</label>
              <select
                value={selectedEmployee || ""}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-2"
              >
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.employeeId}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* Current Payroll Summary */}
        {currentPayroll && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>Current Payroll Summary</CardTitle>
              <CardDescription>
                {currentPayroll.month} {currentPayroll.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Base Salary</p>
                  <p className="text-xl font-bold">${currentPayroll.baseSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Allowances</p>
                  <p className="text-xl font-bold text-green-600">+${currentPayroll.allowances.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deductions</p>
                  <p className="text-xl font-bold text-red-600">-${currentPayroll.deductions.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">Net Salary</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${currentPayroll.netSalary.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Breakdown */}
        {currentPayroll && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Salary</span>
                    <span className="font-medium">${currentPayroll.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2">
                    <span className="text-muted-foreground">Allowances</span>
                    <span className="font-medium text-green-600">+${currentPayroll.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2 font-semibold">
                    <span>Total Earnings</span>
                    <span>${(currentPayroll.baseSalary + currentPayroll.allowances).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${Math.round(currentPayroll.deductions * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="font-medium">${Math.round(currentPayroll.deductions * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Other</span>
                    <span className="font-medium">${Math.round(currentPayroll.deductions * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2 font-semibold text-red-600">
                    <span>Total Deductions</span>
                    <span>-${currentPayroll.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Net Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground mb-1">Total Take Home</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${currentPayroll.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() =>
                      handleDownloadPayslip(
                        currentPayroll.id,
                        currentPayroll.month,
                        currentPayroll.year,
                        currentPayroll.netSalary,
                      )
                    }
                    disabled={downloadingId === currentPayroll.id}
                  >
                    {downloadingId === currentPayroll.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Slip
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payroll History */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll History</CardTitle>
            <CardDescription>Previous salary records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium">Month/Year</th>
                    <th className="text-left py-3 px-3 font-medium">Base Salary</th>
                    <th className="text-left py-3 px-3 font-medium">Allowances</th>
                    <th className="text-left py-3 px-3 font-medium">Deductions</th>
                    <th className="text-left py-3 px-3 font-medium">Net Salary</th>
                    <th className="text-left py-3 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPayroll.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-3 px-3">
                        {record.month} {record.year}
                      </td>
                      <td className="py-3 px-3">${record.baseSalary.toLocaleString()}</td>
                      <td className="py-3 px-3 text-green-600">+${record.allowances.toLocaleString()}</td>
                      <td className="py-3 px-3 text-red-600">-${record.deductions.toLocaleString()}</td>
                      <td className="py-3 px-3 font-semibold">${record.netSalary.toLocaleString()}</td>
                      <td className="py-3 px-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={() => handleDownloadPayslip(record.id, record.month, record.year, record.netSalary)}
                          disabled={downloadingId === record.id}
                        >
                          {downloadingId === record.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </td>
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
