import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  AlertCircle,
  Loader,
  Wand2,
  ShoppingBag
} from 'lucide-react';
import {
  ProductAnalysisResult
} from '../types/prompts';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import CharacterEditor, { Character } from './shared/CharacterEditor';
import SceneSelector, { Scene } from './shared/SceneSelector';
import PainPointManager, { PainPoint } from './shared/PainPointManager';
import DialogueDisplay from './shared/DialogueDisplay';

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
  const [dialogueStyle, setDialogueStyle] = useState('natural');
  const [dialogueLength, setDialogueLength] = useState('medium');
  const [dialogueTone, setDialogueTone] = useState('friendly');
  const [includeEmotions, setIncludeEmotions] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogueStory, setDialogueStory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState(false);

  // 添加调试日志
  console.log('DialogueGenerator rendering...', {
    selectedScene,
    characters: characters.length,
    painPoints: painPoints.length,
    apiConfigured
  });

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

    // 风格映射
    const styleMap = {
      natural: '自然真实',
      formal: '正式专业',
      casual: '轻松随意',
      humorous: '幽默风趣',
      emotional: '情感丰富'
    };

    // 长度映射
    const lengthMap = {
      short: { words: '200-300字', rounds: '4-6轮对话' },
      medium: { words: '400-600字', rounds: '8-12轮对话' },
      long: { words: '700-1000字', rounds: '15-20轮对话' }
    };

    // 语调映射
    const toneMap = {
      friendly: '友好亲切',
      professional: '专业严谨',
      enthusiastic: '热情积极',
      calm: '平和理性',
      persuasive: '说服力强'
    };

    const currentLength = lengthMap[dialogueLength as keyof typeof lengthMap];
    const currentStyle = styleMap[dialogueStyle as keyof typeof styleMap];
    const currentTone = toneMap[dialogueTone as keyof typeof toneMap];

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

对话风格要求：
- 整体风格：${currentStyle}
- 语调特点：${currentTone}
- 对话长度：${currentLength.words}（${currentLength.rounds}）
${includeEmotions ? '- 包含情感表达：适当添加情感描述和动作描述' : '- 纯对话形式：只包含对话内容，不添加情感描述'}

特殊要求：
${customRequirements || '无'}

请创作一个自然流畅的对话，要求：
1. 严格按照指定的风格和语调进行创作
2. 对话要真实自然，符合各角色的性格特点
3. 巧妙地融入产品信息，不要过于生硬
4. 通过对话展现用户痛点，并展示产品如何解决这些痛点
5. 控制在指定的对话长度范围内
6. 每轮对话请标明说话人姓名
${includeEmotions ? '7. 适当添加情感描述，如：（微笑）、（思考）、（惊喜）等' : '7. 只输出纯对话内容'}

