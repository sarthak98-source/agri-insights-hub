import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useUser } from '@clerk/clerk-react';
import { RefreshCw, Bell, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  getProducts, 
  generateAlerts,
  type Product,
  type Alert
} from '@/lib/api';

const Alerts = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id || 'guest';

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const productsData = await getProducts(userId);
      setProducts(productsData);
      const alertsData = generateAlerts(productsData);
      setAlerts(alertsData);

      // Show notification if there are critical alerts
      const criticalAlerts = alertsData.filter(a => a.type === 'low_stock');
      if (criticalAlerts.length > 0) {
        toast({
          title: "⚠️ Critical Alerts Detected!",
          description: `You have ${criticalAlerts.length} low stock alert(s) that need immediate attention.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading alerts",
        description: "Failed to load alert data. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const lowStockAlerts = alerts.filter(a => a.type === 'low_stock');
  const overstockAlerts = alerts.filter(a => a.type === 'overstock');
  const optimalAlerts = alerts.filter(a => a.type === 'optimal');

  // Calculate insights
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const avgStock = products.length > 0 ? Math.round(totalStock / products.length) : 0;
  const criticalCount = lowStockAlerts.length;
  const warningCount = overstockAlerts.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Bell className="h-4 w-4" />
            Real-time Monitoring
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Alerts & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with intelligent alerts and actionable insights for your inventory
          </p>
          <Button 
            onClick={loadData} 
            variant="outline" 
            className="mt-4"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Alerts
          </Button>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-sm text-red-700">Critical Alerts</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
            <p className="text-sm text-amber-700">Warnings</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-600">{optimalAlerts.length}</p>
            <p className="text-sm text-green-700">Optimal</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-border">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-6">Add products to your inventory to see alerts and insights</p>
            <Button variant="default" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            {/* Alert Categories */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Low Stock Alerts */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="bg-red-500 text-white px-6 py-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 pulse-animation" />
                  <h2 className="font-display text-lg font-bold">Low Stock Alerts</h2>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {lowStockAlerts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No low stock alerts</p>
                  ) : (
                    lowStockAlerts.map((alert, index) => (
                      <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-800">{alert.productName}</h4>
                            <p className="text-sm text-red-600 mt-1">
                              Stock: {alert.currentStock} units | Min Level: {alert.minStockLevel} units
                            </p>
                            <p className="text-xs text-red-500 mt-2">{alert.message}</p>
                            <div className="mt-3 flex gap-2">
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Action Required
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Overstock Warnings */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="bg-amber-500 text-white px-6 py-4 flex items-center gap-3">
                  <Package className="h-6 w-6" />
                  <h2 className="font-display text-lg font-bold">Overstock Warnings</h2>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {overstockAlerts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No overstock warnings</p>
                  ) : (
                    overstockAlerts.map((alert, index) => (
                      <div key={index} className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📦</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-800">{alert.productName}</h4>
                            <p className="text-sm text-amber-600 mt-1">
                              Stock: {alert.currentStock} units | Max Level: {alert.maxStockLevel} units
                            </p>
                            <p className="text-xs text-amber-500 mt-2">{alert.message}</p>
                            <div className="mt-3 flex gap-2">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                Review Needed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Optimal Stock */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="bg-green-500 text-white px-6 py-4 flex items-center gap-3">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h2 className="font-display text-lg font-bold">Optimal Stock</h2>
                </div>
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {optimalAlerts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No products at optimal level</p>
                  ) : (
                    optimalAlerts.slice(0, 5).map((alert, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">✅</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800">{alert.productName}</h4>
                            <p className="text-sm text-green-600 mt-1">
                              Stock: {alert.currentStock} units
                            </p>
                            <p className="text-xs text-green-500 mt-2">{alert.message}</p>
                            <div className="mt-3 flex gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Well Balanced
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {optimalAlerts.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground">
                      +{optimalAlerts.length - 5} more products at optimal level
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Insights Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-border p-8">
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                AI-Powered Insights
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-3">📈 Inventory Overview</h3>
                  <p className="text-sm text-blue-700">
                    You have {products.length} products with an average stock of {avgStock} units. 
                    {criticalCount > 0 && ` ${criticalCount} product(s) need immediate restocking.`}
                    {warningCount > 0 && ` ${warningCount} product(s) are overstocked.`}
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-3">🎯 Optimization Score</h3>
                  <p className="text-sm text-purple-700">
                    Your inventory optimization score is{' '}
                    <strong>{Math.round((optimalAlerts.length / Math.max(products.length, 1)) * 100)}%</strong>.
                    {optimalAlerts.length === products.length 
                      ? ' Perfect! All products are optimally stocked.' 
                      : ` You can improve by addressing ${criticalCount + warningCount} alert(s).`}
                  </p>
                </div>
                {criticalCount > 0 && (
                  <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <h3 className="font-semibold text-red-800 mb-3">⚠️ Urgent Actions</h3>
                    <p className="text-sm text-red-700">
                      {criticalCount} product(s) are critically low. Immediate action required to prevent stock-outs 
                      and potential loss of sales opportunities.
                    </p>
                  </div>
                )}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">💡 Smart Recommendation</h3>
                  <p className="text-sm text-green-700">
                    {criticalCount > 0 
                      ? `Focus on restocking low-stock items first. Estimated reorder value needed for optimal levels.`
                      : optimalAlerts.length === products.length
                      ? 'Excellent inventory management! Continue monitoring to maintain these levels.'
                      : 'Review overstock items to free up capital and storage space.'}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse-animation {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse-animation 2s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
};

export default Alerts;