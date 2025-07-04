export interface TemplateMetadata {
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  targetAudience: string[];
  industry?: string[];
  language: 'zh-CN' | 'en-US';
}

export interface TemplateUsage {
  useCount: number;
  rating: number;
  feedback: string[];
  successRate: number;
  lastUsed?: string;
}

export interface TemplateContent {
  prompt?: string;
  systemPrompt?: string;
  variables?: PromptVariable[];
  examples?: string[];
  structure?: Record<string, unknown>;
  format?: string;
  parsedText?: string;
}

export interface PromptVariable {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export type TemplateType = 'prompt' | 'product' | 'dialogue' | 'script' | 'copywriting';
export type TemplateCategory = 'welcome' | 'product' | 'social' | 'activity' | 'service' | 'testimonial' | 'lifestyle' | 'interaction' | 'analysis' | 'story' | 'other';
export type SortField = 'name' | 'createdAt' | 'useCount' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface UnifiedTemplate {
  id: string;
  name: string;
  type: TemplateType;
  category: TemplateCategory;
  content: TemplateContent;
  metadata: TemplateMetadata;
  usage: TemplateUsage;
  isBuiltIn: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  originalFileName?: string;
}

export interface TemplateFilters {
  searchTerm: string;
  selectedType: TemplateType | 'all';
  selectedCategory: TemplateCategory | 'all';
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface TemplateFormData {
  name: string;
  type: TemplateType;
  category: TemplateCategory;
  content: TemplateContent;
  metadata: TemplateMetadata;
  isActive: boolean;
}

export interface TemplateStats {
  totalTemplates: number;
  totalUsage: number;
  averageRating: number;
  activeTemplates: number;
} 