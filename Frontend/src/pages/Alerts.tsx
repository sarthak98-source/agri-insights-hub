import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const Alerts = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Real-time Monitoring
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Alerts & Insights</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Stay informed with intelligent alerts and actionable insights for your inventory</p>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-red-600" id="critical-count">2</p>
            <p className="text-sm text-red-700">Critical Alerts</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-amber-600" id="warning-count">1</p>
            <p className="text-sm text-amber-700">Warnings</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-600" id="optimal-count">2</p>
            <p className="text-sm text-green-700">Optimal</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-blue-600" id="total-count">5</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
        </div>

        {/* Alert Categories */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="bg-red-500 text-white px-6 py-4 flex items-center gap-3">
              <svg className="h-6 w-6 pulse-animation" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <h2 className="font-display text-lg font-bold">Low Stock Alerts</h2>
            </div>
            <div className="p-6 space-y-4" id="low-stock-alerts">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-800">Urea Fertilizer (50kg)</h4>
                    <p className="text-sm text-red-600 mt-1">Stock: 150 units | Predicted Demand: 200 units</p>
                    <p className="text-xs text-red-500 mt-2">Action: Order 50+ units immediately</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-800">Pesticide Spray (1L)</h4>
                    <p className="text-sm text-red-600 mt-1">Stock: 45 units | Predicted Demand: 100 units</p>
                    <p className="text-xs text-red-500 mt-2">Action: Urgent restock needed - 55+ units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overstock Warnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="bg-amber-500 text-white px-6 py-4 flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <h2 className="font-display text-lg font-bold">Overstock Warnings</h2>
            </div>
            <div className="p-6 space-y-4" id="overstock-alerts">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-semibold text-amber-800">DAP Fertilizer (50kg)</h4>
                    <p className="text-sm text-amber-600 mt-1">Stock: 80 units | Predicted Demand: 60 units</p>
                    <p className="text-xs text-amber-500 mt-2">Suggestion: Reduce next order by 20 units</p>
                  </div>
                </div>
              </div>
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
            <div className="p-6 space-y-4" id="optimal-alerts">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-green-800">Wheat Seeds (10kg)</h4>
                    <p className="text-sm text-green-600 mt-1">Stock: 200 units | Predicted Demand: 180 units</p>
                    <p className="text-xs text-green-500 mt-2">Status: Well balanced inventory</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="font-semibold text-green-800">NPK Complex (25kg)</h4>
                    <p className="text-sm text-green-600 mt-1">Stock: 120 units | Predicted Demand: 110 units</p>
                    <p className="text-xs text-green-500 mt-2">Status: Optimal stock level maintained</p>
                  </div>
                </div>
              </div>
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
              <h3 className="font-semibold text-blue-800 mb-3">📈 Demand Trend Analysis</h3>
              <p className="text-sm text-blue-700">Fertilizer demand is expected to increase by 15% in the next 2 weeks due to the approaching planting season. Consider increasing stock for Urea and NPK products.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-3">🎯 Optimization Recommendation</h3>
              <p className="text-sm text-purple-700">Based on historical data, maintaining stock at 110% of predicted demand provides optimal balance between availability and storage costs.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">🌾 Seasonal Alert</h3>
              <p className="text-sm text-green-700">Kharif season approaching. Historical data shows 40% increase in pesticide demand. Prepare inventory accordingly.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-3">💡 Cost Saving Tip</h3>
              <p className="text-sm text-amber-700">Bulk ordering DAP and Urea together can save 8% on logistics. Next optimal order window: 5 days from now.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Alerts;