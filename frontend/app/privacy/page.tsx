"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LegalPage() {
  return (
    <main className="relative min-h-screen grid-bg px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed space-y-4">
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
            <p>
              If you have any questions regarding your data, please feel free to reach out to the development team.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}