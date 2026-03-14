import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Workflow, Users, Mail, CheckCircle2 } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "automation",
    title: "Lead Capture completed",
    description: "Processed 124 new leads from LinkedIn",
    time: "2 minutes ago",
    icon: Workflow,
  },
  {
    id: "2",
    type: "team",
    title: "New team member",
    description: "Sarah Chen joined the workspace",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: "3",
    type: "email",
    title: "Email sequence sent",
    description: "Follow-up sequence sent to 89 contacts",
    time: "3 hours ago",
    icon: Mail,
  },
  {
    id: "4",
    type: "success",
    title: "Goal achieved",
    description: "Monthly outreach target exceeded by 15%",
    time: "Yesterday",
    icon: CheckCircle2,
  },
  {
    id: "5",
    type: "automation",
    title: "Automation updated",
    description: "Customer Onboarding workflow modified",
    time: "2 days ago",
    icon: Workflow,
  },
]

export function RecentActivity() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <activity.icon className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium leading-none">{activity.title}</p>
                <p className="truncate text-xs text-muted-foreground">{activity.description}</p>
                <p className="truncate text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
