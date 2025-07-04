import { Search } from 'lucide-react';
import { TemplateFilters, TemplateType, TemplateCategory } from '../../types/unified-template';

interface TemplateFilterBarProps {
  filters: TemplateFilters;
  onFiltersChange: (filters: Partial<TemplateFilters>) => void;
}

export function TemplateFilterBar({ filters, onFiltersChange }: TemplateFilterBarProps) {
  const typeOptions = [
    { value: 'all', label: '全部类型' },
    { value: 'prompt', label: '提示词' },
    { value: 'product', label: '产品分析' },
    { value: 'dialogue', label: '对话故事' },
    { value: 'script', label: '话术分析' },
    { value: 'copywriting', label: '文案生成' }
  ];

  const categoryOptions = [
    { value: 'all', label: '全部分类' },
    { value: 'welcome', label: '欢迎语' },
    { value: 'product', label: '产品推广' },
    { value: 'social', label: '社交分享' },
    { value: 'activity', label: '活动营销' },
    { value: 'service', label: '客服话术' },
    { value: 'testimonial', label: '用户反馈' },
    { value: 'lifestyle', label: '生活场景' },
    { value: 'interaction', label: '互动话题' },
    { value: 'analysis', label: '分析类' },
    { value: 'story', label: '故事类' },
    { value: 'other', label: '其他' }
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: '创建时间（最新）' },
    { value: 'createdAt-asc', label: '创建时间（最早）' },
    { value: 'name-asc', label: '名称（A-Z）' },
    { value: 'name-desc', label: '名称（Z-A）' },
    { value: 'useCount-desc', label: '使用次数（最多）' },
    { value: 'rating-desc', label: '评分（最高）' }
  ];

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as ['name' | 'createdAt' | 'useCount' | 'rating', 'asc' | 'desc'];
    onFiltersChange({ sortBy, sortOrder });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 搜索框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜索模板
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="搜索模板名称、描述或标签..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            />
          </div>
        </div>

        {/* 模板类型筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            模板类型
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={filters.selectedType}
            onChange={(e) => onFiltersChange({ selectedType: e.target.value as TemplateType | 'all' })}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 模板分类筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            模板分类
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            value={filters.selectedCategory}
            onChange={(e) => onFiltersChange({ selectedCategory: e.target.value as TemplateCategory | 'all' })}
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