import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="px-5 py-20 md:py-28">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border glass px-6 py-16 text-center glow-purple md:px-12">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-glow-blue/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-glow-purple/25 blur-[90px]" />

        <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          Ready to read the room?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-pretty text-muted-foreground md:text-lg">
          Join the teams using Perception AI to turn live social chatter into
          clear, actionable insight.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Button
            render={<Link href="/signup" />}
            size="lg"
            className="h-12 bg-primary px-8 text-base text-primary-foreground glow-purple transition-transform hover:scale-[1.03]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
