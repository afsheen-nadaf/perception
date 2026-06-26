export type Sentiment = "positive" | "negative" | "neutral"

export const recentSearches = [
  { topic: "Taylor Swift", volume: "1.2M", active: true },
  { topic: "Playstation 5", volume: "842K" },
  { topic: "Coffee", volume: "521K" },
  { topic: "Tesla Cybertruck", volume: "398K" },
  { topic: "Climate Policy", volume: "276K" },
  { topic: "Premier League", volume: "210K" },
]

export const polarizationScore = 0.85

export interface TrendPoint {
  time: string
  positive: number
  negative: number
}

// Hourly sentiment volume over the last 24 hours
export const sentimentTrend: TrendPoint[] = [
  { time: "00:00", positive: 62, negative: 21 },
  { time: "01:00", positive: 58, negative: 24 },
  { time: "02:00", positive: 54, negative: 26 },
  { time: "03:00", positive: 49, negative: 22 },
  { time: "04:00", positive: 46, negative: 19 },
  { time: "05:00", positive: 51, negative: 23 },
  { time: "06:00", positive: 60, negative: 28 },
  { time: "07:00", positive: 71, negative: 34 },
  { time: "08:00", positive: 83, negative: 41 },
  { time: "09:00", positive: 92, negative: 38 },
  { time: "10:00", positive: 88, negative: 45 },
  { time: "11:00", positive: 79, negative: 52 },
  { time: "12:00", positive: 95, negative: 48 },
  { time: "13:00", positive: 104, negative: 44 },
  { time: "14:00", positive: 98, negative: 57 },
  { time: "15:00", positive: 112, negative: 61 },
  { time: "16:00", positive: 126, negative: 55 },
  { time: "17:00", positive: 134, negative: 49 },
  { time: "18:00", positive: 121, negative: 63 },
  { time: "19:00", positive: 138, negative: 72 },
  { time: "20:00", positive: 152, negative: 68 },
  { time: "21:00", positive: 147, negative: 59 },
  { time: "22:00", positive: 129, negative: 47 },
  { time: "23:00", positive: 118, negative: 42 },
]

export const currentUser = {
  name: "Jordan Avery",
  email: "jordan.avery@gmail.com",
  avatar: "/avatar.png",
}

export const sentimentBreakdown = {
  positive: 58,
  neutral: 27,
  negative: 15,
}

export const positiveKeywords = [
  "iconic",
  "masterpiece",
  "legendary",
  "obsessed",
  "stunning",
  "flawless",
  "energy",
  "vibes",
]

export const negativeKeywords = [
  "overrated",
  "expensive",
  "disappointed",
  "delayed",
  "boycott",
  "drama",
  "exhausting",
]

export interface Post {
  id: string
  author: string
  handle: string
  text: string
  time: string
  sentiment: Sentiment
  score: number
}

export const samplePosts: Post[] = [
  {
    id: "1",
    author: "Maya Reyes",
    handle: "@mayareyes",
    text: "Just experienced this live and I am genuinely speechless. Absolutely iconic, a flawless performance from start to finish.",
    time: "2m ago",
    sentiment: "positive",
    score: 0.94,
  },
  {
    id: "2",
    author: "Dev Kapoor",
    handle: "@devbuilds",
    text: "Honestly a bit overrated for the price point. Expected way more given all the hype around it lately.",
    time: "6m ago",
    sentiment: "negative",
    score: 0.81,
  },
  {
    id: "3",
    author: "Lina Okafor",
    handle: "@linao",
    text: "It's fine. Does what it says, nothing groundbreaking but not bad either. Pretty neutral take overall.",
    time: "11m ago",
    sentiment: "neutral",
    score: 0.62,
  },
  {
    id: "4",
    author: "Theo Marchetti",
    handle: "@theom",
    text: "The energy in this community is unmatched right now. Stunning visuals and the vibes are immaculate.",
    time: "18m ago",
    sentiment: "positive",
    score: 0.89,
  },
  {
    id: "5",
    author: "Sasha Lindqvist",
    handle: "@sashal",
    text: "Really disappointed it got delayed again. This is getting exhausting for everyone who pre-ordered.",
    time: "24m ago",
    sentiment: "negative",
    score: 0.77,
  },
  {
    id: "6",
    author: "Omar Haddad",
    handle: "@omarh",
    text: "Comparing the specs side by side. Numbers look reasonable, will reserve judgment until the full review.",
    time: "31m ago",
    sentiment: "neutral",
    score: 0.58,
  },
  {
    id: "7",
    author: "Priya Nair",
    handle: "@priyawrites",
    text: "A genuine masterpiece. I have been obsessed all week and cannot stop recommending it to everyone.",
    time: "44m ago",
    sentiment: "positive",
    score: 0.92,
  },
]
