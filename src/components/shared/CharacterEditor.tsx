import React, { useState } from 'react';
import {
  User,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  Star
} from 'lucide-react';

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
  allowCustomRoles?: boolean;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  characters,
  onCharactersChange,
  maxCharacters = 5,
  allowCustomRoles = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({});

  const presetRoles = [
    { value: 'customer', label: '客户', description: '有需求的潜在客户' },
    { value: 'friend', label: '朋友', description: '关心朋友的人' },
    { value: 'expert', label: '专家', description: '产品专家或顾问' },
    { value: 'service', label: '客服', description: '专业客服人员' },
    { value: 'user', label: '用户', description: '产品使用者' },
    { value: 'family', label: '家人', description: '家庭成员' },
    { value: 'supporter', label: '支持者', description: '产品推荐者' }
  ];

  const handleAddCharacter = () => {
    if (characters.length >= maxCharacters) {
      alert(`最多只能添加${maxCharacters}个角色`);
      return;
    }

    setNewCharacter({
      id: `char_${Date.now()}`,
      name: '',
      role: 'customer',
      personality: '',
      isPreset: false
    });
    setIsEditing(true);
  };

  const handleEditCharacter = (character: Character) => {
    if (character.isPreset) {
      alert('预设角色不能编辑');
      return;
    }
    setEditingCharacter(character);
    setNewCharacter(character);
    setIsEditing(true);
  };

  const handleSaveCharacter = () => {
    if (!newCharacter.name || !newCharacter.role || !newCharacter.personality) {
      alert('请填写完整的角色信息');
      return;
    }

    const characterToSave: Character = {
      id: newCharacter.id || `char_${Date.now()}`,
      name: newCharacter.name,
      role: newCharacter.role,
      personality: newCharacter.personality,
      isPreset: false
    };

    let updatedCharacters;
    if (editingCharacter) {
      updatedCharacters = characters.map(char => 
        char.id === editingCharacter.id ? characterToSave : char
      );
    } else {
      updatedCharacters = [...characters, characterToSave];
    }

    onCharactersChange(updatedCharacters);
    handleCancelEdit();
  };

  const handleDeleteCharacter = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character?.isPreset) {
      alert('预设角色不能删除');
      return;
    }

    if (confirm('确定要删除这个角色吗？')) {
      const updatedCharacters = characters.filter(char => char.id !== characterId);
      onCharactersChange(updatedCharacters);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCharacter(null);
    setNewCharacter({});
  };

  const getRoleLabel = (role: string) => {
    const preset = presetRoles.find(r => r.value === role);
    return preset ? preset.label : role;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">角色设置</h3>
          <span className="text-sm text-gray-500">({characters.length}/{maxCharacters})</span>
        </div>
        <button
          onClick={handleAddCharacter}
          disabled={characters.length >= maxCharacters}
          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>添加角色</span>
        </button>
      </div>

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">{character.name}</h4>
                {character.isPreset && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                {!character.isPreset && (
                  <>
                    <button
                      onClick={() => handleEditCharacter(character)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">角色:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {getRoleLabel(character.role)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{character.personality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Character Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCharacter ? '编辑角色' : '添加角色'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
                  <input
                    type="text"
                    value={newCharacter.name || ''}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入角色名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">角色类型</label>
                  {allowCustomRoles ? (
                    <select
                      value={newCharacter.role || ''}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">选择角色类型</option>
                      {presetRoles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newCharacter.role || ''}
                      onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="输入角色类型"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性格特点</label>
                  <textarea
                    value={newCharacter.personality || ''}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, personality: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="描述角色的性格特点和行为特征"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveCharacter}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default CharacterEditor;
