import { useState, useCallback } from 'react';

export interface SamplePost {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  created_utc: string;
}

export interface SentimentData {
  polarization_score: number;
  metrics: {
    positive: number;
    negative: number;
    neutral: number;
  };
  top_keywords: {
    positive: string[];
    negative: string[];
  };
  sample_posts: SamplePost[];
  time_trend?: any[];
}

export const useSentiment = () => {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const analyzeTopic = useCallback(async (topic: string, userId: string | undefined) => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

    try {
      const start = performance.now();

      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic,
          userId: userId
        })
      });

      const end = performance.now();
      setLatency(Math.round(end - start));

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result: SentimentData = await response.json();
      console.log("API result:", result);
      setData(result);
    } catch (err: any) {
      console.error('API Gateway Connection Error:', err);
      setError(err.message || 'Failed to fetch tracking data.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, latency, analyzeTopic };
};