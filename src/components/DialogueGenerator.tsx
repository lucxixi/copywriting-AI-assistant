import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  AlertCircle,
  Loader,
  Copy,
  ShoppingBag,
  Wand2,
  CheckCircle
} from 'lucide-react';
import {
  ProductAnalysisResult
} from '../types/prompts';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import CharacterEditor, { Character } from './shared/CharacterEditor';
import SceneSelector, { Scene } from './shared/SceneSelector';
import PainPointManager, { PainPoint } from './shared/PainPointManager';

const DialogueGenerator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysisResult | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductAnalysisResult[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [customScenes, setCustomScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [productInfo, setProductInfo] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogueStory, setDialogueStory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    loadAvailableProducts();
    checkApiConfiguration();
    initializeDefaultCharacters();
    loadCustomScenes();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const initializeDefaultCharacters = () => {
    const defaultCharacters: Character[] = [
      {
        id: 'char_1',
        name: '小李',
        role: 'customer',
        personality: '有明确痛点的用户，关注产品实用性',
        isPreset: true
      },
      {
        id: 'char_2',
        name: '小王',
        role: 'friend',
        personality: '关心朋友的人，乐于分享经验',
        isPreset: true
      }
    ];
    setCharacters(defaultCharacters);
  };

  const loadAvailableProducts = () => {
    const products = storageService.getProductAnalyses();
    setAvailableProducts(products);
  };

  const loadCustomScenes = () => {
    // 从本地存储加载自定义场景
    const savedScenes = localStorage.getItem('dialogue_custom_scenes');
    if (savedScenes) {
      try {
        const scenes = JSON.parse(savedScenes);
        setCustomScenes(scenes);
      } catch (error) {
        console.error('Failed to load custom scenes:', error);
      }
    }
  };

  const saveCustomScenes = (scenes: Scene[]) => {
    try {
      localStorage.setItem('dialogue_custom_scenes', JSON.stringify(scenes));
      setCustomScenes(scenes);
    } catch (error) {
      console.error('Failed to save custom scenes:', error);
    }
  };

  const handleCustomSceneCreate = (scene: Scene) => {
    const updatedScenes = [...customScenes, scene];
    saveCustomScenes(updatedScenes);
  };

  const handleCustomSceneEdit = (scene: Scene) => {
    const updatedScenes = customScenes.map(s => s.id === scene.id ? scene : s);
    saveCustomScenes(updatedScenes);
  };

  const handleCustomSceneDelete = (sceneId: string) => {
    const updatedScenes = customScenes.filter(s => s.id !== sceneId);
    saveCustomScenes(updatedScenes);

    // 如果删除的是当前选中的场景，清空选择
    if (selectedScene?.id === sceneId) {
      setSelectedScene(null);
    }
  };

  const handleProductSelect = (product: ProductAnalysisResult) => {
    setSelectedProduct(product);
    setProductInfo(product.product?.description || '');

    // 自动填充痛点
    if (product.painPoints && product.painPoints.length > 0) {
      const productPainPoints: PainPoint[] = product.painPoints.map((point, index) => ({
        id: `pain_${index}`,
        title: point,
        description: `来自产品分析的痛点：${point}`,
        severity: 'medium' as const,
        category: '产品需求',
        targetAudience: [product.product?.targetAudience || '通用用户']
      }));
      setPainPoints(productPainPoints);
    }

    setShowProductSelector(false);
  };

  const handleGenerate = async () => {
    if (!apiConfigured) {
      setError('请先在系统设置中配置AI API');
      return;
    }

    if (!selectedProduct && !productInfo.trim()) {
      setError('请选择产品或输入产品信息');
      return;
    }

    if (painPoints.length === 0) {
      setError('请至少添加一个痛点');
      return;
    }

    if (!selectedScene) {
      setError('请选择对话场景');
      return;
    }

    if (characters.length < 2) {
      setError('至少需要2个角色才能生成对话');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = generateDialoguePrompt();

      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的对话创作专家，擅长创作真实自然的对话故事。请根据产品信息和用户痛点，创作一个引人入胜的对话故事，突出产品价值。`,
        maxTokens: 2000,
        temperature: 0.8
      });

      if (response.success && response.content) {
        setDialogueStory(response.content);

        // 保存生成历史
        const historyRecord = {
          id: `dialogue_${Date.now()}`,
          type: 'dialogue',
          style: 'story',
          prompt,
          result: response.content,
          apiConfig: storageService.getActiveApiId(),
          createdAt: new Date().toISOString(),
          parameters: {
            scene: selectedScene.name,
            characters: characters.map(c => c.name),
            painPoints: painPoints.map(p => p.title),
            product: selectedProduct?.product?.name || '自定义产品'
          }
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

  const generateDialoguePrompt = (): string => {
    const productName = selectedProduct?.product?.name || '产品';
    const productDesc = selectedProduct?.product?.description || productInfo;

    return `请为以下产品创作一个对话故事：

产品信息：
- 产品名称：${productName}
- 产品描述：${productDesc}
- 目标用户：${selectedProduct?.product?.targetAudience || '通用用户'}

对话场景：
- 场景名称：${selectedScene?.name}
- 场景描述：${selectedScene?.description}
- 场景背景：${selectedScene?.context}

角色设置：
${characters.map((char, index) =>
  `${index + 1}. ${char.name}（${char.role}）：${char.personality}`
).join('\n')}

用户痛点：
${painPoints.map((point, index) =>
  `${index + 1}. ${point.title}：${point.description}（严重程度：${point.severity}）`
).join('\n')}

特殊要求：
${customRequirements || '无'}

请创作一个自然流畅的对话，要求：
1. 对话要真实自然，符合各角色的性格特点
2. 巧妙地融入产品信息，不要过于生硬
3. 通过对话展现用户痛点，并展示产品如何解决这些痛点
4. 对话长度适中，大约8-12轮对话
5. 每轮对话请标明说话人姓名

请按以下格式输出：
[角色名称]：[对话内容]
[角色名称]：[对话内容]
...`;
  };

  const handleCopy = async () => {
    if (dialogueStory) {
      try {
        await navigator.clipboard.writeText(dialogueStory);
        // 可以添加成功提示
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const clearForm = () => {
    setSelectedProduct(null);
    setProductInfo('');
    setPainPoints([]);
    setDialogueStory('');
    setError('');
    setCustomRequirements('');
    initializeDefaultCharacters();
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 bg-gray-50">
      {/* Left Panel - Input */}
      <div className="lg:w-1/2 space-y-6">
        {/* API Status */}
        {!apiConfigured && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <span className="text-sm text-orange-700">请先在系统设置中配置AI API</span>
            </div>
          </div>
        )}

        {/* Product Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">产品信息</h3>
            </div>
            <button
              onClick={() => setShowProductSelector(!showProductSelector)}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              选择已分析产品
            </button>
          </div>

          {selectedProduct ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900">{selectedProduct.product?.name}</h4>
              <p className="text-sm text-blue-700 mt-1">{selectedProduct.product?.description}</p>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                取消选择
              </button>
            </div>
          ) : (
            <textarea
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              placeholder="请输入产品信息，包括产品名称、功能特点、目标用户等..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          )}

          {showProductSelector && availableProducts.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
              {availableProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{product.product?.name}</div>
                  <div className="text-sm text-gray-600 truncate">{product.product?.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scene Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SceneSelector
            selectedScene={selectedScene}
            onSceneChange={setSelectedScene}
            customScenes={customScenes}
            allowCustom={true}
            onCustomSceneCreate={handleCustomSceneCreate}
            onCustomSceneEdit={handleCustomSceneEdit}
            onCustomSceneDelete={handleCustomSceneDelete}
          />
        </div>

        {/* Character Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CharacterEditor
            characters={characters}
            onCharactersChange={setCharacters}
            maxCharacters={5}
          />
        </div>

        {/* Pain Points Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <PainPointManager
            painPoints={painPoints}
            onPainPointsChange={setPainPoints}
            maxPainPoints={8}
          />
        </div>

        {/* Custom Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">特殊要求</h3>
          <textarea
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder="输入任何特殊要求或注意事项..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Generate Button */}
        <div className="flex space-x-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !apiConfigured}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>AI创作中...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>生成对话故事</span>
              </>
            )}
          </button>

          <button
            onClick={clearForm}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            清空
          </button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:w-1/2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">生成结果</h3>
            {dialogueStory && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制</span>
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>重新生成</span>
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Content Display */}
          <div className="min-h-96 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
            {isGenerating ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <p className="text-gray-600">AI正在创作对话故事...</p>
                </div>
              </div>
            ) : dialogueStory ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">生成成功</span>
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {dialogueStory}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {apiConfigured ? '配置参数后点击生成开始创作' : '请先配置AI API后开始使用'}
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

export default DialogueGenerator;