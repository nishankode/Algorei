import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ArrowRight, Workflow, Users, MessageSquareText, Check, Zap, Clock, Shield } from "lucide-react"

const services = [
  {
    id: "workflow-automation",
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive business tasks with intelligent workflows that adapt and learn. Connect your tools and let AI handle the mundane so your team can focus on high-value work.",
    benefits: [
      "Reduce manual work by up to 80%",
      "Connect 100+ apps and services",
      "Visual workflow builder - no code required",
      "Real-time monitoring and alerts",
      "Custom logic and conditional branching",
      "Scheduled and trigger-based automations",
    ],
    useCases: [
      "Data entry and synchronization",
      "Report generation and distribution",
      "Approval workflows",
      "File management and backup",
    ],
  },
  {
    id: "lead-handling",
    icon: Users,
    title: "Lead Handling",
    description:
      "Capture, qualify, and organize leads automatically. Our AI scores leads based on engagement and fit, enriches data from multiple sources, and routes prospects to the right team members instantly.",
    benefits: [
      "AI-powered lead scoring",
      "Automatic data enrichment",
      "Smart routing to sales reps",
      "CRM integration",
      "Lead nurturing sequences",
      "Conversion tracking and analytics",
    ],
    useCases: [
      "LinkedIn prospecting",
      "Website visitor capture",
      "Email campaign responses",
      "Event and webinar leads",
    ],
  },
  {
    id: "customer-support",
    icon: MessageSquareText,
    title: "Customer Support Agents",
    description:
      "Deploy AI chatbots that understand context and provide human-like support. Reduce response times, scale your support operations, and maintain quality without scaling costs.",
    benefits: [
      "Natural language understanding",
      "24/7 availability",
      "Seamless handoff to human agents",
      "Multi-channel support",
      "Custom knowledge base training",
      "Sentiment analysis and escalation",
    ],
    useCases: [
      "FAQ and documentation queries",
      "Order status and tracking",
      "Account management",
      "Technical troubleshooting",
    ],
  },
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Get started in minutes, not months. Our intuitive interface makes automation accessible to everyone.",
  },
  {
    icon: Clock,
    title: "Save Hours Every Week",
    description: "Automate repetitive tasks and free up your team to focus on strategic work that drives growth.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and GDPR-ready. Your data is always protected.",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Transform your business with AI automation
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              From workflow automation to intelligent customer support, we provide the tools you need
              to scale efficiently and deliver exceptional experiences.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Book a demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  id={service.id}
                  className={`flex flex-col gap-12 lg:flex-row lg:items-start ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-foreground text-background">
                      <service.icon className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{service.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold">Key Benefits</h3>
                      <ul className="mt-4 space-y-3">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="/signup" className="mt-8 inline-block">
                      <Button className="gap-2">
                        Get started
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex-1">
                    <div className="rounded-2xl border border-border bg-card p-8">
                      <h3 className="text-lg font-semibold">Common Use Cases</h3>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {service.useCases.map((useCase) => (
                          <div
                            key={useCase}
                            className="rounded-lg border border-border bg-background p-4"
                          >
                            <p className="text-sm font-medium">{useCase}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-secondary/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Why choose Algorei?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Built for modern businesses that need reliable, secure, and scalable automation.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-foreground text-background">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-foreground p-8 text-center text-background sm:p-12 lg:p-16">
              <h2 className="text-2xl font-bold sm:text-3xl">Ready to automate your business?</h2>
              <p className="mx-auto mt-4 max-w-xl text-background/80">
                Join hundreds of businesses already using Algorei to save time, reduce costs, and
                scale their operations.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button variant="secondary" size="lg" className="gap-2">
                    Start free trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-background/20 bg-transparent text-background hover:bg-background/10"
                  >
                    Contact sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
