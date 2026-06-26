import React from "react"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KeywordCloudsProps {
  keywords?: { positive: string[]; negative: string[] };
  isLoading?: boolean;
}

export function KeywordClouds({ keywords = { positive: [], negative: [] }, isLoading = false }: KeywordCloudsProps) {
  return (
    <Card className="glass flex flex-col gap-6 border-border p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 text-positive" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Top Positive Keywords</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.positive.length === 0 ? (
            <span className="text-xs text-muted-foreground">No data yet</span>
          ) : (
            keywords.positive.map((word) => (
              <span key={word} className="rounded-full border border-positive/30 bg-positive/10 px-3 py-1 text-xs font-medium text-positive">
                {word}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ThumbsDown className="h-4 w-4 text-negative" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Top Negative Keywords</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.negative.length === 0 ? (
            <span className="text-xs text-muted-foreground">No data yet</span>
          ) : (
            keywords.negative.map((word) => (
              <span key={word} className="rounded-full border border-negative/30 bg-negative/10 px-3 py-1 text-xs font-medium text-negative">
                {word}
              </span>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}