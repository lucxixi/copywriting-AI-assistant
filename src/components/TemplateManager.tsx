import React, { useState, useEffect } from 'react';
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
import { PromptTemplate } from '../types/prompts';
import { storageService } from '../services/storage';

const TemplateManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = storageService.getPromptTemplates();
    setTemplates(savedTemplates);
  };

  const getCategories = () => {
    const counts = templates.reduce((acc, template) => {
      acc[template.type] = (acc[template.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: 'all', label: '全部模板', count: templates.length },
      { id: 'product', label: '产品推广', count: counts.product || 0 },
      { id: 'activity', label: '活动营销', count: counts.activity || 0 },
      { id: 'social', label: '社交分享', count: counts.social || 0 },
      { id: 'service', label: '客服话术', count: counts.service || 0 },
      { id: 'welcome', label: '欢迎引导', count: counts.welcome || 0 },
      { id: 'interaction', label: '互动话题', count: counts.interaction || 0 },
      { id: 'testimonial', label: '用户反馈', count: counts.testimonial || 0 },
      { id: 'lifestyle', label: '生活场景', count: counts.lifestyle || 0 },
    ];
  };

  const categories = getCategories();

  const getFilteredTemplates = () => {
    let filtered = templates;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.type === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      welcome: '欢迎语',
      product: '产品推广',
      social: '朋友圈',
      activity: '活动营销',
      interaction: '互动话题',
      service: '客服话术',
      testimonial: '用户反馈',
      lifestyle: '生活场景'
    };
    return labels[type] || type;
  };

  const getStyleLabel = (style: string) => {
    const labels: Record<string, string> = {
      professional: '专业正式',
      friendly: '亲切温暖',
      humorous: '幽默风趣',
      urgent: '紧迫感',
      emotional: '情感化',
      casual: '轻松随意'
    };
    return labels[style] || style;
  };

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
            placeholder="搜索模板名称或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>
        
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>筛选</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar - Categories */}
        <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">分类筛选</h3>
              {showMobileFilters && (
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="sm:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{template.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 mb-3 space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {getTypeLabel(template.type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {getStyleLabel(template.style)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-3">
                      {template.isBuiltIn ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">内置</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">自定义</span>
                      )}
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

                  {/* Variables */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">变量参数：</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {variable.label}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{template.variables.length - 3}个
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  {template.examples && template.examples.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-2">示例预览：</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{template.examples[0]}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button 
                        title="查看详情"
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        title="复制模板"
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {!template.isBuiltIn && (
                        <>
                          <button 
                            title="编辑模板"
                            className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            title="删除模板"
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <button className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="text-sm">使用模板</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {templates.length === 0 ? '还没有任何模板，系统会自动加载内置模板' : '没有找到匹配的模板'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {templates.length === 0 ? '请刷新页面或检查系统设置' : '尝试调整搜索条件或分类筛选'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
