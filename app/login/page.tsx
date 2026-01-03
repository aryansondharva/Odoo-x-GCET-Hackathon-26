"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function SignIn() {
  const router = useRouter()
  const { login, isLoading, generateOTP } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setOtpLoading(true)

    try {
      await generateOTP(email)
      setOtpSent(true)
    } catch (err) {
      setError("Failed to send OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password, otpSent ? otp : undefined)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HR</span>
            </div>
            <span className="text-2xl font-bold text-black">Talentsphere</span>
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your HR account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={otpSent ? handleSubmit : handleSendOTP} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                Email or Employee ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hr1@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || otpLoading || otpSent}
                required
                className="bg-white border-gray-200 text-black placeholder:text-gray-500 focus:border-black focus:ring-black h-12 rounded-lg"
              />
            </div>

            {!otpSent && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || otpLoading}
                    required
                    className="bg-white border-gray-200 text-black placeholder:text-gray-500 focus:border-black focus:ring-black pr-10 h-12 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading || otpLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-slate-900">
                  Enter OTP (Demo: Check Console)
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  disabled={isLoading}
                  required
                  maxLength={6}
                  className="bg-white border-gray-200 text-black placeholder:text-gray-500 focus:border-black focus:ring-black text-center tracking-widest h-12 text-lg font-bold rounded-lg"
                />
                <p className="text-xs text-gray-500">OTP valid for 10 minutes</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-black text-white font-medium py-3 h-12 text-base rounded-lg hover:bg-gray-800 transition-all duration-200"
              disabled={isLoading || otpLoading}
            >
              {isLoading || otpLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {otpSent ? "Verifying..." : "Sending OTP..."}
                </>
              ) : otpSent ? (
                <>
                  Verify & Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            {otpSent && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 h-12 bg-transparent rounded-lg"
                onClick={() => {
                  setOtpSent(false)
                  setOtp("")
                }}
              >
                Back
              </Button>
            )}
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">HR:</span> hr1@example.com / HR@12345
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Employee:</span> emp1@example.com / Emp@12345
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-black hover:text-gray-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-black text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
