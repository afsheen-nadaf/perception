import type { Metadata } from "next"
import { AuthCard } from "@/components/auth/auth-card"

export const metadata: Metadata = {
  title: "Welcome to Perception AI",
  description: "Unlock real-time sentiment intelligence. Sign in or create your account to begin analyzing the world's opinion.",
}

export default function SignupPage() {
  return (
    <AuthCard
      title="Welcome to Perception AI"
      subtitle="Unlock real-time sentiment intelligence. Sign in or create your account to begin analyzing the world's opinion."
      buttonLabel="Continue with Google"
    />
  )
}
