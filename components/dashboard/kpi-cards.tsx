import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Send, Workflow, TrendingUp } from "lucide-react"

const kpis = [
  {
    title: "Revenue Generated",
    value: "$124,892",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "From automated outreach",
  },
  {
    title: "Outreach Done",
    value: "45,231",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Send,
    description: "Messages sent this month",
  },
  {
    title: "Automations",
    value: "1,847",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: Workflow,
    description: "Successfully executed",
  },
  {
    title: "Conversion",
    value: "4.3%",
    change: "+0.8%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Leads to customers",
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="truncate text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-2xl font-bold">{kpi.value}</div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span
                className={
                  kpi.changeType === "positive" ? "text-green-500" : "text-red-500"
                }
              >
                {kpi.change}
              </span>
              <span className="truncate text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
