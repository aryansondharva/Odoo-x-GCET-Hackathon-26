import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    // Test if we can write to the uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads", "profile-pictures")
    
    // Ensure directory exists
    await mkdir(uploadsDir, { recursive: true })
    
    // Test write a simple file
    const testFilePath = join(uploadsDir, "test.txt")
    await writeFile(testFilePath, "test", "utf8")
    
    return NextResponse.json({ 
      success: true, 
      message: "File system test passed",
      uploadsDir,
      testFile: testFilePath
    })
  } catch (error: any) {
    console.error("File system test error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
