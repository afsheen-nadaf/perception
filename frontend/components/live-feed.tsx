import React from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Sentiment = "positive" | "negative" | "neutral"

const sentimentStyles: Record<Sentiment, string> = {
  positive: "border-positive/30 bg-positive/10 text-positive",
  negative: "border-negative/30 bg-negative/10 text-negative",
  neutral: "border-border bg-muted text-neutral",
}

interface LiveFeedProps {
  posts: any[];
  isLoading?: boolean;
}

export function LiveFeed({ posts, isLoading = false }: LiveFeedProps) {
  return (
    <Card className="glass flex h-full flex-col gap-4 border-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-foreground">Sample Posts</h2>
          <p className="text-xs text-muted-foreground">Live annotated feed</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-border bg-accent/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
          </span>
          Live
        </span>
      </div>

      <ScrollArea className="h-[420px] pr-3">
        {posts.length === 0 ? (
          <p className="text-xs text-muted-foreground">Search a topic to see posts.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-relaxed text-foreground/90">{post.text}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
                      sentimentStyles[post.sentiment as Sentiment],
                    )}
                  >
                    {post.sentiment}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{new Date(post.created_utc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="tabular-nums">confidence {(post.confidence * 100).toFixed(0)}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </Card>
  )
}