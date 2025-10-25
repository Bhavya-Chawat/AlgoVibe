"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { LogOut, ClipboardCheck } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { motion } from "framer-motion"

interface EvaluatorLayoutClientProps {
  children: React.ReactNode
  user: {
    email?: string
    role: string
  } | null  // ← Allow null for login page
}

export default function EvaluatorLayoutClient({ children, user }: EvaluatorLayoutClientProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  // If login page or no user, render without header
  const isLoginPage = pathname === "/evaluator/login"
  if (isLoginPage || !user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hack-black via-hack-navy to-hack-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-hack-navy/80 border-b border-warning-orange/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-warning-orange to-orange-600 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gradient-orange">AlgoVibe Evaluator</div>
              <p className="text-xs text-gray-400">Judge Panel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-alert-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-alert-red/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </motion.button>
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-200">Evaluator</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-br from-warning-orange to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">EV</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,75,47,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,75,47,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,75,47,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </div>
  )
}
