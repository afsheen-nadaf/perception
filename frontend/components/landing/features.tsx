import { Radio, Scale, PieChart } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Radio,
    title: "Real-time Bluesky Analysis",
    description:
      "Stream and analyze live posts from Bluesky the moment conversations happen.",
  },
  {
    icon: Scale,
    title: "Polarization Detection",
    description:
      "Measure how divided opinion is on any topic with a precise polarization score.",
  },
  {
    icon: PieChart,
    title: "Sentiment Breakdown",
    description:
      "Instantly see the split of positive, neutral, and negative reactions.",
  },
]

export function Features() {
  return (
    <section className="px-5 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group border-border glass p-6 transition-all hover:border-primary/30 hover:glow-blue"
          >
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
              <feature.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
