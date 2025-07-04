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

export interface CopywritingHistory {
  id: string;
  type: CopywritingType;
  style: WritingStyle;
  prompt: string;
  result: string;
  apiConfig: string;
  createdAt: string;
  parameters: GenerationParams;
}

export interface CopywritingFilters {
  searchTerm: string;
  selectedType: CopywritingType | 'all';
  selectedStyle: WritingStyle | 'all';
  sortBy: 'createdAt' | 'type' | 'style';
  sortOrder: 'asc' | 'desc';
}

export interface CopywritingStats {
  totalGenerations: number;
  totalTypes: number;
  totalStyles: number;
  recentGenerations: number;
} 