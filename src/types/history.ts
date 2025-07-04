export type HistoryType = 'copywriting' | 'dialogue' | 'product' | 'template' | 'analysis';

export interface HistoryMetadata {
  module: string;
  productName?: string;
  style?: string;
  length?: string;
  characters?: string[];
  scene?: string;
  tags?: string[];
  apiConfig?: string;
  parameters?: Record<string, unknown>;
}

export interface HistoryRecord {
  id: string;
  type: 'copywriting' | 'dialogue';
  content: string;
  createdAt: string;
  productName?: string;
  extra?: Record<string, any>;
}

export interface HistoryFilters {
  searchTerm: string;
  selectedType: HistoryType | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'date' | 'type' | 'length' | 'title';
  sortOrder: 'asc' | 'desc';
  showFavoritesOnly: boolean;
}

export interface HistoryStats {
  totalRecords: number;
  totalTypes: number;
  totalWords: number;
  recentRecords: number;
  favoritesCount: number;
}

export interface HistoryExportOptions {
  format: 'csv' | 'json' | 'txt';
  includeMetadata: boolean;
  dateRange: 'all' | 'selected' | 'filtered';
  selectedIds?: string[];
} 