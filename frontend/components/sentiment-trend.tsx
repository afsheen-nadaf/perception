"use client"

import React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Activity } from "lucide-react"

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  const positive = payload.find((p) => p.dataKey === "positive")?.value ?? 0
  const negative = payload.find((p) => p.dataKey === "negative")?.value ?? 0

  return (
    <div className="rounded-lg border border-border glass px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-2 text-positive">
        <span className="h-2 w-2 rounded-full bg-positive" aria-hidden="true" />
        <span className="tabular-nums">{positive} positive</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-negative">
        <span className="h-2 w-2 rounded-full bg-negative" aria-hidden="true" />
        <span className="tabular-nums">{negative} negative</span>
      </div>
    </div>
  )
}

interface SentimentTrendProps {
  trendData: any[];
  isLoading?: boolean;
}

export function SentimentTrend({ trendData, isLoading = false }: SentimentTrendProps) {
  return (
    <section aria-label="Sentiment trend over the last 24 hours" className="rounded-2xl border border-border glass p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 glow-blue">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h2 className="text-sm font-semibold text-foreground">Sentiment Trend</h2>
            <p className="text-[11px] text-muted-foreground">Volume over the last 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-positive shadow-[0_0_8px_var(--positive)]" aria-hidden="true" />
            Positive
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-negative shadow-[0_0_8px_var(--negative)]" aria-hidden="true" />
            Negative
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full">
        {trendData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {isLoading ? "Loading trend data..." : "Search a topic to see sentiment over time"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--negative)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--negative)" stopOpacity={0} />
                </linearGradient>
                <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} interval={ "preserveStartEnd" } />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={44} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="negative" stroke="var(--negative)" strokeWidth={2} fill="url(#fillNegative)" filter="url(#glowLine)" activeDot={{ r: 4, fill: "var(--negative)" }} />
              <Area type="monotone" dataKey="positive" stroke="var(--positive)" strokeWidth={2} fill="url(#fillPositive)" filter="url(#glowLine)" activeDot={{ r: 4, fill: "var(--positive)" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}