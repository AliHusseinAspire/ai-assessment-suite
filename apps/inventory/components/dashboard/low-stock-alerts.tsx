import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  sku: string;
  category: { name: string };
}

interface LowStockAlertsProps {
  items: LowStockItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps): React.ReactElement {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">All items are well stocked.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/inventory/${item.id}`}
              className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.sku} &middot; {item.category.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  {item.quantity} left
                </p>
                <p className="text-xs text-muted-foreground">
                  Min: {item.minStock}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
