import React, { useState } from 'react';
import {
  User,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Users,
  Star,
  Download,
  Upload,
  BookOpen,
  Briefcase,
  Heart,
  ShoppingBag,
  Coffee,
  GraduationCap,
  Stethoscope,
  Wrench,
  Palette
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
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const presetRoles = [
    { value: 'customer', label: '客户', description: '有需求的潜在客户' },
    { value: 'friend', label: '朋友', description: '关心朋友的人' },
    { value: 'expert', label: '专家', description: '产品专家或顾问' },
    { value: 'service', label: '客服', description: '专业客服人员' },
    { value: 'user', label: '用户', description: '产品使用者' },
    { value: 'family', label: '家人', description: '家庭成员' },
    { value: 'supporter', label: '支持者', description: '产品推荐者' }
  ];

  // 角色模板库
  const characterTemplates: Record<string, Character[]> = {
    business: [
      {
        id: 'template_ceo',
        name: '张总',
        role: '企业CEO',
        personality: '决策果断，注重效率，关心投资回报率',
        isPreset: true
      },
      {
        id: 'template_manager',
        name: '李经理',
        role: '部门经理',
        personality: '责任心强，注重团队协作，追求工作质量',
        isPreset: true
      },
      {
        id: 'template_sales',
        name: '王销售',
        role: '销售代表',
        personality: '沟通能力强，善于发现客户需求，积极主动',
        isPreset: true
      },
      {
        id: 'template_consultant',
        name: '陈顾问',
        role: '业务顾问',
        personality: '专业知识丰富，善于分析问题，提供解决方案',
        isPreset: true
      }
    ],
    lifestyle: [
      {
        id: 'template_mom',
        name: '妈妈',
        role: '家庭主妇',
        personality: '细心体贴，关心家人健康，注重性价比',
        isPreset: true
      },
      {
        id: 'template_student',
        name: '小明',
        role: '大学生',
        personality: '好奇心强，喜欢尝试新事物，预算有限',
        isPreset: true
      },
      {
        id: 'template_senior',
        name: '老王',
        role: '退休老人',
        personality: '经验丰富，注重实用性，喜欢传统品牌',
        isPreset: true
      },
      {
        id: 'template_young_professional',
        name: '小李',
        role: '年轻白领',
        personality: '追求品质生活，注重效率，愿意为便利付费',
        isPreset: true
      }
    ],
    service: [
      {
        id: 'template_doctor',
        name: '医生',
        role: '医疗专家',
        personality: '专业严谨，关心患者健康，注重科学依据',
        isPreset: true
      },
      {
        id: 'template_teacher',
        name: '老师',
        role: '教育工作者',
        personality: '耐心细致，善于解释，关心学生成长',
        isPreset: true
      },
      {
        id: 'template_technician',
        name: '技术员',
        role: '技术支持',
        personality: '技术精湛，逻辑清晰，善于解决问题',
        isPreset: true
      },
      {
        id: 'template_customer_service',
        name: '客服小张',
        role: '客服专员',
        personality: '服务热情，沟通耐心，解决问题高效',
        isPreset: true
      }
    ],
    creative: [
      {
        id: 'template_designer',
        name: '设计师',
        role: '创意设计师',
        personality: '富有创意，追求美感，注重用户体验',
        isPreset: true
      },
      {
        id: 'template_blogger',
        name: '博主',
        role: '内容创作者',
        personality: '善于表达，关注热点，喜欢分享经验',
        isPreset: true
      },
      {
        id: 'template_photographer',
        name: '摄影师',
        role: '专业摄影师',
        personality: '艺术敏感，追求完美，注重细节',
        isPreset: true
      }
    ]
  };

  const templateCategories = [
    { id: 'all', name: '全部模板', icon: BookOpen },
    { id: 'business', name: '商务场景', icon: Briefcase },
    { id: 'lifestyle', name: '生活场景', icon: Heart },
    { id: 'service', name: '服务场景', icon: Stethoscope },
    { id: 'creative', name: '创意场景', icon: Palette }
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

  // 模板库相关函数
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return Object.values(characterTemplates).flat();
    }
    return characterTemplates[selectedCategory] || [];
  };

  const handleAddFromTemplate = (template: Character) => {
    if (characters.length >= maxCharacters) {
      alert(`最多只能添加${maxCharacters}个角色`);
      return;
    }

    // 检查是否已存在同名角色
    const existingNames = characters.map(c => c.name);
    let newName = template.name;
    let counter = 1;
    while (existingNames.includes(newName)) {
      newName = `${template.name}${counter}`;
      counter++;
    }

    const newCharacter: Character = {
      ...template,
      id: `char_${Date.now()}`,
      name: newName,
      isPreset: false
    };

    onCharactersChange([...characters, newCharacter]);
    setShowTemplateLibrary(false);
  };

  const handleExportCharacters = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      characters: characters.filter(c => !c.isPreset)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `characters_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCharacters = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.characters && Array.isArray(importData.characters)) {
          const importedCharacters = importData.characters.map((char: any) => ({
            ...char,
            id: `char_${Date.now()}_${Math.random()}`,
            isPreset: false
          }));

          onCharactersChange([...characters, ...importedCharacters]);
          alert(`成功导入 ${importedCharacters.length} 个角色`);
        } else {
          alert('文件格式不正确');
        }
      } catch (error) {
        alert('文件解析失败，请检查文件格式');
      }
    };
    reader.readAsText(file);

    // 清空input值，允许重复导入同一文件
    event.target.value = '';
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
        <div className="flex items-center space-x-2">
          {/* 模板库按钮 */}
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>模板库</span>
          </button>

          {/* 导入导出按钮 */}
          <div className="flex items-center space-x-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImportCharacters}
              className="hidden"
              id="import-characters"
            />
            <label
              htmlFor="import-characters"
              className="flex items-center space-x-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">导入</span>
            </label>
            <button
              onClick={handleExportCharacters}
              disabled={characters.filter(c => !c.isPreset).length === 0}
              className="flex items-center space-x-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">导出</span>
            </button>
          </div>

          {/* 添加角色按钮 */}
          <button
            onClick={handleAddCharacter}
            disabled={characters.length >= maxCharacters}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>添加角色</span>
          </button>
        </div>
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

      {/* 角色模板库模态框 */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">角色模板库</h2>
                <button
                  onClick={() => setShowTemplateLibrary(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 分类筛选 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {templateCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 模板列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map((template) => (
                  <div
                    key={template.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                      </div>
                      <button
                        onClick={() => handleAddFromTemplate(template)}
                        disabled={characters.length >= maxCharacters}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                        <span>添加</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">角色：</span>
                        <span className="text-gray-900">{template.role}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">性格：</span>
                        <span className="text-gray-700">{template.personality}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredTemplates().length === 0 && (
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
                  <p className="text-gray-600">该分类下暂无角色模板</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterEditor;
