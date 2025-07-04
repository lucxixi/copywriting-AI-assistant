// 扩展系统设置管理服务

import { ExtendedSystemSettings } from '../types/settings';
import { analyticsService } from './analytics';

class SettingsManager {
  private readonly STORAGE_KEY = 'copywriting_ai_extended_settings';
  private settings: ExtendedSystemSettings | null = null;
  private listeners: ((settings: ExtendedSystemSettings) => void)[] = [];

  // 获取默认设置
  private getDefaultSettings(): ExtendedSystemSettings {
    return {
      // 原有设置
      apiKeys: [],
      activeApiKeyId: '',
      model: 'gemini-1.5-flash',
      copywritingSettings: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
        frequencyPenalty: 0,
        presencePenalty: 0,
        style: '专业'
      },
      dialogueSettings: {
        temperature: 0.8,
        maxTokens: 1500,
        topP: 0.9,
        frequencyPenalty: 0,
        presencePenalty: 0,
        style: '亲切'
      },
      productAnalysisSettings: {
        temperature: 0.6,
        maxTokens: 2000,
        topP: 0.9,
        frequencyPenalty: 0,
        presencePenalty: 0,
        style: '专业'
      },
      theme: 'light',
      language: 'zh-CN',
      autoSave: true,
      fontSize: 'medium',
      layoutDensity: 'standard',
      historyRetentionDays: 30,
      maxHistoryRecords: 1000,
      autoCleanup: true,
      defaultExportFormat: 'txt',
      includeMetadata: true,
      showSuccessNotifications: true,
      showErrorNotifications: true,
      notificationDuration: 3000,

      // 新增设置
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
    };
  }

  // 加载设置
  loadSettings(): ExtendedSystemSettings {
    if (this.settings) {
      return this.settings;
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 合并默认设置以确保新字段存在
        this.settings = { ...this.getDefaultSettings(), ...parsed };
      } else {
        this.settings = this.getDefaultSettings();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = this.getDefaultSettings();
    }

    return this.settings;
  }

  // 保存设置
  saveSettings(settings: ExtendedSystemSettings): void {
    try {
      this.settings = settings;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      
      // 通知监听器
      this.listeners.forEach(listener => listener(settings));
      
      // 记录设置变更事件
      if (settings.dataInsights.collectUsageData) {
        analyticsService.trackEvent({
          type: 'edit',
          moduleId: 'settings',
          metadata: {
            action: 'save_settings',
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  // 更新特定设置
  updateSetting<K extends keyof ExtendedSystemSettings>(
    key: K, 
    value: ExtendedSystemSettings[K]
  ): void {
    const currentSettings = this.loadSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    this.saveSettings(updatedSettings);
  }

  // 重置为默认设置
  resetToDefaults(): void {
    const defaultSettings = this.getDefaultSettings();
    this.saveSettings(defaultSettings);
  }

  // 导出设置
  exportSettings(): string {
    const settings = this.loadSettings();
    return JSON.stringify(settings, null, 2);
  }

  // 导入设置
  importSettings(settingsJson: string): void {
    try {
      const imported = JSON.parse(settingsJson);
      // 验证导入的设置结构
      const merged = { ...this.getDefaultSettings(), ...imported };
      this.saveSettings(merged);
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('无效的设置文件格式');
    }
  }

  // 添加设置变更监听器
  addListener(listener: (settings: ExtendedSystemSettings) => void): void {
    this.listeners.push(listener);
  }

  // 移除设置变更监听器
  removeListener(listener: (settings: ExtendedSystemSettings) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 应用主题设置到DOM
  applyThemeSettings(): void {
    const settings = this.loadSettings();
    const { themeSettings, fontSettings, layoutSettings } = settings;

    // 应用主题模式
    if (themeSettings.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeSettings.mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // 自动模式
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // 应用CSS变量
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--accent-color', themeSettings.accentColor);

    // 应用字体设置
    if (fontSettings.family === 'custom' && fontSettings.customFamily) {
      root.style.setProperty('--font-family', fontSettings.customFamily);
    } else {
      const fontMap = {
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        serif: 'Georgia, "Times New Roman", serif',
        mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace'
      };
      root.style.setProperty('--font-family', fontMap[fontSettings.family] || fontMap.system);
    }

    // 应用字体大小
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    root.style.setProperty('--font-size', sizeMap[fontSettings.size]);

    // 应用行高
    const lineHeightMap = {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    };
    root.style.setProperty('--line-height', lineHeightMap[fontSettings.lineHeight]);

    // 应用布局密度
    const densityMap = {
      compact: '0.5rem',
      standard: '1rem',
      spacious: '1.5rem'
    };
    root.style.setProperty('--spacing-unit', densityMap[layoutSettings.density]);
  }

  // 检查访问权限
  checkAccess(moduleId: string): boolean {
    const settings = this.loadSettings();
    const restriction = settings.accessControlSettings.moduleRestrictions[moduleId];
    
    if (!restriction) return true;
    if (!restriction.restricted) return true;
    
    // 这里应该检查密码验证状态
    // 简化实现，实际应用中需要更复杂的会话管理
    return !restriction.requirePassword;
  }

  // 应用内容过滤
  filterContent(content: string): string {
    const settings = this.loadSettings();
    const { contentFilterSettings } = settings;
    
    if (!contentFilterSettings.enabled) return content;
    
    let filtered = content;
    
    // 应用敏感词过滤
    contentFilterSettings.sensitiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, contentFilterSettings.autoReplace ? '[已过滤]' : word);
    });
    
    // 应用自定义过滤器
    contentFilterSettings.customFilters.forEach(filter => {
      if (filter.enabled) {
        try {
          const regex = new RegExp(filter.pattern, 'gi');
          filtered = filtered.replace(regex, filter.replacement);
        } catch (error) {
          console.error('Invalid filter pattern:', filter.pattern, error);
        }
      }
    });
    
    return filtered;
  }

  // 数据匿名化
  anonymizeData(data: any): any {
    const settings = this.loadSettings();
    const { privacySettings } = settings;
    
    if (!privacySettings.anonymization.enabled) return data;
    
    let anonymized = JSON.stringify(data);
    
    // 应用自定义遮蔽规则
    privacySettings.anonymization.customMasks.forEach(mask => {
      try {
        const regex = new RegExp(mask.pattern, 'gi');
        anonymized = anonymized.replace(regex, mask.replacement);
      } catch (error) {
        console.error('Invalid mask pattern:', mask.pattern, error);
      }
    });
    
    return JSON.parse(anonymized);
  }
}

export const settingsManager = new SettingsManager();
