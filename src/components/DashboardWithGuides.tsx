import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useProducts } from '../hooks/useProducts';
import { useTemplates } from '../hooks/useTemplates';
import ReactMarkdown from 'react-markdown';

interface DashboardWithGuidesProps {
  onTabChange?: (tab: string) => void;
}

const getQuickStartGuide = async (): Promise<string> => {
  // 动态加载 markdown 文件内容
  const res = await fetch('/快速入门指南.md');
  return await res.text();
};
const getFAQ = async (): Promise<string> => {
  const res = await fetch('/常见问题解答.md');
  return await res.text();
};

const DashboardWithGuides: React.FC<DashboardWithGuidesProps> = ({ onTabChange }) => {
  const { records } = useHistory();
  const { products } = useProducts();
  const { templates } = useTemplates();
  const [showGuide, setShowGuide] = useState(false);
  const [guideContent, setGuideContent] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [faqContent, setFAQContent] = useState('');
  const handleOpenGuide = async () => {
    setShowGuide(true);
    if (!guideContent) {
      const content = await getQuickStartGuide();
      setGuideContent(content);
    }
  };
  const handleOpenFAQ = async () => {
    setShowFAQ(true);
    if (!faqContent) {
      const content = await getFAQ();
      setFAQContent(content);
    }
  };

  // 统计数字联动
  const copywritingCount = records.filter(r => r.type === 'copywriting').length;
  const productCount = products.length;
  const templateCount = templates.length;
  const historyCount = records.length;

  const stats = [
    { label: '文案生成', value: copywritingCount, icon: '📝', tab: 'copywriting' },
    { label: '产品管理', value: productCount, icon: '📦', tab: 'product-manager' },
    { label: '模板管理', value: templateCount, icon: '📋', tab: 'template-manager' },
    { label: '历史记录', value: historyCount, icon: '🕒', tab: 'history' },
  ];

  const quickLinks = [
    { label: '文案生成', icon: '📝', tab: 'copywriting', desc: 'AI智能生成营销文案' },
    { label: '对话创作', icon: '💬', tab: 'dialogue', desc: '微信群聊对话生成，模拟真实场景' },
    { label: '产品管理', icon: '📦', tab: 'product-manager', desc: '管理你的产品信息' },
    { label: '产品分析', icon: '🔍', tab: 'product-analysis', desc: '深度分析产品卖点与用户痛点' },
    { label: '模板管理', icon: '📋', tab: 'template-manager', desc: '统一管理文案与对话模板' },
    { label: '系统设置', icon: '⚙️', tab: 'settings', desc: 'API与界面个性化' },
  ];

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

      {/* 新手帮助区域，两个按钮并排 */}
      <div style={{ background: '#f9fafb', borderRadius: 10, padding: 24, marginTop: 32 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>🆘 新手帮助</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <button onClick={handleOpenGuide} style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '18px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
            📖 查看快速入门指南
          </button>
          <button onClick={handleOpenFAQ} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '18px 0', fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
            ❓ 常见问题解答
          </button>
        </div>
      </div>
      {/* 快速入门指南弹窗 */}
      {showGuide && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 800, width: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 32px rgba(0,0,0,0.12)', padding: 32, position: 'relative' }}>
            <button onClick={() => setShowGuide(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>⚡ 快速入门指南</div>
            <div style={{ fontSize: 15, color: '#333' }}>
              <div style={{ lineHeight: 1.8 }}>
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 style={{fontSize: '2rem', fontWeight: 700, margin: '1.2em 0 0.7em 0', borderBottom: '2px solid #eee', paddingBottom: 8}} {...props} />,
                    h2: (props) => <h2 style={{fontSize: '1.5rem', fontWeight: 600, margin: '1.1em 0 0.6em 0', borderBottom: '1px solid #eee', paddingBottom: 6}} {...props} />,
                    h3: (props) => <h3 style={{fontSize: '1.2rem', fontWeight: 600, margin: '1em 0 0.5em 0'}} {...props} />,
                    h4: (props) => <h4 style={{fontSize: '1.1rem', fontWeight: 500, margin: '0.9em 0 0.4em 0'}} {...props} />,
                    p: (props) => <p style={{margin: '0.7em 0'}} {...props} />,
                    ul: (props) => <ul style={{margin: '0.7em 0 0.7em 1.5em', paddingLeft: 18}} {...props} />,
                    ol: (props) => <ol style={{margin: '0.7em 0 0.7em 1.5em', paddingLeft: 18}} {...props} />,
                    li: (props) => <li style={{margin: '0.3em 0'}} {...props} />,
                    pre: (props) => <pre style={{background: '#f6f8fa', borderRadius: 6, padding: 12, overflowX: 'auto', margin: '1em 0'}} {...props} />,
                    code: (props) => <code style={{background: '#f3f4f6', borderRadius: 4, padding: '2px 6px', fontSize: '0.97em'}} {...props} />,
                    blockquote: (props) => <blockquote style={{borderLeft: '4px solid #2563eb', background: '#f3f6fb', margin: '1em 0', padding: '8px 18px', color: '#555', fontStyle: 'italic'}} {...props} />,
                    a: (props) => <a style={{color: '#2563eb', textDecoration: 'underline'}} {...props} />
                  }}
                >{guideContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 常见问题解答弹窗 */}
      {showFAQ && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 800, width: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 32px rgba(0,0,0,0.12)', padding: 32, position: 'relative' }}>
            <button onClick={() => setShowFAQ(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>❓ 常见问题解答</div>
            <div style={{ fontSize: 15, color: '#333' }}>
              <div style={{ lineHeight: 1.8 }}>
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 style={{fontSize: '2rem', fontWeight: 700, margin: '1.2em 0 0.7em 0', borderBottom: '2px solid #eee', paddingBottom: 8}} {...props} />,
                    h2: (props) => <h2 style={{fontSize: '1.5rem', fontWeight: 600, margin: '1.1em 0 0.6em 0', borderBottom: '1px solid #eee', paddingBottom: 6}} {...props} />,
                    h3: (props) => <h3 style={{fontSize: '1.2rem', fontWeight: 600, margin: '1em 0 0.5em 0'}} {...props} />,
                    h4: (props) => <h4 style={{fontSize: '1.1rem', fontWeight: 500, margin: '0.9em 0 0.4em 0'}} {...props} />,
                    p: (props) => <p style={{margin: '0.7em 0'}} {...props} />,
                    ul: (props) => <ul style={{margin: '0.7em 0 0.7em 1.5em', paddingLeft: 18}} {...props} />,
                    ol: (props) => <ol style={{margin: '0.7em 0 0.7em 1.5em', paddingLeft: 18}} {...props} />,
                    li: (props) => <li style={{margin: '0.3em 0'}} {...props} />,
                    pre: (props) => <pre style={{background: '#f6f8fa', borderRadius: 6, padding: 12, overflowX: 'auto', margin: '1em 0'}} {...props} />,
                    code: (props) => <code style={{background: '#f3f4f6', borderRadius: 4, padding: '2px 6px', fontSize: '0.97em'}} {...props} />,
                    blockquote: (props) => <blockquote style={{borderLeft: '4px solid #10b981', background: '#f3fbf7', margin: '1em 0', padding: '8px 18px', color: '#555', fontStyle: 'italic'}} {...props} />,
                    a: (props) => <a style={{color: '#10b981', textDecoration: 'underline'}} {...props} />
                  }}
                >{faqContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWithGuides;
