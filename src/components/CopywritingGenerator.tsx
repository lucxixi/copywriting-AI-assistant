import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Users,
  Calendar,
  Star,
  Sparkles,
  AlertCircle,
  Loader,
  Copy,
  Download,
  Settings,
  ChevronUp,
  ChevronDown,
  Wand2,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { CopywritingType, WritingStyle, GenerationParams } from '../types/prompts';
import { apiService } from '../services/api';
import { promptService } from '../services/prompts';
import { storageService } from '../services/storage';
import { GenerationHistory } from '../types/api';

const CopywritingGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<CopywritingType>('product');
  const [selectedStyle, setSelectedStyle] = useState<WritingStyle>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 生成参数
  const [targetAudience, setTargetAudience] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [customRequirements, setCustomRequirements] = useState('');

  useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 根据文案类型验证必填字段
    if (selectedType === 'product' && !productInfo.trim()) {
      errors.productInfo = '产品推广文案需要填写产品信息';
    }

    if (selectedType === 'welcome' && !targetAudience.trim()) {
      errors.targetAudience = '欢迎语文案需要明确目标用户';
    }

    if (selectedType === 'activity' && !productInfo.trim()) {
      errors.productInfo = '活动营销文案需要填写活动信息';
    }

    // 通用验证
    if (productInfo.length > 500) {
      errors.productInfo = '产品信息不能超过500字';
    }

    if (keyPoints.length > 300) {
      errors.keyPoints = '关键要点不能超过300字';
    }

    if (customRequirements.length > 200) {
      errors.customRequirements = '特殊要求不能超过200字';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const copywritingTypes = [
    { id: 'welcome', label: '欢迎语文案', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'product', label: '产品推广', icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { id: 'social', label: '朋友圈分享', icon: Users, color: 'from-purple-500 to-indigo-500' },
    { id: 'activity', label: '活动营销', icon: Calendar, color: 'from-orange-500 to-red-500' },
    { id: 'promotion', label: '促销文案', icon: Star, color: 'from-violet-500 to-purple-500' },
    { id: 'education', label: '教育内容', icon: Sparkles, color: 'from-teal-500 to-cyan-500' },
  ];

  const writingStyles = [
    { id: 'professional', label: '专业正式', description: '商务场合，权威可信' },
    { id: 'friendly', label: '亲切温暖', description: '拉近距离，增加好感' },
    { id: 'humorous', label: '幽默风趣', description: '轻松活泼，增强记忆' },
    { id: 'urgent', label: '紧迫感', description: '营造稀缺，促进行动' },
  ];

  const handleGenerate = async () => {
    if (!apiConfigured) {
      setError('请先在系统设置中配置AI API');
      return;
    }

    // 表单验证
    if (!validateForm()) {
      setError('请检查并修正表单中的错误');
      return;
    }

    setIsGenerating(true);
    setError('');
    setValidationErrors({});

    try {
      // 准备生成参数
      const params: GenerationParams = {
        type: selectedType,
        style: selectedStyle,
        targetAudience,
        productInfo,
        keyPoints: keyPoints ? keyPoints.split('\n').filter(k => k.trim()) : [],
        length,
        includeEmoji,
        customRequirements
      };

      // 获取业务上下文
      const businessContext = storageService.getBusinessContext();

      // 生成提示词
      const prompt = promptService.generatePrompt(params, businessContext);

      // 调用API生成内容
      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的私域运营文案专家，擅长撰写各种类型的营销文案。请根据用户需求生成高质量、有吸引力的文案内容。`,
        maxTokens: 1000,
        temperature: 0.7
      });

      if (response.success && response.content) {
        setGeneratedContent(response.content);

        // 保存生成历史
        const historyRecord: GenerationHistory = {
          id: `gen_${Date.now()}`,
          type: selectedType,
          style: selectedStyle,
          prompt,
          result: response.content,
          apiConfig: storageService.getActiveApiId(),
          createdAt: new Date().toISOString(),
          parameters: params
        };

        storageService.saveGenerationHistory(historyRecord);
      } else {
        setError(response.error || '生成失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成过程中发生错误');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      try {
        await navigator.clipboard.writeText(generatedContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
        setError('复制失败，请手动复制内容');
      }
    }
  };

  const handleSaveAsTemplate = () => {
    if (generatedContent) {
      const templateName = prompt('请输入模板名称:', `${copywritingTypes.find(t => t.id === selectedType)?.label || '自定义'}模板_${new Date().toLocaleDateString()}`);

      if (!templateName) return;

      // 创建统一模板格式
      const template = {
        id: `template_${Date.now()}`,
        name: templateName,
        type: 'copywriting' as const,
        category: selectedType as any,
        content: {
          prompt: generatedContent,
          systemPrompt: `你是一个专业的私域运营文案专家，擅长撰写各种类型的营销文案。请根据用户需求生成高质量、有吸引力的文案内容。`,
          variables: [],
          examples: [generatedContent]
        },
        metadata: {
          description: `基于${copywritingTypes.find(t => t.id === selectedType)?.label || '自定义'}类型生成的模板`,
          tags: [selectedType, selectedStyle, '文案生成'],
          difficulty: 'beginner' as const,
          estimatedTime: 5,
          targetAudience: targetAudience ? [targetAudience] : [],
          language: 'zh-CN' as const
        },
        usage: {
          useCount: 0,
          rating: 5,
          feedback: [],
          successRate: 100
        },
        isBuiltIn: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        storageService.saveUnifiedTemplate(template);
        alert('模板保存成功！您可以在模板管理中查看和使用。');
      } catch (error) {
        console.error('保存模板失败:', error);
        alert('模板保存失败，请重试。');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">智能文案生成</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">AI驱动的个性化文案创作工具</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">高级设置</span>
            {showAdvancedSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Copywriting Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">文案类型</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {copywritingTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className={`font-medium text-xs sm:text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'} leading-tight`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Writing Style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">文案风格</h3>
            <div className="space-y-2 sm:space-y-3">
              {writingStyles.map((style) => (
                <label key={style.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={selectedStyle === style.id}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{style.label}</div>
                    <div className="text-xs text-gray-500 leading-tight">{style.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters - Collapsible on mobile */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ${!showAdvancedSettings ? 'hidden sm:block' : ''}`}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">参数设置</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文案长度</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="short">短文案 (50-100字)</option>
                  <option value="medium">中等长度 (100-200字)</option>
                  <option value="long">长文案 (200+字)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标用户</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => {
                    setTargetAudience(e.target.value);
                    clearValidationError('targetAudience');
                  }}
                  placeholder="例：25-35岁职场女性"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.targetAudience ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.targetAudience && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.targetAudience}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">产品信息</label>
                  <span className={`text-xs ${productInfo.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {productInfo.length}/500
                  </span>
                </div>
                <textarea
                  value={productInfo}
                  onChange={(e) => {
                    setProductInfo(e.target.value);
                    clearValidationError('productInfo');
                  }}
                  placeholder="输入产品或服务的详细信息"
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.productInfo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.productInfo && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.productInfo}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">关键要点</label>
                  <span className={`text-xs ${keyPoints.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                    {keyPoints.length}/300
                  </span>
                </div>
                <textarea
                  value={keyPoints}
                  onChange={(e) => {
                    setKeyPoints(e.target.value);
                    clearValidationError('keyPoints');
                  }}
                  placeholder="每行一个要点，例如：&#10;高性价比&#10;快速发货&#10;优质服务"
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.keyPoints ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.keyPoints && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.keyPoints}</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">包含表情符号</span>
                </label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">特殊要求</label>
                  <span className={`text-xs ${customRequirements.length > 150 ? 'text-red-500' : 'text-gray-500'}`}>
                    {customRequirements.length}/200
                  </span>
                </div>
                <textarea
                  value={customRequirements}
                  onChange={(e) => {
                    setCustomRequirements(e.target.value);
                    clearValidationError('customRequirements');
                  }}
                  placeholder="其他特殊要求或注意事项"
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.customRequirements ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.customRequirements && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.customRequirements}</p>
                )}
              </div>
            </div>
          </div>

          {/* API状态提醒 */}
          {!apiConfigured && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm text-orange-700">请先在系统设置中配置AI API</span>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !apiConfigured}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>AI创作中...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>开始生成</span>
              </>
            )}
          </button>
        </div>

        {/* Generation Results */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Preview Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">生成结果</h3>
              {generatedContent && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                      copySuccess
                        ? 'text-green-600 bg-green-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copySuccess ? '已复制' : '复制'}</span>
                  </button>
                  <button
                    onClick={handleSaveAsTemplate}
                    className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">保存模板</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">重新生成</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* 错误提示 */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="min-h-48 sm:min-h-64 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32 sm:h-40">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">AI正在为您精心创作...</p>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600">生成结果</span>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">生成成功</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {generatedContent}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 sm:h-40">
                  <div className="text-center">
                    <Wand2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">
                      {apiConfigured ? '选择文案类型和参数，点击生成开始创作' : '请先配置AI API后开始使用'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">快速模板</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: '限时优惠模板', desc: '营造紧迫感，促进转化', usage: 234 },
                { title: '新品发布模板', desc: '突出产品亮点和价值', usage: 189 },
                { title: '用户好评模板', desc: '社会证明，建立信任', usage: 156 },
                { title: '活动邀请模板', desc: '增强参与感和期待感', usage: 142 },
              ].map((template, index) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{template.title}</h4>
                    <span className="text-xs text-gray-500">{template.usage}人使用</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{template.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingGenerator;