"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface LegalModalProps {
  title: string
  content: React.ReactNode
  trigger: React.ReactElement
}

export function LegalModal({ title, content, trigger }: LegalModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />
      
      <Dialog.Portal>
        {/* Backdrop overlay — This explicitly intercepts pointer events for dismissal */}
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm pointer-events-auto" />
        
        {/* Dialog.Popup acts as the viewport centering wrapper layout */}
        <Dialog.Popup className="fixed inset-0 z-[60] flex items-center justify-center p-4 outline-none pointer-events-none">
          {/* We add pointer-events-auto back to the card surface container so clicking inside won't close it */}
          <div className="w-full max-w-2xl pointer-events-auto">
            <Card className="glass border-border shadow-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                {content}
              </CardContent>
            </Card>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}