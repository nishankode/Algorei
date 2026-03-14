"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Pencil,
  Trash2,
  Download,
  Workflow,
} from "lucide-react"

const automations = [
  {
    id: "1",
    name: "Lead Capture - LinkedIn",
    description: "Automatically capture and qualify leads from LinkedIn outreach",
    status: "active",
    type: "Lead Handling",
    tasksCompleted: 1234,
    tasksToday: 45,
    lastRun: "2 minutes ago",
  },
  {
    id: "2",
    name: "Email Follow-up Sequence",
    description: "Send personalized follow-up emails based on engagement",
    status: "active",
    type: "Workflow",
    tasksCompleted: 892,
    tasksToday: 23,
    lastRun: "15 minutes ago",
  },
  {
    id: "3",
    name: "Customer Onboarding",
    description: "Guide new customers through the onboarding process",
    status: "paused",
    type: "Workflow",
    tasksCompleted: 456,
    tasksToday: 0,
    lastRun: "2 days ago",
  },
  {
    id: "4",
    name: "Support Ticket Routing",
    description: "Automatically route support tickets to the right team",
    status: "active",
    type: "Support",
    tasksCompleted: 2341,
    tasksToday: 89,
    lastRun: "1 minute ago",
  },
  {
    id: "5",
    name: "Invoice Generation",
    description: "Generate and send invoices based on completed projects",
    status: "completed",
    type: "Workflow",
    tasksCompleted: 156,
    tasksToday: 0,
    lastRun: "30 days ago",
  },
  {
    id: "6",
    name: "Meeting Scheduler",
    description: "Automate meeting scheduling based on calendar availability",
    status: "active",
    type: "Workflow",
    tasksCompleted: 567,
    tasksToday: 12,
    lastRun: "30 minutes ago",
  },
]

const statusStyles = {
  active: "bg-green-500/10 text-green-500",
  paused: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-muted text-muted-foreground",
}

export default function AutomationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "completed">("all")

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch = automation.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || automation.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">Automations</h1>
          <p className="truncate text-muted-foreground">
            Manage and monitor your automated workflows.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              <span>New Automation</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
              <DialogDescription>
                Set up a new automated workflow for your business.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter automation name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Describe what this automation does" />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Workflow", "Lead Handling", "Support"].map((type) => (
                    <Button key={type} variant="outline" size="sm">
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Automation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex shrink-0 overflow-x-auto rounded-lg border border-border p-1">
          {(["all", "active", "paused", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredAutomations.map((automation) => (
          <Card key={automation.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Workflow className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base">{automation.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={`mt-1 ${statusStyles[automation.status as keyof typeof statusStyles]}`}
                    >
                      {automation.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {automation.status === "active" ? (
                      <DropdownMenuItem>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{automation.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-muted-foreground">Total Tasks</p>
                  <p className="truncate font-semibold tabular-nums">{automation.tasksCompleted.toLocaleString()}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-muted-foreground">Today</p>
                  <p className="truncate font-semibold tabular-nums">{automation.tasksToday}</p>
                </div>
              </div>
              <p className="mt-4 truncate text-xs text-muted-foreground">
                Last run: {automation.lastRun}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
