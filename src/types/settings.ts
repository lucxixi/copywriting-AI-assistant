// 系统设置相关类型定义

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: 'openrouter' | 'together' | 'siliconflow' | 'google';
  isActive: boolean;
  usage: {
    calls: number;
    tokens: number;
    lastUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ModuleSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  style: string;
  model?: string;
  customPrompts?: string[];
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: 'small' | 'medium' | 'large';
}

export interface FontSettings {
  family: 'system' | 'serif' | 'sans-serif' | 'monospace';
  size: 'small' | 'medium' | 'large';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  weight: 'light' | 'normal' | 'medium' | 'bold';
}

export interface LayoutSettings {
  density: 'compact' | 'standard' | 'comfortable';
  sidebarWidth: 'narrow' | 'normal' | 'wide';
  contentMaxWidth: 'container' | 'full' | 'custom';
  showSidebar: boolean;
  sidebarCollapsed: boolean;
}

export interface WorkspaceLayout {
  id: string;
  name: string;
  description: string;
  layout: {
    sidebarPosition: 'left' | 'right';
    panelLayout: 'single' | 'split' | 'grid';
    defaultModule: string;
    pinnedModules: string[];
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStatistics {
  totalSessions: number;
  totalGenerations: number;
  moduleUsage: Record<string, number>;
  dailyStats: Record<string, number>;
  weeklyStats: Record<string, number>;
  monthlyStats: Record<string, number>;
}

export interface QualityMetrics {
  averageContentLength: number;
  contentLengthDistribution: {
    short: number;
    medium: number;
    long: number;
  };
  styleDistribution: Record<string, number>;
  regenerationRate: number;
}

export interface DataInsights {
  enabled: boolean;
  collectUsageData: boolean;
  generateReports: boolean;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface ContentFilterSettings {
  enabled: boolean;
  sensitiveWords: string[];
  customFilters: string[];
  autoReplace: boolean;
  notifyOnFilter: boolean;
  keywordReplacements: KeywordMapping[];
}

export interface KeywordMapping {
  id: string;
  original: string;
  replacement: string;
}

export interface PrivacySettings {
  dataEncryption: {
    enabled: boolean;
    algorithm: string;
    keyRotationDays: number;
  };
  dataRetention: {
    historyDays: number;
    templateDays: number;
    analysisDays: number;
    autoCleanup: boolean;
  };
  anonymization: {
    enabled: boolean;
    maskPersonalInfo: boolean;
    maskBusinessInfo: boolean;
    customMasks: string[];
  };
}

export interface AccessControlSettings {
  passwordProtection: {
    enabled: boolean;
    sessionTimeout: number;
    maxAttempts: number;
    lockoutDuration: number;
  };
  moduleRestrictions: Record<string, boolean>;
  exportRestrictions: {
    requirePassword: boolean;
    allowedFormats: string[];
    maxExportSize: number;
  };
}

export interface DataCleanupSettings {
  autoCleanup: {
    enabled: boolean;
    schedule: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
  };
  manualCleanup: {
    lastCleanup: string;
    itemsRemoved: number;
    spaceFreed: number;
  };
  cleanupRules: Array<{
    type: string;
    condition: string;
    action: string;
  }>;
}

export interface SystemSettings {
  // API 配置
  apiKeys: ApiKey[];
  activeApiKeyId: string;
  model: string;
  
  // 模块设置
  copywritingSettings: ModuleSettings;
  dialogueSettings: ModuleSettings;
  productAnalysisSettings: ModuleSettings;
  
  // 界面设置
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
  fontSize: 'small' | 'medium' | 'large';
  layoutDensity: 'compact' | 'standard' | 'comfortable';
  
  // 数据设置
  historyRetentionDays: number;
  maxHistoryRecords: number;
  autoCleanup: boolean;
  
  // 导出设置
  defaultExportFormat: 'txt' | 'docx' | 'pdf' | 'csv' | 'json';
  includeMetadata: boolean;
  
  // 通知设置
  showSuccessNotifications: boolean;
  showErrorNotifications: boolean;
  notificationDuration: number;
  
  // 扩展设置
  themeSettings: ThemeSettings;
  fontSettings: FontSettings;
  layoutSettings: LayoutSettings;
  workspaceLayouts: WorkspaceLayout[];
  activeWorkspaceLayoutId: string;
  
  // 统计和洞察
  usageStatistics: UsageStatistics;
  qualityMetrics: QualityMetrics;
  dataInsights: DataInsights;
  
  // 安全和隐私
  contentFilterSettings: ContentFilterSettings;
  privacySettings: PrivacySettings;
  accessControlSettings: AccessControlSettings;
  dataCleanupSettings: DataCleanupSettings;
}

export interface SettingsTab {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'basic' | 'advanced' | 'security' | 'data';
}

export interface SettingsChange {
  key: keyof SystemSettings;
  value: unknown;
  timestamp: string;
  description: string;
}

export interface SettingsBackup {
  version: string;
  timestamp: string;
  settings: SystemSettings;
  metadata: {
    description: string;
    tags: string[];
  };
}
