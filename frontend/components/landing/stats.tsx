const stats = [
  { value: "200+", label: "posts analyzed per search" },
  { value: "<30s", label: "average analysis time" },
  { value: "Live", label: "Bluesky data stream" },
]

export function Stats() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-border glass px-6 py-8 md:px-10">
        <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-primary text-glow md:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
