import React, { useState } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { ApiKey } from '../../types/settings';

interface ApiSettingsProps {
  apiKeys: ApiKey[];
  activeApiKeyId: string;
  model: string;
  onAddApiKey: (provider: ApiKey['provider'], name: string, key: string) => void;
  onRemoveApiKey: (keyId: string) => void;
  onSetActiveApiKey: (keyId: string) => void;
  onTestConnection: (apiKey?: string) => Promise<boolean>;
  onUpdateSettings: (key: string, value: unknown) => void;
  getAvailableModels: () => Array<{ id: string; name: string; provider: string }>;
  getApiProviders: () => Array<{ id: string; name: string; icon: string }>;
}

export function ApiSettings({
  apiKeys,
  model,
  onAddApiKey,
  onRemoveApiKey,
  onSetActiveApiKey,
  onTestConnection,
  onUpdateSettings,
  getAvailableModels,
  getApiProviders
}: ApiSettingsProps) {
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState({
    provider: 'google' as ApiKey['provider'],
    name: '',
    key: ''
  });

  const handleTestConnection = async (apiKey?: string) => {
    setTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      const success = await onTestConnection(apiKey);
      setConnectionStatus(success ? 'success' : 'error');
    } catch {
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.key) {
      alert('请填写API密钥名称和密钥值');
      return;
    }
    
    onAddApiKey(newApiKey.provider, newApiKey.name, newApiKey.key);
    setNewApiKey({ provider: 'google', name: '', key: '' });
    setShowAddModal(false);
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // 可以显示成功提示
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      google: '🔑',
      openrouter: '🔗',
      together: '🤝',
      siliconflow: '⚡'
    };
    return icons[provider] || '🔑';
  };

  const getProviderName = (provider: string) => {
    const names: Record<string, string> = {
      google: 'Google Gemini',
      openrouter: 'OpenRouter',
      together: 'Together AI',
      siliconflow: 'SiliconFlow'
    };
    return names[provider] || provider;
  };

  return (
    <div className="space-y-6">
      {/* API密钥管理 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API密钥管理</h3>
            <p className="text-gray-600 mt-1">配置和管理您的AI服务API密钥</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>添加密钥</span>
          </button>
        </div>

        {/* API密钥列表 */}
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>还没有配置API密钥</p>
              <p className="text-sm">点击上方按钮添加您的第一个API密钥</p>
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className={`border rounded-lg p-4 ${
                  apiKey.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getProviderIcon(apiKey.provider)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                        {apiKey.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            活跃
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {getProviderName(apiKey.provider)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>调用次数: {apiKey.usage.calls}</span>
                        <span>Token数: {apiKey.usage.tokens.toLocaleString()}</span>
                        {apiKey.usage.lastUsed && (
                          <span>最后使用: {new Date(apiKey.usage.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* 显示/隐藏密钥 */}
                    <button
                      onClick={() => setShowApiKey(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title={showApiKey[apiKey.id] ? '隐藏密钥' : '显示密钥'}
                    >
                      {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* 复制密钥 */}
                    <button
                      onClick={() => handleCopyApiKey(apiKey.key)}
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="复制密钥"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* 测试连接 */}
                    <button
                      onClick={() => handleTestConnection(apiKey.key)}
                      disabled={testingConnection}
                      className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      title="测试连接"
                    >
                      {testingConnection ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                    </button>

                    {/* 设为活跃 */}
                    {!apiKey.isActive && (
                      <button
                        onClick={() => onSetActiveApiKey(apiKey.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        设为活跃
                      </button>
                    )}

                    {/* 删除密钥 */}
                    <button
                      onClick={() => {
                        if (confirm('确定要删除这个API密钥吗？')) {
                          onRemoveApiKey(apiKey.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="删除密钥"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 显示密钥值 */}
                {showApiKey[apiKey.id] && (
                  <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono break-all">
                    {apiKey.key}
                  </div>
                )}

                {/* 连接状态 */}
                {connectionStatus !== 'idle' && (
                  <div className="mt-3 flex items-center space-x-2">
                    {connectionStatus === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {connectionStatus === 'success' ? '连接成功' : '连接失败'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 模型选择 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">模型选择</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            默认模型
          </label>
          <select
            value={model}
            onChange={(e) => onUpdateSettings('model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getAvailableModels().map((modelOption) => (
              <option key={modelOption.id} value={modelOption.id}>
                {modelOption.name} ({modelOption.provider})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            选择用于生成内容的默认AI模型
          </p>
        </div>
      </div>

      {/* 添加API密钥模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">添加API密钥</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* 提供商选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API提供商
                  </label>
                  <select
                    value={newApiKey.provider}
                    onChange={(e) => setNewApiKey(prev => ({ 
                      ...prev, 
                      provider: e.target.value as ApiKey['provider'] 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getApiProviders().map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.icon} {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 密钥名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    密钥名称
                  </label>
                  <input
                    type="text"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="给这个密钥起个名字"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* API密钥 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API密钥
                  </label>
                  <input
                    type="password"
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="输入您的API密钥"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddApiKey}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  添加密钥
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
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