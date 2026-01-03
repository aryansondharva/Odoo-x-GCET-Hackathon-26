"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, BarChart3, Shield, Zap } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-bold text-black">Dayflow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-black transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-gray-300 hover:bg-white bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-black hover:bg-gray-800 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 bg-green-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-green-600">Smart HR Management</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 leading-tight">HR Excellence</h1>
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-6">
                Simplified
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Centralized platform for comprehensive employee management. Streamline achievements, simplify HR
                operations, and empower your workforce with verified digital profiles.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg font-medium rounded-lg hover-lift">
                  Demo Login <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 hover:bg-white bg-transparent px-8 py-6 text-lg font-medium rounded-lg"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-black">100%</div>
                <p className="text-sm text-gray-600 mt-1">Digital Records</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-500">24/7</div>
                <p className="text-sm text-gray-600 mt-1">System Access</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">100%</div>
                <p className="text-sm text-gray-600 mt-1">Demo Accounts</p>
              </div>
            </div>

            {/* Credentials Info */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                Demo Credentials Available
              </p>
              <p className="text-sm text-gray-600">
                Try with any of the 12 demo accounts or create a new one. See README for full list.
              </p>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-green-200 rounded-3xl transform -rotate-6" />
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <h3 className="font-bold">Employee Dashboard</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">Attendance</span>
                    <span className="text-lg font-bold text-green-600">24/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-4/5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">Leave Balance</span>
                    <span className="text-lg font-bold text-blue-600">8/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-8/12" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">$5,000</p>
                    <p className="text-xs text-gray-600">Current Month</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-xs text-gray-600">Pending Tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your HR operations efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Employee Management",
                description: "Manage employee profiles, documents, and organizational structure",
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description: "Real-time dashboards and comprehensive reporting capabilities",
              },
              {
                icon: Shield,
                title: "Security",
                description: "Enterprise-grade security with OTP and role-based access control",
              },
              {
                icon: Zap,
                title: "Automation",
                description: "Streamlined workflows for approvals and notifications",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="font-bold text-blue-600 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your HR?</h2>
          <p className="text-xl text-gray-300 mb-8">Start with a free demo account - no credit card required</p>
          <Link href="/login">
            <Button className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-lg font-medium rounded-lg hover-lift">
              Try Demo Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <p className="text-sm opacity-75">2024 Dayflow HRMS. All rights reserved.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <p className="text-sm opacity-75">Modern HR Management System</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2026 Dayflow HRMS. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
