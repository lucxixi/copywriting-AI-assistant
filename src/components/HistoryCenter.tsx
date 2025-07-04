import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';

const HistoryCenter: React.FC = () => {
  const { records, deleteRecord, deleteRecords, clearAll, filterRecords, exportRecords } = useHistory();
  const [type, setType] = useState<'all' | 'copywriting' | 'dialogue'>('all');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  // 根据筛选条件获取记录
  const filtered = type === 'all' ? filterRecords(undefined, keyword) : filterRecords(type, keyword);

  // 批量选择
  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const selectAll = () => {
    setSelected(filtered.map(r => r.id));
  };
  const clearSelect = () => {
    setSelected([]);
  };

  // 复制内容
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('已复制到剪贴板');
    } catch {
      alert('复制失败');
    }
  };

  // 删除单条
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      deleteRecord(id);
      setSelected(prev => prev.filter(i => i !== id));
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selected.length === 0) return;
    if (window.confirm('确定要批量删除选中的记录吗？')) {
      deleteRecords(selected);
      setSelected([]);
    }
  };

  // 清空全部
  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
      clearAll();
      setSelected([]);
    }
  };

  // 导出
  const handleExport = (format: 'json' | 'csv') => {
    exportRecords(format);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>📜 历史记录</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: 15 }}>所有生成的文案和对话都会自动保存，支持筛选、导出、删除等操作</p>
      </div>
      {/* 操作栏 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <select value={type} onChange={e => setType(e.target.value as any)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', fontSize: 15 }}>
          <option value="all">全部类型</option>
          <option value="copywriting">文案</option>
          <option value="dialogue">对话</option>
        </select>
        <input
          type="text"
          placeholder="关键词搜索"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', fontSize: 15, flex: 1, minWidth: 180 }}
        />
        <button onClick={() => handleExport('json')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: 'pointer' }}>导出JSON</button>
        <button onClick={() => handleExport('csv')} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: 'pointer' }}>导出CSV</button>
        <button onClick={handleBatchDelete} disabled={selected.length === 0} style={{ background: selected.length ? '#ef4444' : '#eee', color: selected.length ? '#fff' : '#888', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: selected.length ? 'pointer' : 'not-allowed' }}>批量删除</button>
        <button onClick={handleClearAll} style={{ background: '#f59e42', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: 'pointer' }}>清空全部</button>
      </div>
      {/* 列表 */}
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, minHeight: 300, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {filtered.length === 0 ? (
          <div style={{ color: '#bbb', fontSize: 16, textAlign: 'center', padding: 60 }}>暂无历史记录</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={e => e.target.checked ? selectAll() : clearSelect()} />
                </th>
                <th style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'left' }}>类型</th>
                <th style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'left' }}>内容</th>
                <th style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'left' }}>产品</th>
                <th style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'left' }}>时间</th>
                <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f3f3f3', background: selected.includes(r.id) ? '#f0f9ff' : '#fff' }}>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                  </td>
                  <td style={{ padding: 8 }}>{r.type === 'copywriting' ? '文案' : '对话'}</td>
                  <td style={{ padding: 8, maxWidth: 320, wordBreak: 'break-all', fontSize: 14 }}>
                    <div style={{ whiteSpace: 'pre-line', maxHeight: 80, overflow: 'auto' }}>{r.content.length > 120 ? r.content.slice(0, 120) + '...' : r.content}</div>
                  </td>
                  <td style={{ padding: 8 }}>{r.productName || '-'}</td>
                  <td style={{ padding: 8 }}>{new Date(r.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button onClick={() => handleCopy(r.content)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer', marginRight: 6 }}>复制</button>
                    <button onClick={() => handleDelete(r.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryCenter; 