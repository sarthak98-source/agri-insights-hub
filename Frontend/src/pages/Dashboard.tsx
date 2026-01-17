import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Leaf,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getStock, 
  addStock, 
  getForecast, 
  generateAlerts,
  type StockItem,
  type ForecastData,
  type Alert
} from '@/lib/api';

const Dashboard = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stockData, forecastData] = await Promise.all([
        getStock(),
        getForecast()
      ]);
      setStock(stockData);
      setForecast(forecastData);
      setAlerts(generateAlerts(forecastData.predictions));
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Using sample data for demonstration.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity) {
      toast({
        title: "Validation Error",
        description: "Please enter both product name and quantity.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addStock({ productName, quantity: parseInt(quantity) });
      toast({
        title: "Stock Added",
        description: `Successfully added ${quantity} units of ${productName}.`,
      });
      setProductName('');
      setQuantity('');
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const lowStockAlerts = alerts.filter(a => a.type === 'low_stock');
  const overstockAlerts = alerts.filter(a => a.type === 'overstock');
  const optimalAlerts = alerts.filter(a => a.type === 'optimal');

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
                  Retailer Dashboard
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Smart Agri-Input Inventory Management
                </p>
              </div>
              <Button 
                onClick={loadData} 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">Total Products</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{stock.length}</p>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">Low Stock</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-destructive">{lowStockAlerts.length}</p>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">Overstock</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-warning">{overstockAlerts.length}</p>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">Optimal</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-success">{optimalAlerts.length}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Stock Entry & Current Stock */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stock Entry Section */}
              <section className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Add New Stock
                  </h2>
                </div>

                <form onSubmit={handleAddStock} className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., NPK Fertilizer (50kg)"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter units"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      type="submit" 
                      variant="hero" 
                      className="w-full h-11"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Stock
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </section>

              {/* Current Stock Section */}
              <section className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Package className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Current Stock
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                            Product Name
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                            Quantity Available
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stock.map((item, index) => {
                          const alert = alerts.find(a => a.productName === item.productName);
                          return (
                            <tr 
                              key={index} 
                              className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-foreground font-medium">
                                {item.productName}
                              </td>
                              <td className="py-4 px-4 text-right text-foreground">
                                <span className="font-mono font-bold">{item.quantity}</span>
                                <span className="text-muted-foreground ml-1">units</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                {alert?.type === 'low_stock' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                    <AlertTriangle className="h-3 w-3" />
                                    Low Stock
                                  </span>
                                )}
                                {alert?.type === 'overstock' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                                    <AlertCircle className="h-3 w-3" />
                                    Overstock
                                  </span>
                                )}
                                {alert?.type === 'optimal' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Optimal
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
              </section>
            </div>

            {/* Right Column - Forecast & Alerts */}
            <div className="space-y-8">
              {/* Demand Forecast Section */}
              <section className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Demand Forecast
                  </h2>
                </div>

                {forecast && (
                  <>
                    <div className="bg-primary/5 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Forecast Period: {forecast.forecastPeriod}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="h-4 w-4" />
                        <span>Model: {forecast.modelUsed} ({forecast.accuracy}% accuracy)</span>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {forecast.predictions.slice(0, 5).map((pred, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                        >
                          <span className="text-sm text-foreground truncate max-w-[150px]">
                            {pred.productName}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {pred.predictedDemand} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* Alerts Section */}
              <section className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-destructive text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Alerts & Insights
                  </h2>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {/* Low Stock Alerts */}
                  {lowStockAlerts.map((alert, index) => (
                    <div 
                      key={`low-${index}`}
                      className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-destructive text-sm">
                            LOW STOCK ALERT
                          </p>
                          <p className="text-sm text-foreground font-medium mt-1">
                            {alert.productName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span>Stock: <strong>{alert.currentStock}</strong></span>
                            <span>Demand: <strong>{alert.predictedDemand}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Overstock Alerts */}
                  {overstockAlerts.map((alert, index) => (
                    <div 
                      key={`over-${index}`}
                      className="p-4 rounded-xl bg-warning/10 border border-warning/20"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-warning text-sm">
                            OVERSTOCK ALERT
                          </p>
                          <p className="text-sm text-foreground font-medium mt-1">
                            {alert.productName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span>Stock: <strong>{alert.currentStock}</strong></span>
                            <span>Demand: <strong>{alert.predictedDemand}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Optimal Status */}
                  {optimalAlerts.length > 0 && (
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-success text-sm">
                            OPTIMAL STOCK
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {optimalAlerts.length} products have optimal stock levels for predicted demand.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
