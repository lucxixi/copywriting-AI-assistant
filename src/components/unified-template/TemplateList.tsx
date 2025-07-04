import { 
  BookOpen, 
  ShoppingBag, 
  MessageSquare, 
  FileText, 
  Zap, 
  BarChart3, 
  Star, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { UnifiedTemplate, TemplateType, TemplateCategory } from '../../types/unified-template';

interface TemplateListProps {
  templates: UnifiedTemplate[];
  onUseTemplate: (id: string) => void;
  onViewTemplate: (template: UnifiedTemplate) => void;
  onEditTemplate: (template: UnifiedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export function TemplateList({ 
  templates, 
  onUseTemplate, 
  onViewTemplate, 
  onEditTemplate, 
  onDeleteTemplate 
}: TemplateListProps) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <BookOpen className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
        <p className="text-gray-600 mb-4">还没有创建任何模板，点击上方按钮开始创建</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => {
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
                  onClick={() => onUseTemplate(template.id)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="使用模板"
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewTemplate(template)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="查看详情"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditTemplate(template)}
                  className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  title="编辑模板"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTemplate(template.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除模板"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 