import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started with automation",
    price: "$49",
    period: "/month",
    features: {
      workflows: "5 workflows",
      tasks: "1,000 tasks/month",
      integrations: "10 integrations",
      support: "Email support",
      analytics: "Basic analytics",
      api: "API access",
      teamMembers: "2 team members",
      customIntegrations: false,
      aiSupport: false,
      sla: false,
      onPremise: false,
    },
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing businesses that need more power",
    price: "$199",
    period: "/month",
    features: {
      workflows: "Unlimited workflows",
      tasks: "25,000 tasks/month",
      integrations: "50+ integrations",
      support: "Priority support",
      analytics: "Advanced analytics",
      api: "API access",
      teamMembers: "10 team members",
      customIntegrations: true,
      aiSupport: false,
      sla: false,
      onPremise: false,
    },
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    description: "Enterprise-grade automation for large organizations",
    price: "$499",
    period: "/month",
    features: {
      workflows: "Unlimited workflows",
      tasks: "Unlimited tasks",
      integrations: "100+ integrations",
      support: "Dedicated support",
      analytics: "Custom analytics",
      api: "API access",
      teamMembers: "Unlimited",
      customIntegrations: true,
      aiSupport: true,
      sla: true,
      onPremise: true,
    },
    cta: "Contact sales",
    highlighted: false,
  },
]

const featureList = [
  { key: "workflows", label: "Workflows" },
  { key: "tasks", label: "Monthly Tasks" },
  { key: "integrations", label: "Integrations" },
  { key: "teamMembers", label: "Team Members" },
  { key: "support", label: "Support" },
  { key: "analytics", label: "Analytics" },
  { key: "api", label: "API Access" },
  { key: "customIntegrations", label: "Custom Integrations" },
  { key: "aiSupport", label: "AI Support Agents" },
  { key: "sla", label: "SLA Guarantee" },
  { key: "onPremise", label: "On-premise Option" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your business. Start with a 14-day free trial, no credit
              card required. Scale up as you grow.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-8",
                    plan.highlighted
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-background px-4 py-1 text-sm font-medium text-foreground">
                      Most Popular
                    </div>
                  )}

                  <h3
                    className={cn(
                      "text-xl font-semibold",
                      plan.highlighted ? "text-background" : "text-foreground"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      plan.highlighted ? "text-background/70" : "text-muted-foreground"
                    )}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className={cn(
                        "text-4xl font-bold tracking-tight",
                        plan.highlighted ? "text-background" : "text-foreground"
                      )}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        plan.highlighted ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <Link href={plan.name === "Business" ? "/contact" : "/signup"} className="mt-8">
                    <Button
                      variant={plan.highlighted ? "secondary" : "default"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <ul className="mt-8 flex-1 space-y-3">
                    {Object.entries(plan.features).map(([key, value]) => {
                      if (typeof value === "boolean") return null
                      return (
                        <li key={key} className="flex items-start gap-3">
                          <Check
                            className={cn(
                              "mt-0.5 h-5 w-5 shrink-0",
                              plan.highlighted ? "text-background" : "text-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              plan.highlighted ? "text-background/90" : "text-foreground"
                            )}
                          >
                            {value}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="border-t border-border bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Compare plans</h2>
              <p className="mt-4 text-muted-foreground">
                See which plan is right for your business.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-border p-4 text-left font-medium">Feature</th>
                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        className="border-b border-border p-4 text-center font-medium"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureList.map((feature) => (
                    <tr key={feature.key}>
                      <td className="border-b border-border p-4 text-sm">{feature.label}</td>
                      {plans.map((plan) => {
                        const value = plan.features[feature.key as keyof typeof plan.features]
                        return (
                          <td
                            key={plan.name}
                            className="border-b border-border p-4 text-center text-sm"
                          >
                            {typeof value === "boolean" ? (
                              value ? (
                                <Check className="mx-auto h-5 w-5 text-green-500" />
                              ) : (
                                <Minus className="mx-auto h-5 w-5 text-muted-foreground" />
                              )
                            ) : (
                              value
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Questions?</h2>
              <p className="mt-4 text-muted-foreground">
                Our team is here to help. Contact us for any questions about our plans.
              </p>
              <Link href="/contact">
                <Button className="mt-6" variant="outline">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
