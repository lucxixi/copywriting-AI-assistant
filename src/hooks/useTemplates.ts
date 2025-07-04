import { useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storage';
import { 
  UnifiedTemplate, 
  TemplateFilters, 
  TemplateFormData, 
  TemplateStats
} from '../types/unified-template';

const defaultFilters: TemplateFilters = {
  searchTerm: '',
  selectedType: 'all',
  selectedCategory: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function useTemplates() {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [filters, setFilters] = useState<TemplateFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载模板数据
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedTemplates = storageService.getUnifiedTemplates();
      setTemplates(savedTemplates);
    } catch (err) {
      setError('加载模板失败');
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤和排序后的模板
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // 按类型筛选
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(template => template.type === filters.selectedType);
    }

    // 按分类筛选
    if (filters.selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === filters.selectedCategory);
    }

    // 按搜索词筛选
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.metadata.description.toLowerCase().includes(searchLower) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (filters.sortBy) {
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

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [templates, filters]);

  // 统计信息
  const stats = useMemo((): TemplateStats => {
    const totalTemplates = templates.length;
    const totalUsage = templates.reduce((sum, t) => sum + t.usage.useCount, 0);
    const averageRating = totalTemplates > 0 
      ? templates.reduce((sum, t) => sum + t.usage.rating, 0) / totalTemplates
      : 0;
    const activeTemplates = templates.filter(t => t.isActive).length;

    return {
      totalTemplates,
      totalUsage,
      averageRating,
      activeTemplates
    };
  }, [templates]);

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // 创建模板
  const createTemplate = async (formData: TemplateFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const newTemplate: UnifiedTemplate = {
        id: `template_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        category: formData.category,
        content: formData.content,
        metadata: formData.metadata,
        usage: {
          useCount: 0,
          rating: 5,
          feedback: [],
          successRate: 100
        },
        isBuiltIn: false,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storageService.saveUnifiedTemplate(newTemplate);
      await loadTemplates();
      return newTemplate;
    } catch (err) {
      setError('创建模板失败');
      console.error('Failed to create template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新模板
  const updateTemplate = async (id: string, formData: TemplateFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const existingTemplate = templates.find(t => t.id === id);
      if (!existingTemplate) {
        throw new Error('模板不存在');
      }

      const updatedTemplate: UnifiedTemplate = {
        ...existingTemplate,
        name: formData.name,
        type: formData.type,
        category: formData.category,
        content: formData.content,
        metadata: formData.metadata,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      };

      storageService.saveUnifiedTemplate(updatedTemplate);
      await loadTemplates();
      return updatedTemplate;
    } catch (err) {
      setError('更新模板失败');
      console.error('Failed to update template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 删除模板
  const deleteTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      storageService.deleteUnifiedTemplate(id);
      await loadTemplates();
    } catch (err) {
      setError('删除模板失败');
      console.error('Failed to delete template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 使用模板（激活）
  const activateTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const templateToUse = templates.find(t => t.id === id);
      if (!templateToUse) {
        throw new Error('模板不存在');
      }

      const updatedTemplate: UnifiedTemplate = {
        ...templateToUse,
        usage: {
          ...templateToUse.usage,
          useCount: templateToUse.usage.useCount + 1,
          lastUsed: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };

      storageService.saveUnifiedTemplate(updatedTemplate);
      await loadTemplates(); // 重新加载以更新计数和列表
      return updatedTemplate;
    } catch (err) {
      setError('使用模板失败');
      console.error('Failed to use template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates: filteredTemplates,
    stats,
    filters,
    isLoading,
    error,
    updateFilters,
    resetFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    activateTemplate
  };
} 