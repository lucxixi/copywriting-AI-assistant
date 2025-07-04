import { Package, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { ProductStats as ProductStatsType } from '../../types/product';

interface ProductStatsProps {
  stats: ProductStatsType;
}

export function ProductStats({ stats }: ProductStatsProps) {
  const categoryLabels: Record<string, string> = {
    daily: '日用品',
    food: '食品',
    health: '健康',
    beauty: '美妆',
    electronics: '电子',
    clothing: '服装',
    other: '其他'
  };

  const topCategory = Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">总产品数</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">本周分析</p>
            <p className="text-xl font-bold text-gray-900">{stats.recentAnalyses}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">分类数量</p>
            <p className="text-xl font-bold text-gray-900">{Object.keys(stats.categories).length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">主要分类</p>
            <p className="text-xl font-bold text-gray-900">
              {topCategory ? categoryLabels[topCategory[0]] || topCategory[0] : '无'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 