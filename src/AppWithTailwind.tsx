import React, { useState } from 'react';

function AppWithTailwind() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  console.log('AppWithTailwind rendering...', { activeTab });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">工作台概览</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">欢迎使用文案AI助手！</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">文案生成</h3>
                  <p className="text-blue-700 text-sm">智能生成营销文案</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">对话创作</h3>
                  <p className="text-purple-700 text-sm">创作对话故事</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">产品分析</h3>
                  <p className="text-green-700 text-sm">深度分析产品特性</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dialogue':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">对话创作</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">功能测试</h3>
                <p className="text-gray-600 mb-4">这里应该显示对话创作的功能界面</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">左侧：配置区域</h4>
                    <p className="text-gray-600 text-sm">产品信息、场景选择、角色设置等</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">右侧：生成结果</h4>
                    <p className="text-gray-600 text-sm">AI生成的对话内容</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  开始创作
                </button>
              </div>
            </div>
          </div>
        );
      case 'copywriting':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">文案生成</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">文案生成功能界面</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">工作台概览</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">欢迎使用文案AI助手！</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 简化的侧边栏 */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">文案AI助手</h1>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              📊 工作台概览
            </button>
            
            <button
              onClick={() => setActiveTab('copywriting')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'copywriting'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✍️ 文案生成
            </button>
            
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'dialogue'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              💬 对话创作
            </button>
          </div>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default AppWithTailwind;
