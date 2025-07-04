import { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { 
  CopywritingType, 
  WritingStyle, 
  GenerationParams, 
  BusinessContext,
  CopywritingHistory,
  CopywritingFilters,
  CopywritingStats
} from '../types/copywriting';

const defaultFilters: CopywritingFilters = {
  searchTerm: '',
  selectedType: 'all',
  selectedStyle: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function useCopywriting() {
  const [history, setHistory] = useState<CopywritingHistory[]>([]);
  const [filters, setFilters] = useState<CopywritingFilters>(defaultFilters);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfigured, setApiConfigured] = useState(false);

  // 检查API配置
  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  // 加载生成历史
  const loadHistory = () => {
    try {
      const savedHistory = storageService.getGenerationHistory();
      setHistory(savedHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  // 过滤和排序后的历史记录
  const filteredHistory = useMemo(() => {
    let filtered = history;

    // 按类型筛选
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(record => record.type === filters.selectedType);
    }

    // 按风格筛选
    if (filters.selectedStyle !== 'all') {
      filtered = filtered.filter(record => record.style === filters.selectedStyle);
    }

    // 按搜索词筛选
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.result.toLowerCase().includes(searchLower) ||
        record.parameters.productInfo?.toLowerCase().includes(searchLower) ||
        record.parameters.targetAudience?.toLowerCase().includes(searchLower)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (filters.sortBy) {
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'style':
          aValue = a.style;
          bValue = b.style;
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
  }, [history, filters]);

  // 统计信息
  const stats = useMemo((): CopywritingStats => {
    const totalGenerations = history.length;
    const totalTypes = new Set(history.map(h => h.type)).size;
    const totalStyles = new Set(history.map(h => h.style)).size;
    const recentGenerations = history.filter(h => {
      const daysDiff = (Date.now() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      totalGenerations,
      totalTypes,
      totalStyles,
      recentGenerations
    };
  }, [history]);

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<CopywritingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // 生成文案
  const generateCopywriting = async (params: GenerationParams): Promise<string> => {
    if (!apiConfigured) {
      throw new Error('请先在系统设置中配置AI API');
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 获取业务上下文
      const businessContext = storageService.getBusinessContext();

      // 生成提示词
      const prompt = generatePrompt(params, businessContext);

      // 调用API生成内容
      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的私域运营文案专家，擅长撰写各种类型的营销文案。请根据用户需求生成高质量、有吸引力的文案内容。`,
        maxTokens: 1000,
        temperature: 0.7
      });

      if (response.success && response.content) {
        // 保存生成历史
        const historyRecord: CopywritingHistory = {
          id: `gen_${Date.now()}`,
          type: params.type,
          style: params.style,
          prompt,
          result: response.content,
          apiConfig: storageService.getActiveApiId() || '',
          createdAt: new Date().toISOString(),
          parameters: params
        };

        storageService.saveGenerationHistory(historyRecord);
        loadHistory(); // 重新加载历史

        return response.content;
      } else {
        throw new Error(response.error || '生成失败，请重试');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成过程中发生错误';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成提示词
  const generatePrompt = (params: GenerationParams, businessContext?: BusinessContext): string => {
    let prompt = `请生成一个${params.length || 'medium'}长度的${getTypeLabel(params.type)}文案。\n\n`;

    // 添加业务上下文
    if (businessContext) {
      prompt += `品牌信息：\n`;
      if (businessContext.brandName) prompt += `- 品牌名称：${businessContext.brandName}\n`;
      if (businessContext.productName) prompt += `- 产品名称：${businessContext.productName}\n`;
      if (businessContext.productDescription) prompt += `- 产品描述：${businessContext.productDescription}\n`;
      if (businessContext.targetAudience) prompt += `- 目标用户：${businessContext.targetAudience}\n`;
      if (businessContext.brandPersonality) prompt += `- 品牌个性：${businessContext.brandPersonality}\n`;
      if (businessContext.keyBenefits?.length) {
        prompt += `- 核心优势：${businessContext.keyBenefits.join('、')}\n`;
      }
      if (businessContext.priceRange) prompt += `- 价格范围：${businessContext.priceRange}\n`;
      prompt += '\n';
    }

    // 添加生成参数
    if (params.productInfo) {
      prompt += `产品/活动信息：${params.productInfo}\n\n`;
    }

    if (params.targetAudience) {
      prompt += `目标用户：${params.targetAudience}\n\n`;
    }

    if (params.keyPoints?.length) {
      prompt += `关键要点：\n${params.keyPoints.map(point => `- ${point}`).join('\n')}\n\n`;
    }

    prompt += `写作要求：\n`;
    prompt += `- 风格：${getStyleLabel(params.style)}\n`;
    prompt += `- 长度：${getLengthLabel(params.length)}\n`;
    if (params.includeEmoji) prompt += `- 包含表情符号\n`;
    if (params.includeHashtags) prompt += `- 包含话题标签\n`;
    if (params.customRequirements) {
      prompt += `- 特殊要求：${params.customRequirements}\n`;
    }

    return prompt;
  };

  // 获取类型标签
  const getTypeLabel = (type: CopywritingType): string => {
    const labels: Record<CopywritingType, string> = {
      welcome: '欢迎语',
      product: '产品推广',
      social: '朋友圈分享',
      activity: '活动营销',
      promotion: '促销文案',
      education: '教育内容'
    };
    return labels[type];
  };

  // 获取风格标签
  const getStyleLabel = (style: WritingStyle): string => {
    const labels: Record<WritingStyle, string> = {
      professional: '专业正式',
      friendly: '亲切温暖',
      humorous: '幽默风趣',
      urgent: '紧迫感',
      emotional: '情感化',
      casual: '轻松随意'
    };
    return labels[style];
  };

  // 获取长度标签
  const getLengthLabel = (length?: 'short' | 'medium' | 'long'): string => {
    const labels = {
      short: '简短',
      medium: '中等',
      long: '详细'
    };
    return labels[length || 'medium'];
  };

  // 删除历史记录
  const deleteHistory = (id: string) => {
    try {
      storageService.deleteGenerationHistory(id);
      loadHistory();
    } catch (error) {
      console.error('Failed to delete history:', error);
    }
  };

  // 复制文案
  const copyContent = async (content: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.error('Failed to copy content:', err);
      return false;
    }
  };

  // 初始化
  useEffect(() => {
    checkApiConfiguration();
    loadHistory();
  }, []);

  return {
    history: filteredHistory,
    stats,
    filters,
    isGenerating,
    error,
    apiConfigured,
    updateFilters,
    resetFilters,
    generateCopywriting,
    deleteHistory,
    copyContent,
    getTypeLabel,
    getStyleLabel,
    getLengthLabel
  };
} 