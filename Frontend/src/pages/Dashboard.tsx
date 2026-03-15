import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Leaf,
  Calendar,
  ShoppingCart,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  getProducts,
  getProductStats,
  type Product,
  type ProductStats
} from '@/lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/* ---------------- Rupee Icon ---------------- */
const IndianRupee = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h6.5a3.5 3.5 0 1 0 0-7H6" />
  </svg>
);

const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.id || 'guest';

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    lowStock: 0,
    overStock: 0,
    optimal: 0,
    outOfStock: 0,
    totalQuantity: 0,
    totalStockValue: 0,
    expiringSoon: 0,
    averageCostPerUnit: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState<'cost' | 'quantity' | 'expiry'>('cost');
  const [trendFilter, setTrendFilter] = useState<'products' | 'quantity' | 'value'>('quantity');

  /* ---------------- Load Data ---------------- */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, s] = await Promise.all([
        getProducts(userId),
        getProductStats(userId)
      ]);
      setProducts(p);
      setStats(s);

      if (s.lowStock || s.outOfStock) {
        toast({
          title: "⚠ Inventory Alert",
          description: `${s.outOfStock} out of stock, ${s.lowStock} low stock`,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  /* ---------------- Charts ---------------- */
  const productChartData = useMemo(() => {
    return products.slice(0, 10).map(p => ({
      name: p.productName.slice(0, 12),
      value:
        chartFilter === 'cost'
          ? p.quantity * (p.costPerUnit || 0)
          : chartFilter === 'quantity'
          ? p.quantity
          : p.expiryDate
          ? Math.ceil(
              (new Date(p.expiryDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          : 0
    }));
  }, [products, chartFilter]);

  const monthlyTrendData = useMemo(() => {
    const map = new Map<string, any>();
    products.forEach(p => {
      if (!p.createdAt) return;
      const d = new Date(p.createdAt);
      const key = d.toISOString().slice(0, 7);
      if (!map.has(key)) {
        map.set(key, { month: d.toLocaleString('en', { month: 'short' }), products: 0, quantity: 0, value: 0 });
      }
      const m = map.get(key);
      m.products++;
      m.quantity += p.quantity;
      m.value += p.quantity * (p.costPerUnit || 0);
    });
    return Array.from(map.values()).slice(-6);
  }, [products]);

  /* ---------------- UI ---------------- */
  return (
    <Layout>
      <div className="bg-secondary min-h-screen">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground py-8">
          <div className="container mx-auto px-4 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold flex gap-2">
                <Leaf /> Dashboard
              </h1>
              <p>Welcome back, {user?.firstName || "User"}</p>
            </div>
            <Button onClick={loadData} disabled={isLoading} variant="outline">
              <RefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh
            </Button>
          </div>
        </div>

        {/* Charts */}
        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-xl">
            <h2 className="font-bold mb-4">Product Analysis</h2>
            <ResponsiveContainer height={300}>
              <BarChart data={productChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card p-6 rounded-xl">
            <h2 className="font-bold mb-4">Monthly Trend</h2>
            <ResponsiveContainer height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey={trendFilter} stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
