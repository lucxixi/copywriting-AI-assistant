import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductStats } from './ProductStats';
import { ProductFilterBar } from './ProductFilterBar';
import { ProductList } from './ProductList';
import { ProductDetail } from './ProductDetail';
import { ProductAnalysisResult, ProductInfo } from '../../types/product';

export function ProductManager() {
  const {
    products,
    stats,
    filters,
    error,
    updateFilters,
    deleteProduct,
    copyProductInfo,
    addProduct,
    updateProduct
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysisResult | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductAnalysisResult | null>(null);

  const handleSelectProduct = (product: ProductAnalysisResult) => {
    setSelectedProduct(product);
  };

  const handleCopyProduct = async (product: ProductAnalysisResult) => {
    const success = await copyProductInfo(product);
    if (success) {
      alert('已复制到剪贴板！');
    } else {
      alert('复制失败，请手动复制');
    }
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProductClick = (product: ProductAnalysisResult) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData: ProductInfo) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedAnalysis: ProductAnalysisResult = {
          ...editingProduct,
          product: { ...editingProduct.product, ...productData },
          painPoints: productData.painPoints || editingProduct.painPoints, // Update pain points from form
        };
        await updateProduct(updatedAnalysis);
      } else {
        // Add new product
        await addProduct(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('保存产品失败:', err);
      alert('保存产品失败，请重试！');
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('确定要删除这个产品分析吗？')) {
      try {
        await deleteProduct(id);
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
        if (editingProduct?.id === id) { // If the deleted product was being edited
          setEditingProduct(null);
          setShowProductForm(false);
        }
      } catch (error) {
        console.error('删除产品失败:', error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📦 产品管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">管理已分析的产品信息，查看详细分析结果</p>
        </div>
        <button
          onClick={handleAddProductClick}
          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
        >
          ➕ 新增产品
        </button>
      </div>

      {/* Product Form / Modal */}
      {showProductForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '28px', borderRadius: '10px', width: '90%', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>{editingProduct ? '编辑产品' : '新增产品'}</h2>
            <ProductForm
              initialData={editingProduct ? editingProduct.product : null}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 统计信息 */}
      <ProductStats stats={stats} />

      {/* 搜索和过滤 */}
      <ProductFilterBar 
        filters={filters} 
        onFiltersChange={updateFilters} 
      />

      {/* 产品列表和详情 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧：产品列表 */}
        <div className="lg:col-span-1">
          <ProductList
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onCopyProduct={handleCopyProduct}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProductClick}
          />
        </div>

        {/* 右侧：产品详情 */}
        <div className="lg:col-span-2">
          <ProductDetail product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}

interface ProductFormProps {
  initialData: ProductInfo | null;
  onSave: (data: ProductInfo) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductInfo>(initialData || {
    id: '',
    name: '',
    category: 'other',
    description: '',
    features: [],
    benefits: [],
    painPoints: [],
    targetAudience: '',
    priceRange: '',
    imageUrl: '',
    extractedText: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split('\n').map(item => item.trim()).filter(item => item !== '')
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = ['daily', 'food', 'health', 'beauty', 'electronics', 'clothing', 'other'];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>产品名称:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
      </div>
      <div>
        <label htmlFor="category" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>产品分类:</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>产品描述:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        ></textarea>
      </div>
      <div>
        <label htmlFor="features" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>产品特点 (每行一个):</label>
        <textarea id="features" name="features" value={formData.features.join('\n')} onChange={handleArrayChange} rows={3}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        ></textarea>
      </div>
      <div>
        <label htmlFor="benefits" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>产品优势 (每行一个):</label>
        <textarea id="benefits" name="benefits" value={formData.benefits.join('\n')} onChange={handleArrayChange} rows={3}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        ></textarea>
      </div>
      <div>
        <label htmlFor="painPoints" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>用户痛点 (每行一个):</label>
        <textarea id="painPoints" name="painPoints" value={formData.painPoints.join('\n')} onChange={handleArrayChange} rows={3}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        ></textarea>
      </div>
      <div>
        <label htmlFor="targetAudience" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>目标受众:</label>
        <input type="text" id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
      </div>
      <div>
        <label htmlFor="priceRange" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>价格区间 (可选):</label>
        <input type="text" id="priceRange" name="priceRange" value={formData.priceRange || ''} onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
      </div>
      <div>
        <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>图片URL (可选):</label>
        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', flex: 1 }}>保存</button>
        <button type="button" onClick={onCancel} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', flex: 1 }}>取消</button>
      </div>
    </form>
  );
}; 