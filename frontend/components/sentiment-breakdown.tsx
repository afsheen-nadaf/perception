import React from "react"
import { Card } from "@/components/ui/card"

interface SentimentBreakdownProps {
  metrics: { positive: number; negative: number; neutral: number };
  isLoading?: boolean;
}

export function SentimentBreakdown({ metrics, isLoading = false }: SentimentBreakdownProps) {
  const bars = [
    { label: "Positive", value: metrics.positive, color: "var(--positive)", text: "text-positive" },
    { label: "Neutral",  value: metrics.neutral,  color: "var(--neutral)",  text: "text-neutral"  },
    { label: "Negative", value: metrics.negative, color: "var(--negative)", text: "text-negative" },
  ]

  return (
    <Card className="glass border-border p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-foreground">Sentiment Breakdown</h2>
        <p className="text-xs text-muted-foreground">Distribution across 1.2M mentions</p>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{bar.label}</span>
              <span className={`font-semibold tabular-nums ${bar.text}`}>{bar.value}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${bar.value}%`,
                  backgroundColor: bar.color,
                  boxShadow: `0 0 12px -2px ${bar.color}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}