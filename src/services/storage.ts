// 本地存储服务

import { ApiConfig, GenerationHistory } from '../types/api';
import { PromptTemplate, BusinessContext, ScriptAnalysisResult, ProductAnalysisResult, DialogueStory, UnifiedTemplate } from '../types/prompts';

class StorageService {
  private readonly KEYS = {
    API_CONFIGS: 'copywriting_ai_api_configs',
    ACTIVE_API: 'copywriting_ai_active_api',
    PROMPT_TEMPLATES: 'copywriting_ai_prompt_templates',
    GENERATION_HISTORY: 'copywriting_ai_generation_history',
    BUSINESS_CONTEXT: 'copywriting_ai_business_context',
    USER_PREFERENCES: 'copywriting_ai_user_preferences',
    SCRIPT_ANALYSES: 'copywriting_ai_script_analyses',
    SCRIPT_TEMPLATES: 'copywriting_ai_script_templates',
    PRODUCT_ANALYSES: 'copywriting_ai_product_analyses',
    PRODUCT_TEMPLATES: 'copywriting_ai_product_templates',
    DIALOGUE_STORIES: 'copywriting_ai_dialogue_stories',
    DIALOGUE_TEMPLATES: 'copywriting_ai_dialogue_templates',
    UNIFIED_TEMPLATES: 'copywriting_ai_unified_templates'
  };

  // API配置管理
  getApiConfigs(): ApiConfig[] {
    try {
      const configs = localStorage.getItem(this.KEYS.API_CONFIGS);
      return configs ? JSON.parse(configs) : [];
    } catch (error) {
      console.error('Failed to get API configs:', error);
      return [];
    }
  }

