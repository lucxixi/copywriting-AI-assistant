import React, { useState } from 'react';

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  category: string;
  isPreset: boolean;
}

interface PainPointManagerProps {
  painPoints: PainPoint[];
  onPainPointsChange: (painPoints: PainPoint[]) => void;
}

const PainPointManagerFixed: React.FC<PainPointManagerProps> = ({
  painPoints,
  onPainPointsChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPainPoint, setEditingPainPoint] = useState<Partial<PainPoint>>({});

  const categories = [
    { value: 'price', label: '价格相关', icon: '💰' },
    { value: 'effectiveness', label: '效果疑虑', icon: '🎯' },
    { value: 'trust', label: '信任问题', icon: '🤝' },
    { value: 'comparison', label: '产品对比', icon: '⚖️' },
    { value: 'usage', label: '使用问题', icon: '🔧' },
    { value: 'other', label: '其他', icon: '❓' }
  ];

  const handleAddNew = () => {
    setEditingPainPoint({
      id: '',
      title: '',
      description: '',
      category: 'other',
      isPreset: false
    });
    setIsEditing(true);
  };

  const handleEdit = (painPoint: PainPoint) => {
    if (painPoint.isPreset) return;
    setEditingPainPoint(painPoint);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingPainPoint.title || !editingPainPoint.description) {
      alert('请填写痛点标题和描述');
      return;
    }

    const painPointToSave: PainPoint = {
      id: editingPainPoint.id || `pain_${Date.now()}`,
      title: editingPainPoint.title!,
      description: editingPainPoint.description!,
      category: editingPainPoint.category || 'other',
      isPreset: false
    };

    if (editingPainPoint.id) {
      // 编辑现有痛点
      const updatedPainPoints = painPoints.map(painPoint =>
        painPoint.id === editingPainPoint.id ? painPointToSave : painPoint
      );
      onPainPointsChange(updatedPainPoints);
    } else {
      // 添加新痛点
      onPainPointsChange([...painPoints, painPointToSave]);
    }

    setIsEditing(false);
    setEditingPainPoint({});
  };

  const handleDelete = (painPointId: string) => {
    if (confirm('确定要删除这个痛点吗？')) {
      const updatedPainPoints = painPoints.filter(painPoint => painPoint.id !== painPointId);
      onPainPointsChange(updatedPainPoints);
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">💭</span>
          <h3 className="text-lg font-semibold text-gray-900">痛点管理</h3>
        </div>
        <button
          onClick={handleAddNew}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          ➕ 添加痛点
        </button>
      </div>

      <div className="grid gap-3">
        {painPoints.map((painPoint) => {
          const categoryInfo = getCategoryInfo(painPoint.category);
          return (
            <div
              key={painPoint.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{categoryInfo.icon}</span>
                    <h4 className="font-medium text-gray-900">{painPoint.title}</h4>
                    {painPoint.isPreset && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">预设</span>
                    )}
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {categoryInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{painPoint.description}</p>
                </div>
                
                {!painPoint.isPreset && (
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(painPoint)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(painPoint.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {painPoints.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">💭</span>
            <p className="text-gray-500">暂无痛点，请添加痛点</p>
          </div>
        )}
      </div>

      {/* 编辑对话框 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPainPoint.id ? '编辑痛点' : '添加痛点'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ❌
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">痛点标题</label>
                  <input
                    type="text"
                    value={editingPainPoint.title || ''}
                    onChange={(e) => setEditingPainPoint(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：价格担忧"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">痛点描述</label>
                  <textarea
                    value={editingPainPoint.description || ''}
                    onChange={(e) => setEditingPainPoint(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="详细描述这个痛点..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">痛点分类</label>
                  <select
                    value={editingPainPoint.category || 'other'}
                    onChange={(e) => setEditingPainPoint(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <span>✅</span>
                  <span>保存</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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

export default PainPointManagerFixed;
