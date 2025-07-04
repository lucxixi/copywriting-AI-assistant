import { useState, useEffect, useCallback } from 'react';

import { 
  SystemSettings, 
  ApiKey, 
  ModuleSettings, 
  SettingsBackup 
} from '../types/settings';

const defaultModuleSettings: ModuleSettings = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1.0,
  frequencyPenalty: 0,
  presencePenalty: 0,
  style: '专业'
};

const getDefaultSettings = (): SystemSettings => ({
  // API 配置
  apiKeys: [],
  activeApiKeyId: '',
  model: 'gemini-1.5-flash',
  
  // 模块设置
  copywritingSettings: { ...defaultModuleSettings },
  dialogueSettings: { ...defaultModuleSettings, style: '亲切' },
  productAnalysisSettings: { ...defaultModuleSettings, style: '专业' },
  
  // 界面设置
  theme: 'light',
  language: 'zh-CN',
  autoSave: true,
  fontSize: 'medium',
  layoutDensity: 'standard',
  
  // 数据设置
  historyRetentionDays: 30,
  maxHistoryRecords: 1000,
  autoCleanup: true,
  
  // 导出设置
  defaultExportFormat: 'txt',
  includeMetadata: true,
  
  // 通知设置
  showSuccessNotifications: true,
  showErrorNotifications: true,
  notificationDuration: 3000,
  
  // 扩展设置
  themeSettings: {
    mode: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    borderRadius: 'medium'
  },
  fontSettings: {
    family: 'system',
    size: 'medium',
    lineHeight: 'normal',
    weight: 'normal'
  },
  layoutSettings: {
    density: 'standard',
    sidebarWidth: 'normal',
    contentMaxWidth: 'container',
    showSidebar: true,
    sidebarCollapsed: false
  },
  workspaceLayouts: [
    {
      id: 'default',
      name: '默认布局',
      description: '标准的工作区布局',
      layout: {
        sidebarPosition: 'left',
        panelLayout: 'single',
        defaultModule: 'dashboard',
        pinnedModules: []
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  activeWorkspaceLayoutId: 'default',
  
  // 统计和洞察
  usageStatistics: {
    totalSessions: 0,
    totalGenerations: 0,
    moduleUsage: {},
    dailyStats: {},
    weeklyStats: {},
    monthlyStats: {}
  },
  qualityMetrics: {
    averageContentLength: 0,
    contentLengthDistribution: { short: 0, medium: 0, long: 0 },
    styleDistribution: {},
    regenerationRate: 0
  },
  dataInsights: {
    enabled: false,
    collectUsageData: true,
    generateReports: false,
    reportFrequency: 'weekly'
  },
  
  // 安全和隐私
  contentFilterSettings: {
    enabled: false,
    sensitiveWords: [],
    customFilters: [],
    autoReplace: false,
    notifyOnFilter: true
  },
  privacySettings: {
    dataEncryption: {
      enabled: false,
      algorithm: 'AES-256',
      keyRotationDays: 30
    },
    dataRetention: {
      historyDays: 30,
      templateDays: 90,
      analysisDays: 180,
      autoCleanup: true
    },
    anonymization: {
      enabled: false,
      maskPersonalInfo: false,
      maskBusinessInfo: false,
      customMasks: []
    }
  },
  accessControlSettings: {
    passwordProtection: {
      enabled: false,
      sessionTimeout: 30,
      maxAttempts: 3,
      lockoutDuration: 15
    },
    moduleRestrictions: {},
    exportRestrictions: {
      requirePassword: false,
      allowedFormats: ['txt', 'docx', 'pdf'],
      maxExportSize: 10
    }
  },
  dataCleanupSettings: {
    autoCleanup: {
      enabled: false,
      schedule: 'weekly',
      retentionDays: 30
    },
    manualCleanup: {
      lastCleanup: '',
      itemsRemoved: 0,
      spaceFreed: 0
    },
    cleanupRules: []
  }
});

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 加载设置
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const savedSettings = localStorage.getItem('systemSettings');
      if (savedSettings) {
        setSettings({ ...getDefaultSettings(), ...JSON.parse(savedSettings) });
      }
    } catch (err) {
      setError('加载设置失败');
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存设置
  const saveSettings = useCallback(async (newSettings?: SystemSettings) => {
    try {
      setSaveStatus('saving');
      setError(null);
      
      const settingsToSave = newSettings || settings;
      localStorage.setItem('systemSettings', JSON.stringify(settingsToSave));
      setSettings(settingsToSave);
      setSaveStatus('saved');
      
      // 3秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setError('保存设置失败');
      setSaveStatus('error');
      console.error('Failed to save settings:', err);
    }
  }, [settings]);

  // 更新设置
  const updateSettings = useCallback((key: keyof SystemSettings, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // 更新模块设置
  const updateModuleSettings = useCallback((
    module: 'copywriting' | 'dialogue' | 'productAnalysis',
    key: keyof ModuleSettings,
    value: unknown
  ) => {
    setSettings(prev => ({
      ...prev,
      [`${module}Settings`]: {
        ...prev[`${module}Settings` as keyof SystemSettings] as ModuleSettings,
        [key]: value
      }
    }));
  }, []);

  // API Key 管理
  const addApiKey = useCallback((provider: ApiKey['provider'], name: string, key: string) => {
    const newApiKey: ApiKey = {
      id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      key,
      provider,
      isActive: false,
      usage: {
        calls: 0,
        tokens: 0,
        lastUsed: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSettings(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newApiKey]
    }));
  }, []);

  const removeApiKey = useCallback((keyId: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== keyId),
      activeApiKeyId: prev.activeApiKeyId === keyId ? '' : prev.activeApiKeyId
    }));
  }, []);

  const setActiveApiKey = useCallback((keyId: string) => {
    setSettings(prev => ({
      ...prev,
      activeApiKeyId: keyId,
      apiKeys: prev.apiKeys.map(key => ({
        ...key,
        isActive: key.id === keyId
      }))
    }));
  }, []);

  const updateApiKeyUsage = useCallback((keyId: string, calls: number, tokens: number) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.map(key => 
        key.id === keyId 
          ? {
              ...key,
              usage: {
                calls: key.usage.calls + calls,
                tokens: key.usage.tokens + tokens,
                lastUsed: new Date().toISOString()
              },
              updatedAt: new Date().toISOString()
            }
          : key
      )
    }));
  }, []);

  // 测试API连接
  const testApiConnection = useCallback(async (apiKey?: string) => {
    const keyToTest = apiKey || settings.apiKeys.find(k => k.isActive)?.key;
    if (!keyToTest) {
      throw new Error('没有可用的API密钥');
    }

    // 这里应该调用实际的API测试
    // 暂时模拟测试
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.2); // 80%成功率
      }, 1000);
    });
  }, [settings.apiKeys]);

  // 重置为默认设置
  const resetToDefaults = useCallback(() => {
    if (confirm('确定要重置所有设置为默认值吗？此操作不可恢复。')) {
      setSettings(getDefaultSettings());
    }
  }, []);

  // 清除所有数据
  const clearAllData = useCallback(() => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      try {
        localStorage.clear();
        setSettings(getDefaultSettings());
        alert('所有数据已清除');
          } catch {
      setError('清除数据失败');
    }
    }
  }, []);

  // 导出设置
  const exportSettings = useCallback(() => {
    const exportData: SettingsBackup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings,
      metadata: {
        description: '系统设置备份',
        tags: ['settings', 'backup']
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings]);

  // 导入设置
  const importSettings = useCallback((file: File) => {
    return new Promise<boolean>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as SettingsBackup;
          if (data.settings && data.version) {
            setSettings({ ...getDefaultSettings(), ...data.settings });
            resolve(true);
          } else {
            reject(new Error('无效的设置文件格式'));
          }
        } catch (err) {
          reject(new Error('解析设置文件失败'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }, []);

  // 获取可用模型
  const getAvailableModels = useCallback(() => {
    return [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openrouter' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openrouter' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter' }
    ];
  }, []);

  // 获取API提供商
  const getApiProviders = useCallback(() => {
    return [
      { id: 'google', name: 'Google Gemini', icon: '🔑' },
      { id: 'openrouter', name: 'OpenRouter', icon: '🔗' },
      { id: 'together', name: 'Together AI', icon: '🤝' },
      { id: 'siliconflow', name: 'SiliconFlow', icon: '⚡' }
    ];
  }, []);

  // 初始化
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    error,
    saveStatus,
    loadSettings,
    saveSettings,
    updateSettings,
    updateModuleSettings,
    addApiKey,
    removeApiKey,
    setActiveApiKey,
    updateApiKeyUsage,
    testApiConnection,
    resetToDefaults,
    clearAllData,
    exportSettings,
    importSettings,
    getAvailableModels,
    getApiProviders
  };
} 