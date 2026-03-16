"use client"

import { useState, useEffect } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, Mail, Shield, Trash2, UserCog, Loader2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface TeamMember {
  id: string
  user_id?: string
  name: string
  email: string
  role: string
  status: 'invited' | 'active'
  avatar: string
  joined_at: string
}

const roleStyles: Record<string, string> = {
  admin: "bg-foreground text-background",
  member: "bg-secondary text-secondary-foreground",
  viewer: "bg-muted text-muted-foreground",
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUserId(user.id)

      // 1. Prioritize active team membership (for invited members) over ownership
      const { data: membership } = await supabase
        .from("team_members")
        .select("client_id, role, clients(id, company_name, owner_id)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle()

      let client = null
      if (membership?.clients) {
        client = membership.clients as any
        setCurrentUserRole((membership as any).role || 'member')
      } else {
        // If no active membership, check if they own a company
        const { data: ownedClient } = await supabase
          .from("clients")
          .select("id, company_name, owner_id")
          .eq("owner_id", user.id)
          .maybeSingle()
        
        if (ownedClient) {
          client = ownedClient
          setCurrentUserRole('admin') // Owner is admin
        }
      }

      // AUTO-REPAIR: If no company but user metadata has one (and user is owner)
      if (!client && user.user_metadata?.company) {
        const { data: newClient, error: createErr } = await supabase
          .from("clients")
          .insert({
            company_name: user.user_metadata.company,
            owner_id: user.id
          })
          .select()
          .single()
        
        if (!createErr) client = newClient
      }

      if (!client) {
        setMembers([])
        setLoading(false)
        return
      }

      setClientId(client.id)
      const activeClientId = client.id

      // 2. Fetch Owner's details
      const { data: ownerUser } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", client.owner_id)
        .single()

      let ownerInfo: TeamMember | null = null

      if (ownerUser) {
        ownerInfo = {
          id: `owner-${client.owner_id}`,
          user_id: client.owner_id,
          name: `${ownerUser.first_name || ""} ${ownerUser.last_name || ""}`.trim() || ownerUser.email.split("@")[0] || "Owner",
          email: ownerUser.email,
          role: "admin",
          status: "active" as const,
          avatar: (ownerUser.first_name?.[0] || ownerUser.email[0]).toUpperCase(),
          joined_at: "Owner"
        }
      }

      // 3. Fetch all team members for this company
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          role,
          status,
          created_at,
          user_id,
          users:user_id (
            email,
            first_name,
            last_name
          )
        `)
        .eq("client_id", activeClientId)

      if (error || !data) throw error || new Error("Failed to fetch team members")

      const formattedMembers: TeamMember[] = data.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        name: `${m.users.first_name || ""} ${m.users.last_name || ""}`.trim() || m.users.email.split("@")[0],
        email: m.users.email,
        role: m.role,
        status: m.status || 'active',
        avatar: (m.users.first_name?.[0] || m.users.email[0]).toUpperCase(),
        joined_at: m.status === 'invited' ? 'Pending' : new Date(m.created_at).toLocaleDateString()
      }))

      // Combine owner and members
      const allMembers = ownerInfo 
        ? [ownerInfo, ...formattedMembers.filter(m => m.user_id !== client!.owner_id)]
        : formattedMembers

      setMembers(allMembers)
    } catch (error: any) {
      console.error("Error fetching team:", error)
      toast.error("Failed to load team members.")
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) return
    if (!clientId) {
      toast.error("No active company found to invite users to.")
      return
    }

    setInviting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (inviteEmail.toLowerCase() === user.email?.toLowerCase()) {
        toast.error("You cannot invite yourself.")
        setInviting(false)
        return
      }

      // 1. Check if the user exists by email
      const { data: userToInvite, error: userErr } = await supabase
        .from("users")
        .select("id")
        .eq("email", inviteEmail)
        .single()

      if (userErr || !userToInvite) {
        toast.error("User not found. They must be registered in the app first.")
        return
      }

      // 2. Insert into team_members
      const { error: inviteErr } = await supabase
        .from("team_members")
        .insert([{
          client_id: clientId,
          user_id: userToInvite.id,
          role: inviteRole,
          status: 'invited'
        }])

      if (inviteErr) {
        if (inviteErr.code === "23505") { // Unique constraint violation
          toast.error("User is already a member of this team.")
        } else {
          throw inviteErr
        }
        return
      }

      toast.success(`Invitation sent to ${inviteEmail}!`)
      setIsDialogOpen(false)
      setInviteEmail("")
      fetchTeam()
    } catch (error: any) {
      toast.error(error.message || "Failed to invite user.")
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = (member: TeamMember) => {
    setMemberToRemove(member)
    setIsRemoveDialogOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!clientId || !memberToRemove) return
    
    setRemoving(memberToRemove.id)
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberToRemove.id)
      
      if (error) throw error
      
      toast.success("Team member removed successfully.")
      setIsRemoveDialogOpen(false)
      fetchTeam()
    } catch (error: any) {
      console.error("Error removing member:", error)
      toast.error(error.message || "Failed to remove team member.")
    } finally {
      setRemoving(null)
      setMemberToRemove(null)
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateCompany = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const companyName = user.user_metadata?.company || "My Company"
      
      const { data, error } = await supabase
        .from("clients")
        .insert({
          company_name: companyName,
          owner_id: user.id
        })
        .select()
        .single()

      if (error || !data) throw error || new Error("Failed to fetch team members")
      
      toast.success(`Company "${companyName}" created successfully!`)
      fetchTeam()
    } catch (error: any) {
      console.error("Error creating company:", error)
      toast.error(error.message || "Failed to create company.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage team members and their permissions.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!clientId || (currentUserRole !== 'admin')}>
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Invite a registered user to join your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="colleague@company.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div className="flex gap-2">
                  {["admin", "member", "viewer"].map((role) => (
                    <Button 
                      key={role} 
                      variant={inviteRole === role ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setInviteRole(role)}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {inviteRole === 'admin' ? "Admins can manage all settings." : 
                   inviteRole === 'member' ? "Members can create automations." : 
                   "Viewers can only view."}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleInvite} disabled={inviting}>
                {inviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Joined Recently
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : members.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : "Active"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Team Members</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !clientId ? (
            <div className="flex h-48 flex-col items-center justify-center text-center space-y-4">
              <div className="bg-secondary p-4 rounded-full">
                <UserCog className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">Setup Your Team</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Click below to initialize your company profile and start managing your team.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCompany} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Initialize Company
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard/settings">Settings</a>
                </Button>
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No team members found.</p>
              <p className="text-sm text-muted-foreground">Invite someone above to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined At</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                          <span className="text-sm font-medium">{member.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className={roleStyles[member.role] || ""}
                        >
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        {member.status === 'invited' && (
                          <Badge variant="outline" className="text-[10px] uppercase font-bold text-amber-500 border-amber-500 bg-amber-500/10">
                            Invited
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {member.joined_at}
                    </TableCell>
                    <TableCell>
                      {currentUserRole === 'admin' && 
                       member.user_id !== currentUserId && 
                       !member.id.startsWith('owner-') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>

      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2 mx-auto sm:mx-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl">Remove team member?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from the team? 
              They will lose all access to <strong>{clientId ? members.find(m => m.id.startsWith('owner-'))?.name?.split("'")[0] || "the company" : "the company"}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={!!removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleConfirmRemove()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!removing}
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : "Delete Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
