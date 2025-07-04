export interface ProductInfo {
  id: string;
  name: string;
  category: 'daily' | 'food' | 'health' | 'beauty' | 'electronics' | 'clothing' | 'other';
  description: string;
  features: string[];
  benefits: string[];
  painPoints: string[];
  targetAudience: string;
  priceRange?: string;
  imageUrl?: string;
  extractedText?: string;
}

export interface ProductAnalysisResult {
  id: string;
  product: ProductInfo;
  painPoints: string[];
  keySellingPoints: string[];
  marketingCopy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  searchTerm: string;
  selectedCategory: ProductInfo['category'] | 'all';
  sortBy: 'name' | 'createdAt' | 'category';
  sortOrder: 'asc' | 'desc';
}

export interface ProductStats {
  totalProducts: number;
  categories: Record<string, number>;
  recentAnalyses: number;
} 