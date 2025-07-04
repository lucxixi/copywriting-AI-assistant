import React, { useState, useEffect } from 'react';
import { UnifiedTemplate, TemplateType, TemplateCategory } from '../types/prompts';
import { storageService } from '../services/storage';

const UnifiedTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<UnifiedTemplate>>({
    name: '',
    type: 'copywriting',
    category: 'other',
    isBuiltIn: false,
    isActive: true,
    content: {},
    metadata: {
      description: '',
      tags: [],
      difficulty: 'beginner',
      estimatedTime: 5,
      targetAudience: [],
      language: 'zh-CN'
    },
    usage: {
      useCount: 0,
      rating: 5,
      feedback: [],
      successRate: 100
    }
  });
  const [viewingTemplate, setViewingTemplate] = useState<UnifiedTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = storageService.getUnifiedTemplates();
    setTemplates(savedTemplates);
  };

  // 类型分组映射
  const typeMap: { [key in TemplateType]: { emoji: string; label: string } } = {
    copywriting: { emoji: '⚡', label: '文案生成' },
    prompt: { emoji: '📝', label: '提示词' },
    product: { emoji: '🛍️', label: '产品分析' },
    dialogue: { emoji: '💬', label: '对话故事' },
    script: { emoji: '📄', label: '话术分析' }
  };

  // 按类型分组
  const groupedByType: Record<TemplateType, UnifiedTemplate[]> = {
    copywriting: [],
    prompt: [],
    product: [],
    dialogue: [],
    script: []
  };
  templates.forEach(t => groupedByType[t.type].push(t));

  // 调试输出
  console.log('templates', templates);
  console.log('groupedByType', groupedByType);

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('确定要删除这个模板吗？')) {
      storageService.deleteUnifiedTemplate(templateId);
      loadTemplates();
    }
  };

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setNewTemplate({
      name: '',
      type: 'copywriting',
      category: 'other',
      isBuiltIn: false,
      isActive: true,
      content: {},
      metadata: {
        description: '',
        tags: [],
        difficulty: 'beginner',
        estimatedTime: 5,
        targetAudience: [],
        language: 'zh-CN'
      },
      usage: {
        useCount: 0,
        rating: 5,
        feedback: [],
        successRate: 100
      }
    });
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.metadata?.description) {
      alert('请填写模板名称和描述');
      return;
    }
    const templateToSave: UnifiedTemplate = {
      id: newTemplate.id || `template_${Date.now()}`,
      name: newTemplate.name!,
      type: newTemplate.type || 'copywriting',
      category: newTemplate.category || 'other',
      content: newTemplate.content || {},
      metadata: {
        description: newTemplate.metadata?.description || '',
        tags: newTemplate.metadata?.tags || [],
        difficulty: newTemplate.metadata?.difficulty || 'beginner',
        estimatedTime: newTemplate.metadata?.estimatedTime || 5,
        targetAudience: newTemplate.metadata?.targetAudience || [],
        language: newTemplate.metadata?.language || 'zh-CN'
      },
      usage: newTemplate.usage || {
        useCount: 0,
        rating: 5,
        feedback: [],
        successRate: 100
      },
      isBuiltIn: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    storageService.saveUnifiedTemplate(templateToSave);
    loadTemplates();
    setIsCreating(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* 标题和统计 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>📋 模板管理</h1>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 14 }}>
          <span>📚 总数：{templates.length}</span>
          <span>📊 使用：{templates.reduce((sum, t) => sum + t.usage.useCount, 0)}</span>
          <span>⭐ 平均分：{templates.length > 0 ? (templates.reduce((sum, t) => sum + t.usage.rating, 0) / templates.length).toFixed(1) : '0.0'}</span>
          <span>⚙️ 活跃：{templates.filter(t => t.isActive).length}</span>
        </div>
      </div>

      {/* 搜索和创建 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="🔍 搜索模板名称/描述/标签"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
        />
        <button
          onClick={handleCreateTemplate}
          style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
        >
          ➕ 创建模板
        </button>
      </div>

      {/* 类型分组展示，仅在搜索为空时显示 */}
      {searchTerm === '' && (
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.values(groupedByType).every(arr => arr.length === 0) && (
            <div style={{ color: '#bbb', textAlign: 'center', fontSize: 15, padding: 24 }}>
              暂无模板，请先创建模板
            </div>
          )}
          {Object.keys(typeMap).map(typeKey => {
            const type = typeKey as TemplateType;
            if (groupedByType[type].length === 0) return null;
            return (
              <div key={type}>
                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                  {typeMap[type].emoji} {typeMap[type].label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {groupedByType[type].map(t => (
                    <div key={t.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 18, minWidth: 220, maxWidth: 260, flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 16 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: '#888', minHeight: 18 }}>{t.metadata.description || '无'}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => alert(`正在使用模板：${t.name}`)}
                          style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 14, cursor: 'pointer' }}
                        >⚡ 使用</button>
                        <button
                          onClick={() => setViewingTemplate(t)}
                          style={{ flex: 1, background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 14, cursor: 'pointer' }}
                        >👁️ 查看</button>
                        <button
                          onClick={() => handleDeleteTemplate(t.id)}
                          style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 14, cursor: 'pointer' }}
                        >🗑️ 删除</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 创建模板弹窗 */}
      {isCreating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>➕ 创建新模板</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                placeholder="模板名称 *"
                value={newTemplate.name || ''}
                onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <textarea
                placeholder="模板描述 *"
                value={newTemplate.metadata?.description || ''}
                onChange={e => setNewTemplate({ ...newTemplate, metadata: { ...newTemplate.metadata!, description: e.target.value } })}
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14, minHeight: 60 }}
              />
              <input
                type="text"
                placeholder="标签（逗号分隔）"
                value={newTemplate.metadata?.tags?.join(', ') || ''}
                onChange={e => setNewTemplate({ ...newTemplate, metadata: { ...newTemplate.metadata!, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <select
                value={newTemplate.type || 'copywriting'}
                onChange={e => setNewTemplate({ ...newTemplate, type: e.target.value as TemplateType })}
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                <option value="copywriting">⚡ 文案生成</option>
                <option value="prompt">📝 提示词</option>
                <option value="product">🛍️ 产品分析</option>
                <option value="dialogue">💬 对话故事</option>
                <option value="script">📄 话术分析</option>
              </select>
              <select
                value={newTemplate.category || 'other'}
                onChange={e => setNewTemplate({ ...newTemplate, category: e.target.value as TemplateCategory })}
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                <option value="other">其他</option>
                <option value="welcome">欢迎语</option>
                <option value="product">产品推广</option>
                <option value="social">社交分享</option>
                <option value="activity">活动营销</option>
                <option value="service">客服话术</option>
                <option value="testimonial">用户反馈</option>
                <option value="lifestyle">生活场景</option>
                <option value="interaction">互动话题</option>
                <option value="analysis">分析类</option>
                <option value="story">故事类</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={handleSaveTemplate}
                style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}
              >💾 保存</button>
              <button
                onClick={() => setIsCreating(false)}
                style={{ flex: 1, background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}
              >取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 查看模板详情弹窗 */}
      {viewingTemplate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 320, maxWidth: 420, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', position: 'relative' }}>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{viewingTemplate.name}</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{viewingTemplate.metadata.description || '无描述'}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
              <div>类型：{typeMap[viewingTemplate.type].label}</div>
              <div>分类：{viewingTemplate.category}</div>
              <div>标签：{viewingTemplate.metadata.tags?.join(', ') || '无'}</div>
              <div>难度：{viewingTemplate.metadata.difficulty}</div>
              <div>目标用户：{viewingTemplate.metadata.targetAudience?.join(', ') || '无'}</div>
              <div>创建时间：{new Date(viewingTemplate.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>
              <div>内容：{viewingTemplate.content?.prompt || '无'}</div>
              <div>系统提示词：{viewingTemplate.content?.systemPrompt || '无'}</div>
            </div>
            <button
              onClick={() => setViewingTemplate(null)}
              style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}
            >✖️</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedTemplateManager; 