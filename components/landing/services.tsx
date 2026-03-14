import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Workflow, Users, MessageSquareText } from "lucide-react"

const services = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive business tasks with intelligent workflows. Connect your tools and let AI handle the mundane so your team can focus on what matters.",
    features: ["Custom workflow builder", "100+ integrations", "Real-time monitoring"],
  },
  {
    icon: Users,
    title: "Lead Handling",
    description:
      "Capture, qualify, and organize leads automatically. Our AI scores leads, enriches data, and routes prospects to the right team members instantly.",
    features: ["Lead scoring & qualification", "Auto data enrichment", "Smart routing"],
  },
  {
    icon: MessageSquareText,
    title: "Customer Support Agents",
    description:
      "Deploy AI chatbots that understand context and provide human-like support. Reduce response times and scale your support without scaling costs.",
    features: ["Natural language AI", "24/7 availability", "Seamless handoff to humans"],
  },
]

export function Services() {
  return (
    <section className="border-t border-border bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to transform your business operations with AI
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
                <service.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 flex-1 text-muted-foreground">{service.description}</p>

              <ul className="mt-6 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/services" className="mt-8">
                <Button variant="outline" className="w-full gap-2">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
