import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-border glass px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary glow-blue">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Perception AI
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            render={<Link href="/signup">Get Started</Link>}
            className="bg-primary text-primary-foreground glow-purple transition-transform hover:scale-[1.03]"
          />
        </nav>
      </div>
    </header>
  )
}
