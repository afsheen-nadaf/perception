"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SearchHeader } from "@/components/search-header"
import { PolarizationCard } from "@/components/polarization-card"
import { SentimentBreakdown } from "@/components/sentiment-breakdown"
import { KeywordClouds } from "@/components/keyword-clouds"
import { LiveFeed } from "@/components/live-feed"
import { SentimentTrend } from "@/components/sentiment-trend"
import { useSentiment } from "@/hooks/useSentiment"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { AnalyzingSplash } from "@/components/analyzing-splash"

// Firestore imports to save personal history
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data, loading, error, analyzeTopic, latency } = useSentiment()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // 1. Kick unauthenticated users back to the landing page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // 2. Only block the render if the USER is loading. 
  // We let the sentiment search "loading" state pass through to the skeleton components!
  if (authLoading || !user) return null

  // 3. Handle manual search bar submits
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Trigger the Python backend to start analyzing
    analyzeTopic(searchTerm)

    // Save a tiny log to the user's personal sidebar history in Firestore
    try {
      await addDoc(collection(db, "search_history"), {
        userId: user.uid,
        topic: searchTerm,
        volume: "Live",
        createdAt: serverTimestamp()
      })
    } catch (err) {
      console.error("Failed to save personal search history:", err)
    }
  }

  // 4. Handle clicks from the Recent Searches sidebar
  const handleHistoryClick = (topic: string) => {
    setSearchTerm(topic) // Update the input field visually
    analyzeTopic(topic)  // Fire the API (which will hit your Python cache!)
  }

  // 5. Safely extract data with fallbacks
  const polarizationScore = data?.polarization_score ?? 0.0
  const metrics = data?.metrics ?? { positive: 0, negative: 0, neutral: 0 }
  const samplePosts = data?.sample_posts ?? []
  const topKeywords = data?.top_keywords ?? { positive: [], negative: [] }
  const timeTrend = data?.time_trend ?? []

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {loading && searchTerm && <AnalyzingSplash />}
      </AnimatePresence>
      {/* Background aesthetics */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none fixed -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-glow-blue/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-glow-purple/20 blur-[120px]" />

      <div className="relative flex min-h-screen">
        {/* Sidebar Container */}
        <div className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
          <AppSidebar onHistoryClick={handleHistoryClick} latency={latency} />
        </div>

        {/* Main Dashboard Canvas */}
        <main className="flex-1 px-5 py-6 md:px-8 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="w-full">
              <SearchHeader
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSubmit={handleSearch}
                isLoading={loading}
              />
            </div>

            {error && (
              <div className="w-full text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl">
                ⚠️ API Integration Error: {error}
              </div>
            )}

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <PolarizationCard score={polarizationScore} isLoading={loading} hasData={!!data} />
              <SentimentBreakdown metrics={metrics} isLoading={loading} />
            </section>

            <SentimentTrend trendData={timeTrend} isLoading={loading} />

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <KeywordClouds keywords={topKeywords} isLoading={loading} />
              <LiveFeed posts={samplePosts} isLoading={loading} />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}