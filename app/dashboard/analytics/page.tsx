"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Download, Calendar } from "lucide-react"

const automationsData = [
  { month: "Jan", completed: 234, failed: 12 },
  { month: "Feb", completed: 287, failed: 8 },
  { month: "Mar", completed: 356, failed: 15 },
  { month: "Apr", completed: 412, failed: 9 },
  { month: "May", completed: 489, failed: 11 },
  { month: "Jun", completed: 534, failed: 7 },
]

const revenueData = [
  { month: "Jan", revenue: 45000, target: 40000 },
  { month: "Feb", revenue: 52000, target: 45000 },
  { month: "Mar", revenue: 61000, target: 50000 },
  { month: "Apr", revenue: 78000, target: 60000 },
  { month: "May", revenue: 92000, target: 75000 },
  { month: "Jun", revenue: 124892, target: 90000 },
]

const outreachData = [
  { week: "W1", sent: 2340, opened: 1872, replied: 234 },
  { week: "W2", sent: 2567, opened: 2054, replied: 287 },
  { week: "W3", sent: 2891, opened: 2313, replied: 312 },
  { week: "W4", sent: 3124, opened: 2499, replied: 356 },
]

const packageDistribution = [
  { name: "Starter", clients: 145 },
  { name: "Pro", clients: 234 },
  { name: "Business", clients: 89 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="truncate text-muted-foreground">
            Track your automation performance and business metrics.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Last 6 months</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="truncate">Total Revenue</CardDescription>
            <CardTitle className="truncate text-2xl sm:text-3xl">$452,892</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-sm text-green-500">+23.5% from last period</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="truncate">Automations Run</CardDescription>
            <CardTitle className="truncate text-2xl sm:text-3xl">2,312</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-sm text-green-500">+18.2% from last period</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="truncate">Success Rate</CardDescription>
            <CardTitle className="truncate text-2xl sm:text-3xl">97.3%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-sm text-green-500">+2.1% from last period</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="truncate">Active Clients</CardDescription>
            <CardTitle className="truncate text-2xl sm:text-3xl">468</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-sm text-green-500">+45 new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">Revenue vs Target</CardTitle>
            <CardDescription className="truncate">Monthly revenue compared to targets</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(142, 76%, 36%)",
                },
                target: {
                  label: "Target",
                  color: "hsl(220, 14%, 50%)",
                },
              }}
              className="h-[250px] w-full sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fontSize: 11 }}
                    width={50}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stackId="1"
                    stroke="var(--color-target)"
                    fill="var(--color-target)"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="2"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">Automations Completed</CardTitle>
            <CardDescription className="truncate">Monthly automation execution stats</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: "hsl(142, 76%, 36%)",
                },
                failed: {
                  label: "Failed",
                  color: "hsl(0, 84%, 60%)",
                },
              }}
              className="h-[250px] w-full sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={automationsData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="var(--color-failed)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">Outreach Performance</CardTitle>
            <CardDescription className="truncate">Weekly email outreach metrics</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                sent: {
                  label: "Sent",
                  color: "hsl(220, 14%, 50%)",
                },
                opened: {
                  label: "Opened",
                  color: "hsl(199, 89%, 48%)",
                },
                replied: {
                  label: "Replied",
                  color: "hsl(142, 76%, 36%)",
                },
              }}
              className="h-[250px] w-full sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outreachData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="var(--color-sent)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="var(--color-opened)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="replied"
                    stroke="var(--color-replied)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">Package Distribution</CardTitle>
            <CardDescription className="truncate">Clients by subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                clients: {
                  label: "Clients",
                  color: "hsl(220, 14%, 96%)",
                },
              }}
              className="h-[250px] w-full sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={packageDistribution} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" className="text-xs" width={60} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="clients" 
                    fill="hsl(var(--foreground))" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