请按以下格式输出：
[角色名称]：[对话内容]${includeEmotions ? '（情感描述）' : ''}
[角色名称]：[对话内容]${includeEmotions ? '（情感描述）' : ''}
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

  const handleSaveAsTemplate = () => {
    if (dialogueStory) {
      const templateName = prompt('请输入模板名称:', `对话故事模板_${new Date().toLocaleDateString()}`);

      if (!templateName) return;

      // 创建统一模板格式
      const template = {
        id: `template_${Date.now()}`,
        name: templateName,
        type: 'dialogue' as const,
        category: 'story' as const,
        content: {
          prompt: dialogueStory,
          systemPrompt: `你是一个专业的对话创作专家，擅长创作真实自然的对话故事。请根据产品信息和用户痛点，创作一个引人入胜的对话故事，突出产品价值。`,
          variables: [],
          examples: [dialogueStory],
          structure: {
            scene: selectedScene?.name || '',
            characters: characters.map(c => ({ name: c.name, role: c.role, personality: c.personality })),
            painPoints: painPoints.map(p => ({ title: p.title, description: p.description }))
          }
        },
        metadata: {
          description: `基于${selectedScene?.name || '自定义场景'}的对话故事模板`,
          tags: ['对话故事', selectedScene?.name || '自定义', '营销'],
          difficulty: 'intermediate' as const,
          estimatedTime: 10,
          targetAudience: ['营销人员', '内容创作者'],
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
    <div className="h-full flex flex-col lg:flex-row gap-8 p-6 bg-gray-50">
      {/* Left Panel - Input */}
      <div className="lg:w-1/2 space-y-6 max-h-full overflow-y-auto">
        {/* API Status */}
        {!apiConfigured && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">API未配置</p>
                <p className="text-xs text-orange-600">请先在系统设置中配置AI API</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">产品信息</h3>
                <p className="text-xs text-gray-500">选择或输入产品详情</p>
              </div>
            </div>
            <button
              onClick={() => setShowProductSelector(!showProductSelector)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-sm"
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
            productInfo={selectedProduct?.product?.description || productInfo}
            productName={selectedProduct?.product?.name || '自定义产品'}
            enableAIGeneration={true}
          />
        </div>

        {/* Dialogue Style Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎭</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">对话风格设置</h3>
              <p className="text-xs text-gray-500">自定义对话的风格和特点</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 对话风格 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">对话风格</label>
              <select
                value={dialogueStyle}
                onChange={(e) => setDialogueStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
                <option value="natural">🌿 自然真实</option>
                <option value="formal">👔 正式专业</option>
                <option value="casual">😊 轻松随意</option>
                <option value="humorous">😄 幽默风趣</option>
                <option value="emotional">💝 情感丰富</option>
              </select>
            </div>

            {/* 对话长度 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">对话长度</label>
              <select
                value={dialogueLength}
                onChange={(e) => setDialogueLength(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
                <option value="short">📝 简短（4-6轮对话）</option>
                <option value="medium">📄 中等（8-12轮对话）</option>
                <option value="long">📚 详细（15-20轮对话）</option>
              </select>
            </div>

            {/* 语调特点 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">语调特点</label>
              <select
                value={dialogueTone}
                onChange={(e) => setDialogueTone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
                <option value="friendly">🤝 友好亲切</option>
                <option value="professional">💼 专业严谨</option>
                <option value="enthusiastic">🔥 热情积极</option>
                <option value="calm">🧘 平和理性</option>
                <option value="persuasive">💪 说服力强</option>
              </select>
            </div>

            {/* 情感表达 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">表达方式</label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="emotions"
                    checked={includeEmotions}
                    onChange={() => setIncludeEmotions(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">💭 包含情感描述</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="emotions"
                    checked={!includeEmotions}
                    onChange={() => setIncludeEmotions(false)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">💬 纯对话形式</span>
                </label>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  {includeEmotions ? '✨ 将添加（微笑）、（思考）等情感描述，让对话更生动' : '📝 只输出对话内容，不包含动作描述，更简洁'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Requirements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">特殊要求</h3>
              <p className="text-xs text-gray-500">添加个性化需求和注意事项</p>
            </div>
          </div>
          <textarea
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder="输入任何特殊要求或注意事项..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Generate Button */}
        <div className="flex space-x-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !apiConfigured}
            className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
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
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium hover:shadow-md"
          >
            清空
          </button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">生成结果</h3>
                <p className="text-xs text-gray-500">AI创作的对话内容</p>
              </div>
            </div>
            {dialogueStory && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 text-sm font-medium shadow-sm"
              >
                <Wand2 className="w-4 h-4" />
                <span>重新生成</span>
              </button>
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
          <div className="flex-1 min-h-0">
            {isGenerating ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-200 h-full">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MessageSquare className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">AI正在创作对话故事</h4>
                    <p className="text-gray-600 mb-6">请稍候，正在为您生成精彩的对话内容...</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : dialogueStory ? (
              <DialogueDisplay
                dialogue={dialogueStory}
                characters={characters}
                onCopy={handleCopy}
                onSaveAsTemplate={handleSaveAsTemplate}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-dashed border-gray-300 h-full">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">准备开始创作</h4>
                    <p className="text-gray-500 max-w-sm">
                      {apiConfigured ? '配置好参数后，点击生成按钮开始AI创作' : '请先在系统设置中配置AI API'}
                    </p>
                    {!apiConfigured && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          需要配置API
                        </span>
                      </div>
                    )}
                  </div>
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