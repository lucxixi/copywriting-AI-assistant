import { Package, Copy, Trash2, Calendar, Edit } from 'lucide-react';
import { ProductAnalysisResult } from '../../types/product';

interface ProductListProps {
  products: ProductAnalysisResult[];
  selectedProduct: ProductAnalysisResult | null;
  onSelectProduct: (product: ProductAnalysisResult) => void;
  onCopyProduct: (product: ProductAnalysisResult) => void;
  onDeleteProduct: (id: string) => void;
  onEditProduct: (product: ProductAnalysisResult) => void;
}

export function ProductList({ 
  products, 
  selectedProduct, 
  onSelectProduct, 
  onCopyProduct, 
  onDeleteProduct, 
  onEditProduct 
}: ProductListProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      daily: '日用品',
      food: '食品',
      health: '健康',
      beauty: '美妆',
      electronics: '电子',
      clothing: '服装',
      other: '其他'
    };
    return labels[category] || category;
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Package className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品分析</h3>
        <p className="text-gray-600 mb-4">还没有创建任何产品分析，去产品分析页面创建第一个分析</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">产品列表</h2>
        <span className="text-sm text-gray-500">共 {products.length} 个</span>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedProduct?.id === product.id
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {product.product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.product.targetAudience}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {getCategoryLabel(product.product.category)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {product.keySellingPoints.length} 个卖点
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {product.painPoints.length} 个痛点
                  </span>
                </div>
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product);
                  }}
                  className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="编辑产品"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyProduct(product);
                  }}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="复制产品信息"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProduct(product.id);
                  }}
                  className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="删除产品"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 