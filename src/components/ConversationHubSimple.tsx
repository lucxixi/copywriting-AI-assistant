import React, { useState, useEffect } from 'react';
import { ProductAnalysisResult } from '../types/prompts';
import { storageService } from '../services/storage';

interface Character {
  id: string;
  name: string;
  role: 'customer' | 'seller';
  personality: string;
  painPoints: string[];
}

const ConversationHubSimple: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysisResult | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductAnalysisResult[]>([]);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'analyze'>('create');

  useEffect(() => {
    loadAvailableProducts();
    checkApiConfiguration();
    initializeDefaultCharacters();
  }, []);

  const loadAvailableProducts = () => {
    const products = storageService.getProductAnalysisResults();
    setAvailableProducts(products);
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  };

  const checkApiConfiguration = () => {
    const activeConfig = storageService.getActiveApiConfig();
    setApiConfigured(!!activeConfig);
  };

  const initializeDefaultCharacters = () => {
    const defaultCharacters: Character[] = [
      {
        id: 'char_1',
        name: '小李',
        role: 'customer',
        personality: '谨慎型消费者，注重性价比',
        painPoints: ['价格敏感', '担心质量', '需要详细说明']
      },
      {
        id: 'char_2',
        name: '销售员',
        role: 'seller',
        personality: '专业热情，善于解答疑问',
        painPoints: []
      }
    ];
    setCharacters(defaultCharacters);
  };

  const handleGenerateDialogue = () => {
    if (!selectedProduct || !apiConfigured) {
      alert('请先选择产品并配置API');
      return;
    }
    
    // 这里会调用对话生成逻辑
    console.log('生成对话:', { selectedProduct, characters });
    alert('对话生成功能正在开发中...');
  };

  const handleAnalyzeScript = () => {
    alert('话术分析功能正在开发中...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">对话创作</h1>
          <p className="text-gray-600 mt-1">创建营销对话和分析话术脚本</p>
        </div>
      </div>

      {/* API 配置检查 */}
      {!apiConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 text-lg mr-2">⚠️</span>
            <div>
              <h3 className="text-yellow-800 font-medium">API 配置提醒</h3>
              <p className="text-yellow-700 text-sm mt-1">
                请先在系统设置中配置 AI API，以便使用对话生成功能。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 标签页切换 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            💬 对话创作
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analyze'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 话术分析
          </button>
        </nav>
      </div>

      {/* 对话创作标签页 */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* 产品选择 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📦 选择产品</h3>
            {availableProducts.length > 0 ? (
              <div className="space-y-3">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{product.productName}</h4>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">¥{product.price}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📦</span>
                <p className="text-gray-500">暂无产品数据</p>
                <p className="text-sm text-gray-400 mt-1">请先在产品分析中添加产品</p>
              </div>
            )}
          </div>

          {/* 角色设置 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">👥 角色设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characters.map((character) => (
                <div key={character.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">
                      {character.role === 'customer' ? '🛒' : '👨‍💼'}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">{character.name}</h4>
                      <p className="text-sm text-gray-500">
                        {character.role === 'customer' ? '客户' : '销售员'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500">性格特点</label>
                      <p className="text-sm text-gray-700">{character.personality}</p>
                    </div>
                    {character.painPoints.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-500">关注点</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.painPoints.map((point, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateDialogue}
              disabled={!selectedProduct || !apiConfigured}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              🚀 生成对话
            </button>
          </div>
        </div>
      )}

      {/* 话术分析标签页 */}
      {activeTab === 'analyze' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📄 上传话术文件</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <span className="text-4xl mb-4 block">📁</span>
              <p className="text-gray-500 mb-2">拖拽文件到此处或点击上传</p>
              <p className="text-sm text-gray-400">支持 .txt, .docx, .pdf 格式</p>
              <button
                onClick={handleAnalyzeScript}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                选择文件
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📊 分析结果</h3>
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📈</span>
              <p className="text-gray-500">上传文件后查看分析结果</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHubSimple;
