"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

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
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-slate-800 rounded-lg mx-auto flex items-center justify-center border border-slate-700">
          <span className="text-sm font-bold text-slate-400">App/Web</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-4">Sign in Page</h1>
      </div>

      <form onSubmit={otpSent ? handleSubmit : handleSendOTP} className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
            Login ID/Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your login ID or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || otpLoading || otpSent}
            required
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {!otpSent && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
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
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                disabled={isLoading || otpLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {otpSent && (
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-slate-300 text-sm font-medium">
              Enter OTP (check console for demo OTP)
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
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 text-center tracking-widest"
            />
            <p className="text-xs text-slate-400">OTP valid for 10 minutes</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2"
          disabled={isLoading || otpLoading}
        >
          {isLoading || otpLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {otpSent ? "Verifying..." : "Sending OTP..."}
            </>
          ) : otpSent ? (
            "VERIFY & SIGN IN"
          ) : (
            "SIGN IN"
          )}
        </Button>

        {otpSent && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            onClick={() => {
              setOtpSent(false)
              setOtp("")
            }}
          >
            Back
          </Button>
        )}
      </form>

      <div className="border-t border-slate-800 pt-4 text-center text-sm">
        <p className="text-slate-400">
          Don't have an Account?{" "}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
