import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Star,
  BarChart3,
  Eye,
  Download,
  Tag,
  Calendar,
  User,
  ChevronDown,
  X
} from 'lucide-react';

const TemplateManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    { id: 'all', label: '全部模板', count: 24 },
    { id: 'product', label: '产品推广', count: 8 },
    { id: 'activity', label: '活动营销', count: 6 },
    { id: 'social', label: '社交分享', count: 4 },
    { id: 'service', label: '客服话术', count: 3 },
    { id: 'welcome', label: '欢迎引导', count: 3 },
  ];

  const templates = [
    {
      id: 1,
      title: '产品推广通用模板',
      category: 'product',
      description: '适用于各类产品的推广文案生成，突出产品卖点和用户价值',
      usage: 342,
      rating: 4.8,
      efficiency: 92,
      lastModified: '2024-01-15',
      author: '张运营',
      tags: ['热门', '高转化', '通用'],
      preview: '🌟 【限时特惠】{产品名称}震撼上市！\n\n✨ 核心亮点：\n{产品卖点1}\n{产品卖点2}\n{产品卖点3}...'
    },
    {
      id: 2,
      title: '限时活动促销模板',
      category: 'activity',
      description: '营造紧迫感和稀缺性，提高活动参与度和转化率',
      usage: 287,
      rating: 4.6,
      efficiency: 88,
      lastModified: '2024-01-12',
      author: '李营销',
      tags: ['紧急', '促销', '转化'],
      preview: '⏰ 限时{活动时长}！{活动名称}火热进行中！\n\n🎁 超值福利：\n• {优惠内容1}\n• {优惠内容2}...'
    },
    {
      id: 3,
      title: '朋友圈分享模板',
      category: 'social',
      description: '适合朋友圈传播的文案格式，增强社交分享效果',
      usage: 234,
      rating: 4.7,
      efficiency: 85,
      lastModified: '2024-01-10',
      author: '王小红',
      tags: ['社交', '分享', '口碑'],
      preview: '✨ 今天要给大家推荐一个{产品类型}神器！\n\n用了{使用时长}，真的太惊喜了...'
    },
    {
      id: 4,
      title: '新用户欢迎模板',
      category: 'welcome',
      description: '温暖的欢迎新用户，建立良好的第一印象',
      usage: 198,
      rating: 4.9,
      efficiency: 90,
      lastModified: '2024-01-08',
      author: '陈客服',
      tags: ['欢迎', '温暖', '引导'],
      preview: '🎉 欢迎{用户称呼}加入我们的大家庭！\n\n很高兴认识你，我是你的专属顾问{客服名称}...'
    },
    {
      id: 5,
      title: '客服标准回复模板',
      category: 'service',
      description: '标准化的客服回复话术，提高服务效率和用户满意度',
      usage: 167,
      rating: 4.5,
      efficiency: 87,
      lastModified: '2024-01-05',
      author: '赵客服',
      tags: ['客服', '标准', '效率'],
      preview: '亲爱的{用户称呼}，感谢您的咨询！\n\n关于您提到的{问题类型}，我来为您详细解答...'
    },
    {
      id: 6,
      title: '用户好评展示模板',
      category: 'social',
      description: '展示用户真实好评，建立社会信任感',
      usage: 145,
      rating: 4.4,
      efficiency: 83,
      lastModified: '2024-01-03',
      author: '孙运营',
      tags: ['好评', '信任', '展示'],
      preview: '🌟 又收到了{用户类型}的五星好评！\n\n"{用户评价内容}"\n\n感谢{用户称呼}的信任...'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">模板管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">管理和优化您的文案模板库</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm sm:text-base">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>创建模板</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="搜索模板名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>筛选</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">导出</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Category Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分类筛选</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Category Filter */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-xl p-6 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">分类筛选</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                {/* Template Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{template.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mb-3 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{template.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{template.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{template.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-2">模板预览：</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{template.preview}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{template.usage}</div>
                    <div className="text-xs text-gray-500">使用次数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{template.efficiency}%</div>
                    <div className="text-xs text-gray-500">效率评分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{template.rating}</div>
                    <div className="text-xs text-gray-500">用户评分</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">分析</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">没有找到匹配的模板</p>
              <p className="text-gray-400 text-sm mt-1">尝试调整搜索条件或创建新模板</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;