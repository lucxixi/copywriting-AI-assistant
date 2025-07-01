import React, { useState } from 'react';
import {
  Camera,
  ShoppingBag,
  AlertCircle,
  Loader,
  Copy,
  Download,
  CheckCircle,
  RefreshCw,
  Save,
  FileText
} from 'lucide-react';
import { ProductInfo, ProductAnalysisResult } from '../types/prompts';
import { apiService } from '../services/api';
import { promptService } from '../services/prompts';
import { storageService } from '../services/storage';

const ProductAnalyzer: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!productInfo.trim()) {
      errors.productInfo = '请输入产品描述信息';
    } else if (productInfo.length < 10) {
      errors.productInfo = '产品描述至少需要10个字符';
    } else if (productInfo.length > 2000) {
      errors.productInfo = '产品描述不能超过2000字符';
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    setUploadedImage(file);
    setError('');

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 模拟OCR文字提取（实际项目中需要调用OCR API）
    simulateOCR(file);
  };

  const simulateOCR = async (file: File) => {
    // 这里应该调用真实的OCR API，比如Google Vision API
    // 目前使用模拟数据
    setTimeout(() => {
      setExtractedText('模拟从图片中提取的文字信息...');
    }, 1000);
  };

  const handleAnalyze = async () => {
    if (!apiConfigured) {
      setError('请先在系统设置中配置AI API');
      return;
    }

    // 表单验证
    if (!validateForm()) {
      setError('请检查并修正表单中的错误');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setValidationErrors({});

    try {
      const prompt = promptService.generateProductAnalysisPrompt(productInfo, extractedText);
      
      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的产品分析专家，擅长分析产品信息并生成营销文案。请严格按照要求的格式输出分析结果，确保所有信息都基于提供的内容，不要虚构功能。`,
        maxTokens: 2000,
        temperature: 0.3
      });

      if (response.success && response.content) {
        // 解析AI返回的分析结果
        const parsedResult = parseAnalysisResult(response.content);
        setAnalysisResult(parsedResult);
        
        // 自动归档到产品管理
        storageService.saveProductAnalysis(parsedResult);

        // 显示成功状态
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(response.error || '分析失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中发生错误');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAnalysisResult = (content: string): ProductAnalysisResult => {
    try {
      // 尝试解析JSON格式的返回
      const parsed = JSON.parse(content);
      if (parsed.product && parsed.painPoints && parsed.marketingCopy) {
        return {
          id: `product_${Date.now()}`,
          ...parsed
        };
      }
    } catch (e) {
      // JSON解析失败，使用文本解析
    }

    // 文本解析逻辑
    const lines = content.split('\n').filter(line => line.trim());

    // 提取产品名称
    const nameMatch = content.match(/产品名称[：:]\s*(.+)/i);
    const productName = nameMatch ? nameMatch[1].trim() : '智能产品';

    // 提取目标用户
    const audienceMatch = content.match(/目标用户[：:]\s*(.+)/i);
    const targetAudience = audienceMatch ? audienceMatch[1].trim() : '广大用户';

    // 提取痛点
    const painPointsSection = content.match(/痛点[：:]?\s*\n?([\s\S]*?)(?=\n\n|\n[^\s]|$)/i);
    const painPoints = painPointsSection
      ? painPointsSection[1].split(/[,，\n]/).map(p => p.trim()).filter(p => p)
      : ['用户需求未满足', '现有解决方案不够完善'];

    // 提取卖点
    const sellingPointsSection = content.match(/卖点[：:]?\s*\n?([\s\S]*?)(?=\n\n|\n[^\s]|$)/i);
    const keySellingPoints = sellingPointsSection
      ? sellingPointsSection[1].split(/[,，\n]/).map(p => p.trim()).filter(p => p)
      : ['高性价比', '优质服务', '快速响应'];

    // 提取营销文案
    const copyMatch = content.match(/营销文案[：:]?\s*\n?([\s\S]*?)(?=\n\n|$)/i);
    const marketingCopy = copyMatch ? copyMatch[1].trim() : content.slice(0, 200) + '...';

    const product: ProductInfo = {
      name: productName,
      category: 'other',
      description: productInfo.slice(0, 100),
      features: ['智能功能', '便捷操作'],
      benefits: ['提升效率', '节省成本'],
      targetAudience,
      imageUrl: imagePreview,
      extractedText
    };

    return {
      id: `product_${Date.now()}`,
      product,
      painPoints: painPoints.slice(0, 5),
      marketingCopy,
      keySellingPoints: keySellingPoints.slice(0, 6)
    };
  };

  const handleCopyResult = async () => {
    if (!analysisResult) return;
    
    const resultText = `产品分析结果：

产品信息：
- 名称：${analysisResult.product.name}
- 类型：${analysisResult.product.category}
- 描述：${analysisResult.product.description}
- 目标用户：${analysisResult.product.targetAudience}

用户痛点：${analysisResult.painPoints.join('、')}

关键卖点：${analysisResult.keySellingPoints.join('、')}

营销文案：
${analysisResult.marketingCopy}`;

    try {
      await navigator.clipboard.writeText(resultText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      setError('复制失败，请手动复制内容');
    }
  };

  const handleSaveAsTemplate = () => {
    if (!analysisResult) return;
    
    // 将分析结果保存为模板
    const template = {
      id: `product_template_${Date.now()}`,
      name: `产品分析模板_${new Date().toLocaleDateString()}`,
      product: analysisResult.product,
      analysis: analysisResult,
      createdAt: new Date().toISOString()
    };
    
    try {
      storageService.saveProductTemplate(template);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError('模板保存失败，请重试');
    }
  };

  const clearForm = () => {
    setProductInfo('');
    setUploadedImage(null);
    setImagePreview('');
    setExtractedText('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">产品分析</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">分析产品信息，生成详细营销文案</p>
        </div>
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">已保存</span>
            </div>
          )}
          <button
            onClick={clearForm}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            清空表单
          </button>
        </div>
      </div>

      {/* API配置提示 */}
      {!apiConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">请先在系统设置中配置AI API</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 输入区域 */}
        <div className="space-y-4">
          {/* 产品信息输入 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">产品信息</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    产品描述 *
                  </label>
                  <span className={`text-xs ${productInfo.length > 1800 ? 'text-red-500' : 'text-gray-500'}`}>
                    {productInfo.length}/2000
                  </span>
                </div>
                <textarea
                  className={`w-full h-32 border rounded-lg px-3 py-2 text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.productInfo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="请详细描述产品信息，包括功能、特点、优势等..."
                  value={productInfo}
                  onChange={(e) => {
                    setProductInfo(e.target.value);
                    clearValidationError('productInfo');
                  }}
                />
                {validationErrors.productInfo && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.productInfo}</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  💡 提示：详细的产品描述有助于生成更准确的分析结果
                </div>
              </div>
            </div>
          </div>

          {/* 图片上传 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">产品图片（可选）</h3>
            
            <div className="space-y-4">
              {/* 图片上传区域 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="产品图片"
                        className="w-full max-w-xs mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-500">点击更换图片</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-gray-600">点击上传产品图片</p>
                      <p className="text-sm text-gray-500">支持 JPG、PNG 格式</p>
                    </div>
                  )}
                </label>
              </div>

              {/* 提取的文字 */}
              {extractedText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    从图片中提取的文字
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {extractedText}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !productInfo.trim() || !apiConfigured}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>AI正在分析产品信息...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>开始分析</span>
              </>
            )}
          </button>
        </div>

        {/* 分析结果 */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">分析结果</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyResult}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                      copySuccess
                        ? 'text-green-600 bg-green-100'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="复制结果"
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm hidden sm:inline">{copySuccess ? '已复制' : '复制'}</span>
                  </button>
                  <button
                    onClick={handleSaveAsTemplate}
                    className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="保存为模板"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">保存模板</span>
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                    title="重新分析"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">重新分析</span>
                  </button>
                </div>
              </div>

              {/* 产品基本信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">产品基本信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">产品名称</span>
                    <p className="text-sm font-medium">{analysisResult.product.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">产品类型</span>
                    <p className="text-sm font-medium">{analysisResult.product.category}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500">目标用户</span>
                    <p className="text-sm font-medium">{analysisResult.product.targetAudience}</p>
                  </div>
                </div>
              </div>

              {/* 用户痛点 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">用户痛点</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.painPoints.map((point, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关键卖点 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">关键卖点</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keySellingPoints.map((point, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              {/* 营销文案 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">营销文案</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {analysisResult.marketingCopy}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyzer; 