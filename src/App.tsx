import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CopywritingGenerator from './components/CopywritingGenerator';
import TemplateManager from './components/TemplateManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'generate':
        return <CopywritingGenerator />;
      case 'templates':
        return <TemplateManager />;
      case 'data':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">数据管理</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">用户数据和产品信息管理功能正在开发中...</p>
          </div>
        );
      case 'team':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">团队协作</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">团队协作和权限管理功能正在开发中...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">系统设置</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">系统配置和个人设置功能正在开发中...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="pt-16 lg:pt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;