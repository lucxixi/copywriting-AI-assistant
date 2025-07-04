import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  tags: string[];
}

const defaultCategories = [
  { id: 'all', name: '全部', icon: '📦' },
  { id: 'digital', name: '数码', icon: '💻' },
  { id: 'fashion', name: '时尚', icon: '👗' },
  { id: 'food', name: '美食', icon: '🍔' },
  { id: 'home', name: '家居', icon: '🏠' },
  { id: 'other', name: '其他', icon: '📝' }
];

const getLocalProducts = (): Product[] => {
  const raw = localStorage.getItem('products');
  return raw ? JSON.parse(raw) : [];
};
const setLocalProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({ name: '', category: 'other', description: '', tags: [] });

  useEffect(() => {
    setProducts(getLocalProducts());
  }, []);

  useEffect(() => {
    let list = products;
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (search) list = list.filter(p => p.name.includes(search) || (p.tags && p.tags.some(t => t.includes(search))));
    setFiltered(list);
  }, [products, search, category]);

  const handleSave = () => {
    if (!form.name) {
      alert('请填写产品名称');
      return;
    }
    let newProducts;
    if (editing) {
      newProducts = products.map(p => p.id === editing.id ? { ...editing, ...form, tags: (form.tags || []) } : p);
    } else {
      newProducts = [
        ...products,
        {
          id: `product_${Date.now()}`,
          name: form.name!,
          category: form.category || 'other',
          description: form.description || '',
          tags: form.tags || []
        }
      ];
    }
    setProducts(newProducts);
    setLocalProducts(newProducts);
    setIsEditing(false);
    setEditing(null);
    setForm({ name: '', category: 'other', description: '', tags: [] });
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该产品吗？')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      setLocalProducts(newProducts);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditing(null);
    setForm({ name: '', category: 'other', description: '', tags: [] });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📦 产品管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">管理你的产品信息，支持搜索、分类、编辑和删除</p>
        </div>
        <button
          onClick={() => { setIsEditing(true); setEditing(null); setForm({ name: '', category: 'other', description: '', tags: [] }); }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md text-sm sm:text-base"
        >
          <span>➕</span>
          <span>添加产品</span>
        </button>
      </div>

      {/* 搜索和分类 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 搜索产品名称或标签..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
        />
        <div className="flex gap-2 overflow-x-auto">
          {defaultCategories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${category === c.id ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              <span>{c.icon}</span>
              <span className="text-sm">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 产品列表 */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-500">{search || category !== 'all' ? '没有找到匹配的产品' : '暂无产品'}</p>
            <p className="text-xs text-gray-400 mt-1">{search || category !== 'all' ? '尝试调整搜索条件' : '点击“添加产品”创建第一个产品'}</p>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📦</span>
                  <span className="font-bold text-lg text-gray-900">{p.name}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs ml-2">{defaultCategories.find(c => c.id === p.category)?.name || '其他'}</span>
                </div>
                <div className="text-gray-600 text-sm mb-1">{p.description}</div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="编辑"><span className="text-lg">✏️</span></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除"><span className="text-lg">🗑️</span></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑/新增弹窗 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editing ? '✏️ 编辑产品' : '➕ 添加产品'}</h2>
                <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600"><span className="text-xl">❌</span></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品名称 *</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="请输入产品名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={form.category || 'other'}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {defaultCategories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <textarea
                    value={form.description || ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="请输入产品描述"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={form.tags?.join(', ') || ''}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                    placeholder="如：爆款, 新品, 限时"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"><span>💾</span><span>保存</span></button>
                <button onClick={handleCancel} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
