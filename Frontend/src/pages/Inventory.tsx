import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@clerk/clerk-react';
import { 
  Package, 
  RefreshCw,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  DollarSign,
  Calendar,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getProducts, 
  addProduct,
  updateProduct, 
  deleteProduct,
  getProductStats,
  type Product,
  type ProductStats
} from '@/lib/api';

const Inventory = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  
  // Add Stock Form
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    category: '',
    unit: 'units',
    costPerUnit: '',
    expiryDate: '',
    minStockLevel: '10',
    maxStockLevel: '1000'
  });

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please enter product name and quantity.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newProduct: Product = {
        userId,
        productName: formData.productName,
        quantity: parseInt(formData.quantity),
        category: formData.category || 'General',
        unit: formData.unit || 'units',
        costPerUnit: parseFloat(formData.costPerUnit) || 0,
        expiryDate: formData.expiryDate || undefined,
        minStockLevel: parseInt(formData.minStockLevel) || 10,
        maxStockLevel: parseInt(formData.maxStockLevel) || 1000
      };

      await addProduct(newProduct);
      
      toast({
        title: "Success",
        description: `Added ${formData.quantity} units of ${formData.productName}.`,
      });
      
      // Reset form
      setFormData({
        productName: '',
        quantity: '',
        category: '',
        unit: 'units',
        costPerUnit: '',
        expiryDate: '',
        minStockLevel: '10',
        maxStockLevel: '1000'
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id || null);
    setEditForm({
      ...product,
      expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof Product, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id: string) => {
    try {
      await updateProduct(id, editForm);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
      setEditingId(null);
      setEditForm({});
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(id);
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        });
        loadData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusInfo = (product: Product) => {
    const minStock = product.minStockLevel || 10;
    const maxStock = product.maxStockLevel || 1000;
    
    if (product.quantity === 0) {
      return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
    }
    if (product.quantity <= minStock) {
      return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    }
    if (product.quantity >= maxStock) {
      return { label: 'Overstock', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    }
    return { label: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    return expiry <= fiveDaysFromNow && expiry >= new Date();
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            Inventory Management
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Inventory Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive inventory tracking and management system
          </p>
          <Button 
            onClick={loadData} 
            variant="outline" 
            className="mt-4"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
            <p className="text-sm text-orange-700">Low Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
            <p className="text-sm text-red-700">Out of Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.optimal}</p>
            <p className="text-sm text-green-700">Optimal Stock</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.totalQuantity}</p>
            <p className="text-sm text-purple-700">Total Units</p>
          </div>
        </div>

        {/* Add Stock Section */}
        <section className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Add New Stock
            </h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g., NPK Fertilizer (50kg)"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Fertilizer, Seeds"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="bags, kg, ml"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost per Unit (₹)</Label>
                <Input
                  id="costPerUnit"
                  name="costPerUnit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.costPerUnit}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input
                  id="minStockLevel"
                  name="minStockLevel"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                <Input
                  id="maxStockLevel"
                  name="maxStockLevel"
                  type="number"
                  value={formData.maxStockLevel}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Stock
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Current Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl font-bold">Current Inventory</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">No inventory yet</p>
              <p className="text-muted-foreground">Add your first product using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost/Unit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min/Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const statusInfo = getStatusInfo(product);
                    const totalValue = product.quantity * (product.costPerUnit || 0);
                    const expiring = isExpiringSoon(product.expiryDate);
                    const expired = isExpired(product.expiryDate);

                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        {editingId === product._id ? (
                          <>
                            <td className="px-6 py-4" colSpan={9}>
                              <div className="grid grid-cols-7 gap-3">
                                <Input
                                  value={editForm.productName || ''}
                                  onChange={(e) => handleEditChange('productName', e.target.value)}
                                  placeholder="Product Name"
                                  className="h-8"
                                />
                                <Input
                                  value={editForm.category || ''}
                                  onChange={(e) => handleEditChange('category', e.target.value)}
                                  placeholder="Category"
                                  className="h-8"
                                />
                                <Input
                                  type="number"
                                  value={editForm.quantity || 0}
                                  onChange={(e) => handleEditChange('quantity', parseInt(e.target.value))}
                                  className="h-8"
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editForm.costPerUnit || 0}
                                  onChange={(e) => handleEditChange('costPerUnit', parseFloat(e.target.value))}
                                  className="h-8"
                                  placeholder="Cost"
                                />
                                <Input
                                  type="number"
                                  value={editForm.minStockLevel || 10}
                                  onChange={(e) => handleEditChange('minStockLevel', parseInt(e.target.value))}
                                  className="h-8"
                                  placeholder="Min"
                                />
                                <Input
                                  type="date"
                                  value={editForm.expiryDate || ''}
                                  onChange={(e) => handleEditChange('expiryDate', e.target.value)}
                                  className="h-8"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => saveEdit(product._id!)}
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEdit}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{product.productName}</div>
                              <div className="text-sm text-gray-500">{product.unit}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono font-bold">
                              {product.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                              ₹{(product.costPerUnit || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono font-bold">
                              ₹{totalValue.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">
                              <div>{product.minStockLevel || 10}</div>
                              <div className="text-gray-400">/</div>
                              <div>{product.maxStockLevel || 1000}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {product.expiryDate ? (
                                <div className={expired ? 'text-red-600 font-semibold' : expiring ? 'text-orange-600 font-semibold' : 'text-gray-500'}>
                                  {new Date(product.expiryDate).toLocaleDateString()}
                                  {expired && <div className="text-xs">Expired</div>}
                                  {expiring && !expired && <div className="text-xs">⚠️ Expiring in 5 days</div>}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEdit(product)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(product._id!, product.productName)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;