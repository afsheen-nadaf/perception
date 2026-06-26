import { Search, Cpu, LineChart } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search a topic",
    description: "Type any keyword, hashtag, or brand you want to track.",
  },
  {
    icon: Cpu,
    title: "AI analyzes sentiment",
    description:
      "Our models process hundreds of live posts and score the mood.",
  },
  {
    icon: LineChart,
    title: "See live results",
    description:
      "Watch sentiment, trends, and polarization update in real time.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            From question to insight in three simple steps.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {/* Connecting line */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border glass glow-blue">
                <step.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
