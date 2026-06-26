"use client"

import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import { GoogleButton } from "@/components/auth/google-button"
import { LegalModal } from "@/components/legal-modal"

interface AuthCardProps {
  title: string
  subtitle: string
  buttonLabel: string
}

export function AuthCard({
  title,
  subtitle,
  buttonLabel,
}: AuthCardProps) {
  const termsContent = (
    <>
    <p>
              <strong>Last updated: June 2026</strong>
            </p>
            <p>
              Perception AI is a research-based sentiment analytics platform. By using this service, you agree that your interaction with the platform is for informational purposes.
            </p>
            <p>
              We prioritize your privacy. This application uses Google Authentication to provide a secure login experience. We do not store or sell your personal data; your identity information is used solely to manage your personalized dashboard settings and project history.
            </p>
            <p>
              All sentiment analysis is performed in real-time. Because we rely on public API streams, we are not responsible for the accuracy of third-party content. 
            </p>
            </>
  )

  const privacyContent = (
    <>
    <p>
              <strong>Last updated: June 2026</strong>
            </p>
            <p>
              Perception AI is a research-based sentiment analytics platform. By using this service, you agree that your interaction with the platform is for informational purposes.
            </p>
            <p>
              We prioritize your privacy. This application uses Google Authentication to provide a secure login experience. We do not store or sell your personal data; your identity information is used solely to manage your personalized dashboard settings and project history.
            </p>
            <p>
              All sentiment analysis is performed in real-time. Because we rely on public API streams, we are not responsible for the accuracy of third-party content. 
            </p>
            </>
  )
    
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 grid-bg">
      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-glow-blue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-glow-purple/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-border glass p-8 shadow-2xl">
          {/* Logo */}
          <Link
            href="/"
            className="mx-auto flex w-fit items-center gap-2.5"
            aria-label="Perception AI home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary glow-blue">
              <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Perception AI
            </span>
          </Link>

          {/* Heading */}
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Google auth */}
          <div className="mt-8">
            <GoogleButton label={buttonLabel} />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
  By continuing, you agree to our{" "}
  <LegalModal 
    title="Terms of Service"
    content={termsContent}
    trigger={
      <button type="button" className="text-foreground/80 underline-offset-2 hover:underline font-medium bg-transparent border-0 p-0 cursor-pointer">
        Terms
      </button>
    }
  />
  {" "} and {" "}
  <LegalModal 
    title="Privacy Policy"
    content={privacyContent}
    trigger={
      <button type="button" className="text-foreground/80 underline-offset-2 hover:underline font-medium bg-transparent border-0 p-0 cursor-pointer">
        Privacy Policy
      </button>
    }
  />
  .
</p>
        </div>
      </div>
    </main>
  )
}
