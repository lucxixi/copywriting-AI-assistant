# 系统设置模块第二阶段功能说明

## 🎉 新功能概览

本次更新为系统设置模块添加了三大核心功能模块，大幅提升了用户体验和系统安全性。

### 🌈 界面个性化
- **主题定制**: 支持浅色/深色/自动主题模式
- **颜色配置**: 8种预设颜色 + 自定义颜色选择器
- **字体设置**: 系统字体/衬线字体/等宽字体，支持自定义字体
- **布局密度**: 紧凑/标准/宽松三种布局密度
- **工作区布局**: 可创建和管理多个自定义工作区布局

### 📊 数据洞察
- **使用统计**: 总生成次数、会话数、模块使用排行
- **质量分析**: 内容长度分布、风格分布、重新生成率
- **效率报告**: 日/周/月使用报告、生产力评分
- **趋势分析**: 使用增长趋势、偏好变化分析
- **系统健康**: 存储使用情况、性能指标、安全状态

### 🔒 安全隐私
- **内容过滤**: 敏感词检测、自定义过滤规则、自动替换
- **隐私保护**: 数据加密、保留策略、匿名化处理
- **访问控制**: 密码保护、模块访问限制、导出限制
- **数据清理**: 自动清理、手动清理、自定义清理规则

## 🚀 技术架构

### 新增文件结构
```
src/
├── types/
│   └── settings.ts              # 扩展的设置类型定义
├── services/
│   ├── analytics.ts             # 数据分析服务
│   └── settingsManager.ts       # 设置管理服务
├── components/
│   ├── PersonalizationSettings.tsx    # 界面个性化组件
│   ├── DataInsightsSettings.tsx       # 数据洞察组件
│   └── SecurityPrivacySettings.tsx    # 安全隐私组件
└── utils/
    └── testNewFeatures.ts       # 功能测试工具
```

### 核心服务

#### SettingsManager
- 统一的设置管理服务
- 支持设置的加载、保存、导入、导出
- 实时主题应用和CSS变量更新
- 访问控制和内容过滤功能

#### AnalyticsService
- 事件跟踪和数据收集
- 使用统计和质量指标计算
- 效率报告和趋势分析生成
- 系统健康状态监控

## 🎨 主题系统

### CSS变量支持
系统现在支持动态CSS变量，可以实时切换主题：

```css
:root {
  --primary-color: #3B82F6;
  --secondary-color: #6B7280;
  --accent-color: #10B981;
  --font-family: system-ui;
  --font-size: 16px;
  --line-height: 1.5;
  --spacing-unit: 1rem;
}
```

### 响应式布局
- 支持三种侧边栏宽度（窄/正常/宽）
- 三种内容最大宽度（全宽/容器/窄版）
- 三种布局密度（紧凑/标准/宽松）

## 📈 数据分析

### 事件跟踪
系统会自动跟踪以下事件：
- 内容生成事件
- 模块切换事件
- 设置修改事件
- 导出操作事件

### 统计指标
- **使用统计**: 按日/周/月统计使用情况
- **质量指标**: 内容长度、风格分布、满意度
- **效率指标**: 响应时间、生产力评分、使用高峰

## 🛡️ 安全功能

### 内容过滤
- 敏感词检测和替换
- 正则表达式自定义过滤器
- 实时过滤通知

### 数据保护
- AES-256/AES-128加密选项
- 自动密钥轮换
- 数据保留策略配置

### 访问控制
- 模块级别的访问限制
- 密码保护功能
- 导出权限控制

## 🔧 使用方法

### 1. 访问系统设置
在应用中点击侧边栏的"系统设置"按钮，现在可以看到新增的三个标签页：
- 界面个性化
- 数据洞察
- 安全隐私

### 2. 个性化设置
1. 选择"界面个性化"标签
2. 在"主题定制"中选择颜色和模式
3. 在"字体设置"中调整字体和大小
4. 在"布局密度"中选择合适的间距
5. 在"工作区布局"中创建自定义布局

### 3. 查看数据洞察
1. 选择"数据洞察"标签
2. 首次使用需要启用数据洞察功能
3. 查看各种统计图表和分析报告
4. 配置数据收集和报告生成选项

### 4. 配置安全设置
1. 选择"安全隐私"标签
2. 在"内容过滤"中添加敏感词和过滤规则
3. 在"隐私保护"中配置加密和匿名化
4. 在"访问控制"中设置密码和权限
5. 在"数据清理"中配置自动清理规则

## 🧪 测试功能

在浏览器控制台中运行以下命令来测试新功能：

```javascript
// 运行所有测试
testNewFeatures.runAllTests();

// 单独测试某个功能
testNewFeatures.testThemeSwitching();
testNewFeatures.testSecurityFeatures();
testNewFeatures.testDataInsights();

// 查看性能优化建议
testNewFeatures.performanceOptimizations();
```

## 📝 配置示例

### 主题配置
```typescript
const themeSettings = {
  mode: 'dark',
  primaryColor: '#8B5CF6',
  secondaryColor: '#6B7280',
  accentColor: '#10B981',
  borderRadius: 'large'
};
```

### 安全配置
```typescript
const securitySettings = {
  contentFilterSettings: {
    enabled: true,
    sensitiveWords: ['敏感词1', '敏感词2'],
    autoReplace: true,
    notifyOnFilter: true
  },
  accessControlSettings: {
    passwordProtection: {
      enabled: true,
      sessionTimeout: 30,
      maxAttempts: 3
    }
  }
};
```

## 🔄 数据迁移

现有的系统设置会自动迁移到新的扩展格式，无需手动操作。新字段会使用默认值初始化。

## 🚨 注意事项

1. **数据隐私**: 数据洞察功能默认关闭，需要用户主动启用
2. **性能影响**: 启用所有功能可能会增加内存使用，建议根据需要选择性启用
3. **浏览器兼容**: CSS变量需要现代浏览器支持
4. **存储限制**: 大量数据可能会超出localStorage限制，建议定期清理

## 🛠️ 开发者指南

### 添加新的主题变量
1. 在 `src/index.css` 中定义CSS变量
2. 在 `settingsManager.ts` 中的 `applyThemeSettings` 方法中应用变量
3. 在组件中使用CSS类或内联样式引用变量

### 添加新的分析事件
1. 在需要跟踪的地方调用 `analyticsService.trackEvent()`
2. 在 `analytics.ts` 中添加新的计算逻辑
3. 在数据洞察组件中显示新的指标

### 添加新的安全规则
1. 在 `types/settings.ts` 中定义新的规则类型
2. 在 `settingsManager.ts` 中实现规则逻辑
3. 在安全隐私组件中添加配置界面

## 📞 支持

如有问题或建议，请查看代码注释或联系开发团队。
