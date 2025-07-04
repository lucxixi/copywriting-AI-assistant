// 安全隐私设置组件

import React, { useState } from 'react';
import { ContentFilterSettings, PrivacySettings, AccessControlSettings, DataCleanupSettings } from '../types/settings';

interface SecurityPrivacySettingsProps {
  contentFilterSettings: ContentFilterSettings;
  privacySettings: PrivacySettings;
  accessControlSettings: AccessControlSettings;
  dataCleanupSettings: DataCleanupSettings;
  onContentFilterChange: (settings: ContentFilterSettings) => void;
  onPrivacyChange: (settings: PrivacySettings) => void;
  onAccessControlChange: (settings: AccessControlSettings) => void;
  onDataCleanupChange: (settings: DataCleanupSettings) => void;
}

const SecurityPrivacySettings: React.FC<SecurityPrivacySettingsProps> = ({
  contentFilterSettings,
  privacySettings,
  accessControlSettings,
  dataCleanupSettings,
  onContentFilterChange,
  onPrivacyChange,
  onAccessControlChange,
  onDataCleanupChange
}) => {
  const [activeTab, setActiveTab] = useState<'filter' | 'privacy' | 'access' | 'cleanup'>('filter');
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showAddMask, setShowAddMask] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newSensitiveWord, setNewSensitiveWord] = useState('');
  const [newFilter, setNewFilter] = useState({ name: '', pattern: '', replacement: '' });
  const [newMask, setNewMask] = useState({ pattern: '', replacement: '' });
  const [newRule, setNewRule] = useState({ name: '', description: '', condition: '', action: 'delete' as const });
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'filter', name: '内容过滤', icon: '🔍' },
    { id: 'privacy', name: '隐私保护', icon: '🔒' },
    { id: 'access', name: '访问控制', icon: '🛡️' },
    { id: 'cleanup', name: '数据清理', icon: '🧹' }
  ];

  const handleAddSensitiveWord = () => {
    if (!newSensitiveWord.trim()) return;
    
    const updatedWords = [...contentFilterSettings.sensitiveWords, newSensitiveWord.trim()];
    onContentFilterChange({
      ...contentFilterSettings,
      sensitiveWords: updatedWords
    });
    setNewSensitiveWord('');
  };

  const handleRemoveSensitiveWord = (index: number) => {
    const updatedWords = contentFilterSettings.sensitiveWords.filter((_, i) => i !== index);
    onContentFilterChange({
      ...contentFilterSettings,
      sensitiveWords: updatedWords
    });
  };

  const handleAddCustomFilter = () => {
    if (!newFilter.name.trim() || !newFilter.pattern.trim()) return;
    
    const filter = {
      id: `filter_${Date.now()}`,
      name: newFilter.name,
      pattern: newFilter.pattern,
      replacement: newFilter.replacement,
      enabled: true
    };
    
    onContentFilterChange({
      ...contentFilterSettings,
      customFilters: [...contentFilterSettings.customFilters, filter]
    });
    
    setNewFilter({ name: '', pattern: '', replacement: '' });
    setShowAddFilter(false);
  };

  const handleToggleFilter = (filterId: string) => {
    const updatedFilters = contentFilterSettings.customFilters.map(filter =>
      filter.id === filterId ? { ...filter, enabled: !filter.enabled } : filter
    );
    onContentFilterChange({
      ...contentFilterSettings,
      customFilters: updatedFilters
    });
  };

  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = contentFilterSettings.customFilters.filter(filter => filter.id !== filterId);
    onContentFilterChange({
      ...contentFilterSettings,
      customFilters: updatedFilters
    });
  };

  const handleAddCustomMask = () => {
    if (!newMask.pattern.trim() || !newMask.replacement.trim()) return;
    
    const updatedMasks = [...privacySettings.anonymization.customMasks, newMask];
    onPrivacyChange({
      ...privacySettings,
      anonymization: {
        ...privacySettings.anonymization,
        customMasks: updatedMasks
      }
    });
    
    setNewMask({ pattern: '', replacement: '' });
    setShowAddMask(false);
  };

  const handleSetPassword = () => {
    if (passwordInput !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (passwordInput.length < 6) {
      alert('密码长度至少6位');
      return;
    }
    
    onAccessControlChange({
      ...accessControlSettings,
      passwordProtection: {
        ...accessControlSettings.passwordProtection,
        password: passwordInput,
        enabled: true
      }
    });
    
    setPasswordInput('');
    setConfirmPassword('');
    alert('密码设置成功');
  };

  const handleAddCleanupRule = () => {
    if (!newRule.name.trim() || !newRule.description.trim()) return;
    
    const rule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      description: newRule.description,
      condition: newRule.condition || '{}',
      action: newRule.action,
      enabled: true
    };
    
    onDataCleanupChange({
      ...dataCleanupSettings,
      cleanupRules: [...dataCleanupSettings.cleanupRules, rule]
    });
    
    setNewRule({ name: '', description: '', condition: '', action: 'delete' });
    setShowAddRule(false);
  };

  const handleManualCleanup = () => {
    if (confirm('确定要执行手动清理吗？这将根据设置的规则清理数据。')) {
      // 这里应该调用实际的清理服务
      const now = new Date().toISOString();
      onDataCleanupChange({
        ...dataCleanupSettings,
        manualCleanup: {
          lastCleanup: now,
          itemsRemoved: Math.floor(Math.random() * 100), // 模拟数据
          spaceFreed: Math.floor(Math.random() * 1024 * 1024) // 模拟数据
        }
      });
      alert('清理完成');
    }
  };

  const renderContentFilter = () => (
    <div className="space-y-6">
      {/* 基础设置 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">基础设置</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={contentFilterSettings.enabled}
              onChange={(e) => onContentFilterChange({
                ...contentFilterSettings,
                enabled: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">启用内容过滤</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={contentFilterSettings.autoReplace}
              onChange={(e) => onContentFilterChange({
                ...contentFilterSettings,
                autoReplace: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">自动替换敏感内容</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={contentFilterSettings.notifyOnFilter}
              onChange={(e) => onContentFilterChange({
                ...contentFilterSettings,
                notifyOnFilter: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">过滤时显示通知</span>
          </label>
        </div>
      </div>

      {/* 敏感词管理 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">敏感词管理</h4>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newSensitiveWord}
            onChange={(e) => setNewSensitiveWord(e.target.value)}
            placeholder="添加敏感词..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSensitiveWord()}
          />
          <button
            onClick={handleAddSensitiveWord}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {contentFilterSettings.sensitiveWords.map((word, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {word}
              <button
                onClick={() => handleRemoveSensitiveWord(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 自定义过滤器 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">自定义过滤器</h4>
          <button
            onClick={() => setShowAddFilter(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + 添加过滤器
          </button>
        </div>
        
        <div className="space-y-3">
          {contentFilterSettings.customFilters.map((filter) => (
            <div key={filter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{filter.name}</div>
                <div className="text-sm text-gray-500">
                  模式: {filter.pattern} → 替换: {filter.replacement || '(删除)'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleFilter(filter.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    filter.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {filter.enabled ? '启用' : '禁用'}
                </button>
                <button
                  onClick={() => handleRemoveFilter(filter.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加过滤器弹窗 */}
      {showAddFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加自定义过滤器</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">过滤器名称</label>
                <input
                  type="text"
                  value={newFilter.name}
                  onChange={(e) => setNewFilter({ ...newFilter, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: 电话号码过滤"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">匹配模式（正则表达式）</label>
                <input
                  type="text"
                  value={newFilter.pattern}
                  onChange={(e) => setNewFilter({ ...newFilter, pattern: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: \d{11}"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">替换内容（留空则删除）</label>
                <input
                  type="text"
                  value={newFilter.replacement}
                  onChange={(e) => setNewFilter({ ...newFilter, replacement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: [电话号码]"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddFilter(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCustomFilter}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {/* 数据加密 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">数据加密</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.dataEncryption.enabled}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataEncryption: {
                  ...privacySettings.dataEncryption,
                  enabled: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">启用本地数据加密</span>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">加密算法</label>
            <select
              value={privacySettings.dataEncryption.algorithm}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataEncryption: {
                  ...privacySettings.dataEncryption,
                  algorithm: e.target.value as any
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="AES-256">AES-256</option>
              <option value="AES-128">AES-128</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密钥轮换周期（天）</label>
            <input
              type="number"
              value={privacySettings.dataEncryption.keyRotationDays}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataEncryption: {
                  ...privacySettings.dataEncryption,
                  keyRotationDays: parseInt(e.target.value) || 30
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="365"
            />
          </div>
        </div>
      </div>

      {/* 数据保留 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">数据保留策略</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">历史记录保留（天）</label>
            <input
              type="number"
              value={privacySettings.dataRetention.historyDays}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataRetention: {
                  ...privacySettings.dataRetention,
                  historyDays: parseInt(e.target.value) || 30
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板保留（天）</label>
            <input
              type="number"
              value={privacySettings.dataRetention.templateDays}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataRetention: {
                  ...privacySettings.dataRetention,
                  templateDays: parseInt(e.target.value) || 90
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分析数据保留（天）</label>
            <input
              type="number"
              value={privacySettings.dataRetention.analysisDays}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataRetention: {
                  ...privacySettings.dataRetention,
                  analysisDays: parseInt(e.target.value) || 180
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.dataRetention.autoCleanup}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                dataRetention: {
                  ...privacySettings.dataRetention,
                  autoCleanup: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">自动清理过期数据</span>
          </label>
        </div>
      </div>

      {/* 数据匿名化 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">数据匿名化</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.anonymization.enabled}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                anonymization: {
                  ...privacySettings.anonymization,
                  enabled: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">启用数据匿名化</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.anonymization.maskPersonalInfo}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                anonymization: {
                  ...privacySettings.anonymization,
                  maskPersonalInfo: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">遮蔽个人信息</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.anonymization.maskBusinessInfo}
              onChange={(e) => onPrivacyChange({
                ...privacySettings,
                anonymization: {
                  ...privacySettings.anonymization,
                  maskBusinessInfo: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">遮蔽商业信息</span>
          </label>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium text-gray-900">自定义遮蔽规则</h5>
            <button
              onClick={() => setShowAddMask(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + 添加规则
            </button>
          </div>
          
          <div className="space-y-2">
            {privacySettings.anonymization.customMasks.map((mask, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">
                  {mask.pattern} → {mask.replacement}
                </span>
                <button
                  onClick={() => {
                    const updatedMasks = privacySettings.anonymization.customMasks.filter((_, i) => i !== index);
                    onPrivacyChange({
                      ...privacySettings,
                      anonymization: {
                        ...privacySettings.anonymization,
                        customMasks: updatedMasks
                      }
                    });
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 添加遮蔽规则弹窗 */}
      {showAddMask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加遮蔽规则</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">匹配模式</label>
                <input
                  type="text"
                  value={newMask.pattern}
                  onChange={(e) => setNewMask({ ...newMask, pattern: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: \d{4}-\d{4}-\d{4}-\d{4}"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">替换内容</label>
                <input
                  type="text"
                  value={newMask.replacement}
                  onChange={(e) => setNewMask({ ...newMask, replacement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: ****-****-****-****"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMask(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCustomMask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAccessControl = () => (
    <div className="space-y-6">
      {/* 密码保护 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">密码保护</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={accessControlSettings.passwordProtection.enabled}
              onChange={(e) => onAccessControlChange({
                ...accessControlSettings,
                passwordProtection: {
                  ...accessControlSettings.passwordProtection,
                  enabled: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">启用密码保护</span>
          </label>

          {accessControlSettings.passwordProtection.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="至少6位字符"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="再次输入密码"
                  />
                </div>
              </div>

              <button
                onClick={handleSetPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                设置密码
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会话超时（分钟）</label>
                  <input
                    type="number"
                    value={accessControlSettings.passwordProtection.sessionTimeout}
                    onChange={(e) => onAccessControlChange({
                      ...accessControlSettings,
                      passwordProtection: {
                        ...accessControlSettings.passwordProtection,
                        sessionTimeout: parseInt(e.target.value) || 30
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="480"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最大尝试次数</label>
                  <input
                    type="number"
                    value={accessControlSettings.passwordProtection.maxAttempts}
                    onChange={(e) => onAccessControlChange({
                      ...accessControlSettings,
                      passwordProtection: {
                        ...accessControlSettings.passwordProtection,
                        maxAttempts: parseInt(e.target.value) || 3
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">锁定时长（分钟）</label>
                  <input
                    type="number"
                    value={accessControlSettings.passwordProtection.lockoutDuration}
                    onChange={(e) => onAccessControlChange({
                      ...accessControlSettings,
                      passwordProtection: {
                        ...accessControlSettings.passwordProtection,
                        lockoutDuration: parseInt(e.target.value) || 15
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="120"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 模块访问限制 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">模块访问限制</h4>
        <div className="space-y-3">
          {[
            { id: 'copywriting', name: '文案生成', icon: '📝' },
            { id: 'dialogue', name: '对话创作', icon: '💬' },
            { id: 'product-analysis', name: '产品分析', icon: '🔍' },
            { id: 'template-manager', name: '模板管理', icon: '📋' },
            { id: 'history', name: '历史记录', icon: '🕒' }
          ].map((module) => {
            const restriction = accessControlSettings.moduleRestrictions[module.id] || { restricted: false, requirePassword: false };
            return (
              <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{module.icon}</span>
                  <span className="font-medium text-gray-900">{module.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={restriction.restricted}
                      onChange={(e) => onAccessControlChange({
                        ...accessControlSettings,
                        moduleRestrictions: {
                          ...accessControlSettings.moduleRestrictions,
                          [module.id]: {
                            ...restriction,
                            restricted: e.target.checked
                          }
                        }
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">限制访问</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={restriction.requirePassword}
                      onChange={(e) => onAccessControlChange({
                        ...accessControlSettings,
                        moduleRestrictions: {
                          ...accessControlSettings.moduleRestrictions,
                          [module.id]: {
                            ...restriction,
                            requirePassword: e.target.checked
                          }
                        }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">需要密码</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 导出限制 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">导出限制</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={accessControlSettings.exportRestrictions.requirePassword}
              onChange={(e) => onAccessControlChange({
                ...accessControlSettings,
                exportRestrictions: {
                  ...accessControlSettings.exportRestrictions,
                  requirePassword: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">导出时需要密码验证</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">允许的导出格式</label>
            <div className="flex flex-wrap gap-2">
              {['txt', 'docx', 'pdf', 'json'].map((format) => (
                <label key={format} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessControlSettings.exportRestrictions.allowedFormats.includes(format)}
                    onChange={(e) => {
                      const formats = e.target.checked
                        ? [...accessControlSettings.exportRestrictions.allowedFormats, format]
                        : accessControlSettings.exportRestrictions.allowedFormats.filter(f => f !== format);
                      onAccessControlChange({
                        ...accessControlSettings,
                        exportRestrictions: {
                          ...accessControlSettings.exportRestrictions,
                          allowedFormats: formats
                        }
                      });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{format.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">最大导出大小（MB）</label>
            <input
              type="number"
              value={accessControlSettings.exportRestrictions.maxExportSize}
              onChange={(e) => onAccessControlChange({
                ...accessControlSettings,
                exportRestrictions: {
                  ...accessControlSettings.exportRestrictions,
                  maxExportSize: parseInt(e.target.value) || 10
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="100"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataCleanup = () => (
    <div className="space-y-6">
      {/* 自动清理设置 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">自动清理设置</h4>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={dataCleanupSettings.autoCleanup.enabled}
              onChange={(e) => onDataCleanupChange({
                ...dataCleanupSettings,
                autoCleanup: {
                  ...dataCleanupSettings.autoCleanup,
                  enabled: e.target.checked
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">启用自动清理</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">清理频率</label>
              <select
                value={dataCleanupSettings.autoCleanup.schedule}
                onChange={(e) => onDataCleanupChange({
                  ...dataCleanupSettings,
                  autoCleanup: {
                    ...dataCleanupSettings.autoCleanup,
                    schedule: e.target.value as any
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">每日</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">数据保留天数</label>
              <input
                type="number"
                value={dataCleanupSettings.autoCleanup.retentionDays}
                onChange={(e) => onDataCleanupChange({
                  ...dataCleanupSettings,
                  autoCleanup: {
                    ...dataCleanupSettings.autoCleanup,
                    retentionDays: parseInt(e.target.value) || 30
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 手动清理 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">手动清理</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {dataCleanupSettings.manualCleanup.lastCleanup
                  ? new Date(dataCleanupSettings.manualCleanup.lastCleanup).toLocaleDateString()
                  : '从未清理'
                }
              </div>
              <div className="text-gray-600">最后清理时间</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {dataCleanupSettings.manualCleanup.itemsRemoved || 0}
              </div>
              <div className="text-gray-600">已清理项目</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {((dataCleanupSettings.manualCleanup.spaceFreed || 0) / 1024).toFixed(1)} KB
              </div>
              <div className="text-gray-600">释放空间</div>
            </div>
          </div>

          <button
            onClick={handleManualCleanup}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            立即执行清理
          </button>
        </div>
      </div>

      {/* 清理规则 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">清理规则</h4>
          <button
            onClick={() => setShowAddRule(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + 添加规则
          </button>
        </div>

        <div className="space-y-3">
          {dataCleanupSettings.cleanupRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{rule.name}</div>
                <div className="text-sm text-gray-500">{rule.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  动作: {rule.action === 'delete' ? '删除' : rule.action === 'archive' ? '归档' : '匿名化'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const updatedRules = dataCleanupSettings.cleanupRules.map(r =>
                      r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                    );
                    onDataCleanupChange({
                      ...dataCleanupSettings,
                      cleanupRules: updatedRules
                    });
                  }}
                  className={`px-2 py-1 rounded text-xs ${
                    rule.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {rule.enabled ? '启用' : '禁用'}
                </button>
                <button
                  onClick={() => {
                    const updatedRules = dataCleanupSettings.cleanupRules.filter(r => r.id !== rule.id);
                    onDataCleanupChange({
                      ...dataCleanupSettings,
                      cleanupRules: updatedRules
                    });
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加清理规则弹窗 */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加清理规则</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">规则名称</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: 清理旧的临时文件"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="描述这个规则的作用..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">执行动作</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="delete">删除</option>
                  <option value="archive">归档</option>
                  <option value="anonymize">匿名化</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddRule(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCleanupRule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
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
        {activeTab === 'filter' && renderContentFilter()}
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'access' && renderAccessControl()}
        {activeTab === 'cleanup' && renderDataCleanup()}
      </div>
    </div>
  );
};

export default SecurityPrivacySettings;
