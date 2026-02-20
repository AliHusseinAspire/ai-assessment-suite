'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingDown, Loader2 } from 'lucide-react';

interface Prediction {
  itemId: string;
  itemName: string;
  currentQuantity: number;
  daysUntilEmpty: number;
  recommendation: string;
}

export function AIPredictions(): React.ReactElement {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch('/api/ai/predict-stock');
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.predictions ?? []);
        }
      } catch {
        // Non-blocking
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, []);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Stock Predictions</h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing stock trends...
        </div>
      ) : predictions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No stock concerns detected. All items look healthy.
        </p>
      ) : (
        <div className="space-y-3">
          {predictions.slice(0, 5).map((prediction, i) => (
            <Link
              key={`${prediction.itemId}-${i}`}
              href={`/inventory/${prediction.itemId}`}
              className="flex items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
            >
              <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{prediction.itemName}</p>
                <p className="text-xs text-muted-foreground">
                  {prediction.currentQuantity} units remaining &middot;{' '}
                  ~{prediction.daysUntilEmpty} days until empty
                </p>
                <p className="text-xs text-primary">{prediction.recommendation}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
