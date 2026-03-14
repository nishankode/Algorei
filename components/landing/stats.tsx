const stats = [
  {
    value: "500+",
    label: "Businesses Helped",
    description: "Companies trust Algorei to power their automation",
  },
  {
    value: "10M+",
    label: "Outreach Done",
    description: "Messages sent and leads captured automatically",
  },
  {
    value: "$50M+",
    label: "Revenue Generated",
    description: "Value created for our clients through automation",
  },
]

const logos = [
  "TechCorp",
  "Innovate",
  "ScaleUp",
  "GrowthCo",
  "NextGen",
]

export function Stats() {
  return (
    <section className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative border-l-2 border-foreground pl-6"
            >
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-lg font-medium">{stat.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by forward-thinking companies
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <div
                key={logo}
                className="text-xl font-semibold tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
