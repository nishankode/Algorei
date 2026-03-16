"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users as UsersIcon, Activity, TrendingUp, AlertCircle, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function ManagementOverview() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalUsers: 0,
    activeAutomations: 0,
    growthRate: "+12%"
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const { count: clientCount } = await supabase
          .from("clients")
          .select("*", { count: 'exact', head: true })
        
        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: 'exact', head: true })

        const { count: automationCount } = await supabase
          .from("automations")
          .select("*", { count: 'exact', head: true })
          .eq("status", "active")

        setStats({
          totalClients: clientCount || 0,
          totalUsers: userCount || 0,
          activeAutomations: automationCount || 0,
          growthRate: "+8.4%" // Simplified mock for now
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      icon: Building2,
      description: "Managing organizations",
      color: "text-blue-500"
    },
    {
      title: "Registered Users",
      value: stats.totalUsers.toString(),
      icon: UsersIcon,
      description: "Across all companies",
      color: "text-purple-500"
    },
    {
      title: "Active Automations",
      value: stats.activeAutomations.toString(),
      icon: Activity,
      description: "Running workflows",
      color: "text-emerald-500"
    },
    {
      title: "System Status",
      value: "Healthy",
      icon: ShieldCheck,
      description: "All services operational",
      color: "text-amber-500"
    }
  ]

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Management Overview</h2>
        <p className="text-muted-foreground">Internal platform oversight and performance metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-sidebar-border bg-sidebar/50">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground italic">
              Chart visualization coming soon...
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-sidebar-border bg-sidebar/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New client registered</p>
                  <p className="text-xs text-muted-foreground">Starlight Systems joined the platform</p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Automation scaled</p>
                  <p className="text-xs text-muted-foreground">Workflow capacity increased for Apex Corp</p>
                </div>
                <div className="text-xs text-muted-foreground">5h ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">New user invited</p>
                  <p className="text-xs text-muted-foreground">Admin invited to Pixel Perfect team</p>
                </div>
                <div className="text-xs text-muted-foreground">1d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
