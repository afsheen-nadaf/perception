"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
}

export function SearchHeader({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: SearchHeaderProps) {
  const [focused, setFocused] = useState(false)

  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Real-Time Intelligence
        </p>

        <motion.h1 className="relative w-fit text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          <motion.span
            animate={{
              backgroundPosition: [
                "200% center", // Start completely hidden on the right
                "200% center", // Stay hidden for the first rest period
                "-200% center", // Sweep completely across to the left
                "-200% center", // Stay hidden for the second rest period
              ],
              textShadow: [
                "0 0 0px rgba(168,85,247,0)",
                "0 0 0px rgba(168,85,247,0)",
                "0 0 25px rgba(168,85,247,0.35)", // A softer, more premium glow during the sweep
                "0 0 0px rgba(168,85,247,0)",
              ],
            }}
            transition={{
              duration: 12, // Stretched to 12s for a slow, premium SaaS tempo
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 0.8, 1], // Spreads out the timeline so the sweep is a smooth, single action
            }}
            className="
              inline-block
              bg-[linear-gradient(110deg,#ffffff_35%,#a855f7_50%,#ffffff_65%)]
              bg-[length:250%_100%]
              bg-clip-text
              text-transparent
              select-none
            "
          >
            What's the Internet Thinking?
          </motion.span>
        </motion.h1>
      </div>

      <motion.form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(e)
        }}
        animate={{
          scale: focused ? 1.015 : 1, // Slightly less aggressive scale to match the clean aesthetic
          borderRadius: focused ? 24 : 16,
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 20,
          mass: 0.6,
        }}
        className="group relative flex w-full items-center gap-2 border border-border glass p-2"
        style={{
          boxShadow: focused
            ? "0 0 0 1px color-mix(in oklab, var(--glow-blue) 35%, transparent), 0 0 40px -10px color-mix(in oklab, var(--glow-blue) 50%, transparent)"
            : "0 0 0 1px transparent",
        }}
      >
        <motion.div
          className="pointer-events-none absolute left-5 text-muted-foreground"
          animate={{
            scale: focused ? 1.1 : 1,
            color: focused ? "var(--primary)" : "var(--muted-foreground)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 16,
          }}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </motion.div>

        <label htmlFor="topic-search" className="sr-only">
          Search a topic to analyze
        </label>

        <input
          id="topic-search"
          type="text"
          placeholder="Analyze a topic, brand, or person..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChange={onChange}
          className="h-12 flex-1 bg-transparent pl-12 pr-2 text-base text-foreground outline-none placeholder:text-muted-foreground cursor-text"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 gap-2 rounded-xl px-6 text-sm font-semibold glow-purple cursor-pointer"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </motion.form>
    </header>
  )
}