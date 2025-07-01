import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  X,
  Edit,
  Trash2,
  Check,
  Target,
  TrendingDown
} from 'lucide-react';

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  targetAudience: string[];
}

interface PainPointManagerProps {
  painPoints: PainPoint[];
  onPainPointsChange: (painPoints: PainPoint[]) => void;
  maxPainPoints?: number;
  categories?: string[];
}

const PainPointManager: React.FC<PainPointManagerProps> = ({
  painPoints,
  onPainPointsChange,
  maxPainPoints = 10,
  categories = ['功能需求', '体验问题', '成本考虑', '时间压力', '信任担忧', '竞品对比']
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPainPoint, setEditingPainPoint] = useState<PainPoint | null>(null);
  const [newPainPoint, setNewPainPoint] = useState<Partial<PainPoint>>({
    severity: 'medium',
    category: categories[0],
    targetAudience: []
  });

  const severityConfig = {
    low: { label: '轻微', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    medium: { label: '中等', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    high: { label: '严重', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' }
  };

  const commonAudiences = ['年轻人', '中年人', '老年人', '学生', '上班族', '家长', '企业主', '创业者'];

  const handleAddPainPoint = () => {
    if (painPoints.length >= maxPainPoints) {
      alert(`最多只能添加${maxPainPoints}个痛点`);
      return;
    }
    setIsAdding(true);
    setNewPainPoint({
      id: `pain_${Date.now()}`,
      title: '',
      description: '',
      severity: 'medium',
      category: categories[0],
      targetAudience: []
    });
  };

  const handleEditPainPoint = (painPoint: PainPoint) => {
    setEditingPainPoint(painPoint);
    setNewPainPoint(painPoint);
    setIsAdding(true);
  };

  const handleSavePainPoint = () => {
    if (!newPainPoint.title || !newPainPoint.description) {
      alert('请填写完整的痛点信息');
      return;
    }

    const painPointToSave: PainPoint = {
      id: newPainPoint.id || `pain_${Date.now()}`,
      title: newPainPoint.title!,
      description: newPainPoint.description!,
      severity: newPainPoint.severity!,
      category: newPainPoint.category!,
      targetAudience: newPainPoint.targetAudience!
    };

    let updatedPainPoints;
    if (editingPainPoint) {
      updatedPainPoints = painPoints.map(point => 
        point.id === editingPainPoint.id ? painPointToSave : point
      );
    } else {
      updatedPainPoints = [...painPoints, painPointToSave];
    }

    onPainPointsChange(updatedPainPoints);
    handleCancelEdit();
  };

  const handleDeletePainPoint = (painPointId: string) => {
    if (confirm('确定要删除这个痛点吗？')) {
      const updatedPainPoints = painPoints.filter(point => point.id !== painPointId);
      onPainPointsChange(updatedPainPoints);
    }
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingPainPoint(null);
    setNewPainPoint({
      severity: 'medium',
      category: categories[0],
      targetAudience: []
    });
  };

  const handleAudienceToggle = (audience: string) => {
    const currentAudiences = newPainPoint.targetAudience || [];
    const updatedAudiences = currentAudiences.includes(audience)
      ? currentAudiences.filter(a => a !== audience)
      : [...currentAudiences, audience];
    
    setNewPainPoint(prev => ({ ...prev, targetAudience: updatedAudiences }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">痛点管理</h3>
          <span className="text-sm text-gray-500">({painPoints.length}/{maxPainPoints})</span>
        </div>
        <button
          onClick={handleAddPainPoint}
          disabled={painPoints.length >= maxPainPoints}
          className="flex items-center space-x-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>添加痛点</span>
        </button>
      </div>

      {/* Pain Points List */}
      <div className="space-y-3">
        {painPoints.map((painPoint) => {
          const severityInfo = severityConfig[painPoint.severity];
          
          return (
            <div key={painPoint.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{painPoint.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${severityInfo.bgColor} ${severityInfo.textColor}`}>
                      {severityInfo.label}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {painPoint.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{painPoint.description}</p>
                  {painPoint.targetAudience.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {painPoint.targetAudience.map((audience, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => handleEditPainPoint(painPoint)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePainPoint(painPoint.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {painPoints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>还没有添加任何痛点</p>
            <p className="text-sm">点击"添加痛点"开始</p>
          </div>
        )}
      </div>

      {/* Pain Point Editor Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPainPoint ? '编辑痛点' : '添加痛点'}
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">痛点标题</label>
                  <input
                    type="text"
                    value={newPainPoint.title || ''}
                    onChange={(e) => setNewPainPoint(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="简洁描述痛点"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                  <textarea
                    value={newPainPoint.description || ''}
                    onChange={(e) => setNewPainPoint(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="详细描述痛点的具体表现和影响"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">严重程度</label>
                    <select
                      value={newPainPoint.severity || 'medium'}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, severity: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                      {Object.entries(severityConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                    <select
                      value={newPainPoint.category || categories[0]}
                      onChange={(e) => setNewPainPoint(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标用户</label>
                  <div className="flex flex-wrap gap-2">
                    {commonAudiences.map(audience => (
                      <button
                        key={audience}
                        type="button"
                        onClick={() => handleAudienceToggle(audience)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          (newPainPoint.targetAudience || []).includes(audience)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {audience}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSavePainPoint}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>保存</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

export default PainPointManager;
