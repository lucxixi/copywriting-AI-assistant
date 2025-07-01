import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  Calendar,
  Tag,
  Users,
  MoreVertical,
  Archive,
  Star
} from 'lucide-react';
import { ProductInfo, ProductAnalysisResult } from '../types/prompts';
import { storageService } from '../services/storage';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<ProductAnalysisResult[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductAnalysisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductAnalysisResult | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductAnalysisResult | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showBatchActions, setShowBatchActions] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const loadProducts = () => {
    const savedProducts = storageService.getProductAnalyses();
    setProducts(savedProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.painPoints.some(point => point.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.keySellingPoints.some(point => point.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 按类别过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.product.category === selectedCategory);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.product.name.toLowerCase();
          bValue = b.product.name.toLowerCase();
          break;
        case 'category':
          aValue = a.product.category;
          bValue = b.product.category;
          break;
        case 'date':
          aValue = new Date(a.id.split('_')[1] || 0).getTime();
          bValue = new Date(b.id.split('_')[1] || 0).getTime();
          break;
        default:
          aValue = a.product.name.toLowerCase();
          bValue = b.product.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleEdit = (product: ProductAnalysisResult) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    setIsLoading(true);
    setError('');

    try {
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? editingProduct : p
      );

      // 更新存储
      storageService.saveProductAnalyses(updatedProducts);
      setProducts(updatedProducts);
      setIsEditing(false);
      setEditingProduct(null);

      setSuccessMessage('产品信息已成功更新');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('确定要删除这个产品吗？此操作不可恢复。')) return;

    setIsLoading(true);
    setError('');

    try {
      const updatedProducts = products.filter(p => p.id !== productId);
      storageService.saveProductAnalyses(updatedProducts);
      setProducts(updatedProducts);

      setSuccessMessage('产品已成功删除');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('删除失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedProducts.size === 0) return;

    if (!confirm(`确定要删除选中的 ${selectedProducts.size} 个产品吗？此操作不可恢复。`)) return;

    setIsLoading(true);
    setError('');

    try {
      const updatedProducts = products.filter(p => !selectedProducts.has(p.id));
      storageService.saveProductAnalyses(updatedProducts);
      setProducts(updatedProducts);
      setSelectedProducts(new Set());

      setSuccessMessage(`已成功删除 ${selectedProducts.size} 个产品`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('批量删除失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleView = (product: ProductAnalysisResult) => {
    setViewingProduct(product);
  };

  const handleCopyProduct = async (product: ProductAnalysisResult) => {
    const productText = `产品名称：${product.product.name}
产品类别：${getCategoryLabel(product.product.category)}
目标用户：${product.product.targetAudience}
产品描述：${product.product.description}

用户痛点：
${product.painPoints.map(point => `• ${point}`).join('\n')}

关键卖点：
${product.keySellingPoints.map(point => `• ${point}`).join('\n')}

营销文案：
${product.marketingCopy}`;

    try {
      await navigator.clipboard.writeText(productText);
      setSuccessMessage('产品信息已复制到剪贴板');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setError('复制失败，请重试');
    }
  };

  const handleExportProducts = () => {
    const dataToExport = selectedProducts.size > 0
      ? products.filter(p => selectedProducts.has(p.id))
      : filteredProducts;

    const exportData = dataToExport.map(product => ({
      产品名称: product.product.name,
      产品类别: getCategoryLabel(product.product.category),
      目标用户: product.product.targetAudience,
      产品描述: product.product.description,
      用户痛点: product.painPoints.join('；'),
      关键卖点: product.keySellingPoints.join('；'),
      营销文案: product.marketingCopy
    }));

    const csvContent = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `产品分析_${new Date().toLocaleDateString()}.csv`;
    link.click();

    setSuccessMessage(`已导出 ${dataToExport.length} 个产品`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'daily': '日用品',
      'food': '食品',
      'health': '保健品',
      'beauty': '美妆',
      'electronics': '电子产品',
      'clothing': '服装',
      'other': '其他'
    };
    return categoryMap[category] || category;
  };

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'daily', label: '日用品' },
    { value: 'food', label: '食品' },
    { value: 'health', label: '保健品' },
    { value: 'beauty', label: '美妆' },
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装' },
    { value: 'other', label: '其他' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">产品管理</h1>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600 text-sm sm:text-base">管理产品分析结果，支持编辑和删除</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>总计: {products.length}</span>
              <span>•</span>
              <span>显示: {filteredProducts.length}</span>
              {selectedProducts.size > 0 && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">已选: {selectedProducts.size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {successMessage && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {selectedProducts.size > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportProducts}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">导出选中</span>
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">删除选中</span>
              </button>
            </div>
          )}

          <button
            onClick={() => loadProducts()}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">刷新</span>
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索产品</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="搜索产品名称、描述、痛点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">产品类别</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'date')}
            >
              <option value="date">创建时间</option>
              <option value="name">产品名称</option>
              <option value="category">产品类别</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">排序顺序</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedProducts.size === filteredProducts.length ? '取消全选' : '全选'}
            </button>
            {filteredProducts.length > 0 && (
              <button
                onClick={handleExportProducts}
                className="text-sm text-green-600 hover:text-green-800"
              >
                导出全部
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            共 {filteredProducts.length} 个产品
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 transition-all ${
            selectedProducts.has(product.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-100'
          }`}>
            <div className="flex items-start space-x-4">
              {/* 复选框 */}
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* 产品信息 */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.product.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {getCategoryLabel(product.product.category)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(parseInt(product.id.split('_')[1]) || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>目标用户：{product.product.targetAudience}</span>
                  </div>
                  <div>描述：{product.product.description.substring(0, 120)}...</div>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span>{product.painPoints.length} 个痛点</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-green-500" />
                      <span>{product.keySellingPoints.length} 个卖点</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleView(product)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="查看详情"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyProduct(product)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="复制产品信息"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="编辑产品"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除产品"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>没有找到产品</p>
            <p className="text-sm">尝试调整搜索条件或添加新产品</p>
          </div>
        )}
      </div>

      {/* 编辑对话框 */}
      {isEditing && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">编辑产品信息</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    value={editingProduct.product.name}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      product: { ...prev.product, name: e.target.value }
                    } : null)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品类别</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    value={editingProduct.product.category}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      product: { ...prev.product, category: e.target.value as any }
                    } : null)}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标用户</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    value={editingProduct.product.targetAudience}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      product: { ...prev.product, targetAudience: e.target.value }
                    } : null)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
                  <textarea
                    className="w-full h-32 border rounded-lg px-3 py-2 text-gray-900 resize-none"
                    value={editingProduct.product.description}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      product: { ...prev.product, description: e.target.value }
                    } : null)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">用户痛点</label>
                  <div className="space-y-2">
                    {editingProduct.painPoints.map((point, index) => (
                      <input
                        key={index}
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 text-gray-900"
                        value={point}
                        onChange={(e) => {
                          const newPainPoints = [...editingProduct.painPoints];
                          newPainPoints[index] = e.target.value;
                          setEditingProduct(prev => prev ? {
                            ...prev,
                            painPoints: newPainPoints
                          } : null);
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">关键卖点</label>
                  <div className="space-y-2">
                    {editingProduct.keySellingPoints.map((point, index) => (
                      <input
                        key={index}
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 text-gray-900"
                        value={point}
                        onChange={(e) => {
                          const newSellingPoints = [...editingProduct.keySellingPoints];
                          newSellingPoints[index] = e.target.value;
                          setEditingProduct(prev => prev ? {
                            ...prev,
                            keySellingPoints: newSellingPoints
                          } : null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 查看详情对话框 */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">产品详情</h2>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewingProduct.product.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {getCategoryLabel(viewingProduct.product.category)}
                    </span>
                    <span className="text-sm text-gray-500">目标用户：{viewingProduct.product.targetAudience}</span>
                  </div>
                  <p className="text-gray-700">{viewingProduct.product.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">用户痛点</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingProduct.painPoints.map((point, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">关键卖点</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingProduct.keySellingPoints.map((point, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">营销文案</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{viewingProduct.marketingCopy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager; 