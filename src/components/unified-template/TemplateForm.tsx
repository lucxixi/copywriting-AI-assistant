import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { 
  UnifiedTemplate, 
  TemplateFormData, 
  TemplateType, 
  TemplateCategory 
} from '../../types/unified-template';

interface TemplateFormProps {
  template?: UnifiedTemplate | null;
  onSave: (formData: TemplateFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TemplateForm({ template, onSave, onCancel, isLoading = false }: TemplateFormProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: template?.name || '',
    type: template?.type || 'copywriting',
    category: template?.category || 'other',
    content: {
      prompt: template?.content.prompt || '',
      systemPrompt: template?.content.systemPrompt || '',
      variables: template?.content.variables || [],
      examples: template?.content.examples || []
    },
    metadata: {
      description: template?.metadata.description || '',
      tags: template?.metadata.tags || [],
      difficulty: template?.metadata.difficulty || 'beginner',
      estimatedTime: template?.metadata.estimatedTime || 5,
      targetAudience: template?.metadata.targetAudience || [],
      industry: template?.metadata.industry || [],
      language: template?.metadata.language || 'zh-CN'
    },
    isActive: template?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '模板名称不能为空';
    }

    if (!formData.metadata.description.trim()) {
      newErrors.description = '模板描述不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('保存模板失败:', error);
    }
  };

  const updateFormData = (field: keyof TemplateFormData, value: string | TemplateType | TemplateCategory | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateMetadata = (field: keyof TemplateFormData['metadata'], value: string | string[] | number | 'beginner' | 'intermediate' | 'advanced' | 'zh-CN' | 'en-US') => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateContent = (field: keyof TemplateFormData['content'], value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  const typeOptions = [
    { value: 'copywriting', label: '文案生成' },
    { value: 'prompt', label: '提示词' },
    { value: 'product', label: '产品分析' },
    { value: 'dialogue', label: '对话故事' },
    { value: 'script', label: '话术分析' }
  ];

  const categoryOptions = [
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

  const difficultyOptions = [
    { value: 'beginner', label: '初级' },
    { value: 'intermediate', label: '中级' },
    { value: 'advanced', label: '高级' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {template ? '编辑模板' : '创建新模板'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>

              {/* 模板名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模板名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="输入模板名称"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* 模板类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模板类型 *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value as TemplateType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 模板分类 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模板分类 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value as TemplateCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 模板描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模板描述 *
                </label>
                <textarea
                  value={formData.metadata.description}
                  onChange={(e) => updateMetadata('description', e.target.value)}
                  placeholder="详细描述这个模板的用途和特点"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* 模板内容 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">模板内容</h3>

              {/* 提示词内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提示词内容
                </label>
                <textarea
                  value={formData.content.prompt || ''}
                  onChange={(e) => updateContent('prompt', e.target.value)}
                  placeholder="输入模板的提示词内容..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* 系统提示词 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  系统提示词
                </label>
                <textarea
                  value={formData.content.systemPrompt || ''}
                  onChange={(e) => updateContent('systemPrompt', e.target.value)}
                  placeholder="输入系统级提示词..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 附加信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">附加信息</h3>

              {/* 标签 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                <input
                  type="text"
                  value={formData.metadata.tags.join(', ')}
                  onChange={(e) => updateMetadata('tags', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="用逗号分隔，如：营销, 推广, 创意"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* 难度和预计时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    难度等级
                  </label>
                  <select
                    value={formData.metadata.difficulty}
                    onChange={(e) => updateMetadata('difficulty', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    {difficultyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    预计时间（分钟）
                  </label>
                  <input
                    type="number"
                    value={formData.metadata.estimatedTime}
                    onChange={(e) => updateMetadata('estimatedTime', parseInt(e.target.value) || 5)}
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 目标用户 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标用户
                </label>
                <input
                  type="text"
                  value={formData.metadata.targetAudience.join(', ')}
                  onChange={(e) => updateMetadata('targetAudience', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="用逗号分隔，如：营销人员, 内容创作者, 企业主"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* 行业 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  适用行业
                </label>
                <input
                  type="text"
                  value={formData.metadata.industry?.join(', ') || ''}
                  onChange={(e) => updateMetadata('industry', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="用逗号分隔，如：电商, 教育, 金融"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? '保存中...' : (template ? '保存修改' : '创建模板')}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 