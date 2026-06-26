"use client"

import { useEffect, useState } from "react"
import { BrainCircuit, Clock, Cpu, ChevronsUpDown, LogOut, User } from "lucide-react"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface SearchHistoryItem {
  topic: string
  volume?: string | number
  active?: boolean
}

interface AppSidebarProps {
  onHistoryClick?: (topic: string) => void
  latency?: number | null
  currentTopic?: string // Added to dynamically highlight the active search item
}

export function AppSidebar({ onHistoryClick, latency, currentTopic }: AppSidebarProps) {
  const { user, logout } = useAuth()
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])

  useEffect(() => {
    if (!user?.uid) return

    // 1. Point to your updated global collection name
    const historyRef = collection(db, "searches")
    
    // 2. Query by your fresh timestamp property
    const q = query(
      historyRef,
      orderBy("searched_at", "desc"),
      limit(7) // Bumped up slightly for a richer sidebar view
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => {
        const data = doc.data()
        const topicName = data.topic || "Unknown Topic"
        return {
          topic: topicName,
          volume: data.metrics?.positive ? `${data.metrics.positive}% Pos` : "Live", 
          // Dynamically check if this item is the currently selected search path
          active: currentTopic?.toLowerCase() === topicName.toLowerCase(),
        }
      })
      setRecentSearches(historyData)
    }, (error) => {
      console.error("Error loading recent searches layout:", error)
    })

    return () => unsubscribe()
  }, [user?.uid, currentTopic])

  const displayName = user?.displayName || "User Account"
  const displayEmail = user?.email || ""
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="flex h-full w-full flex-col gap-8 border-r border-border bg-sidebar/80 px-5 py-6 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 glow-blue">
          <BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Perception<span className="text-primary"> AI</span>
          </p>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Sentiment Engine</p>
        </div>
      </div>

      {/* Recent Searches */}
      <nav aria-label="Recent searches" className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2 px-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Recent Searches</span>
        </div>

        {recentSearches.length === 0 ? (
          <p className="px-1 py-2 text-xs italic text-muted-foreground/60">No recent lookups</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {recentSearches.map((item) => (
              <li key={item.topic}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onHistoryClick?.(item.topic) }}
                  className={cn(
                    "group flex items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all cursor-pointer",
                    item.active
                      ? "border-primary/30 bg-primary/10 text-foreground glow-blue"
                      : "text-muted-foreground hover:border-border hover:bg-accent/40 hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        item.active ? "bg-primary shadow-[0_0_8px_var(--glow-blue)]" : "bg-muted-foreground/40 group-hover:bg-primary",
                      )}
                      aria-hidden="true"
                    />
                    <span className="font-medium capitalize">{item.topic}</span>
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{item.volume}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-3">
        {/* Pipeline Status */}
        <div className="rounded-xl border border-primary/40 glass p-4 overflow-hidden relative shadow-[0_0_20px_-4px_var(--glow-blue)]">
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5 animate-pulse" />

          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-positive">
                  Pipeline Active
                </span>
              </div>
              <Cpu className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last Response</p>
                <p className="text-[10px] tabular-nums text-primary">
                  {latency ? `${(latency / 1000).toFixed(1)}s` : "—"}
                </p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width: latency ? `${Math.min((latency / 30000) * 100, 100)}%` : "0%",
                    boxShadow: "0 0 8px var(--glow-blue)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm outline-none transition-colors hover:bg-accent/40 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} alt={displayName} />
                <AvatarFallback className="text-xs font-medium">
                  {initials || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-sm font-medium leading-none text-foreground">{displayName}</span>
                <span className="truncate text-[11px] leading-none text-muted-foreground">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={displayName} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-foreground">{displayName}</span>
                    <span className="text-xs text-muted-foreground truncate">{displayEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-red-400 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}
 {/* This is a comment inside TSX markup */}