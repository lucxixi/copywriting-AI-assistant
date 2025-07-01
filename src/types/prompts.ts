// 提示词相关类型定义

export interface PromptTemplate {
  id: string;
  name: string;
  type: CopywritingType;
  style: WritingStyle;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  examples?: string[];
  tags: string[];
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
}

// 统一模板管理数据结构
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
}

export type TemplateType = 
  | 'prompt'        // 提示词模板
  | 'product'       // 产品分析模板
  | 'dialogue'      // 对话故事模板
  | 'script'        // 话术分析模板
  | 'copywriting';  // 文案生成模板

export type TemplateCategory = 
  | 'welcome'       // 欢迎语
  | 'product'       // 产品推广
  | 'social'        // 社交分享
  | 'activity'      // 活动营销
  | 'service'       // 客服话术
  | 'testimonial'   // 用户反馈
  | 'lifestyle'     // 生活场景
  | 'interaction'   // 互动话题
  | 'analysis'      // 分析类
  | 'story'         // 故事类
  | 'other';        // 其他

export interface TemplateContent {
  prompt?: string;
  systemPrompt?: string;
  variables?: PromptVariable[];
  examples?: string[];
  structure?: Record<string, unknown>;
  format?: string;
}

export interface TemplateMetadata {
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 预计使用时间（分钟）
  targetAudience: string[];
  industry?: string[];
  language: 'zh-CN' | 'en-US';
}

export interface TemplateUsage {
  useCount: number;
  lastUsed?: string;
  rating: number; // 1-5星评分
  feedback: string[];
  successRate: number; // 成功率百分比
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

export type CopywritingType = 
  | 'welcome'      // 欢迎语文案
  | 'product'      // 产品推广
  | 'social'       // 朋友圈分享
  | 'activity'     // 活动营销
  | 'promotion'    // 促销文案
  | 'education';   // 教育内容

export type WritingStyle = 
  | 'professional' // 专业正式
  | 'friendly'     // 亲切温暖
  | 'humorous'     // 幽默风趣
  | 'urgent'       // 紧迫感
  | 'emotional'    // 情感化
  | 'casual';      // 轻松随意

export interface GenerationParams {
  type: CopywritingType;
  style: WritingStyle;
  targetAudience?: string;
  productInfo?: string;
  keyPoints?: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  includeEmoji?: boolean;
  includeHashtags?: boolean;
  customRequirements?: string;
}

export interface BusinessContext {
  brandName?: string;
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  brandPersonality?: string;
  keyBenefits?: string[];
  competitiveAdvantages?: string[];
  priceRange?: string;
  promotionInfo?: {
    type: string;
    discount: string;
    deadline: string;
    conditions?: string;
  };
}

// 对话话术分析相关类型
export interface ConversationScript {
  id: string;
  content: string;
  role: 'promoter' | 'customer' | 'supporter'; // 推广者、客户、托
  confidence: number; // AI分析的可信度
  context?: string; // 对话上下文
  createdAt: string;
}

export interface ScriptAnalysisResult {
  scripts: ConversationScript[];
  summary: {
    promoterCount: number;
    customerCount: number;
    supporterCount: number;
    commonThemes: string[];
    effectiveTechniques: string[];
  };
}

// 产品分析相关类型
export interface ProductInfo {
  name: string;
  category: 'daily' | 'food' | 'health' | 'beauty' | 'electronics' | 'clothing' | 'other';
  description: string;
  features: string[];
  benefits: string[];
  targetAudience: string;
  priceRange?: string;
  imageUrl?: string;
  extractedText?: string; // 从图片中提取的文字
}

export interface ProductAnalysisResult {
  id: string;
  product: ProductInfo;
  painPoints: string[];
  marketingCopy: string;
  keySellingPoints: string[];
}

// 对话故事生成相关类型
export interface DialogueCharacter {
  id: string;
  name: string;
  role: 'customer' | 'friend' | 'family' | 'colleague' | 'expert';
  personality: string;
  painPoint: string;
}

export interface DialogueStory {
  id: string;
  title: string;
  product: ProductInfo;
  characters: DialogueCharacter[];
  scenario: string;
  dialogue: DialogueLine[];
  painPoints: string[];
  solution: string;
  createdAt: string;
}

export interface DialogueLine {
  characterId: string;
  characterName: string;
  content: string;
  emotion?: string;
}

// 对话场景类型
export type DialogueScene = 
  | 'story'        // 故事创作
  | 'service'      // 客服话术
  | 'testimonial'  // 用户反馈
  | 'lifestyle'    // 生活场景
  | 'interaction'; // 互动话题

// 对话角色类型
export interface DialogueRole {
  id: string;
  name: string;
  role: 'customer' | 'friend' | 'family' | 'colleague' | 'expert' | 'service' | 'user';
  personality: string;
  background?: string;
  painPoint?: string;
  isPreset: boolean;
}

// 对话场景配置
export interface DialogueSceneConfig {
  id: string;
  name: string;
  type: DialogueScene;
  description: string;
  characters: DialogueRole[];
  scenario: string;
  promptTemplate: string;
}
