"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, X, Users, Loader2 } from "lucide-react"

interface Invitation {
  id: string
  client_id: string
  role: string
  company_name: string
  invited_at: string
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const supabase = createClient()

  const fetchInvitations = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          client_id,
          role,
          created_at,
          clients:client_id (
            company_name
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "invited")

      if (error) throw error

      const formatted = (data || []).map((inv: any) => ({
        id: inv.id,
        client_id: inv.client_id,
        role: inv.role,
        company_name: inv.clients?.company_name || "Unknown Company",
        invited_at: new Date(inv.created_at).toLocaleDateString()
      }))

      setInvitations(formatted)
    } catch (error: any) {
      console.error("Error fetching invitations:", error)
      toast.error("Failed to load invitations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    setProcessing(id)
    try {
      if (action === 'accept') {
        const { error } = await supabase
          .from("team_members")
          .update({ status: 'active' })
          .eq("id", id)
        
        if (error) throw error
        toast.success("Invitation accepted!")
      } else {
        const { error } = await supabase
          .from("team_members")
          .delete()
          .eq("id", id)
        
        if (error) throw error
        toast.success("Invitation declined")
      }
      fetchInvitations()
    } catch (error: any) {
      console.error(`Error ${action}ing invitation:`, error)
      toast.error(`Failed to ${action} invitation`)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground">
          Manage pending team invitations.
        </p>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-secondary p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No pending invitations</p>
            <p className="text-sm text-muted-foreground">
              You'll see invitations here when someone adds you to their team.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv) => (
            <Card key={inv.id} className="relative overflow-hidden group">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="capitalize">
                  {inv.role}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{inv.company_name}</CardTitle>
                <CardDescription>Invited on {inv.invited_at}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have been invited to join <strong>{inv.company_name}</strong> as a <strong>{inv.role}</strong>.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => handleAction(inv.id, 'accept')}
                  disabled={!!processing}
                >
                  {processing === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Accept
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(inv.id, 'decline')}
                  disabled={!!processing}
                >
                  {processing === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Decline
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
