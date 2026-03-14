import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started with automation",
    price: "$49",
    period: "/month",
    features: [
      "5 automated workflows",
      "1,000 tasks/month",
      "Email support",
      "Basic analytics",
      "API access",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing businesses that need more power",
    price: "$199",
    period: "/month",
    features: [
      "Unlimited workflows",
      "25,000 tasks/month",
      "Priority support",
      "Advanced analytics",
      "Lead handling module",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    description: "Enterprise-grade automation for large organizations",
    price: "$499",
    period: "/month",
    features: [
      "Everything in Pro",
      "Unlimited tasks",
      "Dedicated support",
      "AI customer support agents",
      "Custom AI training",
      "SLA guarantee",
      "On-premise option",
      "Security audit",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="border-t border-border bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your business. Scale up as you grow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
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

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
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
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === "Business" ? "/contact" : "/signup"} className="mt-8">
                <Button
                  variant={plan.highlighted ? "secondary" : "default"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
