import { getCurrentUser } from '@/features/auth/actions';
import { getDashboardStats } from '@/features/dashboard/queries';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/dashboard/stat-card';
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts';
import { StockChart } from '@/components/dashboard/stock-chart';
import { AIPredictions } from '@/components/dashboard/ai-predictions';
import { Package, DollarSign, BarChart3, FolderOpen } from 'lucide-react';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}. Here&apos;s your inventory overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={stats.totalItems.toString()}
          description={`${stats.totalQuantity} total units`}
          icon={Package}
        />
        <StatCard
          title="Inventory Value"
          value={`$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description={`Avg $${stats.averagePrice.toFixed(2)} per item`}
          icon={DollarSign}
        />
        <StatCard
          title="Low Stock"
          value={(stats.statusCounts['LOW_STOCK'] ?? 0).toString()}
          description="Items need reordering"
          icon={BarChart3}
          variant={stats.statusCounts['LOW_STOCK'] > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories.toString()}
          description={`${stats.totalItems} items organized`}
          icon={FolderOpen}
        />
      </div>

      {/* Charts & Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StockChart statusCounts={stats.statusCounts} />
        <CategoryPieChart data={stats.categoryDistribution} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockAlerts items={stats.lowStockItems} />
        <RecentActivity activities={stats.recentActivity} />
      </div>

      {/* AI Predictions */}
      <AIPredictions />
    </div>
  );
}
