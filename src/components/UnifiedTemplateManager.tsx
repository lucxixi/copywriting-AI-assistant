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
  X,
  Settings,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  FileText,
  Zap
} from 'lucide-react';
import { UnifiedTemplate, TemplateType, TemplateCategory } from '../types/prompts';
import { storageService } from '../services/storage';

const UnifiedTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<UnifiedTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TemplateType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'useCount' | 'rating'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UnifiedTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterAndSortTemplates();
  }, [templates, searchTerm, selectedType, selectedCategory, sortBy, sortOrder]);

  const loadTemplates = () => {
    const savedTemplates = storageService.getUnifiedTemplates();
    setTemplates(savedTemplates);
  };

  const filterAndSortTemplates = () => {
    let filtered = templates;

    // 按类型筛选
    if (selectedType !== 'all') {
      filtered = filtered.filter(template => template.type === selectedType);
    }

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'useCount':
          aValue = a.usage.useCount;
          bValue = b.usage.useCount;
          break;
        case 'rating':
          aValue = a.usage.rating;
          bValue = b.usage.rating;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTemplates(filtered);
  };

  const getTypeIcon = (type: TemplateType) => {
    const icons = {
      prompt: BookOpen,
      product: ShoppingBag,
      dialogue: MessageSquare,
      script: FileText,
      copywriting: Zap
    };
    return icons[type] || FileText;
  };

  const getTypeLabel = (type: TemplateType) => {
    const labels: Record<TemplateType, string> = {
      prompt: '提示词',
      product: '产品分析',
      dialogue: '对话故事',
      script: '话术分析',
      copywriting: '文案生成'
    };
    return labels[type];
  };

  const getCategoryLabel = (category: TemplateCategory) => {
    const labels: Record<TemplateCategory, string> = {
      welcome: '欢迎语',
      product: '产品推广',
      social: '社交分享',
      activity: '活动营销',
      service: '客服话术',
      testimonial: '用户反馈',
      lifestyle: '生活场景',
      interaction: '互动话题',
      analysis: '分析类',
      story: '故事类',
      other: '其他'
    };
    return labels[category];
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleUseTemplate = (template: UnifiedTemplate) => {
    // 更新使用统计
    storageService.updateTemplateUsage(template.id, {
      useCount: template.usage.useCount + 1,
      lastUsed: new Date().toISOString()
    });
    
    // 重新加载模板
    loadTemplates();
    
    // 这里可以跳转到相应的功能页面
    alert(`正在使用模板：${template.name}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？此操作不可恢复。')) {
      storageService.deleteUnifiedTemplate(templateId);
      loadTemplates();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">统一模板管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">管理所有类型的模板，支持分类、搜索和统计</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>创建模板</span>
        </button>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">总模板数</p>
              <p className="text-xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">总使用次数</p>
              <p className="text-xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + t.usage.useCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">平均评分</p>
              <p className="text-xl font-bold text-gray-900">
                {templates.length > 0 
                  ? (templates.reduce((sum, t) => sum + t.usage.rating, 0) / templates.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">活跃模板</p>
              <p className="text-xl font-bold text-gray-900">
                {templates.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索模板</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900"
                placeholder="搜索模板名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板类型</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TemplateType | 'all')}
            >
              <option value="all">全部类型</option>
              <option value="prompt">提示词</option>
              <option value="product">产品分析</option>
              <option value="dialogue">对话故事</option>
              <option value="script">话术分析</option>
              <option value="copywriting">文案生成</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板分类</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | 'all')}
            >
              <option value="all">全部分类</option>
              <option value="welcome">欢迎语</option>
              <option value="product">产品推广</option>
              <option value="social">社交分享</option>
              <option value="activity">活动营销</option>
              <option value="service">客服话术</option>
              <option value="testimonial">用户反馈</option>
              <option value="lifestyle">生活场景</option>
              <option value="interaction">互动话题</option>
              <option value="analysis">分析类</option>
              <option value="story">故事类</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as typeof sortBy);
                setSortOrder(newSortOrder as typeof sortOrder);
              }}
            >
              <option value="createdAt-desc">创建时间（最新）</option>
              <option value="createdAt-asc">创建时间（最早）</option>
              <option value="name-asc">名称（A-Z）</option>
              <option value="name-desc">名称（Z-A）</option>
              <option value="useCount-desc">使用次数（最多）</option>
              <option value="rating-desc">评分（最高）</option>
            </select>
          </div>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="grid gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => {
            const TypeIcon = getTypeIcon(template.type);
            return (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {getTypeLabel(template.type)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {getCategoryLabel(template.category)}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${getDifficultyColor(template.metadata.difficulty)}`}>
                            {template.metadata.difficulty === 'beginner' ? '初级' : 
                             template.metadata.difficulty === 'intermediate' ? '中级' : '高级'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{template.metadata.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {template.metadata.tags.slice(0, 5).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {template.metadata.tags.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.metadata.tags.length - 5}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{template.usage.useCount} 次使用</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(template.usage.rating)}
                          <span>({template.usage.rating.toFixed(1)})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="使用模板"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* 编辑功能 */}}
                      className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="编辑模板"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除模板"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
            <p className="text-gray-600 mb-4">还没有创建任何模板，点击上方按钮开始创建</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建第一个模板
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedTemplateManager; 