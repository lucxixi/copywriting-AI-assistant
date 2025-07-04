import { Search } from 'lucide-react';
import { ProductFilters } from '../../types/product';

interface ProductFilterBarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
}

export function ProductFilterBar({ filters, onFiltersChange }: ProductFilterBarProps) {
  const categoryOptions = [
    { value: 'all', label: '全部分类' },
    { value: 'daily', label: '日用品' },
    { value: 'food', label: '食品' },
    { value: 'health', label: '健康' },
    { value: 'beauty', label: '美妆' },
    { value: 'electronics', label: '电子' },
    { value: 'clothing', label: '服装' },
    { value: 'other', label: '其他' }
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: '创建时间（最新）' },
    { value: 'createdAt-asc', label: '创建时间（最早）' },
    { value: 'name-asc', label: '名称（A-Z）' },
    { value: 'name-desc', label: '名称（Z-A）' },
    { value: 'category-asc', label: '分类（A-Z）' }
  ];

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as ['name' | 'createdAt' | 'category', 'asc' | 'desc'];
    onFiltersChange({ sortBy, sortOrder });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 搜索框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜索产品
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="搜索产品名称、描述或目标用户..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            />
          </div>
        </div>

        {/* 产品分类筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            产品分类
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={filters.selectedCategory}
            onChange={(e) => onFiltersChange({ selectedCategory: e.target.value as 'daily' | 'food' | 'health' | 'beauty' | 'electronics' | 'clothing' | 'other' | 'all' })}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 排序方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序方式
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 