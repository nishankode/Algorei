import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-background to-background" />
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Automation Platform</span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI workflow automation for businesses
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            We replace manual processes with intelligent systems. Automate repetitive tasks, handle
            leads efficiently, and deploy AI-powered customer support agents.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">
                Explore services
              </Button>
            </Link>
          </div>

          <div className="mt-16 w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  dashboard.algorei.com
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <p className="mt-1 text-2xl font-bold">$2.4M</p>
                  <p className="mt-1 text-sm text-green-500">+12.5% this month</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Outreach Done</p>
                  <p className="mt-1 text-2xl font-bold">124,892</p>
                  <p className="mt-1 text-sm text-green-500">+8.2% this month</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Automations</p>
                  <p className="mt-1 text-2xl font-bold">847</p>
                  <p className="mt-1 text-sm text-green-500">+23 this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
