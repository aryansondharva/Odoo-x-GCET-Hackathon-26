"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPayroll, mockEmployees } from "@/lib/mock-data"
import { Download, Loader2, DollarSign, TrendingUp, TrendingDown, Users, Calendar, FileText, Calculator } from "lucide-react"

export default function PayrollPage() {
  const { user } = useAuth()
  const [selectedEmployee, setSelectedEmployee] = useState(user?.employeeId)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (!user) return null

  const isAdmin = user.role === "admin"
  const displayPayroll = isAdmin ? mockPayroll : mockPayroll.filter((p) => p.employeeId === user.employeeId)
  
  // Calculate payroll statistics
  const payrollStats = useMemo(() => {
    const totalPayroll = displayPayroll.reduce((acc, p) => acc + p.netSalary, 0)
    const avgSalary = displayPayroll.length > 0 ? totalPayroll / displayPayroll.length : 0
    const totalDeductions = displayPayroll.reduce((acc, p) => acc + p.deductions, 0)
    const totalAllowances = displayPayroll.reduce((acc, p) => acc + p.allowances, 0)
    
    return {
      totalPayroll,
      avgSalary,
      totalDeductions,
      totalAllowances,
      recordCount: displayPayroll.length
    }
  }, [displayPayroll])
  
  // Filter payroll by month/year
  const filteredPayroll = useMemo(() => {
    return displayPayroll.filter(p => {
      const payrollDate = new Date(`${p.month} 1, ${p.year}`)
      return payrollDate.getMonth() === selectedMonth && payrollDate.getFullYear() === selectedYear
    })
  }, [displayPayroll, selectedMonth, selectedYear])
  
  const currentPayroll = filteredPayroll[0]

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            {isAdmin ? "Payroll Management" : "My Payroll"}
          </h1>
          <div className="flex items-center gap-3">
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Process Payroll
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-black">
                    ${payrollStats.totalPayroll.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Salary</p>
                  <p className="text-2xl font-bold text-black">
                    ${Math.round(payrollStats.avgSalary).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Deductions</p>
                  <p className="text-2xl font-bold text-black">
                    ${payrollStats.totalDeductions.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-black">{payrollStats.recordCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allowances</p>
                  <p className="text-2xl font-bold text-black">
                    ${payrollStats.totalAllowances.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {isAdmin && (
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
          )}
          
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"].map((month, index) => (
                <SelectItem key={month} value={index.toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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

        {/* Current Payroll Summary */}
        {currentPayroll && (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">
                {currentPayroll.month} {currentPayroll.year} Payroll Summary
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isAdmin ? `For ${currentPayroll.employeeName}` : "Your current payroll details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">Base Salary</p>
                  <p className="text-xl font-bold text-black">${currentPayroll.baseSalary.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">Allowances</p>
                  <p className="text-xl font-bold text-green-600">+${currentPayroll.allowances.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">Deductions</p>
                  <p className="text-xl font-bold text-green-600">-${currentPayroll.deductions.toLocaleString()}</p>
                </div>
                <div className="bg-black p-4 rounded-lg text-white">
                  <p className="text-xs opacity-90">Net Salary</p>
                  <p className="text-xl font-bold">${currentPayroll.netSalary.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Breakdown */}
        {currentPayroll && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-black">Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium text-black">${currentPayroll.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">HRA Allowance</span>
                    <span className="font-medium text-green-600">+${Math.round(currentPayroll.allowances * 0.4).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transport Allowance</span>
                    <span className="font-medium text-green-600">+${Math.round(currentPayroll.allowances * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medical Allowance</span>
                    <span className="font-medium text-green-600">+${Math.round(currentPayroll.allowances * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2 font-semibold">
                    <span className="text-black">Total Earnings</span>
                    <span className="text-green-600">${(currentPayroll.baseSalary + currentPayroll.allowances).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-black">Deductions Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium text-green-600">${Math.round(currentPayroll.deductions * 0.5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Provident Fund</span>
                    <span className="font-medium text-green-600">${Math.round(currentPayroll.deductions * 0.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Professional Tax</span>
                    <span className="font-medium text-green-600">${Math.round(currentPayroll.deductions * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium text-green-600">${Math.round(currentPayroll.deductions * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2 font-semibold">
                    <span className="text-black">Total Deductions</span>
                    <span className="text-green-600">-${currentPayroll.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-black">Net Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Take Home Salary</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${currentPayroll.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Monthly CTC</p>
                    <p className="text-lg font-semibold text-black">
                      ${(currentPayroll.baseSalary + currentPayroll.allowances).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    className="w-full gap-2 bg-black hover:bg-gray-800 text-white"
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
                        Download Payslip
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payroll History */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-black">Payroll History</CardTitle>
            <CardDescription className="text-gray-600">Previous salary records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-medium text-black">Month/Year</th>
                    <th className="text-left py-3 px-3 font-medium text-black">Base Salary</th>
                    <th className="text-left py-3 px-3 font-medium text-black">Allowances</th>
                    <th className="text-left py-3 px-3 font-medium text-black">Deductions</th>
                    <th className="text-left py-3 px-3 font-medium text-black">Net Salary</th>
                    <th className="text-left py-3 px-3 font-medium text-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPayroll.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        {record.month} {record.year}
                      </td>
                      <td className="py-3 px-3">${record.baseSalary.toLocaleString()}</td>
                      <td className="py-3 px-3 text-green-600">+${record.allowances.toLocaleString()}</td>
                      <td className="py-3 px-3 text-green-600">-${record.deductions.toLocaleString()}</td>
                      <td className="py-3 px-3 font-semibold text-black">${record.netSalary.toLocaleString()}</td>
                      <td className="py-3 px-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 hover:bg-gray-100"
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
