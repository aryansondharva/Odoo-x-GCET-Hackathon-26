import type React from "react"
import { AuthLayout } from "@/components/auth-layout"

export default function AuthLayoutComponent({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
