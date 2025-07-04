// 测试新功能的工具函数

import { settingsManager } from '../services/settingsManager';
import { analyticsService } from '../services/analytics';
import { ExtendedSystemSettings } from '../types/settings';

// 测试设置管理器
export const testSettingsManager = () => {
  console.log('🧪 测试设置管理器...');
  
  try {
    // 测试加载默认设置
    const defaultSettings = settingsManager.loadSettings();
    console.log('✅ 默认设置加载成功:', defaultSettings);
    
    // 测试更新设置
    settingsManager.updateSetting('themeSettings', {
      ...defaultSettings.themeSettings,
      primaryColor: '#FF6B6B'
    });
    console.log('✅ 设置更新成功');
    
    // 测试主题应用
    settingsManager.applyThemeSettings();
    console.log('✅ 主题应用成功');
    
    // 测试访问控制
    const hasAccess = settingsManager.checkAccess('copywriting');
    console.log('✅ 访问控制检查:', hasAccess);
    
    // 测试内容过滤
    const filteredContent = settingsManager.filterContent('这是一个测试内容');
    console.log('✅ 内容过滤测试:', filteredContent);
    
    return true;
  } catch (error) {
    console.error('❌ 设置管理器测试失败:', error);
    return false;
  }
};

// 测试分析服务
export const testAnalyticsService = () => {
  console.log('🧪 测试分析服务...');
  
  try {
    // 测试事件跟踪
    analyticsService.trackEvent({
      type: 'generation',
      moduleId: 'copywriting',
      duration: 1500,
      metadata: {
        style: '专业',
        length: 200
      }
    });
    console.log('✅ 事件跟踪成功');
    
    // 测试获取统计数据
    const stats = analyticsService.getUsageStatistics();
    console.log('✅ 使用统计获取成功:', stats);
    
    // 测试质量指标
    const quality = analyticsService.getQualityMetrics();
    console.log('✅ 质量指标获取成功:', quality);
    
    // 测试系统健康状态
    const health = analyticsService.getSystemHealth();
    console.log('✅ 系统健康状态获取成功:', health);
    
    return true;
  } catch (error) {
    console.error('❌ 分析服务测试失败:', error);
    return false;
  }
};

