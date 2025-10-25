"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  FileText, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  Shield
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { logout } from "@/app/actions/auth"

interface AdminLayoutClientProps {
  children: React.ReactNode
  user: {
    email?: string
    role: string
  }
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Teams", href: "/admin/teams", icon: Users },
    { name: "Contest Controls", href: "/admin/contest", icon: Trophy },
    { name: "Problem Editor", href: "/admin/problem", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hack-black via-hack-navy to-hack-black">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-screen w-72 glass-panel-strong border-r border-alert-red/20 z-50 flex flex-col"
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-alert-red/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-alert-red to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gradient-red">AlgoVibe</h2>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${active 
                          ? "bg-gradient-to-r from-alert-red/20 to-red-600/20 border border-alert-red/40 text-alert-red" 
                          : "glass-panel hover:border-alert-red/30 text-gray-300 hover:text-alert-red"
                        }
                      `}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-8 bg-gradient-to-b from-alert-red to-red-600 rounded-r-full"
                        />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold">{item.name}</span>
                    </motion.div>
                  </button>
                )
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-alert-red/20 space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-alert-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">Admin</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 glass-panel hover:border-alert-red/30 text-gray-300 hover:text-alert-red rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-hack-navy/80 border-b border-alert-red/20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 glass-panel hover:border-alert-red/40 rounded-lg transition-all duration-300"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-alert-red" />
              ) : (
                <Menu className="w-6 h-6 text-alert-red" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-200">Admin User</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-alert-red to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,21,47,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(192,21,47,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(192,21,47,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </div>
  )
}
