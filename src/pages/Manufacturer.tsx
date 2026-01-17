import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const Manufacturer = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Manufacturing Hub
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Manufacturer Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Real-time demand insights from retailers to optimize production and supply chain</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Retailers</span>
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold">248</p>
            <p className="text-xs text-green-600 mt-1">+12 this month</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Aggregate Demand</span>
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <p className="text-3xl font-bold">45,680</p>
            <p className="text-xs text-muted-foreground mt-1">units next 7 days</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Orders Pending</span>
              <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold">34</p>
            <p className="text-xs text-amber-600 mt-1">Awaiting dispatch</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Fulfillment Rate</span>
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold">96.5%</p>
            <p className="text-xs text-green-600 mt-1">Above target</p>
          </div>
        </div>

        {/* Demand Aggregation */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Regional Demand */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Regional Demand (Next 7 Days)
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">North India</p>
                  <p className="text-sm text-muted-foreground">Punjab, Haryana, UP</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">18,450</p>
                  <p className="text-xs text-green-600">+8% from last week</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">South India</p>
                  <p className="text-sm text-muted-foreground">Karnataka, TN, AP</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">12,890</p>
                  <p className="text-xs text-green-600">+5% from last week</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">West India</p>
                  <p className="text-sm text-muted-foreground">Maharashtra, Gujarat</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">9,240</p>
                  <p className="text-xs text-amber-600">+2% from last week</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">East India</p>
                  <p className="text-sm text-muted-foreground">Bihar, WB, Odisha</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">5,100</p>
                  <p className="text-xs text-red-600">-3% from last week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Demand */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Product-wise Demand
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Urea Fertilizer</span>
                  <span className="text-primary font-semibold">15,200 units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">DAP Fertilizer</span>
                  <span className="text-primary font-semibold">12,400 units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">NPK Complex</span>
                  <span className="text-primary font-semibold">8,900 units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Wheat Seeds</span>
                  <span className="text-primary font-semibold">5,680 units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Pesticides</span>
                  <span className="text-primary font-semibold">3,500 units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Benefits for Manufacturers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Demand Visibility</h3>
              <p className="text-sm text-muted-foreground">Real-time aggregated demand data from all connected retailers for accurate production planning</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Cost Optimization</h3>
              <p className="text-sm text-muted-foreground">Reduce production waste and optimize inventory holding costs with predictive insights</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Faster Response</h3>
              <p className="text-sm text-muted-foreground">Quick adaptation to market changes and seasonal demand fluctuations</p>
            </div>
          </div>
        </section>

        {/* Production Recommendations */}
        <section className="bg-gradient-to-br from-primary to-green-400 rounded-2xl p-8 text-white">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            AI Production Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="font-semibold mb-3">🎯 Priority Production</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Increase Urea production by 20% this week</li>
                <li>• Schedule DAP batch for North India dispatch</li>
                <li>• Prepare pesticide inventory for Kharif season</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="font-semibold mb-3">📊 Market Intelligence</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• North region showing 15% higher demand trend</li>
                <li>• New retailers joining platform: 12 this week</li>
                <li>• Average order size increasing by 8%</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Manufacturer;