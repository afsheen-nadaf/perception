"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  // Intercept the click to create a smooth, animated glide to the section
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById("how-it-works")
    
    if (target) {
      target.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" // Aligns the top of the section with the top of the viewport
      })
    }
  }

  return (
    <section className="relative px-5 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Real-time sentiment intelligence, powered by AI
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Understand the World&apos;s{" "}
          <span className="text-primary text-glow">Opinion</span> in Real Time
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Perception AI scans live social conversations, detects polarization,
          and breaks down public sentiment on any topic in seconds — so you
          always know how the world feels.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            render={<Link href="/signup" />}
            size="lg"
            className="h-12 w-full bg-primary px-7 text-base text-primary-foreground glow-purple transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Start Using Today
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          {/* Replaced Next.js Link with a standard anchor running our smooth scroll function */}
          <Button
            render={<a href="#how-it-works" onClick={handleSmoothScroll} />}
            size="lg"
            variant="ghost"
            className="h-12 w-full border border-border px-7 text-base text-foreground hover:bg-secondary sm:w-auto cursor-pointer"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  )
}