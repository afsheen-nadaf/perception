import React from "react"
import { Card } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"

interface PolarizationCardProps {
  score: number;
  isLoading?: boolean;
  hasData?: boolean;
}

function getVerdict(score: number) {
  if (score >= 0.7) return {
    label: "Highly Polarized",
    color: "text-negative",
    description: "Opinions are strongly split into opposing camps with little middle ground."
  }
  if (score >= 0.4) return {
    label: "Moderately Polarized",
    color: "text-yellow-400",
    description: "There is notable disagreement, but some shared perspectives exist."
  }
  if (score >= 0.2) return {
    label: "Slightly Polarized",
    color: "text-primary",
    description: "Mild differences in opinion with a fair amount of common ground."
  }
  return {
    label: "Low Polarization",
    color: "text-positive",
    description: "The conversation is largely aligned with broad agreement across views."
  }
}

export function PolarizationCard({ score, isLoading = false, hasData = false }: PolarizationCardProps) {
  const radius = 80
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - score * circumference
  const verdict = getVerdict(score)

  return (
    <Card className="glass relative overflow-hidden border-border p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-foreground">Polarization Score</h2>
        <p className="text-xs text-muted-foreground">Divisiveness of conversation</p>
      </div>

      {!hasData ? (
        <div className="mt-4 flex h-[160px] flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">No data yet</p>
            <p className="text-xs text-muted-foreground">Search a topic to see its polarization score</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="relative h-[160px] w-[160px]">
            <svg
              height="160" width="160" viewBox="0 0 160 160"
              className="-rotate-90" role="img"
              aria-label={`Polarization score ${score} out of 1`}
            >
              <defs>
                <linearGradient id="polar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--glow-blue)" />
                  <stop offset="100%" stopColor="var(--glow-purple)" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r={normalizedRadius} fill="transparent" stroke="var(--muted)" strokeWidth={stroke} />
              <circle
                cx="80" cy="80" r={normalizedRadius}
                fill="transparent" stroke="url(#polar-grad)"
                strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                style={{ filter: "drop-shadow(0 0 6px var(--glow-purple))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold tabular-nums text-glow text-foreground">{score.toFixed(2)}</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">/ 1.00</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-accent/30 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Verdict</p>
              <p className={`text-sm font-semibold ${verdict.color}`}>{verdict.label}</p>
            </div>
            <p className="max-w-[160px] text-xs leading-relaxed text-muted-foreground">{verdict.description}</p>
          </div>
        </div>
      )}
    </Card>
  )
}