  saveApiConfig(config: ApiConfig): void {
    try {
      const configs = this.getApiConfigs();
      const existingIndex = configs.findIndex(c => c.id === config.id);
      
      if (existingIndex >= 0) {
        configs[existingIndex] = { ...config, updatedAt: new Date().toISOString() };
      } else {
        configs.push(config);
      }
      
      localStorage.setItem(this.KEYS.API_CONFIGS, JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save API config:', error);
    }
  }

  deleteApiConfig(configId: string): void {
    try {
      const configs = this.getApiConfigs().filter(c => c.id !== configId);
      localStorage.setItem(this.KEYS.API_CONFIGS, JSON.stringify(configs));
      
      // 如果删除的是当前激活的配置，清除激活状态
      if (this.getActiveApiId() === configId) {
        this.setActiveApi('');
      }
    } catch (error) {
      console.error('Failed to delete API config:', error);
    }
  }

  getActiveApiId(): string {
    return localStorage.getItem(this.KEYS.ACTIVE_API) || '';
  }

  setActiveApi(configId: string): void {
    localStorage.setItem(this.KEYS.ACTIVE_API, configId);
  }

  getActiveApiConfig(): ApiConfig | null {
    const activeId = this.getActiveApiId();
    if (!activeId) return null;
    
    const configs = this.getApiConfigs();
    return configs.find(c => c.id === activeId) || null;
  }

  // 提示词模板管理
  getPromptTemplates(): PromptTemplate[] {
    try {
      const templates = localStorage.getItem(this.KEYS.PROMPT_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to get prompt templates:', error);
      return [];
    }
  }

  savePromptTemplate(template: PromptTemplate): void {
    try {
      const templates = this.getPromptTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(this.KEYS.PROMPT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save prompt template:', error);
    }
  }

  deletePromptTemplate(templateId: string): void {
    try {
      const templates = this.getPromptTemplates().filter(t => t.id !== templateId);
      localStorage.setItem(this.KEYS.PROMPT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to delete prompt template:', error);
    }
  }

  // 生成历史管理
  getGenerationHistory(): GenerationHistory[] {
    try {
      const history = localStorage.getItem(this.KEYS.GENERATION_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to get generation history:', error);
      return [];
    }
  }

  saveGenerationHistory(record: GenerationHistory): void {
    try {
      const history = this.getGenerationHistory();
      history.unshift(record); // 最新的记录放在前面
      
      // 限制历史记录数量，保留最近100条
      if (history.length > 100) {
        history.splice(100);
      }
      
      localStorage.setItem(this.KEYS.GENERATION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save generation history:', error);
    }
  }

  clearGenerationHistory(): void {
    localStorage.removeItem(this.KEYS.GENERATION_HISTORY);
  }

  // 业务上下文管理
  getBusinessContext(): BusinessContext {
    try {
      const context = localStorage.getItem(this.KEYS.BUSINESS_CONTEXT);
      return context ? JSON.parse(context) : {};
    } catch (error) {
      console.error('Failed to get business context:', error);
      return {};
    }
  }

  saveBusinessContext(context: BusinessContext): void {
    try {
      localStorage.setItem(this.KEYS.BUSINESS_CONTEXT, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to save business context:', error);
    }
  }

  // 用户偏好设置
  getUserPreferences(): Record<string, any> {
    try {
      const prefs = localStorage.getItem(this.KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {};
    }
  }

  saveUserPreferences(preferences: Record<string, any>): void {
    try {
      localStorage.setItem(this.KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  // 对话话术分析管理
  getScriptAnalyses(): ScriptAnalysisResult[] {
    try {
      const analyses = localStorage.getItem(this.KEYS.SCRIPT_ANALYSES);
      return analyses ? JSON.parse(analyses) : [];
    } catch (error) {
      console.error('Failed to get script analyses:', error);
      return [];
    }
  }

  saveScriptAnalysis(analysis: ScriptAnalysisResult): void {
    try {
      const analyses = this.getScriptAnalyses();
      analyses.unshift(analysis);
      
      // 限制数量，保留最近50条
      if (analyses.length > 50) {
        analyses.splice(50);
      }
      
      localStorage.setItem(this.KEYS.SCRIPT_ANALYSES, JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to save script analysis:', error);
    }
  }

  getScriptTemplates(): any[] {
    try {
      const templates = localStorage.getItem(this.KEYS.SCRIPT_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to get script templates:', error);
      return [];
    }
  }

  saveScriptTemplate(template: any): void {
    try {
      const templates = this.getScriptTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(this.KEYS.SCRIPT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save script template:', error);
    }
  }

  // 产品分析管理
  getProductAnalyses(): ProductAnalysisResult[] {
    try {
      const analyses = localStorage.getItem(this.KEYS.PRODUCT_ANALYSES);
      return analyses ? JSON.parse(analyses) : [];
    } catch (error) {
      console.error('Failed to get product analyses:', error);
      return [];
    }
  }

  saveProductAnalysis(analysis: ProductAnalysisResult): void {
    try {
      const analyses = this.getProductAnalyses();
      analyses.unshift(analysis);

      // 限制数量，保留最近50条
      if (analyses.length > 50) {
        analyses.splice(50);
      }

      localStorage.setItem(this.KEYS.PRODUCT_ANALYSES, JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to save product analysis:', error);
    }
  }

  saveProductAnalyses(analyses: ProductAnalysisResult[]): void {
    try {
      localStorage.setItem(this.KEYS.PRODUCT_ANALYSES, JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to save product analyses:', error);
    }
  }

  getProductTemplates(): any[] {
    try {
      const templates = localStorage.getItem(this.KEYS.PRODUCT_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to get product templates:', error);
      return [];
    }
  }

  saveProductTemplate(template: any): void {
    try {
      const templates = this.getProductTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(this.KEYS.PRODUCT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save product template:', error);
    }
  }

  // 对话故事管理
  getDialogueStories(): DialogueStory[] {
    try {
      const stories = localStorage.getItem(this.KEYS.DIALOGUE_STORIES);
      return stories ? JSON.parse(stories) : [];
    } catch (error) {
      console.error('Failed to get dialogue stories:', error);
      return [];
    }
  }

  saveDialogueStory(story: DialogueStory): void {
    try {
      const stories = this.getDialogueStories();
      stories.unshift(story);
      
      // 限制数量，保留最近50条
      if (stories.length > 50) {
        stories.splice(50);
      }
      
      localStorage.setItem(this.KEYS.DIALOGUE_STORIES, JSON.stringify(stories));
    } catch (error) {
      console.error('Failed to save dialogue story:', error);
    }
  }

  getDialogueTemplates(): any[] {
    try {
      const templates = localStorage.getItem(this.KEYS.DIALOGUE_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to get dialogue templates:', error);
      return [];
    }
  }

  saveDialogueTemplate(template: unknown): void {
    try {
      const templates = this.getDialogueTemplates();
      const existingIndex = templates.findIndex((t: { id: string }) => t.id === (template as { id: string }).id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(this.KEYS.DIALOGUE_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save dialogue template:', error);
    }
  }

  // 统一模板管理
  getUnifiedTemplates(): UnifiedTemplate[] {
    try {
      const templates = localStorage.getItem(this.KEYS.UNIFIED_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to get unified templates:', error);
      return [];
    }
  }

  saveUnifiedTemplate(template: UnifiedTemplate): void {
    try {
      const templates = this.getUnifiedTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(this.KEYS.UNIFIED_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save unified template:', error);
    }
  }

  deleteUnifiedTemplate(templateId: string): void {
    try {
      const templates = this.getUnifiedTemplates().filter(t => t.id !== templateId);
      localStorage.setItem(this.KEYS.UNIFIED_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to delete unified template:', error);
    }
  }

  updateTemplateUsage(templateId: string, usage: Partial<UnifiedTemplate['usage']>): void {
    try {
      const templates = this.getUnifiedTemplates();
      const templateIndex = templates.findIndex(t => t.id === templateId);
      
      if (templateIndex >= 0) {
        templates[templateIndex].usage = { ...templates[templateIndex].usage, ...usage };
        templates[templateIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.KEYS.UNIFIED_TEMPLATES, JSON.stringify(templates));
      }
    } catch (error) {
      console.error('Failed to update template usage:', error);
    }
  }

  // 清除所有数据
  clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
