import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  console.log("=== Upload Request Started ===")
  
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const employeeId = formData.get("employeeId") as string

    console.log("FormData received:", {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      employeeId: employeeId
    })

    if (!file) {
      console.log("ERROR: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!employeeId) {
      console.log("ERROR: No employee ID provided")
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.log("ERROR: Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log("ERROR: File too large:", file.size)
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    console.log("File validation passed")

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "profile-pictures")
    console.log("Uploads directory:", uploadsDir)
    
    try {
      await mkdir(uploadsDir, { recursive: true })
      console.log("Directory created/verified")
    } catch (error) {
      console.log("Directory already exists or error:", error)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${employeeId}_${timestamp}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    console.log("Generated filename:", fileName)
    console.log("File path:", filePath)

    // Convert file to buffer and save
    console.log("Converting file to buffer...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log("Buffer created, size:", buffer.length)

    console.log("Writing file...")
    await writeFile(filePath, buffer)
    console.log("File written successfully")

    // Return the public path
    const publicPath = `/uploads/profile-pictures/${fileName}`
    console.log("Public path:", publicPath)

    const response = {
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: publicPath
    }

    console.log("=== Upload Request Completed Successfully ===")
    return NextResponse.json(response)

  } catch (error: any) {
    console.error("=== Upload Request Failed ===")
    console.error("Error:", error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    
    return NextResponse.json({ 
      error: "Failed to upload file: " + error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
