import React, { useState, useEffect } from 'react';
import SidebarSimple from './components/SidebarSimple';
import DashboardWithGuides from './components/DashboardWithGuides';
import CopywritingGeneratorFixed from './components/CopywritingGeneratorFixed';
import ProductManager from './components/ProductManager';
import ProductAnalysis from './components/ProductAnalysis';
import UnifiedTemplateManager from './components/UnifiedTemplateManager';
import SystemSettings from './components/SystemSettings';
import ConversationHub from './components/ConversationHub';
import HistoryCenter from './components/HistoryCenter';
import { settingsManager } from './services/settingsManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    settingsManager.applyThemeSettings();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardWithGuides onTabChange={setActiveTab} />;
      case 'copywriting':
        return <CopywritingGeneratorFixed />;
      case 'product-manager':
        return <ProductManager />;
      case 'template-manager':
        return <UnifiedTemplateManager />;
      case 'product-analysis':
        return <ProductAnalysis />;
      case 'dialogue':
        return <ConversationHub />;
      case 'settings':
        return <SystemSettings />;
      case 'history':
        return <HistoryCenter />;
      default:
        return <DashboardWithGuides onTabChange={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      <SidebarSimple
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileMenuOpen={false}
        onMobileMenuToggle={() => {}}
      />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;