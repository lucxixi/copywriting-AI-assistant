import React, { useState, useEffect } from 'react';
import { CopywritingType, WritingStyle, GenerationParams } from '../types/prompts';
import { apiService } from '../services/api';
import { promptService } from '../services/prompts';
import { storageService } from '../services/storage';
import { GenerationHistory } from '../types/api';
import { useHistory } from '../hooks/useHistory';

const CopywritingGeneratorFixed: React.FC = () => {
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

  const { addRecord } = useHistory();

  useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!productInfo.trim()) {
      errors.productInfo = '请输入产品信息';
    }
    
    if (!targetAudience.trim()) {
      errors.targetAudience = '请输入目标受众';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!apiConfigured) {
      setError('请先配置API接口');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      const params: GenerationParams = {
        type: selectedType,
        style: selectedStyle,
        targetAudience,
        productInfo,
        keyPoints,
        length,
        includeEmoji,
        customRequirements
      };

      const prompt = promptService.generateCopywritingPrompt({
        copyType: selectedType,
        style: selectedStyle,
        productName: productInfo,
        coreFeatures: keyPoints,
        targetAudience,
        keyBenefits: keyPoints,
        length,
        includeEmoji,
        customRequirements
      });
      const result = await apiService.generateContent(prompt);
      
      if (result.success && result.content) {
        setGeneratedContent(result.content);
        
        // 保存到历史记录
        addRecord({
          id: `copy_${Date.now()}`,
          type: 'copywriting',
          content: result.content,
          createdAt: new Date().toISOString(),
          productName: productInfo
        });
      } else {
        setError(result.error || '生成失败，请重试');
      }
    } catch (err) {
      setError('生成过程中出现错误，请检查网络连接和API配置');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文案_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copywritingTypes = [
    { value: 'product' as CopywritingType, label: '产品介绍', icon: '📦' },
    { value: 'promotion' as CopywritingType, label: '促销活动', icon: '🎉' },
    { value: 'brand' as CopywritingType, label: '品牌宣传', icon: '🏆' },
    { value: 'social' as CopywritingType, label: '社交媒体', icon: '📱' }
  ];

  const writingStyles = [
    { value: 'professional' as WritingStyle, label: '专业正式', icon: '💼' },
    { value: 'casual' as WritingStyle, label: '轻松随意', icon: '😊' },
    { value: 'persuasive' as WritingStyle, label: '说服力强', icon: '🎯' },
    { value: 'emotional' as WritingStyle, label: '情感共鸣', icon: '❤️' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📝 文案生成</h1>
        <p className="text-gray-600 mt-1">AI智能生成营销文案，提升转化效果</p>
      </div>

      {/* API状态提示 */}
      {!apiConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <div>
              <p className="text-yellow-800 font-medium">API未配置</p>
              <p className="text-yellow-700 text-sm">请先在系统设置中配置API接口</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入区域 */}
        <div className="space-y-6">
          {/* 文案类型选择 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📋 文案类型</h3>
            <div className="grid grid-cols-2 gap-3">
              {copywritingTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 写作风格 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 写作风格</h3>
            <div className="grid grid-cols-2 gap-3">
              {writingStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{style.icon}</span>
                    <span className="text-sm font-medium">{style.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 基础信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📝 基础信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  产品信息 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  className={`w-full p-3 border rounded-lg resize-none ${
                    validationErrors.productInfo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="请详细描述您的产品特点、功能、优势等..."
                />
                {validationErrors.productInfo && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.productInfo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标受众 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    validationErrors.targetAudience ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="例如：25-35岁职场女性、中小企业主、学生群体等"
                />
                {validationErrors.targetAudience && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.targetAudience}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键卖点</label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={2}
                  placeholder="请列出产品的主要卖点和优势..."
                />
              </div>
            </div>
          </div>

          {/* 高级设置 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-medium text-gray-900">⚙️ 高级设置</h3>
              <span className="text-gray-400">
                {showAdvancedSettings ? '🔼' : '🔽'}
              </span>
            </button>
            
            {showAdvancedSettings && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文案长度</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="short">简短 (50-100字)</option>
                    <option value="medium">中等 (100-200字)</option>
                    <option value="long">详细 (200-300字)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeEmoji"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="includeEmoji" className="text-sm text-gray-700">
                    包含表情符号
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">特殊要求</label>
                  <textarea
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={2}
                    placeholder="其他特殊要求或注意事项..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !apiConfigured}
            className={`w-full py-4 rounded-lg font-medium transition-all ${
              isGenerating || !apiConfigured
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-spin">🔄</span>
                <span>生成中...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>生成文案</span>
              </div>
            )}
          </button>
        </div>

        {/* 右侧：结果区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">📄 生成结果</h3>
            {generatedContent && (
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="复制内容"
                >
                  {copySuccess ? '✅' : '📋'}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="下载文件"
                >
                  💾
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❌</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {copySuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <p className="text-green-700">内容已复制到剪贴板</p>
              </div>
            </div>
          )}

          <div className="min-h-[400px]">
            {generatedContent ? (
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <span className="text-4xl mb-4 block">📝</span>
                  <p className="text-gray-500">
                    {isGenerating ? '正在生成文案...' : '填写信息后点击生成按钮开始创作'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingGeneratorFixed;
