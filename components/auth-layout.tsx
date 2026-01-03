"use client"

import type React from "react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-8">{children}</div>
      </div>
    </div>
  )
}
