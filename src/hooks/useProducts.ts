import { useState, useEffect, useMemo } from 'react';
import { ProductAnalysisResult, ProductFilters, ProductStats, ProductInfo } from '../types/product';

const defaultFilters: ProductFilters = {
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function useProducts() {
  const [products, setProducts] = useState<ProductAnalysisResult[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载产品数据
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedProducts = JSON.parse(localStorage.getItem('productAnalyses') || '[]');
      setProducts(savedProducts);
    } catch (err) {
      setError('加载产品失败');
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加新产品
  const addProduct = async (newProductInfo: ProductInfo) => {
    try {
      setIsLoading(true);
      setError(null);
      const newProductAnalysis: ProductAnalysisResult = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Unique ID
        product: newProductInfo,
        painPoints: newProductInfo.painPoints || [], // Copy from ProductInfo
        keySellingPoints: [], // Initial empty array
        marketingCopy: '', // Initial empty string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProducts = [...products, newProductAnalysis];
      setProducts(updatedProducts);
      localStorage.setItem('productAnalyses', JSON.stringify(updatedProducts));
      return newProductAnalysis;
    } catch (err) {
      setError('添加产品失败');
      console.error('Failed to add product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新现有产品
  const updateProduct = async (updatedProductAnalysis: ProductAnalysisResult) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProducts = products.map(p =>
        p.id === updatedProductAnalysis.id ? { ...updatedProductAnalysis, updatedAt: new Date().toISOString() } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('productAnalyses', JSON.stringify(updatedProducts));
      return updatedProductAnalysis;
    } catch (err) {
      setError('更新产品失败');
      console.error('Failed to update product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤和排序后的产品
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 按分类筛选
    if (filters.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.product.category === filters.selectedCategory);
    }

    // 按搜索词筛选
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.product.name.toLowerCase().includes(searchLower) ||
        product.product.description.toLowerCase().includes(searchLower) ||
        product.product.targetAudience.toLowerCase().includes(searchLower)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.product.name;
          bValue = b.product.name;
          break;
        case 'category':
          aValue = a.product.category;
          bValue = b.product.category;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, filters]);

  // 统计信息
  const stats = useMemo((): ProductStats => {
    const totalProducts = products.length;
    const categories: Record<string, number> = {};
    const recentAnalyses = products.filter(p => {
      const daysDiff = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    products.forEach(product => {
      const category = product.product.category;
      categories[category] = (categories[category] || 0) + 1;
    });

    return {
      totalProducts,
      categories,
      recentAnalyses
    };
  }, [products]);

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // 删除产品
  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('productAnalyses', JSON.stringify(updatedProducts));
    } catch (err) {
      setError('删除产品失败');
      console.error('Failed to delete product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 复制产品信息
  const copyProductInfo = async (product: ProductAnalysisResult) => {
    const copyText = `📊 产品分析结果

🏷️ 产品信息：
• 产品名称：${product.product.name}
• 产品类型：${product.product.category}
• 目标用户：${product.product.targetAudience}

💡 核心卖点：
${product.keySellingPoints.map(point => `• ${point}`).join('\n')}

😰 用户痛点：
${product.painPoints.map(point => `• ${point}`).join('\n')}

📝 营销文案：
${product.marketingCopy}`;

    try {
      await navigator.clipboard.writeText(copyText);
      return true;
    } catch (err) {
      console.error('Failed to copy product info:', err);
      return false;
    }
  };

  // 初始化加载
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products: filteredProducts,
    stats,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    deleteProduct,
    copyProductInfo,
    loadProducts,
    addProduct,
    updateProduct
  };
} 