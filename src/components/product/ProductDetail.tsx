import { ProductAnalysisResult } from '../../types/product';

interface ProductDetailProps {
  product: ProductAnalysisResult | null;
}

export function ProductDetail({ product }: ProductDetailProps) {
  if (!product) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">选择产品查看详情</h3>
        <p className="text-gray-600">从左侧列表中选择一个产品来查看详细分析结果</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">产品详情</h2>

      <div className="space-y-6">
        {/* 产品图片 */}
        {product.product.imageUrl && (
          <div className="text-center">
            <img
              src={product.product.imageUrl}
              alt={product.product.name}
              className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* 产品信息 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">🏷️ 产品信息</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">产品名称：</span>{product.product.name}</div>
            <div><span className="font-medium">目标用户：</span>{product.product.targetAudience}</div>
            <div><span className="font-medium">产品描述：</span>{product.product.description}</div>
            {product.product.priceRange && (
              <div><span className="font-medium">价格范围：</span>{product.product.priceRange}</div>
            )}
          </div>
        </div>

        {/* 核心卖点 */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3">💡 核心卖点</h3>
          <ul className="space-y-1 text-sm">
            {product.keySellingPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 用户痛点 */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-3">😰 用户痛点</h3>
          <ul className="space-y-1 text-sm">
            {product.painPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 营销文案 */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-3">📝 营销文案</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.marketingCopy}
          </p>
        </div>

        {/* 产品特性 */}
        {product.product.features.length > 0 && (
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-3">⚡ 产品特性</h3>
            <ul className="space-y-1 text-sm">
              {product.product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 产品优势 */}
        {product.product.benefits.length > 0 && (
          <div className="bg-teal-50 rounded-lg p-4">
            <h3 className="font-semibold text-teal-900 mb-3">🎯 产品优势</h3>
            <ul className="space-y-1 text-sm">
              {product.product.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 