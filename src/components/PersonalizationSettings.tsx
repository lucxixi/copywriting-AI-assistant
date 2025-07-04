// 界面个性化设置组件

import React, { useState, useEffect } from 'react';
import { ThemeSettings, FontSettings, LayoutSettings, WorkspaceLayout } from '../types/settings';

interface PersonalizationSettingsProps {
  themeSettings: ThemeSettings;
  fontSettings: FontSettings;
  layoutSettings: LayoutSettings;
  workspaceLayouts: WorkspaceLayout[];
  activeWorkspaceLayoutId: string;
  onThemeChange: (settings: ThemeSettings) => void;
  onFontChange: (settings: FontSettings) => void;
  onLayoutChange: (settings: LayoutSettings) => void;
  onWorkspaceLayoutChange: (layoutId: string) => void;
  onCreateWorkspaceLayout: (layout: Omit<WorkspaceLayout, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const PersonalizationSettings: React.FC<PersonalizationSettingsProps> = ({
  themeSettings,
  fontSettings,
  layoutSettings,
  workspaceLayouts,
  activeWorkspaceLayoutId,
  onThemeChange,
  onFontChange,
  onLayoutChange,
  onWorkspaceLayoutChange,
  onCreateWorkspaceLayout
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'font' | 'layout' | 'workspace'>('theme');
  const [showCreateLayout, setShowCreateLayout] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');

  const tabs = [
    { id: 'theme', name: '主题定制', icon: '🎨' },
    { id: 'font', name: '字体设置', icon: '🔤' },
    { id: 'layout', name: '布局密度', icon: '📐' },
    { id: 'workspace', name: '工作区布局', icon: '🖥️' }
  ];

  const predefinedColors = [
    { name: '蓝色', value: '#3B82F6' },
    { name: '紫色', value: '#8B5CF6' },
    { name: '绿色', value: '#10B981' },
    { name: '红色', value: '#EF4444' },
    { name: '橙色', value: '#F59E0B' },
    { name: '粉色', value: '#EC4899' },
    { name: '青色', value: '#06B6D4' },
    { name: '灰色', value: '#6B7280' }
  ];

  const handleCreateWorkspaceLayout = () => {
    if (!newLayoutName.trim()) {
      alert('请输入布局名称');
      return;
    }

    const newLayout: Omit<WorkspaceLayout, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newLayoutName,
      description: newLayoutDescription,
      layout: {
        sidebarPosition: 'left',
        panelLayout: 'single',
        defaultModule: 'dashboard',
        pinnedModules: []
      },
      isDefault: false
    };

    onCreateWorkspaceLayout(newLayout);
    setShowCreateLayout(false);
    setNewLayoutName('');
    setNewLayoutDescription('');
  };

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">主题模式</h4>
        <div className="flex space-x-3">
          {[
            { value: 'light', label: '浅色', icon: '☀️' },
            { value: 'dark', label: '深色', icon: '🌙' },
            { value: 'auto', label: '自动', icon: '🔄' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => onThemeChange({ ...themeSettings, mode: mode.value as any })}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                themeSettings.mode === mode.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">主色调</h4>
        <div className="grid grid-cols-4 gap-3">
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onThemeChange({ ...themeSettings, primaryColor: color.value })}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                themeSettings.primaryColor === color.value
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-sm">{color.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">自定义颜色</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={themeSettings.primaryColor}
              onChange={(e) => onThemeChange({ ...themeSettings, primaryColor: e.target.value })}
              className="w-10 h-10 rounded border border-gray-300"
            />
            <input
              type="text"
              value={themeSettings.primaryColor}
              onChange={(e) => onThemeChange({ ...themeSettings, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">圆角设置</h4>
        <div className="flex space-x-3">
          {[
            { value: 'none', label: '无圆角', preview: 'rounded-none' },
            { value: 'small', label: '小圆角', preview: 'rounded-sm' },
            { value: 'medium', label: '中圆角', preview: 'rounded-md' },
            { value: 'large', label: '大圆角', preview: 'rounded-lg' }
          ].map((radius) => (
            <button
              key={radius.value}
              onClick={() => onThemeChange({ ...themeSettings, borderRadius: radius.value as any })}
              className={`px-4 py-2 border transition-colors ${radius.preview} ${
                themeSettings.borderRadius === radius.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {radius.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFontSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">字体族</h4>
        <div className="space-y-2">
          {[
            { value: 'system', label: '系统默认', preview: 'font-sans' },
            { value: 'serif', label: '衬线字体', preview: 'font-serif' },
            { value: 'mono', label: '等宽字体', preview: 'font-mono' }
          ].map((family) => (
            <button
              key={family.value}
              onClick={() => onFontChange({ ...fontSettings, family: family.value as any })}
              className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${family.preview} ${
                fontSettings.family === family.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{family.label}</div>
              <div className="text-sm text-gray-500 mt-1">
                这是 {family.label} 的预览效果 - The quick brown fox jumps over the lazy dog
              </div>
            </button>
          ))}
        </div>
        
        {fontSettings.family === 'custom' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">自定义字体</label>
            <input
              type="text"
              value={fontSettings.customFamily || ''}
              onChange={(e) => onFontChange({ ...fontSettings, customFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="例如: 'Helvetica Neue', Arial, sans-serif"
            />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">字体大小</h4>
        <div className="flex space-x-3">
          {[
            { value: 'small', label: '小', size: 'text-sm' },
            { value: 'medium', label: '中', size: 'text-base' },
            { value: 'large', label: '大', size: 'text-lg' },
            { value: 'extra-large', label: '特大', size: 'text-xl' }
          ].map((size) => (
            <button
              key={size.value}
              onClick={() => onFontChange({ ...fontSettings, size: size.value as any })}
              className={`px-4 py-2 border rounded-lg transition-colors ${size.size} ${
                fontSettings.size === size.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">行高</h4>
        <div className="flex space-x-3">
          {[
            { value: 'tight', label: '紧凑', class: 'leading-tight' },
            { value: 'normal', label: '正常', class: 'leading-normal' },
            { value: 'relaxed', label: '宽松', class: 'leading-relaxed' }
          ].map((height) => (
            <button
              key={height.value}
              onClick={() => onFontChange({ ...fontSettings, lineHeight: height.value as any })}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                fontSettings.lineHeight === height.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {height.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">布局密度</h4>
        <div className="space-y-3">
          {[
            { value: 'compact', label: '紧凑', description: '更小的间距，适合小屏幕' },
            { value: 'standard', label: '标准', description: '平衡的间距，适合大多数情况' },
            { value: 'spacious', label: '宽松', description: '更大的间距，适合大屏幕' }
          ].map((density) => (
            <button
              key={density.value}
              onClick={() => onLayoutChange({ ...layoutSettings, density: density.value as any })}
              className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                layoutSettings.density === density.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{density.label}</div>
              <div className="text-sm text-gray-500 mt-1">{density.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">侧边栏宽度</h4>
        <div className="flex space-x-3">
          {[
            { value: 'narrow', label: '窄', width: '200px' },
            { value: 'normal', label: '正常', width: '250px' },
            { value: 'wide', label: '宽', width: '300px' }
          ].map((width) => (
            <button
              key={width.value}
              onClick={() => onLayoutChange({ ...layoutSettings, sidebarWidth: width.value as any })}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                layoutSettings.sidebarWidth === width.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div>{width.label}</div>
              <div className="text-xs text-gray-500">{width.width}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">内容最大宽度</h4>
        <div className="flex space-x-3">
          {[
            { value: 'full', label: '全宽', description: '使用全部可用宽度' },
            { value: 'container', label: '容器', description: '限制在容器宽度内' },
            { value: 'narrow', label: '窄版', description: '适合阅读的窄宽度' }
          ].map((width) => (
            <button
              key={width.value}
              onClick={() => onLayoutChange({ ...layoutSettings, contentMaxWidth: width.value as any })}
              className={`flex-1 text-center px-4 py-3 border rounded-lg transition-colors ${
                layoutSettings.contentMaxWidth === width.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{width.label}</div>
              <div className="text-xs text-gray-500 mt-1">{width.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkspaceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-900">工作区布局</h4>
        <button
          onClick={() => setShowCreateLayout(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + 新建布局
        </button>
      </div>

      <div className="space-y-3">
        {workspaceLayouts.map((layout) => (
          <div
            key={layout.id}
            className={`p-4 border rounded-lg transition-colors cursor-pointer ${
              activeWorkspaceLayoutId === layout.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onWorkspaceLayoutChange(layout.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{layout.name}</div>
                {layout.description && (
                  <div className="text-sm text-gray-500 mt-1">{layout.description}</div>
                )}
              </div>
              {layout.isDefault && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">默认</span>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              侧边栏: {layout.layout.sidebarPosition === 'left' ? '左侧' : '右侧'} | 
              面板: {layout.layout.panelLayout === 'single' ? '单面板' : layout.layout.panelLayout === 'split' ? '分割' : '标签页'}
            </div>
          </div>
        ))}
      </div>

      {showCreateLayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">创建新布局</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">布局名称</label>
                <input
                  type="text"
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: 我的工作布局"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
                <textarea
                  value={newLayoutDescription}
                  onChange={(e) => setNewLayoutDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="描述这个布局的用途..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateLayout(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateWorkspaceLayout}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 标签导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === 'theme' && renderThemeSettings()}
        {activeTab === 'font' && renderFontSettings()}
        {activeTab === 'layout' && renderLayoutSettings()}
        {activeTab === 'workspace' && renderWorkspaceSettings()}
      </div>
    </div>
  );
};

export default PersonalizationSettings;
