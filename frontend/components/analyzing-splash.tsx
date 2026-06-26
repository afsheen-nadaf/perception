'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Network, ScanText, Zap } from 'lucide-react'

const loadingPhrases = [
  { text: 'Opening decentralized firehose...', icon: Network },
  { text: 'Ingesting AT Protocol streams...', icon: ScanText },
  { text: 'Running HuggingFace NLP tensors...', icon: Cpu },
  { text: 'Calculating polarization vectors...', icon: Cpu },
  { text: 'Mapping semantic keyword clouds...', icon: Network },
  { text: 'Tokenizing 18.4k posts...', icon: Zap },
  { text: 'Analyzing sentiment patterns...', icon: ScanText },
]

export function AnalyzingSplash() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = loadingPhrases[phraseIndex].icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/85 backdrop-blur-xl"
    >
      {/* Ambient Orbs - Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-glow-blue/3 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -70, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-glow-purple/3 blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center gap-12">
        {/* Professional AI Core - Abstract Geometric Design */}
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* Outer rotating ring */}
          <motion.svg
            className="absolute inset-0"
            viewBox="0 0 192 192"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#outerGrad)"
              strokeWidth="1"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="outerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.68 0.2 250)" />
                <stop offset="50%" stopColor="oklch(0.68 0.2 250 / 0)" />
                <stop offset="100%" stopColor="oklch(0.62 0.22 300)" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Middle counter-rotating ring */}
          <motion.svg
            className="absolute inset-6"
            viewBox="0 0 160 160"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="url(#middleGrad)"
              strokeWidth="1"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="middleGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.62 0.22 300)" />
                <stop offset="50%" stopColor="oklch(0.62 0.22 300 / 0)" />
                <stop offset="100%" stopColor="oklch(0.68 0.2 250)" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Animated scanning geometry - horizontal sweeps */}
          <motion.div
            className="absolute inset-12 flex items-center justify-center"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="h-full w-full" viewBox="0 0 128 128" preserveAspectRatio="none">
              <line
                x1="0"
                y1="32"
                x2="128"
                y2="32"
                stroke="oklch(0.68 0.2 250)"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="64"
                x2="128"
                y2="64"
                stroke="oklch(0.62 0.22 300)"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="96"
                x2="128"
                y2="96"
                stroke="oklch(0.68 0.2 250)"
                strokeWidth="0.5"
              />
            </svg>
          </motion.div>

          {/* Center dot with subtle glow */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 oklch(0.68 0.2 250 / 0.4)',
                '0 0 40px 20px oklch(0.68 0.2 250 / 0)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="relative h-2 w-2 rounded-full bg-glow-blue"
          />
        </div>

        {/* Terminal Display */}
        <div className="flex flex-col items-center gap-4">
          {/* Status text with fade animation */}
          <div className="h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={phraseIndex}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -32, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <CurrentIcon className="h-3.5 w-3.5 flex-shrink-0 text-glow-blue/70" />
                <span className="font-mono text-xs font-medium tracking-widest text-foreground/90">
                  {loadingPhrases[phraseIndex].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimal progress bar */}
          <div className="h-0.5 w-56 bg-gradient-to-r from-transparent via-glow-blue/40 to-transparent rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/4 bg-glow-blue/80"
            />
          </div>

          {/* Status label */}
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-mono text-muted-foreground/70 tracking-widest uppercase mt-1"
          >
            Analyzing in progress
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}