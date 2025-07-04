import React from 'react';

interface DashboardWithGuidesProps {
  onTabChange?: (tab: string) => void;
}

const stats = [
  { label: '文案生成', value: 128, icon: '📝', tab: 'copywriting' },
  { label: '产品管理', value: 24, icon: '📦', tab: 'product-manager' },
  { label: '模板管理', value: 12, icon: '📋', tab: 'template-manager' },
  { label: '历史记录', value: 320, icon: '🕒', tab: 'history' },
];

const quickLinks = [
  { label: '文案生成', icon: '📝', tab: 'copywriting', desc: 'AI智能生成营销文案' },
  { label: '产品管理', icon: '📦', tab: 'product-manager', desc: '管理你的产品信息' },
  { label: '模板管理', icon: '📋', tab: 'template-manager', desc: '统一管理文案模板' },
  { label: '系统设置', icon: '⚙️', tab: 'settings', desc: 'API与界面个性化' },
];

const guides = [
  { title: '快速上手', content: '1. 配置API密钥 2. 添加产品 3. 选择模板 4. 一键生成文案' },
  { title: '常见问题', content: '如遇API异常、生成失败、界面卡顿等，请刷新页面或检查设置。' },
];

const DashboardWithGuides: React.FC<DashboardWithGuidesProps> = ({ onTabChange }) => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      {/* 欢迎语与引导 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>👋 欢迎使用文案AI助手</div>
        <div style={{ color: '#666', fontSize: 16 }}>高效生成、管理和分析你的营销文案，助力业务增长</div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #eee', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{s.value}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>🚀 快捷入口</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {quickLinks.map(link => (
            <button
              key={link.tab}
              onClick={() => onTabChange && onTabChange(link.tab)}
              style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 10, padding: 24, cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{link.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 16 }}>{link.label}</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{link.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 新手帮助 */}
      <div style={{ background: '#f9fafb', borderRadius: 10, padding: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>🆘 新手帮助</div>
        <div style={{ display: 'flex', gap: 32 }}>
          {guides.map(g => (
            <div key={g.title} style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>{g.title}</div>
              <div style={{ color: '#555', fontSize: 14 }}>{g.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardWithGuides;
