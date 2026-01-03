import { NextResponse } from "next/server"
import { healthCheck } from "@/lib/db"

export async function GET() {
  try {
    const result = await healthCheck()
    
    if (result.status === 'healthy') {
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        timestamp: result.timestamp,
        details: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Database connection failed",
        error: result.error,
        details: result
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database health check failed",
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
