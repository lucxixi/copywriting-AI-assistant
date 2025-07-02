import React from 'react';
import { PenTool, BookOpen as Template, Database, BarChart3, Settings, User, Users, Sparkles, X, Menu, MessageSquare, ShoppingBag, MessageCircle, FileText, Search, Package, FolderOpen, Clock } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuToggle }) => {
  const menuItems = [
    {
      id: 'copywriting',
      label: '文案生成',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      description: '生成各种类型的营销文案'
    },
    {
      id: 'dialogue',
      label: '对话创作',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      description: '创作对话故事，分析营销话术'
    },
    {
      id: 'product-analysis',
      label: '产品分析',
      icon: Search,
      color: 'from-green-500 to-emerald-500',
      description: '分析产品信息生成详细文案'
    },
    {
      id: 'product-manager',
      label: '产品管理',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      description: '管理产品信息和分析结果'
    },

    {
      id: 'template-manager',
      label: '模板管理',
      icon: FolderOpen,
      color: 'from-teal-500 to-cyan-500',
      description: '管理文案和对话模板'
    },
    {
      id: 'history',
      label: '历史记录',
      icon: Clock,
      color: 'from-indigo-500 to-purple-500',
      description: '查看和管理生成历史'
    },
    {
      id: 'settings',
      label: '系统设置',
      icon: Settings,
      color: 'from-gray-500 to-gray-700',
      description: '配置管理'
    }
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
        <button
          className="w-full text-left p-6 border-b border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => {
            onTabChange('dashboard');
            if (isMobileMenuOpen) onMobileMenuToggle();
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI文案助手</h1>
              <p className="text-xs text-gray-500">私域运营专家</p>
            </div>
          </div>
        </button>

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