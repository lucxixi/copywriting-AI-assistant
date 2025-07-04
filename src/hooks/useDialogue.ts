import { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { settingsManager } from '../services/settingsManager';
import { useHistory } from './useHistory';
import { 
  DialogueCharacter, 
  DialogueScene, 
  DialoguePainPoint, 
  DialogueSettings, 
  DialogueStory,
  DialogueFilters,
  DialogueStats
} from '../types/dialogue';
import { ProductAnalysisResult } from '../types/product';

const defaultFilters: DialogueFilters = {
  searchTerm: '',
  selectedType: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function useDialogue() {
  const [characters, setCharacters] = useState<DialogueCharacter[]>([]);
  const [scenes, setScenes] = useState<DialogueScene[]>([]);
  const [painPoints, setPainPoints] = useState<DialoguePainPoint[]>([]);
  const [stories, setStories] = useState<DialogueStory[]>([]);
  const [filters, setFilters] = useState<DialogueFilters>(defaultFilters);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfigured, setApiConfigured] = useState(false);
  const { addRecord } = useHistory();

  // 初始化默认角色
  const initializeDefaultCharacters = () => {
    const defaultCharacters: DialogueCharacter[] = [
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

  // 加载自定义场景
  const loadCustomScenes = () => {
    try {
      const savedScenes = localStorage.getItem('dialogue_custom_scenes');
      if (savedScenes) {
        const scenes = JSON.parse(savedScenes);
        setScenes(prev => [...prev, ...scenes]);
      }
    } catch (error) {
      console.error('Failed to load custom scenes:', error);
    }
  };

  // 保存自定义场景
  const saveCustomScenes = (scenes: DialogueScene[]) => {
    try {
      const customScenes = scenes.filter(s => s.isCustom);
      localStorage.setItem('dialogue_custom_scenes', JSON.stringify(customScenes));
      setScenes(scenes);
    } catch (error) {
      console.error('Failed to save custom scenes:', error);
    }
  };

  // 检查API配置
  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  // 加载对话故事
  const loadStories = () => {
    try {
      const savedStories = localStorage.getItem('dialogue_stories');
      if (savedStories) {
        const stories = JSON.parse(savedStories);
        setStories(stories);
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  // 保存对话故事
  const saveStory = (story: DialogueStory) => {
    try {
      const updatedStories = [...stories, story];
      localStorage.setItem('dialogue_stories', JSON.stringify(updatedStories));
      setStories(updatedStories);
    } catch (error) {
      console.error('Failed to save story:', error);
    }
  };

  // 过滤和排序后的故事
  const filteredStories = useMemo(() => {
    let filtered = stories;

    // 按类型筛选
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(story => story.scene.type === filters.selectedType);
    }

    // 按搜索词筛选
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchLower) ||
        story.product.name.toLowerCase().includes(searchLower) ||
        story.scene.name.toLowerCase().includes(searchLower)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'type':
          aValue = a.scene.type;
          bValue = b.scene.type;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [stories, filters]);

  // 统计信息
  const stats = useMemo((): DialogueStats => {
    const totalStories = stories.length;
    const totalCharacters = characters.length;
    const totalScenes = scenes.length;
    const recentStories = stories.filter(s => {
      const daysDiff = (Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      totalStories,
      totalCharacters,
      totalScenes,
      recentStories
    };
  }, [stories, characters, scenes]);

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<DialogueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // 添加角色
  const addCharacter = (character: DialogueCharacter) => {
    setCharacters(prev => [...prev, character]);
  };

  // 更新角色
  const updateCharacter = (id: string, updates: Partial<DialogueCharacter>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // 删除角色
  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  // 添加场景
  const addScene = (scene: DialogueScene) => {
    const updatedScenes = [...scenes, scene];
    if (scene.isCustom) {
      saveCustomScenes(updatedScenes);
    } else {
      setScenes(updatedScenes);
    }
  };

  // 更新场景
  const updateScene = (id: string, updates: Partial<DialogueScene>) => {
    const updatedScenes = scenes.map(s => s.id === id ? { ...s, ...updates } : s);
    setScenes(updatedScenes);
    saveCustomScenes(updatedScenes);
  };

  // 删除场景
  const deleteScene = (id: string) => {
    const updatedScenes = scenes.filter(s => s.id !== id);
    setScenes(updatedScenes);
    saveCustomScenes(updatedScenes);
  };

  // 添加痛点
  const addPainPoint = (painPoint: DialoguePainPoint) => {
    setPainPoints(prev => [...prev, painPoint]);
  };

  // 更新痛点
  const updatePainPoint = (id: string, updates: Partial<DialoguePainPoint>) => {
    setPainPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // 删除痛点
  const deletePainPoint = (id: string) => {
    setPainPoints(prev => prev.filter(p => p.id !== id));
  };

  // 从产品分析导入痛点
  const importPainPointsFromProduct = (product: ProductAnalysisResult) => {
    if (product.painPoints && product.painPoints.length > 0) {
      const productPainPoints: DialoguePainPoint[] = product.painPoints.map((point, index) => ({
        id: `pain_${Date.now()}_${index}`,
        title: point,
        description: `来自产品分析的痛点：${point}`,
        severity: 'medium' as const,
        category: '产品需求',
        targetAudience: [product.product?.targetAudience || '通用用户']
      }));
      setPainPoints(productPainPoints);
    }
  };

  // 生成对话
  const generateDialogue = async (
    product: ProductAnalysisResult | null,
    productInfo: string,
    selectedScene: DialogueScene | null,
    settings: DialogueSettings
  ): Promise<string> => {
    if (!apiConfigured) {
      throw new Error('请先在系统设置中配置AI API');
    }

    if (!product && !productInfo.trim()) {
      throw new Error('请选择产品或输入产品信息');
    }

    if (painPoints.length === 0) {
      throw new Error('请至少添加一个痛点');
    }

    if (!selectedScene) {
      throw new Error('请选择对话场景');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = generateDialoguePrompt(product, productInfo, selectedScene, settings);
      const response = await apiService.generateContent({
        prompt,
        maxTokens: 2000,
        temperature: 0.7
      });
      
      if (!response.success) {
        throw new Error(response.error || '生成失败');
      }
      
      let content = response.content || '';
      
      // 关键词替换逻辑
      const sysSettings = settingsManager.loadSettings();
      const keywordReplacements = sysSettings.contentFilterSettings?.keywordReplacements || [];
      if (keywordReplacements.length > 0) {
        keywordReplacements.forEach(({ original, replacement }: { original: string; replacement: string }) => {
          if (original) {
            // 全词匹配，忽略大小写
            const reg = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            content = content.replace(reg, replacement);
          }
        });
      }
      
      // 保存对话故事
      const story: DialogueStory = {
        id: `story_${Date.now()}`,
        title: `${product?.product.name || '自定义产品'} - ${selectedScene.name}`,
        product: {
          name: product?.product.name || '自定义产品',
          description: product?.product.description || productInfo,
          targetAudience: product?.product.targetAudience || '通用用户'
        },
        characters,
        scene: selectedScene,
        painPoints,
        settings,
        dialogue: parseDialogueResponse(content),
        createdAt: new Date().toISOString()
      };

      // 保存到历史记录
      addRecord({
        id: `dialogue_${Date.now()}`,
        type: 'dialogue',
        content,
        createdAt: new Date().toISOString(),
        productName: product?.product?.name || productInfo || ''
      });

      saveStory(story);
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成对话失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成对话提示词
  const generateDialoguePrompt = (
    product: ProductAnalysisResult | null,
    productInfo: string,
    selectedScene: DialogueScene,
    settings: DialogueSettings
  ): string => {
    const productName = product?.product.name || '产品';
    const productDesc = product?.product.description || productInfo;
    const targetAudience = product?.product.targetAudience || '通用用户';

    return `请根据以下信息生成一个${settings.length}长度的对话故事：

产品信息：
- 产品名称：${productName}
- 产品描述：${productDesc}
- 目标用户：${targetAudience}

对话场景：${selectedScene.name}
场景描述：${selectedScene.description}
场景类型：${selectedScene.type}

角色信息：
${characters.map(char => `- ${char.name}（${char.role}）：${char.personality}`).join('\n')}

用户痛点：
${painPoints.map(point => `- ${point.title}：${point.description}`).join('\n')}

对话要求：
- 风格：${settings.style}
- 语调：${settings.tone}
- 包含情感：${settings.includeEmotions ? '是' : '否'}
- 自定义要求：${settings.customRequirements || '无'}

请生成一个自然、有说服力的对话，展示产品如何解决用户痛点。`;
  };

  // 解析对话响应
  const parseDialogueResponse = (response: string): { characterId: string; characterName: string; content: string }[] => {
    // 这里可以根据实际响应格式进行解析
    // 暂时返回简单的格式
    return [{
      characterId: 'narrator',
      characterName: '旁白',
      content: response
    }];
  };

  // 初始化
  useEffect(() => {
    checkApiConfiguration();
    initializeDefaultCharacters();
    loadCustomScenes();
    loadStories();
  }, []);

  return {
    characters,
    scenes,
    painPoints,
    stories: filteredStories,
    stats,
    filters,
    isGenerating,
    error,
    apiConfigured,
    updateFilters,
    resetFilters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addScene,
    updateScene,
    deleteScene,
    addPainPoint,
    updatePainPoint,
    deletePainPoint,
    importPainPointsFromProduct,
    generateDialogue
  };
} 