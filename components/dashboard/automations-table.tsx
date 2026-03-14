"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Eye, Pencil, Trash2, Plus } from "lucide-react"

const automations = [
  {
    id: "1",
    name: "Lead Capture - LinkedIn",
    status: "active",
    startDate: "2024-01-15",
    endDate: null,
    assignedTo: "John Doe",
    tasksCompleted: 1234,
  },
  {
    id: "2",
    name: "Email Follow-up Sequence",
    status: "active",
    startDate: "2024-01-20",
    endDate: null,
    assignedTo: "Sarah Chen",
    tasksCompleted: 892,
  },
  {
    id: "3",
    name: "Customer Onboarding",
    status: "paused",
    startDate: "2024-02-01",
    endDate: null,
    assignedTo: "Mike Johnson",
    tasksCompleted: 456,
  },
  {
    id: "4",
    name: "Support Ticket Routing",
    status: "active",
    startDate: "2024-02-10",
    endDate: null,
    assignedTo: "Emily Davis",
    tasksCompleted: 2341,
  },
  {
    id: "5",
    name: "Invoice Generation",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-02-28",
    assignedTo: "John Doe",
    tasksCompleted: 156,
  },
]

const statusStyles = {
  active: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  completed: "bg-muted text-muted-foreground hover:bg-muted",
}

export function AutomationsTable() {
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "completed">("all")

  const filteredAutomations =
    filter === "all"
      ? automations
      : automations.filter((a) => a.status === filter)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="shrink-0">Automations</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-x-auto rounded-lg border border-border p-1">
            {(["all", "active", "paused", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === status
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <Button size="sm" className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Name</TableHead>
              <TableHead className="min-w-[80px]">Status</TableHead>
              <TableHead className="hidden min-w-[100px] md:table-cell">Start Date</TableHead>
              <TableHead className="hidden min-w-[120px] lg:table-cell">Assigned To</TableHead>
              <TableHead className="min-w-[80px] text-right">Tasks</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAutomations.map((automation) => (
              <TableRow key={automation.id}>
                <TableCell className="font-medium">
                  <span className="line-clamp-1">{automation.name}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusStyles[automation.status as keyof typeof statusStyles]}
                  >
                    {automation.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <time dateTime={automation.startDate}>
                    {automation.startDate}
                  </time>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="line-clamp-1">{automation.assignedTo}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {automation.tasksCompleted.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
