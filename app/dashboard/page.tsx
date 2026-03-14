import { KPICards } from "@/components/dashboard/kpi-cards"
import { AutomationsTable } from "@/components/dashboard/automations-table"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your automation workflows and performance.
        </p>
      </div>

      <KPICards />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AutomationsTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
