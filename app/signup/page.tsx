"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react"

export default function SignUp() {
  const router = useRouter()
  const { signup, isLoading, generateOTP } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee" as UserRole,
    department: "",
    position: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setOtpLoading(true)
    try {
      await generateOTP(formData.email)
      setStep(2)
    } catch (err) {
      setError("Failed to send OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signup(
        {
          companyName: formData.companyName,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department,
          position: formData.position,
          phone: formData.phone,
        },
        otp,
      )
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HR</span>
            </div>
            <span className="text-2xl font-bold text-black">Dayflow</span>
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join our HRMS platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-1 rounded-full transition-all ${step === 1 ? "bg-purple-600" : "bg-gray-300"}`} />
          <div className={`flex-1 h-1 rounded-full transition-all ${step === 2 ? "bg-purple-600" : "bg-gray-300"}`} />
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-semibold text-black">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={isLoading || otpLoading}
                  required
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-black">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading || otpLoading}
                  required
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading || otpLoading}
                  required
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-black">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isLoading || otpLoading}
                  required
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-black">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading || otpLoading}
                    required
                    className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10 h-11"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-black">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading || otpLoading}
                    required
                    className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading || otpLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 h-12 text-base transition-all duration-200 mt-6"
                disabled={isLoading || otpLoading}
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">OTP sent to {formData.email}</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-semibold text-black">
                  Enter OTP Code
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
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 text-center tracking-widest text-2xl font-bold h-12"
                />
                <p className="text-xs text-gray-500">Check browser console for demo OTP</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 h-12 text-base transition-all duration-200"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-50 py-3 h-12 bg-transparent"
                onClick={() => {
                  setStep(1)
                  setOtp("")
                }}
              >
                Back
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link href="/home" className="text-gray-600 hover:text-black text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
