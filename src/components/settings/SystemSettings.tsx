import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { ApiSettings } from './ApiSettings';
import { SettingsTab } from '../../types/settings';

export function SystemSettings() {
  const {
    settings,
    isLoading,
    error,
    saveStatus,
    saveSettings,
    updateSettings,
    updateModuleSettings,
    addApiKey,
    removeApiKey,
    setActiveApiKey,
    testApiConnection,
    resetToDefaults,
    clearAllData,
    exportSettings,
    importSettings,
    getAvailableModels,
    getApiProviders
  } = useSettings();

  const [activeTab, setActiveTab] = useState('api');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const tabs: SettingsTab[] = [
    { id: 'api', name: 'API配置', icon: '🔑', description: '管理API密钥和模型设置', category: 'basic' },
    { id: 'generation', name: '生成设置', icon: '⚙️', description: '配置内容生成参数', category: 'basic' },
    { id: 'interface', name: '界面设置', icon: '🎨', description: '自定义界面外观', category: 'basic' },
    { id: 'data', name: '数据管理', icon: '💾', description: '管理历史记录和数据', category: 'data' },
    { id: 'export', name: '导出设置', icon: '📤', description: '配置导出选项', category: 'basic' },
    { id: 'notifications', name: '通知设置', icon: '🔔', description: '管理通知偏好', category: 'basic' },
    { id: 'security', name: '安全隐私', icon: '🔒', description: '安全和隐私设置', category: 'security' }
  ];

  const handleImportSettings = async () => {
    if (!importFile) return;

    setImportStatus('importing');
    try {
      await importSettings(importFile);
      setImportStatus('success');
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus('idle');
        setImportFile(null);
      }, 2000);
    } catch (error) {
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleSave = async () => {
    await saveSettings();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'api':
        return (
          <ApiSettings
            apiKeys={settings.apiKeys}
            model={settings.model}
            onAddApiKey={addApiKey}
            onRemoveApiKey={removeApiKey}
            onSetActiveApiKey={setActiveApiKey}
            onTestConnection={testApiConnection}
            onUpdateSettings={updateSettings}
            getAvailableModels={getAvailableModels}
            getApiProviders={getApiProviders}
          />
        );
      case 'generation':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">生成参数设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 文案生成设置 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">文案生成</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">温度 (Temperature)</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.copywritingSettings.temperature}
                        onChange={(e) => updateModuleSettings('copywriting', 'temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>保守 (0)</span>
                        <span>平衡 (1)</span>
                        <span>创意 (2)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">最大Token数</label>
                      <input
                        type="number"
                        value={settings.copywritingSettings.maxTokens}
                        onChange={(e) => updateModuleSettings('copywriting', 'maxTokens', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="100"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">风格</label>
                      <select
                        value={settings.copywritingSettings.style}
                        onChange={(e) => updateModuleSettings('copywriting', 'style', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="专业">专业</option>
                        <option value="亲切">亲切</option>
                        <option value="幽默">幽默</option>
                        <option value="正式">正式</option>
                        <option value="简洁">简洁</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 对话生成设置 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">对话生成</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">温度 (Temperature)</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.dialogueSettings.temperature}
                        onChange={(e) => updateModuleSettings('dialogue', 'temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">最大Token数</label>
                      <input
                        type="number"
                        value={settings.dialogueSettings.maxTokens}
                        onChange={(e) => updateModuleSettings('dialogue', 'maxTokens', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="100"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">风格</label>
                      <select
                        value={settings.dialogueSettings.style}
                        onChange={(e) => updateModuleSettings('dialogue', 'style', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="亲切">亲切</option>
                        <option value="专业">专业</option>
                        <option value="幽默">幽默</option>
                        <option value="正式">正式</option>
                        <option value="简洁">简洁</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'interface':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">界面设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主题模式</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSettings('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="light">浅色模式</option>
                    <option value="dark">深色模式</option>
                    <option value="auto">跟随系统</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings('fontSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="small">小</option>
                    <option value="medium">中</option>
                    <option value="large">大</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">布局密度</label>
                  <select
                    value={settings.layoutDensity}
                    onChange={(e) => updateSettings('layoutDensity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="compact">紧凑</option>
                    <option value="standard">标准</option>
                    <option value="comfortable">舒适</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">历史记录保留天数</label>
                  <input
                    type="number"
                    value={settings.historyRetentionDays}
                    onChange={(e) => updateSettings('historyRetentionDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最大历史记录数</label>
                  <input
                    type="number"
                    value={settings.maxHistoryRecords}
                    onChange={(e) => updateSettings('maxHistoryRecords', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="100"
                    max="10000"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoCleanup}
                    onChange={(e) => updateSettings('autoCleanup', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">自动清理过期数据</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'export':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">导出设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">默认导出格式</label>
                  <select
                    value={settings.defaultExportFormat}
                    onChange={(e) => updateSettings('defaultExportFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="txt">文本文件 (.txt)</option>
                    <option value="docx">Word文档 (.docx)</option>
                    <option value="pdf">PDF文档 (.pdf)</option>
                    <option value="csv">CSV表格 (.csv)</option>
                    <option value="json">JSON数据 (.json)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeMetadata}
                    onChange={(e) => updateSettings('includeMetadata', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">导出时包含元数据</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">成功通知</h4>
                    <p className="text-sm text-gray-600">显示操作成功的通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showSuccessNotifications}
                      onChange={(e) => updateSettings('showSuccessNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">错误通知</h4>
                    <p className="text-sm text-gray-600">显示操作失败的错误通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showErrorNotifications}
                      onChange={(e) => updateSettings('showErrorNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">通知显示时长 (毫秒)</label>
                  <input
                    type="number"
                    value={settings.notificationDuration}
                    onChange={(e) => updateSettings('notificationDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1000"
                    max="10000"
                    step="500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">安全隐私设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">数据加密</h4>
                    <p className="text-sm text-gray-600">启用本地数据加密</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacySettings.dataEncryption.enabled}
                      onChange={(e) => updateSettings('privacySettings', {
                        ...settings.privacySettings,
                        dataEncryption: {
                          ...settings.privacySettings.dataEncryption,
                          enabled: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">匿名化数据</h4>
                    <p className="text-sm text-gray-600">自动匿名化敏感信息</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacySettings.anonymization.enabled}
                      onChange={(e) => updateSettings('privacySettings', {
                        ...settings.privacySettings,
                        anonymization: {
                          ...settings.privacySettings.anonymization,
                          enabled: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>选择要配置的设置项</div>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            配置应用程序的各种设置和偏好
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {saveStatus === 'saving' ? '保存中...' : 
               saveStatus === 'saved' ? '已保存' : '保存设置'}
            </span>
          </button>
          <button
            onClick={exportSettings}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>导入</span>
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* 标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">加载设置中...</span>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>

      {/* 危险操作区域 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">危险操作</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置为默认设置</span>
          </button>
          <button
            onClick={clearAllData}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>清除所有数据</span>
          </button>
        </div>
      </div>

      {/* 导入设置模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">导入设置</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择设置文件
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {importStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>设置导入成功！</span>
                  </div>
                )}

                {importStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>设置导入失败，请检查文件格式</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleImportSettings}
                  disabled={!importFile || importStatus === 'importing'}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {importStatus === 'importing' ? '导入中...' : '导入设置'}
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 