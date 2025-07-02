import React from 'react';
import { FileText, MessageSquare, Search, Package, Settings, BarChart3, Sparkles } from 'lucide-react';

interface SidebarSimpleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const SidebarSimple: React.FC<SidebarSimpleProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobileMenuOpen, 
  onMobileMenuToggle 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: '工作台概览',
      icon: BarChart3,
    },
    {
      id: 'copywriting',
      label: '文案生成',
      icon: FileText,
    },
    {
      id: 'dialogue',
      label: '对话创作',
      icon: MessageSquare,
    },
    {
      id: 'product-analysis',
      label: '产品分析',
      icon: Search,
    },
    {
      id: 'product-manager',
      label: '产品管理',
      icon: Package,
    },
    {
      id: 'template-manager',
      label: '模板管理',
      icon: FileText,
    },
    {
      id: 'history',
      label: '历史记录',
      icon: FileText,
    },
    {
      id: 'settings',
      label: '系统设置',
      icon: Settings,
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">文案AI助手</h1>
            <p className="text-xs text-gray-500 mt-0.5">智能营销文案创作</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SidebarSimple;
