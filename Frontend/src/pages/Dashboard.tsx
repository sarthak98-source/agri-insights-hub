import { useState, useEffect } from 'react';
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

// Custom Indian Rupee Icon Component
const IndianRupee = ({ className = "h-6 w-6" }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13l8.5 8" />
      <path d="M6 13h6.5a3.5 3.5 0 1 0 0-7H6" />
    </svg>
  );
};

const Dashboard = () => {
  const { user } = useUser();
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

  const userId = user?.id || 'guest';

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, statsData] = await Promise.all([
        getProducts(userId),
        getProductStats(userId)
      ]);
      
      setProducts(productsData);
      setStats(statsData);

      if (statsData.lowStock > 0 || statsData.outOfStock > 0) {
        toast({
          title: `⚠️ Inventory Alert`,
          description: `${statsData.outOfStock} out of stock, ${statsData.lowStock} low stock items need attention.`,
          variant: "destructive",
        });
      }

      // Check for expiring products (within 5 days)
      if (statsData.expiringSoon > 0) {
        toast({
          title: `📅 Expiry Alert`,
          description: `${statsData.expiringSoon} product(s) expiring within 5 days!`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // Prepare chart data
  const getChartData = () => {
    if (!products || products.length === 0) return [];
    
    const sortedProducts = [...products].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    ).slice(0, 10);

    if (chartFilter === 'cost') {
      return sortedProducts.map(p => ({
        name: p.productName.substring(0, 15),
        value: (p.quantity || 0) * (p.costPerUnit || 0),
        label: 'Total Value'
      }));
    } else if (chartFilter === 'quantity') {
      return sortedProducts.map(p => ({
        name: p.productName.substring(0, 15),
        value: p.quantity || 0,
        label: 'Quantity'
      }));
    } else {
      return sortedProducts
        .filter(p => p.expiryDate)
        .map(p => {
          const daysToExpiry = Math.ceil((new Date(p.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return {
            name: p.productName.substring(0, 15),
            value: daysToExpiry,
            label: 'Days to Expiry'
          };
        });
    }
  };

  // Calculate dynamic monthly trend from actual product data
  const getMonthlyTrendData = () => {
    if (!products || products.length === 0) return [];

    // Group products by month based on createdAt
    const monthlyData = new Map();
    
    products.forEach(product => {
      if (!product.createdAt) return;
      
      const date = new Date(product.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          products: 0,
          quantity: 0,
          value: 0
        });
      }
      
      const existing = monthlyData.get(monthKey);
      existing.products += 1;
      existing.quantity += product.quantity;
      existing.value += product.quantity * (product.costPerUnit || 0);
    });

    // Convert to array and sort by date
    return Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6) // Last 6 months
      .map(([_, data]) => data);
  };

  const monthlyTrendData = getMonthlyTrendData();

  // Calculate trend change percentage
  const getTrendChange = () => {
    if (monthlyTrendData.length < 2) return null;
    const current = monthlyTrendData[monthlyTrendData.length - 1]?.quantity || 0;
    const previous = monthlyTrendData[monthlyTrendData.length - 2]?.quantity || 1;
    return Math.round(((current - previous) / previous) * 100);
  };

  const kpiCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null
    },
    {
      title: 'Total Stock Value',
      value: `₹${(stats.totalStockValue || 0).toLocaleString()}`,
      icon: IndianRupee,  // Changed from DollarSign to IndianRupee
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      change: null
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: null
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock || 0,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      change: null
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null
    },
    {
      title: 'Monthly Trend',
      value: monthlyTrendData.length > 0 ? monthlyTrendData[monthlyTrendData.length - 1]?.quantity || 0 : 0,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: getTrendChange() !== null ? `${getTrendChange()}%` : null
    }
  ];

  return (
    <Layout>
      <div className="bg-secondary min-h-screen">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                  <Leaf className="h-8 w-8" />
                  Dashboard Overview
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Welcome back, {user?.firstName || 'User'}! Here's your inventory summary.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/inventory">
                  <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <ShoppingCart className="h-4 w-4" />
                    Manage Inventory
                  </Button>
                </Link>
                <Button 
                  onClick={loadData} 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                      <Icon className={`h-6 w-6 ${kpi.textColor}`} />
                    </div>
                    {kpi.change && (
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {kpi.change}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Analysis Chart */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">
                  Product Analysis
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={chartFilter === 'cost' ? 'default' : 'outline'}
                    onClick={() => setChartFilter('cost')}
                  >
                    Value
                  </Button>
                  <Button
                    size="sm"
                    variant={chartFilter === 'quantity' ? 'default' : 'outline'}
                    onClick={() => setChartFilter('quantity')}
                  >
                    Quantity
                  </Button>
                  <Button
                    size="sm"
                    variant={chartFilter === 'expiry' ? 'default' : 'outline'}
                    onClick={() => setChartFilter('expiry')}
                  >
                    Expiry
                  </Button>
                </div>
              </div>
              
              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No data available. Add products to see analysis.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Monthly Demand Trend */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">
                  Monthly Inventory Trend
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={trendFilter === 'products' ? 'default' : 'outline'}
                    onClick={() => setTrendFilter('products')}
                  >
                    Products
                  </Button>
                  <Button
                    size="sm"
                    variant={trendFilter === 'quantity' ? 'default' : 'outline'}
                    onClick={() => setTrendFilter('quantity')}
                  >
                    Quantity
                  </Button>
                  <Button
                    size="sm"
                    variant={trendFilter === 'value' ? 'default' : 'outline'}
                    onClick={() => setTrendFilter('value')}
                  >
                    Value (₹)
                  </Button>
                </div>
              </div>
              {monthlyTrendData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No monthly data available yet. Add products to see trends.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={trendFilter} 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name={trendFilter === 'products' ? 'Products Added' : trendFilter === 'quantity' ? 'Total Quantity' : 'Total Value (₹)'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Units</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalQuantity || 0}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Avg Cost/Unit</span>
              </div>
              <p className="text-2xl font-bold text-foreground">₹{(stats.averageCostPerUnit || 0).toFixed(2)}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-muted-foreground">Overstock</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.overStock || 0}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Optimal Stock</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.optimal || 0}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">
              Recent Products
            </h2>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No products yet. Start by adding inventory!</p>
                <Link to="/inventory">
                  <Button variant="default">
                    Go to Inventory
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Product</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Quantity</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Value</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product) => {
                      const value = product.quantity * (product.costPerUnit || 0);
                      const isLowStock = product.quantity > 0 && product.quantity <= (product.minStockLevel || 10);
                      const isOutOfStock = product.quantity === 0;
                      
                      return (
                        <tr key={product._id} className="border-b border-border/50 hover:bg-secondary/50">
                          <td className="py-3 px-4 text-foreground font-medium">{product.productName}</td>
                          <td className="py-3 px-4 text-right font-mono">{product.quantity} {product.unit}</td>
                          <td className="py-3 px-4 text-right font-mono">₹{value.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;