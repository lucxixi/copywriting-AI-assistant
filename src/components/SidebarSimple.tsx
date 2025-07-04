import React from 'react';

interface SidebarSimpleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const SidebarSimple: React.FC<SidebarSimpleProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  const menuItems = [
    { id: 'dashboard', label: '工作台概览' },
    { id: 'copywriting', label: '文案生成' },
    { id: 'dialogue', label: '对话创作' },
    { id: 'product-analysis', label: '产品分析' },
    { id: 'product-manager', label: '产品管理' },
    { id: 'template-manager', label: '模板管理' },
    { id: 'history', label: '历史记录' },
    { id: 'settings', label: '系统设置' }
  ];

  return (
    <div style={{ width: 220, background: '#fff', borderRight: '1px solid #eee', height: '100vh', padding: 24 }}>
      <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 32 }}>文案AI助手</div>
      <nav>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 16px',
              marginBottom: 8,
              background: activeTab === item.id ? '#e0e7ff' : 'transparent',
              color: activeTab === item.id ? '#2563eb' : '#222',
              border: 'none',
              borderRadius: 6,
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: activeTab === item.id ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SidebarSimple;
