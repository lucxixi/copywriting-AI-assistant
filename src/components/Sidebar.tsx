import React from 'react';
import { PenTool, BookTemplate as Template, Database, BarChart3, Settings, User, FileText, Zap, Users, Sparkles, X, Menu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuToggle }) => {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: '工作台', description: '概览与统计' },
    { id: 'generate', icon: PenTool, label: '文案生成', description: '智能创作' },
    { id: 'templates', icon: Template, label: '模板管理', description: '提示词库' },
    { id: 'data', icon: Database, label: '数据管理', description: '用户产品' },
    { id: 'team', icon: Users, label: '团队协作', description: '协同工作' },
    { id: 'settings', icon: Settings, label: '系统设置', description: '配置管理' },
  ];

  const handleMenuItemClick = (itemId: string) => {
    onTabChange(itemId);
    if (isMobileMenuOpen) {
      onMobileMenuToggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 h-full flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI文案助手</h1>
              <p className="text-xs text-gray-500">私域运营专家</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-medium text-sm truncate ${isActive ? 'text-blue-700' : ''}`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">张运营</div>
              <div className="text-xs text-gray-500 truncate">高级运营专员</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;