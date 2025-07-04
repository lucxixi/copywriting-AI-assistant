import { useState, useEffect } from 'react';
import { HistoryRecord } from '../types/history';

const HISTORY_KEY = 'historyRecords';

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  // 加载历史
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch {
        setRecords([]);
      }
    }
  }, []);

  // 保存历史
  const saveRecords = (list: HistoryRecord[]) => {
    setRecords(list);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  };

  // 新增
  const addRecord = (record: HistoryRecord) => {
    const newList = [record, ...records];
    saveRecords(newList);
  };

  // 删除
  const deleteRecord = (id: string) => {
    const newList = records.filter(r => r.id !== id);
    saveRecords(newList);
  };

  // 批量删除
  const deleteRecords = (ids: string[]) => {
    const newList = records.filter(r => !ids.includes(r.id));
    saveRecords(newList);
  };

  // 清空
  const clearAll = () => {
    saveRecords([]);
  };

  // 筛选
  const filterRecords = (type?: 'copywriting' | 'dialogue', keyword?: string) => {
    let filtered = records;
    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }
    if (keyword) {
      const lower = keyword.toLowerCase();
      filtered = filtered.filter(r => r.content.toLowerCase().includes(lower) || (r.productName?.toLowerCase().includes(lower)));
    }
    return filtered;
  };

  // 导出
  const exportRecords = (format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `history_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // CSV
      const header = '类型,内容,产品,时间\n';
      const rows = records.map(r => `${r.type},"${r.content.replace(/"/g, '""')}",${r.productName || ''},${r.createdAt}`).join('\n');
      const csv = header + rows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return {
    records,
    addRecord,
    deleteRecord,
    deleteRecords,
    clearAll,
    filterRecords,
    exportRecords
  };
} 