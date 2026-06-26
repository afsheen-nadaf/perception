"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function GoogleButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError("Failed to sign in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-border glass text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:glow-blue disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        <span>{loading ? "Connecting to Google..." : label}</span>
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  )
}