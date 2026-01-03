import { type NextRequest, NextResponse } from "next/server"

// In-memory OTP storage (replace with database in production)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check rate limiting
    const existing = otpStore.get(email)
    if (existing && existing.expiresAt > Date.now() && existing.attempts >= 3) {
      return NextResponse.json({ error: "Too many OTP requests. Please try again later." }, { status: 429 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + Number.parseInt(process.env.OTP_EXPIRY || "600") * 1000

    otpStore.set(email, {
      code: otp,
      expiresAt,
      attempts: (existing?.attempts || 0) + 1,
    })

    // TODO: In production, send OTP via email using SMTP
    console.log(`[OTP] Generated for ${email}: ${otp}`)

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email",
        expiresIn: Number.parseInt(process.env.OTP_EXPIRY || "600"),
        // For demo purposes only - remove in production
        demo_otp: process.env.NODE_ENV === "development" ? otp : undefined,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Generate OTP error:", error)
    return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 })
  }
}
