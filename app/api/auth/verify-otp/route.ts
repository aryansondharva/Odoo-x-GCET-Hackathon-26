import { type NextRequest, NextResponse } from "next/server"

// In-memory OTP storage
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const stored = otpStore.get(email)

    if (!stored) {
      return NextResponse.json({ error: "No OTP found for this email. Request a new one." }, { status: 400 })
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP has expired. Request a new one." }, { status: 400 })
    }

    if (stored.code !== otp) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 })
    }

    // OTP verified successfully
    otpStore.delete(email)

    // TODO: Generate JWT token in production
    const token = `jwt_${Date.now()}_${email}`

    return NextResponse.json(
      {
        success: true,
        verified: true,
        message: "OTP verified successfully",
        token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
