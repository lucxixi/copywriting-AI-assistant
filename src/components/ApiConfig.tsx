import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  TestTube,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { ApiConfig as ApiConfigType, API_PROVIDERS } from '../types/api';
import { storageService } from '../services/storage';
import { apiService } from '../services/api';

const ApiConfig: React.FC = () => {
  const [configs, setConfigs] = useState<ApiConfigType[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Partial<ApiConfigType>>({});
  const [testingConfigId, setTestingConfigId] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; error?: string }>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const savedConfigs = storageService.getApiConfigs();
    const activeId = storageService.getActiveApiId();
    setConfigs(savedConfigs);
    setActiveConfigId(activeId);
  };

  const handleAddNew = () => {
    setEditingConfig({
      id: '',
      name: '',
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  };

  const handleEdit = (config: ApiConfigType) => {
    setEditingConfig(config);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingConfig.name || !editingConfig.apiKey || !editingConfig.model) {
      alert('请填写必要的配置信息');
      return;
    }

    const configToSave: ApiConfigType = {
      id: editingConfig.id || `api_${Date.now()}`,
      name: editingConfig.name!,
      provider: editingConfig.provider!,
      apiKey: editingConfig.apiKey!,
      baseUrl: editingConfig.baseUrl || API_PROVIDERS[editingConfig.provider!]?.baseUrl || '',
      model: editingConfig.model!,
      maxTokens: editingConfig.maxTokens || 1000,
      temperature: editingConfig.temperature || 0.7,
      isActive: editingConfig.isActive || false,
      createdAt: editingConfig.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storageService.saveApiConfig(configToSave);
    setIsEditing(false);
    setEditingConfig({});
    loadConfigs();
  };

  const handleDelete = (configId: string) => {
    if (confirm('确定要删除这个API配置吗？')) {
      storageService.deleteApiConfig(configId);
      loadConfigs();
    }
  };

  const handleSetActive = (configId: string) => {
    storageService.setActiveApi(configId);
    setActiveConfigId(configId);
  };

  const handleTestConnection = async (config: ApiConfigType) => {
    setTestingConfigId(config.id);
    const result = await apiService.testApiConnection(config);
    setTestResults(prev => ({ ...prev, [config.id]: result }));
    setTestingConfigId('');
  };

  const getProviderModels = (provider: string) => {
    return apiService.getAvailableModels(provider);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">API配置管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">配置和管理AI大模型API接口</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>添加API配置</span>
        </button>
      </div>

      {/* API配置列表 */}
      <div className="grid gap-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                  {activeConfigId === config.id && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">当前使用</span>
                  )}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {API_PROVIDERS[config.provider]?.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>模型: {config.model}</div>
                  <div>最大Token: {config.maxTokens}</div>
                  <div>温度: {config.temperature}</div>
                  {config.baseUrl && <div>API地址: {config.baseUrl}</div>}
                </div>
                
                {/* 测试结果 */}
                {testResults[config.id] && (
                  <div className={`mt-2 flex items-center space-x-2 text-sm ${
                    testResults[config.id].success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults[config.id].success ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>
                      {testResults[config.id].success 
                        ? '连接测试成功' 
                        : `连接失败: ${testResults[config.id].error}`
                      }
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleTestConnection(config)}
                  disabled={testingConfigId === config.id}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="测试连接"
                >
                  {testingConfigId === config.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                </button>
                
                {activeConfigId !== config.id && (
                  <button
                    onClick={() => handleSetActive(config.id)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    设为当前
                  </button>
                )}
                
                <button
                  onClick={() => handleEdit(config)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(config.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {configs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>还没有配置任何API</p>
            <p className="text-sm">点击"添加API配置"开始使用</p>
          </div>
        )}
      </div>

      {/* 编辑对话框 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingConfig.id ? '编辑API配置' : '添加API配置'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">配置名称</label>
                  <input
                    type="text"
                    value={editingConfig.name || ''}
                    onChange={(e) => setEditingConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="为这个配置起个名字"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API提供商</label>
                  <select
                    value={editingConfig.provider || 'openai'}
                    onChange={(e) => {
                      const provider = e.target.value as keyof typeof API_PROVIDERS;
                      setEditingConfig(prev => ({ 
                        ...prev, 
                        provider,
                        baseUrl: API_PROVIDERS[provider]?.baseUrl || '',
                        model: API_PROVIDERS[provider]?.defaultModel || ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                      <option key={key} value={key}>{provider.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API密钥</label>
                  <input
                    type="password"
                    value={editingConfig.apiKey || ''}
                    onChange={(e) => setEditingConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入API密钥"
                  />
                </div>
                
                {editingConfig.provider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API地址</label>
                    <input
                      type="url"
                      value={editingConfig.baseUrl || ''}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">模型</label>
                  {editingConfig.provider !== 'custom' ? (
                    <select
                      value={editingConfig.model || ''}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      {getProviderModels(editingConfig.provider || 'openai').map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editingConfig.model || ''}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="输入模型名称"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最大Token</label>
                    <input
                      type="number"
                      value={editingConfig.maxTokens || 1000}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min="100"
                      max="4000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">温度</label>
                    <input
                      type="number"
                      value={editingConfig.temperature || 0.7}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="2"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>保存</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
};

export default ApiConfig;