// 测试主题切换
export const testThemeSwitching = () => {
  console.log('🧪 测试主题切换...');
  
  try {
    const settings = settingsManager.loadSettings();
    
    // 测试切换到深色主题
    settingsManager.updateSetting('themeSettings', {
      ...settings.themeSettings,
      mode: 'dark'
    });
    settingsManager.applyThemeSettings();
    console.log('✅ 深色主题切换成功');
    
    // 等待一秒后切换回浅色主题
    setTimeout(() => {
      settingsManager.updateSetting('themeSettings', {
        ...settings.themeSettings,
        mode: 'light'
      });
      settingsManager.applyThemeSettings();
      console.log('✅ 浅色主题切换成功');
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('❌ 主题切换测试失败:', error);
    return false;
  }
};

// 测试布局调整
export const testLayoutAdjustment = () => {
  console.log('🧪 测试布局调整...');
  
  try {
    const settings = settingsManager.loadSettings();
    
    // 测试不同的布局密度
    const densities = ['compact', 'standard', 'spacious'] as const;
    densities.forEach((density, index) => {
      setTimeout(() => {
        settingsManager.updateSetting('layoutSettings', {
          ...settings.layoutSettings,
          density
        });
        settingsManager.applyThemeSettings();
        console.log(`✅ 布局密度切换到 ${density}`);
      }, index * 500);
    });
    
    // 测试侧边栏宽度调整
    const widths = ['narrow', 'normal', 'wide'] as const;
    widths.forEach((width, index) => {
      setTimeout(() => {
        settingsManager.updateSetting('layoutSettings', {
          ...settings.layoutSettings,
          sidebarWidth: width
        });
        console.log(`✅ 侧边栏宽度切换到 ${width}`);
      }, (index + 3) * 500);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 布局调整测试失败:', error);
    return false;
  }
};

// 测试安全功能
export const testSecurityFeatures = () => {
  console.log('🧪 测试安全功能...');
  
  try {
    const settings = settingsManager.loadSettings();
    
    // 测试内容过滤
    settingsManager.updateSetting('contentFilterSettings', {
      ...settings.contentFilterSettings,
      enabled: true,
      sensitiveWords: ['测试敏感词'],
      autoReplace: true
    });
    
    const filteredContent = settingsManager.filterContent('这里包含测试敏感词的内容');
    console.log('✅ 内容过滤测试:', filteredContent);
    
    // 测试数据匿名化
    const testData = {
      phone: '13812345678',
      email: 'test@example.com',
      content: '这是一些测试数据'
    };
    
    settingsManager.updateSetting('privacySettings', {
      ...settings.privacySettings,
      anonymization: {
        ...settings.privacySettings.anonymization,
        enabled: true,
        customMasks: [
          { pattern: '\\d{11}', replacement: '[手机号]' },
          { pattern: '\\w+@\\w+\\.\\w+', replacement: '[邮箱]' }
        ]
      }
    });
    
    const anonymizedData = settingsManager.anonymizeData(testData);
    console.log('✅ 数据匿名化测试:', anonymizedData);
    
    return true;
  } catch (error) {
    console.error('❌ 安全功能测试失败:', error);
    return false;
  }
};

// 测试数据洞察
export const testDataInsights = () => {
  console.log('🧪 测试数据洞察...');
  
  try {
    // 启用数据洞察
    const settings = settingsManager.loadSettings();
    settingsManager.updateSetting('dataInsights', {
      enabled: true,
      collectUsageData: true,
      generateReports: true,
      reportFrequency: 'daily'
    });
    
    // 模拟一些使用数据
    for (let i = 0; i < 10; i++) {
      analyticsService.trackEvent({
        type: 'generation',
        moduleId: 'copywriting',
        duration: Math.random() * 3000 + 1000,
        metadata: {
          style: ['专业', '亲切', '活泼'][Math.floor(Math.random() * 3)],
          length: Math.floor(Math.random() * 500) + 100
        }
      });
    }
    
    // 生成报告
    const report = analyticsService.generateEfficiencyReport('daily');
    console.log('✅ 效率报告生成成功:', report);
    
    return true;
  } catch (error) {
    console.error('❌ 数据洞察测试失败:', error);
    return false;
  }
};

// 运行所有测试
export const runAllTests = () => {
  console.log('🚀 开始运行所有新功能测试...');
  
  const tests = [
    { name: '设置管理器', test: testSettingsManager },
    { name: '分析服务', test: testAnalyticsService },
    { name: '主题切换', test: testThemeSwitching },
    { name: '布局调整', test: testLayoutAdjustment },
    { name: '安全功能', test: testSecurityFeatures },
    { name: '数据洞察', test: testDataInsights }
  ];
  
  const results = tests.map(({ name, test }) => {
    console.log(`\n📋 测试 ${name}...`);
    const result = test();
    return { name, success: result };
  });
  
  console.log('\n📊 测试结果汇总:');
  results.forEach(({ name, success }) => {
    console.log(`${success ? '✅' : '❌'} ${name}: ${success ? '通过' : '失败'}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 总体结果: ${successCount}/${totalCount} 测试通过`);
  
  if (successCount === totalCount) {
    console.log('🎉 所有测试都通过了！新功能已准备就绪。');
  } else {
    console.log('⚠️ 部分测试失败，请检查相关功能。');
  }
  
  return { successCount, totalCount, results };
};

// 性能优化建议
export const performanceOptimizations = () => {
  console.log('⚡ 性能优化建议:');
  
  const suggestions = [
    '1. 使用 React.memo 包装大型组件以避免不必要的重渲染',
    '2. 实现虚拟滚动来处理大量数据列表',
    '3. 使用 useMemo 和 useCallback 优化计算密集型操作',
    '4. 考虑使用 Web Workers 处理数据分析计算',
    '5. 实现懒加载来减少初始包大小',
    '6. 使用 IndexedDB 替代 localStorage 存储大量数据',
    '7. 添加防抖和节流来优化用户输入处理',
    '8. 实现组件级别的错误边界',
    '9. 使用 Service Worker 实现离线功能',
    '10. 考虑使用状态管理库（如 Zustand）来优化状态管理'
  ];
  
  suggestions.forEach(suggestion => console.log(suggestion));
  
  return suggestions;
};

// 导出测试函数供开发时使用
if (typeof window !== 'undefined') {
  (window as any).testNewFeatures = {
    runAllTests,
    testSettingsManager,
    testAnalyticsService,
    testThemeSwitching,
    testLayoutAdjustment,
    testSecurityFeatures,
    testDataInsights,
    performanceOptimizations
  };
}
