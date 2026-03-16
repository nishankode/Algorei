"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Workflow,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Users,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  Users2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { createClient } from "@/lib/supabase/client"
import { type User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Automations", href: "/dashboard/automations", icon: Workflow },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const managementNavigation = [
  { name: "Overview", href: "/dashboard/management", icon: ShieldCheck },
  { name: "Clients", href: "/dashboard/management/clients", icon: Building2 },
  { name: "User Directory", href: "/dashboard/management/users", icon: Users2 },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const pathname = usePathname()
  const supabase = createClient()

  const [invitationsCount, setInvitationsCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains("dark"))

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        // Fetch global role from public.users
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()
        
        if (profile) {
          setUserRole(profile.role)
        }

        // Fetch pending invitations count
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", user.id)
          .eq("status", "invited")
        
        setInvitationsCount(count || 0)
      }
    }
    getUser()
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle("dark", newDark)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  const userDisplayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "User"
  
  const initials = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name?.[0] || ""}`.toUpperCase()
    : user?.email?.[0].toUpperCase() || "U"

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src={isDark ? "/images/logo-dark.png" : "/images/logo-light.png"}
              alt="Algorei Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
              Algorei
            </span>
          </Link>
          <button
            className="text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {userRole === 'admin' && (
            <div className="mt-8">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                Management
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {managementNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User menu */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
                  <span className="text-xs font-semibold">{initials}</span>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">{userDisplayName}</p>
                  <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Account settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8">
          <button
            className="text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {invitationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {invitationsCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium">Notifications</p>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {invitationsCount > 0 && (
                    <DropdownMenuItem asChild className="p-4 cursor-pointer hover:bg-amber-500/10 border-l-2 border-amber-500">
                      <Link href="/dashboard/invitations" className="flex flex-col items-start gap-1 w-full">
                        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team Invitation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You have {invitationsCount} pending team invitation{invitationsCount > 1 ? 's' : ''}.
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Click to view</p>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <p className="text-sm font-medium">Automation completed</p>
                    <p className="text-xs text-muted-foreground">
                      Lead capture workflow finished processing 124 leads
                    </p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <p className="text-sm font-medium">New team member</p>
                    <p className="text-xs text-muted-foreground">
                      Sarah joined your workspace
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <p className="text-sm font-medium">Weekly report ready</p>
                    <p className="text-xs text-muted-foreground">
                      Your automation analytics report is available
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
