import React, { useState } from 'react';

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  isPreset: boolean;
}

interface CharacterEditorProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  maxCharacters?: number;
}

const CharacterEditorFixed: React.FC<CharacterEditorProps> = ({
  characters,
  onCharactersChange,
  maxCharacters = 5
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Partial<Character>>({});

  const roleOptions = [
    { value: 'customer', label: '客户', icon: '🛒' },
    { value: 'salesperson', label: '销售员', icon: '👨‍💼' },
    { value: 'friend', label: '朋友', icon: '👥' },
    { value: 'expert', label: '专家', icon: '🎓' },
    { value: 'influencer', label: '意见领袖', icon: '⭐' },
    { value: 'other', label: '其他', icon: '👤' }
  ];

  const handleAddNew = () => {
    if (characters.length >= maxCharacters) {
      alert(`最多只能添加${maxCharacters}个角色`);
      return;
    }

    setEditingCharacter({
      id: '',
      name: '',
      role: 'customer',
      personality: '',
      isPreset: false
    });
    setIsEditing(true);
  };

  const handleEdit = (character: Character) => {
    if (character.isPreset) return;
    setEditingCharacter(character);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingCharacter.name || !editingCharacter.personality) {
      alert('请填写角色名称和性格描述');
      return;
    }

    const characterToSave: Character = {
      id: editingCharacter.id || `char_${Date.now()}`,
      name: editingCharacter.name!,
      role: editingCharacter.role || 'other',
      personality: editingCharacter.personality!,
      isPreset: false
    };

    if (editingCharacter.id) {
      // 编辑现有角色
      const updatedCharacters = characters.map(character =>
        character.id === editingCharacter.id ? characterToSave : character
      );
      onCharactersChange(updatedCharacters);
    } else {
      // 添加新角色
      onCharactersChange([...characters, characterToSave]);
    }

    setIsEditing(false);
    setEditingCharacter({});
  };

  const handleDelete = (characterId: string) => {
    if (confirm('确定要删除这个角色吗？')) {
      const updatedCharacters = characters.filter(character => character.id !== characterId);
      onCharactersChange(updatedCharacters);
    }
  };

  const getRoleInfo = (role: string) => {
    return roleOptions.find(option => option.value === role) || roleOptions[roleOptions.length - 1];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">👥</span>
          <h3 className="text-lg font-semibold text-gray-900">角色管理</h3>
          <span className="text-sm text-gray-500">({characters.length}/{maxCharacters})</span>
        </div>
        <button
          onClick={handleAddNew}
          disabled={characters.length >= maxCharacters}
          className={`px-3 py-1 text-sm rounded-lg ${
            characters.length >= maxCharacters
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          ➕ 添加角色
        </button>
      </div>

      <div className="grid gap-3">
        {characters.map((character) => {
          const roleInfo = getRoleInfo(character.role);
          return (
            <div
              key={character.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{roleInfo.icon}</span>
                    <h4 className="font-medium text-gray-900">{character.name}</h4>
                    {character.isPreset && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">预设</span>
                    )}
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{character.personality}</p>
                </div>
                
                {!character.isPreset && (
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(character)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(character.id)}
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
        
        {characters.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-500">暂无角色，请添加角色</p>
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
                  {editingCharacter.id ? '编辑角色' : '添加角色'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
                  <input
                    type="text"
                    value={editingCharacter.name || ''}
                    onChange={(e) => setEditingCharacter(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：小李、张经理"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">角色类型</label>
                  <select
                    value={editingCharacter.role || 'customer'}
                    onChange={(e) => setEditingCharacter(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性格描述</label>
                  <textarea
                    value={editingCharacter.personality || ''}
                    onChange={(e) => setEditingCharacter(prev => ({ ...prev, personality: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="描述角色的性格特点、说话风格、关注点等..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

export default CharacterEditorFixed;
