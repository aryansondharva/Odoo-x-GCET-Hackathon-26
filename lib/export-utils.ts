// Utility functions for exporting data

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const keys = Object.keys(data[0])
  const csv = [
    keys.join(","),
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key]
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`
          }
          return value
        })
        .join(","),
    ),
  ].join("\n")

  downloadFile(csv, filename, "text/csv")
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, "application/json")
}

export function exportToPDF(content: string, filename: string) {
  // Note: For production, use a library like jsPDF or html2pdf
  const blob = new Blob([content], { type: "application/pdf" })
  downloadBlob(blob, filename)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, filename)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generatePayslipPDF(employee: any, payroll: any): string {
  const date = new Date().toLocaleDateString()
  return `
    PAYSLIP
    ==================
    Employee: ${employee.name}
    Employee ID: ${employee.employeeId}
    Date: ${date}
    
    EARNINGS
    ==================
    Basic Salary: ${payroll.basicSalary}
    HRA: ${payroll.hra}
    DA: ${payroll.da}
    Total Earnings: ${payroll.totalEarnings}
    
    DEDUCTIONS
    ==================
    Income Tax: ${payroll.incomeTax}
    Provident Fund: ${payroll.pf}
    Total Deductions: ${payroll.totalDeductions}
    
    NET SALARY: ${payroll.netSalary}
  `
}
