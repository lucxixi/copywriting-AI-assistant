import React, { useState } from 'react';

export interface Scene {
  id: string;
  name: string;
  description: string;
  context: string;
  isPreset: boolean;
}

interface SceneSelectorProps {
  selectedScene: Scene | null;
  onSceneSelect: (scene: Scene | null) => void;
  customScenes: Scene[];
  onCustomScenesChange: (scenes: Scene[]) => void;
}

const SceneSelectorFixed: React.FC<SceneSelectorProps> = ({
  selectedScene,
  onSceneSelect,
  customScenes,
  onCustomScenesChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingScene, setEditingScene] = useState<Partial<Scene>>({});

  const handleAddNew = () => {
    setEditingScene({
      id: '',
      name: '',
      description: '',
      context: '',
      isPreset: false
    });
    setIsEditing(true);
  };

  const handleEdit = (scene: Scene) => {
    if (scene.isPreset) return;
    setEditingScene(scene);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingScene.name || !editingScene.description) {
      alert('请填写场景名称和描述');
      return;
    }

    const sceneToSave: Scene = {
      id: editingScene.id || `scene_${Date.now()}`,
      name: editingScene.name!,
      description: editingScene.description!,
      context: editingScene.context || '',
      isPreset: false
    };

    if (editingScene.id) {
      // 编辑现有场景
      const updatedScenes = customScenes.map(scene =>
        scene.id === editingScene.id ? sceneToSave : scene
      );
      onCustomScenesChange(updatedScenes);
    } else {
      // 添加新场景
      onCustomScenesChange([...customScenes, sceneToSave]);
    }

    setIsEditing(false);
    setEditingScene({});
  };

  const handleDelete = (sceneId: string) => {
    if (confirm('确定要删除这个场景吗？')) {
      const updatedScenes = customScenes.filter(scene => scene.id !== sceneId);
      onCustomScenesChange(updatedScenes);
      
      if (selectedScene?.id === sceneId) {
        onSceneSelect(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🎬</span>
          <h3 className="text-lg font-semibold text-gray-900">场景选择</h3>
        </div>
        <button
          onClick={handleAddNew}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ➕ 添加场景
        </button>
      </div>

      <div className="grid gap-3">
        {customScenes.map((scene) => (
          <div
            key={scene.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedScene?.id === scene.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSceneSelect(scene)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{scene.name}</h4>
                  {scene.isPreset && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">预设</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{scene.description}</p>
                {scene.context && (
                  <p className="text-xs text-gray-500">{scene.context}</p>
                )}
              </div>
              
              {!scene.isPreset && (
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(scene);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="编辑"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(scene.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {customScenes.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🎬</span>
            <p className="text-gray-500">暂无场景，请添加场景</p>
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
                  {editingScene.id ? '编辑场景' : '添加场景'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">场景名称</label>
                  <input
                    type="text"
                    value={editingScene.name || ''}
                    onChange={(e) => setEditingScene(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：朋友推荐"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">场景描述</label>
                  <textarea
                    value={editingScene.description || ''}
                    onChange={(e) => setEditingScene(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="描述这个场景的特点..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">场景背景</label>
                  <textarea
                    value={editingScene.context || ''}
                    onChange={(e) => setEditingScene(prev => ({ ...prev, context: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                    placeholder="场景的具体背景和环境..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default SceneSelectorFixed;
