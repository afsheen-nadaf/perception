"use client"

import { motion } from "framer-motion"
import { BrainCircuit } from "lucide-react"

export function LoadingSplash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="relative flex flex-col items-center gap-4">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20"
        >
          <BrainCircuit className="h-8 w-8" />
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Perception<span className="text-primary"> AI</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
            Synchronizing Engine
          </p>
        </div>
      </div>
    </div>
  )
}