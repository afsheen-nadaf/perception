"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { LoadingSplash } from "@/components/loading-splash"

import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Stats } from "@/components/landing/stats"
import { FinalCta } from "@/components/landing/final-cta"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Route Guard: Buffer the transition cleanly
  if (loading || user) {
    return <LoadingSplash />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none fixed -left-40 top-0 h-[480px] w-[480px] animate-pulse rounded-full bg-glow-blue/15 blur-[130px]" />
      <div className="pointer-events-none fixed right-0 top-1/4 h-[520px] w-[520px] animate-pulse rounded-full bg-glow-purple/15 blur-[140px] [animation-delay:1.5s]" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 h-[440px] w-[440px] animate-pulse rounded-full bg-glow-blue/10 blur-[130px] [animation-delay:3s]" />

      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Stats />
          <FinalCta />
        </main>
        <footer className="border-t border-border px-5 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <span>Perception AI</span>
            <span>{`© ${new Date().getFullYear()} Perception AI. All rights reserved.`}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}