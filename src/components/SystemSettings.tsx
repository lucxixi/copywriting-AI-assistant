import React, { useState, useEffect } from 'react';
import { settingsManager } from '../services/settingsManager';
import { KeywordMapping } from '../types/settings';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: 'openrouter' | 'together' | 'siliconflow' | 'google';
  isActive: boolean;
}

const SystemSettings: React.FC = () => {
  // API Key 列表和激活ID持久化
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const settings = settingsManager.loadSettings();
    return settings.apiKeys || [];
  });
  const [activeApiKeyId, setActiveApiKeyId] = useState<string>(() => {
    const settings = settingsManager.loadSettings();
    return settings.activeApiKeyId || '';
  });
  const [showAddApiKey, setShowAddApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{ name: string; key: string; provider: ApiKey['provider'] }>({ name: '', key: '', provider: 'openrouter' });
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [historyDays, setHistoryDays] = useState<number>(30);
  const colorOptions = ['#2563eb', '#10b981', '#f59e42', '#ef4444', '#a855f7', '#fbbf24'];

  // 全局设置
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [primaryColor, setPrimaryColor] = useState<string>('#2563eb');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');

  useEffect(() => {
    // 初始化读取全局设置
    const settings = settingsManager.loadSettings();
    setThemeMode(settings.themeSettings?.mode || 'light');
    setPrimaryColor(settings.themeSettings?.primaryColor || '#2563eb');
    setFontSize(settings.fontSettings?.size || 'medium');
    setDensity(settings.layoutSettings?.density || 'standard');
  }, []);

  // 主题模式切换
  const handleThemeMode = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    settingsManager.updateSetting('themeSettings', {
      ...settingsManager.loadSettings().themeSettings,
      mode
    });
    settingsManager.applyThemeSettings();
  };

  // 主题主色切换
  const handlePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    settingsManager.updateSetting('themeSettings', {
      ...settingsManager.loadSettings().themeSettings,
      primaryColor: color
    });
    settingsManager.applyThemeSettings();
  };

  // 字体大小切换
  const handleFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    settingsManager.updateSetting('fontSettings', {
      ...settingsManager.loadSettings().fontSettings,
      size
    });
    settingsManager.applyThemeSettings();
  };

  // 界面密度切换
  const handleDensity = (d: 'compact' | 'standard' | 'comfortable') => {
    setDensity(d);
    settingsManager.updateSetting('layoutSettings', {
      ...settingsManager.loadSettings().layoutSettings,
      density: d
    });
    settingsManager.applyThemeSettings();
  };

  // 通知设置
  const [showSuccess, setShowSuccess] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(true);
  const [notificationDuration, setNotificationDuration] = useState<number>(3000);

  // 账号信息
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 关键词替换设置
  const [keywordReplacements, setKeywordReplacements] = useState<KeywordMapping[]>(() => {
    const settings = settingsManager.loadSettings();
    return settings.contentFilterSettings?.keywordReplacements || [];
  });
  const [newKeyword, setNewKeyword] = useState<{ original: string; replacement: string }>({ original: '', replacement: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{ original: string; replacement: string }>({ original: '', replacement: '' });

  // 保存到 settingsManager
  const persistApiKeys = (keys: ApiKey[], activeId: string) => {
    setApiKeys(keys);
    setActiveApiKeyId(activeId);
    const settings = settingsManager.loadSettings();
    settingsManager.saveSettings({
      ...settings,
      apiKeys: keys,
      activeApiKeyId: activeId
    });
  };

  // 添加API Key
  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.key) return;
    const newId = `key_${Date.now()}`;
    const keys = [
      ...apiKeys,
      {
        id: newId,
        name: newApiKey.name,
        key: newApiKey.key,
        provider: newApiKey.provider,
        isActive: apiKeys.length === 0
      }
    ];
    const activeId = apiKeys.length === 0 ? newId : activeApiKeyId;
    persistApiKeys(keys, activeId);
    setShowAddApiKey(false);
    setNewApiKey({ name: '', key: '', provider: 'openrouter' });
  };

  // 删除API Key
  const handleDeleteApiKey = (id: string) => {
    const keys = apiKeys.filter(k => k.id !== id);
    let activeId = activeApiKeyId;
    if (id === activeApiKeyId) {
      activeId = keys.length > 0 ? keys[0].id : '';
    }
    persistApiKeys(keys, activeId);
  };

  // 激活API Key
  const handleSetActive = (id: string) => {
    setActiveApiKeyId(id);
    const settings = settingsManager.loadSettings();
    settingsManager.saveSettings({
      ...settings,
      activeApiKeyId: id
    });
  };

  // 数据导出
  const handleExportData = () => {
    try {
      const allData: Record<string, unknown> = {};
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            allData[key] = localStorage.getItem(key);
          }
        }
      }
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `copywriting_ai_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('数据导出成功！请妥善保存备份文件。');
    } catch {
      alert('数据导出失败，请重试。');
    }
  };

  // 数据导入
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (!window.confirm('导入数据将覆盖现有所有数据，确定要继续吗？')) return;
          for (const key in data) {
            localStorage.setItem(key, typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]));
          }
          alert('数据导入成功！页面将刷新以应用新数据。');
          window.location.reload();
        } catch {
          alert('数据导入失败，请检查文件格式是否正确。');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // 一键清除所有数据
  const handleClearAllData = () => {
    if (!window.confirm('确定要清除所有本地数据吗？此操作不可恢复！')) return;
    localStorage.clear();
    alert('所有数据已清除，页面将刷新');
    window.location.reload();
  };

  // 保存到 settingsManager
  const saveKeywordReplacements = (list: KeywordMapping[]) => {
    setKeywordReplacements(list);
    const settings = settingsManager.loadSettings();
    settingsManager.updateSetting('contentFilterSettings', {
      ...settings.contentFilterSettings,
      keywordReplacements: list
    });
  };

  // 添加关键词
  const handleAddKeyword = () => {
    if (!newKeyword.original.trim() || !newKeyword.replacement.trim()) return;
    const newList = [
      ...keywordReplacements,
      {
        id: `kw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        original: newKeyword.original.trim(),
        replacement: newKeyword.replacement.trim()
      }
    ];
    saveKeywordReplacements(newList);
    setNewKeyword({ original: '', replacement: '' });
  };

  // 删除关键词
  const handleDeleteKeyword = (id: string) => {
    const newList = keywordReplacements.filter(k => k.id !== id);
    saveKeywordReplacements(newList);
  };

  // 编辑关键词
  const handleEditKeyword = (id: string) => {
    const kw = keywordReplacements.find(k => k.id === id);
    if (kw) {
      setEditingId(id);
      setEditingValue({ original: kw.original, replacement: kw.replacement });
    }
  };
  const handleSaveEdit = () => {
    if (!editingId) return;
    const newList = keywordReplacements.map(k =>
      k.id === editingId ? { ...k, original: editingValue.original.trim(), replacement: editingValue.replacement.trim() } : k
    );
    saveKeywordReplacements(newList);
    setEditingId(null);
    setEditingValue({ original: '', replacement: '' });
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ original: '', replacement: '' });
  };

  return (
    <div style={{ padding: '40px 0', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>⚙️ 系统设置</h1>
        <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: 15 }}>配置API、主题和隐私等全局选项</p>
      </div>

      {/* 分组卡片响应式两列布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: 28,
        alignItems: 'start',
        justifyItems: 'center',
        marginBottom: 28
      }}>
        {/* 账号信息 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>👤 账号信息</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ fontSize: 15 }}>昵称：</span>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 15, marginTop: 4 }}
                />
              </div>
              <div>
                <span style={{ fontSize: 15 }}>邮箱：</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 15, marginTop: 4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Key 配置 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🔑 API Key 配置</div>
            {apiKeys.length === 0 && <div style={{ color: '#bbb', fontSize: 14, marginBottom: 8 }}>暂无API Key，请添加</div>}
            {apiKeys.map(k => (
              <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <span style={{ fontWeight: k.isActive ? 'bold' : 'normal', fontSize: 15 }}>{k.name} ({k.provider})</span>
                <span style={{ fontSize: 13, color: '#888', flex: 1, marginLeft: 8 }}>{k.key.replace(/.(?=.{4})/g, '*')}</span>
                {!k.isActive && <button onClick={() => handleSetActive(k.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>设为激活</button>}
                {k.isActive && <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 'bold' }}>✔️激活</span>}
                <button onClick={() => handleDeleteApiKey(k.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>🗑️ 删除</button>
              </div>
            ))}
            <button onClick={() => setShowAddApiKey(true)} style={{ marginTop: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 14, cursor: 'pointer' }}>➕ 添加API Key</button>
            {showAddApiKey && (
              <div style={{ marginTop: 16, background: '#f9fafb', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" placeholder="名称" value={newApiKey.name} onChange={e => setNewApiKey({ ...newApiKey, name: e.target.value })} style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
                  <input type="text" placeholder="Key" value={newApiKey.key} onChange={e => setNewApiKey({ ...newApiKey, key: e.target.value })} style={{ flex: 2, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
                  <select value={newApiKey.provider} onChange={e => setNewApiKey({ ...newApiKey, provider: e.target.value as ApiKey['provider'] })} style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                    <option value="openrouter">OpenRouter</option>
                    <option value="together">Together</option>
                    <option value="siliconflow">SiliconFlow</option>
                    <option value="google">Google</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleAddApiKey} style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 15, cursor: 'pointer' }}>💾 保存</button>
                  <button onClick={() => setShowAddApiKey(false)} style={{ flex: 1, background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 15, cursor: 'pointer' }}>取消</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 主题模式 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🎨 主题模式</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => handleThemeMode('light')} style={{ background: themeMode === 'light' ? '#2563eb' : '#eee', color: themeMode === 'light' ? '#fff' : '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, cursor: 'pointer' }}>🌞 明亮</button>
              <button onClick={() => handleThemeMode('dark')} style={{ background: themeMode === 'dark' ? '#2563eb' : '#eee', color: themeMode === 'dark' ? '#fff' : '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, cursor: 'pointer' }}>🌚 暗色</button>
            </div>
          </div>
        </div>

        {/* 主题色/字体/界面密度 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🎨 主题与界面</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              <span style={{ fontSize: 15 }}>主题主色：</span>
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => handlePrimaryColor(color)}
                  style={{ width: 28, height: 28, borderRadius: '50%', border: primaryColor === color ? '2px solid #2563eb' : '1px solid #ddd', background: color, cursor: 'pointer', marginRight: 4 }}
                  title={color}
                />
              ))}
              <span style={{ fontSize: 13, color: '#888' }}>当前色：</span>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: primaryColor, display: 'inline-block', border: '1px solid #ddd' }}></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              <span style={{ fontSize: 15 }}>字体大小：</span>
              <select value={fontSize} onChange={e => handleFontSize(e.target.value as 'small' | 'medium' | 'large')} style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 }}>
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 15 }}>界面密度：</span>
              <select value={density} onChange={e => handleDensity(e.target.value as 'compact' | 'standard' | 'comfortable')} style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 }}>
                <option value="compact">紧凑</option>
                <option value="standard">标准</option>
                <option value="comfortable">宽松</option>
              </select>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🔔 通知设置</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                <input type="checkbox" checked={showSuccess} onChange={e => setShowSuccess(e.target.checked)} />
                显示操作成功通知
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                <input type="checkbox" checked={showError} onChange={e => setShowError(e.target.checked)} />
                显示错误/警告通知
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 15 }}>通知持续时间：</span>
              <input
                type="number"
                min={1000}
                max={10000}
                step={500}
                value={notificationDuration}
                onChange={e => setNotificationDuration(Number(e.target.value))}
                style={{ width: 100, padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 }}
              />
              <span style={{ color: '#888', fontSize: 13 }}>毫秒，推荐3000</span>
            </div>
          </div>
        </div>

        {/* 隐私设置 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🔒 隐私设置</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
              <input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} />
              启用数据加密（仅本地模拟）
            </label>
          </div>
        </div>

        {/* 数据导入导出 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>💾 数据导入/导出</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={handleExportData} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>📤 导出数据</button>
              <button onClick={handleImportData} style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer' }}>📥 导入数据</button>
            </div>
            <div style={{ color: '#888', fontSize: 13, marginTop: 10 }}>导出为JSON文件，导入时会覆盖所有本地数据，请谨慎操作。</div>
          </div>
        </div>

        {/* 历史记录保留天数 & 一键清除 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🗂️ 历史记录与数据管理</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ fontSize: 15 }}>历史记录保留天数：</span>
              <input
                type="number"
                min={1}
                max={365}
                value={historyDays}
                onChange={e => setHistoryDays(Number(e.target.value))}
                style={{ width: 80, padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 }}
              />
              <span style={{ color: '#888', fontSize: 13 }}>超期将自动清理（仅本地模拟）</span>
            </div>
            <button onClick={handleClearAllData} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 15, cursor: 'pointer', width: 180 }}>🗑️ 一键清除所有数据</button>
          </div>
        </div>

        {/* 关键词替换设置 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 28, minHeight: 180, width: '100%', maxWidth: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>🛡️ 关键词替换设置</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 10 }}>用于规避敏感词风险，支持批量添加和一键替换</div>
            {/* 新增关键词表单 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="敏感词"
                value={newKeyword.original}
                onChange={e => setNewKeyword({ ...newKeyword, original: e.target.value })}
                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <span style={{ alignSelf: 'center', color: '#888' }}>→</span>
              <input
                type="text"
                placeholder="替换为"
                value={newKeyword.replacement}
                onChange={e => setNewKeyword({ ...newKeyword, replacement: e.target.value })}
                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <button onClick={handleAddKeyword} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 14, cursor: 'pointer' }}>添加</button>
            </div>
            {/* 关键词列表 */}
            <div style={{ maxHeight: 180, overflowY: 'auto' }}>
              {keywordReplacements.length === 0 && <div style={{ color: '#bbb', fontSize: 14 }}>暂无关键词替换规则</div>}
              {keywordReplacements.map(k => (
                <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {editingId === k.id ? (
                    <>
                      <input
                        type="text"
                        value={editingValue.original}
                        onChange={e => setEditingValue({ ...editingValue, original: e.target.value })}
                        style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                      />
                      <span style={{ color: '#888' }}>→</span>
                      <input
                        type="text"
                        value={editingValue.replacement}
                        onChange={e => setEditingValue({ ...editingValue, replacement: e.target.value })}
                        style={{ flex: 1, padding: 6, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                      />
                      <button onClick={handleSaveEdit} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>保存</button>
                      <button onClick={handleCancelEdit} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>取消</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, color: '#333', fontSize: 15 }}>{k.original}</span>
                      <span style={{ color: '#888' }}>→</span>
                      <span style={{ flex: 1, color: '#2563eb', fontSize: 15 }}>{k.replacement}</span>
                      <button onClick={() => handleEditKeyword(k.id)} style={{ background: '#eee', color: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}>编辑</button>
                      <button onClick={() => handleDeleteKeyword(k.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 13, cursor: 'pointer' }}>删除</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
