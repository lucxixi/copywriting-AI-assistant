import React, { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  category: 'welcome' | 'product' | 'social' | 'activity' | 'service' | 'dialogue' | 'other';
  content: string;
  description: string;
  tags: string[];
  createdAt: string;
  useCount: number;
  type?: 'copywriting' | 'dialogue'; // 新增类型字段
  metadata?: {
    characters?: string[];
    scene?: string;
    painPoints?: string[];
  };
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'other',
    content: '',
    description: '',
    tags: []
  });

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'welcome', name: '欢迎语', icon: '👋' },
    { id: 'product', name: '产品推广', icon: '🛍️' },
    { id: 'social', name: '社交分享', icon: '📱' },
    { id: 'activity', name: '活动营销', icon: '🎉' },
    { id: 'service', name: '客服话术', icon: '💬' },
    { id: 'dialogue', name: '对话故事', icon: '🎭' },
    { id: 'other', name: '其他', icon: '📝' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchTerm]);

  const loadTemplates = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('copywritingTemplates') || '[]');

    // 如果没有模板，添加一些示例模板
    if (savedTemplates.length === 0) {
      const defaultTemplates: Template[] = [
        {
          id: 'welcome_1',
          name: '新用户欢迎',
          category: 'welcome',
          content: '🎉 欢迎加入我们！感谢您的信任，我们将为您提供最优质的服务。有任何问题随时联系我们！',
          description: '适用于新用户注册后的欢迎消息',
          tags: ['欢迎', '新用户', '感谢'],
          createdAt: new Date().toISOString(),
          useCount: 0
        },
        {
          id: 'product_1',
          name: '产品推荐模板',
          category: 'product',
          content: '✨ 【产品名称】限时特惠！\n🔥 原价 ¥XXX，现价仅需 ¥XXX\n💎 高品质保证，用户好评如潮\n⏰ 活动有限，抢完即止！\n👆 点击立即购买',
          description: '通用的产品推广文案模板',
          tags: ['产品', '推广', '特惠', '限时'],
          createdAt: new Date().toISOString(),
          useCount: 0
        },
        {
          id: 'social_1',
          name: '朋友圈分享',
          category: 'social',
          content: '今天又是充实的一天！💪\n分享一个好消息：【具体内容】\n感谢大家一直以来的支持！❤️\n#生活分享 #正能量',
          description: '适合朋友圈分享的正能量文案',
          tags: ['朋友圈', '分享', '正能量'],
          createdAt: new Date().toISOString(),
          useCount: 0
        }
      ];

      localStorage.setItem('copywritingTemplates', JSON.stringify(defaultTemplates));
      setTemplates(defaultTemplates);
    } else {
      setTemplates(savedTemplates);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      alert('请填写模板名称和内容');
      return;
    }

    const template: Template = {
      id: editingTemplate?.id || `template_${Date.now()}`,
      name: newTemplate.name!,
      category: newTemplate.category as Template['category'],
      content: newTemplate.content!,
      description: newTemplate.description || '',
      tags: newTemplate.tags || [],
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      useCount: editingTemplate?.useCount || 0
    };

    let updatedTemplates;
    if (editingTemplate) {
      updatedTemplates = templates.map(t => t.id === template.id ? template : t);
    } else {
      updatedTemplates = [...templates, template];
    }

    setTemplates(updatedTemplates);
    localStorage.setItem('copywritingTemplates', JSON.stringify(updatedTemplates));

    setIsCreating(false);
    setEditingTemplate(null);
    setNewTemplate({
      name: '',
      category: 'other',
      content: '',
      description: '',
      tags: []
    });
  };

  const handleEditTemplate = (template: Template) => {
    setNewTemplate(template);
    setEditingTemplate(template);
    setIsCreating(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      localStorage.setItem('copywritingTemplates', JSON.stringify(updatedTemplates));
    }
  };

  const handleUseTemplate = async (template: Template) => {
    // 增加使用次数
    const updatedTemplates = templates.map(t =>
      t.id === template.id ? { ...t, useCount: t.useCount + 1 } : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('copywritingTemplates', JSON.stringify(updatedTemplates));

    // 复制内容
    try {
      await navigator.clipboard.writeText(template.content);
      alert('模板内容已复制到剪贴板！');
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 模板管理</h1>
          <p className="text-gray-600 mt-1">创建和管理文案模板，提高创作效率</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 新建模板
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索模板名称、内容或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="grid gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' ? '没有找到匹配的模板' : '暂无模板'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm || selectedCategory !== 'all' ? '尝试调整搜索条件' : '点击"新建模板"创建第一个模板'}
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {categories.find(c => c.id === template.category)?.name}
                    </span>
                    {template.useCount > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        使用 {template.useCount} 次
                      </span>
                    )}
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {template.content}
                    </pre>
                  </div>
                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 transition-colors"
                  >
                    📋 使用
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                  >
                    ✏️ 编辑
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 创建/编辑模板弹窗 */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTemplate ? '编辑模板' : '新建模板'}
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTemplate(null);
                    setNewTemplate({
                      name: '',
                      category: 'other',
                      content: '',
                      description: '',
                      tags: []
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板名称 *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name || ''}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="请输入模板名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板分类
                  </label>
                  <select
                    value={newTemplate.category || 'other'}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as Template['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板内容 *
                  </label>
                  <textarea
                    value={newTemplate.content || ''}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    placeholder="请输入模板内容..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模板描述
                  </label>
                  <input
                    type="text"
                    value={newTemplate.description || ''}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="简单描述模板的用途"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签 <span className="text-gray-400">(用逗号分隔)</span>
                  </label>
                  <input
                    type="text"
                    value={newTemplate.tags?.join(', ') || ''}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    placeholder="例如：推广, 活动, 限时"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTemplate ? '保存修改' : '创建模板'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTemplate(null);
                    setNewTemplate({
                      name: '',
                      category: 'other',
                      content: '',
                      description: '',
                      tags: []
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;

// 导出模板管理的工具函数，供其他组件使用
export const templateUtils = {
  // 获取所有模板
  getAllTemplates: (): Template[] => {
    return JSON.parse(localStorage.getItem('copywritingTemplates') || '[]');
  },

  // 获取对话类型的模板
  getDialogueTemplates: (): Template[] => {
    const templates = templateUtils.getAllTemplates();
    return templates.filter(t => t.category === 'dialogue' || t.type === 'dialogue');
  },

  // 保存新模板
  saveTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'useCount'>): Template => {
    const newTemplate: Template = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      useCount: 0
    };

    const templates = templateUtils.getAllTemplates();
    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem('copywritingTemplates', JSON.stringify(updatedTemplates));

    return newTemplate;
  },

  // 增加模板使用次数
  incrementUsage: (templateId: string): void => {
    const templates = templateUtils.getAllTemplates();
    const updatedTemplates = templates.map(t =>
      t.id === templateId ? { ...t, useCount: t.useCount + 1 } : t
    );
    localStorage.setItem('copywritingTemplates', JSON.stringify(updatedTemplates));
  }
};