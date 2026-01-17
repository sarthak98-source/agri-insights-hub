import { Layout } from '@/components/Layout';

const Inventory = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Inventory Management
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Inventory Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Comprehensive inventory tracking and management system</p>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-blue-600">1,250</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-600">890</p>
            <p className="text-sm text-green-700">In Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-amber-600">45</p>
            <p className="text-sm text-amber-700">Low Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <p className="text-3xl font-bold text-red-600">12</p>
            <p className="text-sm text-red-700">Out of Stock</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl font-bold">Current Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Urea Fertilizer</div>
                    <div className="text-sm text-gray-500">50kg bags</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fertilizer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">150 units</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">DAP Fertilizer</div>
                    <div className="text-sm text-gray-500">50kg bags</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fertilizer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">80 units</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">Low Stock</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">Wheat Seeds</div>
                    <div className="text-sm text-gray-500">10kg packets</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Seeds</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">200 units</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;