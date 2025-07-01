import React, { useState } from 'react';
import {
  MapPin,
  Home,
  ShoppingBag,
  Coffee,
  Users,
  MessageSquare,
  Heart,
  Briefcase,
  ChevronDown,
  Check,
  Plus,
  X,
  Save,
  Car,
  Plane,
  GraduationCap,
  Dumbbell,
  Stethoscope,
  Baby,
  Gamepad2,
  Camera,
  Music,
  Utensils,
  Building,
  Phone,
  Video,
  Gift,
  Calendar,
  Star,
  Edit3
} from 'lucide-react';

export interface Scene {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  context: string;
  suggestedCharacters: string[];
  category?: 'daily' | 'business' | 'entertainment' | 'health' | 'education' | 'travel' | 'custom';
  isCustom?: boolean;
  tags?: string[];
}

interface SceneSelectorProps {
  selectedScene: Scene | null;
  onSceneChange: (scene: Scene) => void;
  customScenes?: Scene[];
  allowCustom?: boolean;
  onCustomSceneCreate?: (scene: Scene) => void;
  onCustomSceneEdit?: (scene: Scene) => void;
  onCustomSceneDelete?: (sceneId: string) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({
  selectedScene,
  onSceneChange,
  customScenes = [],
  allowCustom = true,
  onCustomSceneCreate,
  onCustomSceneEdit,
  onCustomSceneDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newScene, setNewScene] = useState<Partial<Scene>>({
    category: 'custom',
    isCustom: true,
    tags: []
  });

  const presetScenes: Scene[] = [
    // 日常生活场景
    {
      id: 'home',
      name: '家庭场景',
      description: '家庭日常生活中的对话',
      icon: Home,
      context: '在家中，家人之间的日常交流',
      suggestedCharacters: ['家人', '配偶', '孩子'],
      category: 'daily',
      tags: ['家庭', '日常', '亲情']
    },
    {
      id: 'social',
      name: '社交聚会',
      description: '朋友聚会或社交场合',
      icon: Users,
      context: '朋友聚会，轻松愉快的氛围',
      suggestedCharacters: ['朋友', '同事', '熟人'],
      category: 'daily',
      tags: ['社交', '聚会', '朋友']
    },
    {
      id: 'shopping',
      name: '购物场景',
      description: '购物时的咨询和推荐',
      icon: ShoppingBag,
      context: '购物场所，产品咨询和推荐',
      suggestedCharacters: ['销售员', '客户', '朋友'],
      category: 'daily',
      tags: ['购物', '消费', '推荐']
    },
    {
      id: 'cafe',
      name: '咖啡厅',
      description: '咖啡厅的休闲对话',
      icon: Coffee,
      context: '咖啡厅，轻松的聊天环境',
      suggestedCharacters: ['朋友', '同事', '客户'],
      category: 'daily',
      tags: ['休闲', '咖啡', '聊天']
    },
    {
      id: 'restaurant',
      name: '餐厅用餐',
      description: '餐厅用餐时的对话',
      icon: Utensils,
      context: '餐厅环境，用餐时的轻松交流',
      suggestedCharacters: ['朋友', '家人', '同事'],
      category: 'daily',
      tags: ['用餐', '美食', '分享']
    },

    // 商务场景
    {
      id: 'office',
      name: '办公场所',
      description: '工作场所的专业对话',
      icon: Briefcase,
      context: '办公室，专业的工作环境',
      suggestedCharacters: ['同事', '客户', '领导'],
      category: 'business',
      tags: ['工作', '商务', '专业']
    },
    {
      id: 'meeting',
      name: '商务会议',
      description: '正式的商务会议场景',
      icon: Building,
      context: '会议室，正式的商务讨论环境',
      suggestedCharacters: ['客户', '合作伙伴', '团队成员'],
      category: 'business',
      tags: ['会议', '商务', '合作']
    },
    {
      id: 'phone_call',
      name: '电话沟通',
      description: '电话中的商务或私人沟通',
      icon: Phone,
      context: '电话沟通，无法面对面的交流',
      suggestedCharacters: ['客户', '朋友', '家人'],
      category: 'business',
      tags: ['电话', '沟通', '远程']
    },
    {
      id: 'video_call',
      name: '视频会议',
      description: '在线视频会议或通话',
      icon: Video,
      context: '视频通话，在线远程交流',
      suggestedCharacters: ['同事', '客户', '朋友'],
      category: 'business',
      tags: ['视频', '在线', '会议']
    },

    // 娱乐场景
    {
      id: 'online',
      name: '线上交流',
      description: '社交媒体或在线聊天',
      icon: MessageSquare,
      context: '线上平台，文字或语音交流',
      suggestedCharacters: ['网友', '客户', '粉丝'],
      category: 'entertainment',
      tags: ['线上', '社交媒体', '聊天']
    },
    {
      id: 'gaming',
      name: '游戏场景',
      description: '游戏中或游戏相关的对话',
      icon: Gamepad2,
      context: '游戏环境，轻松娱乐的氛围',
      suggestedCharacters: ['游戏伙伴', '朋友', '队友'],
      category: 'entertainment',
      tags: ['游戏', '娱乐', '休闲']
    },
    {
      id: 'photography',
      name: '摄影分享',
      description: '摄影作品分享和讨论',
      icon: Camera,
      context: '摄影场所，艺术创作交流',
      suggestedCharacters: ['摄影师', '模特', '朋友'],
      category: 'entertainment',
      tags: ['摄影', '艺术', '分享']
    },
    {
      id: 'music',
      name: '音乐场景',
      description: '音乐相关的对话和分享',
      icon: Music,
      context: '音乐环境，艺术和情感交流',
      suggestedCharacters: ['音乐人', '听众', '朋友'],
      category: 'entertainment',
      tags: ['音乐', '艺术', '情感']
    },
    {
      id: 'party',
      name: '聚会庆祝',
      description: '生日派对或庆祝活动',
      icon: Gift,
      context: '庆祝场合，欢乐热闹的氛围',
      suggestedCharacters: ['朋友', '家人', '同事'],
      category: 'entertainment',
      tags: ['庆祝', '派对', '欢乐']
    },

    // 健康医疗场景
    {
      id: 'hospital',
      name: '医疗咨询',
      description: '医院或诊所的医疗对话',
      icon: Stethoscope,
      context: '医疗场所，专业的健康咨询',
      suggestedCharacters: ['医生', '患者', '家属'],
      category: 'health',
      tags: ['医疗', '健康', '咨询']
    },
    {
      id: 'fitness',
      name: '健身场景',
      description: '健身房或运动场所的对话',
      icon: Dumbbell,
      context: '健身场所，运动和健康交流',
      suggestedCharacters: ['教练', '健身者', '朋友'],
      category: 'health',
      tags: ['健身', '运动', '健康']
    },
    {
      id: 'childcare',
      name: '育儿场景',
      description: '育儿相关的对话和分享',
      icon: Baby,
      context: '育儿环境，关于孩子成长的交流',
      suggestedCharacters: ['父母', '老师', '医生'],
      category: 'health',
      tags: ['育儿', '成长', '教育']
    },

    // 教育场景
    {
      id: 'school',
      name: '学校教育',
      description: '学校或教育机构的对话',
      icon: GraduationCap,
      context: '教育场所，学习和成长交流',
      suggestedCharacters: ['老师', '学生', '家长'],
      category: 'education',
      tags: ['教育', '学习', '成长']
    },

    // 旅行场景
    {
      id: 'travel_car',
      name: '自驾旅行',
      description: '自驾游或车内对话',
      icon: Car,
      context: '车内环境，旅行途中的交流',
      suggestedCharacters: ['旅伴', '家人', '朋友'],
      category: 'travel',
      tags: ['旅行', '自驾', '路途']
    },
    {
      id: 'travel_plane',
      name: '航空旅行',
      description: '机场或飞机上的对话',
      icon: Plane,
      context: '航空旅行，旅途中的交流',
      suggestedCharacters: ['旅客', '空乘', '旅伴'],
      category: 'travel',
      tags: ['旅行', '航空', '度假']
    },

    // 服务场景
    {
      id: 'service',
      name: '客服场景',
      description: '客户服务和咨询场景',
      icon: Heart,
      context: '客服中心，专业的服务环境',
      suggestedCharacters: ['客服', '客户', '专家'],
      category: 'business',
      tags: ['客服', '服务', '咨询']
    },
    {
      id: 'event',
      name: '活动现场',
      description: '各类活动现场的对话',
      icon: Calendar,
      context: '活动现场，热闹的交流环境',
      suggestedCharacters: ['主办方', '参与者', '嘉宾'],
      category: 'entertainment',
      tags: ['活动', '现场', '交流']
    }
  ];

  const allScenes = [...presetScenes, ...customScenes];

  // 场景分类
  const categories = [
    { id: 'all', name: '全部场景', icon: Star },
    { id: 'daily', name: '日常生活', icon: Home },
    { id: 'business', name: '商务场景', icon: Briefcase },
    { id: 'entertainment', name: '娱乐休闲', icon: Gamepad2 },
    { id: 'health', name: '健康医疗', icon: Stethoscope },
    { id: 'education', name: '教育学习', icon: GraduationCap },
    { id: 'travel', name: '旅行出行', icon: Plane },
    { id: 'custom', name: '自定义', icon: Edit3 }
  ];

  // 筛选场景
  const getFilteredScenes = () => {
    if (selectedCategory === 'all') {
      return allScenes;
    }
    return allScenes.filter(scene => scene.category === selectedCategory);
  };

  const filteredScenes = getFilteredScenes();

  const handleSceneSelect = (scene: Scene) => {
    onSceneChange(scene);
    setIsOpen(false);
  };

  const handleCreateCustomScene = () => {
    setIsCreatingCustom(true);
    setEditingScene(null);
    setNewScene({
      id: `custom_${Date.now()}`,
      name: '',
      description: '',
      context: '',
      suggestedCharacters: [],
      category: 'custom',
      isCustom: true,
      tags: [],
      icon: MapPin
    });
  };

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setNewScene(scene);
    setIsCreatingCustom(true);
  };

  const handleSaveCustomScene = () => {
    if (!newScene.name || !newScene.description || !newScene.context) {
      alert('请填写完整的场景信息');
      return;
    }

    const sceneToSave: Scene = {
      id: newScene.id || `custom_${Date.now()}`,
      name: newScene.name,
      description: newScene.description,
      context: newScene.context,
      suggestedCharacters: newScene.suggestedCharacters || [],
      category: newScene.category || 'custom',
      isCustom: true,
      tags: newScene.tags || [],
      icon: newScene.icon || MapPin
    };

    if (editingScene && onCustomSceneEdit) {
      onCustomSceneEdit(sceneToSave);
    } else if (onCustomSceneCreate) {
      onCustomSceneCreate(sceneToSave);
    }

    setIsCreatingCustom(false);
    setEditingScene(null);
    setNewScene({});
  };

  const handleCancelCustomScene = () => {
    setIsCreatingCustom(false);
    setEditingScene(null);
    setNewScene({});
  };

  const handleDeleteScene = (sceneId: string) => {
    if (confirm('确定要删除这个自定义场景吗？')) {
      if (onCustomSceneDelete) {
        onCustomSceneDelete(sceneId);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">场景设置</h3>
        </div>
        {allowCustom && (
          <button
            onClick={handleCreateCustomScene}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>自定义</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
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

      {/* Scene Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {selectedScene ? (
              <>
                <selectedScene.icon className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{selectedScene.name}</div>
                  <div className="text-sm text-gray-500">{selectedScene.description}</div>
                </div>
              </>
            ) : (
              <span className="text-gray-500">选择对话场景</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
            {filteredScenes.length > 0 ? (
              filteredScenes.map((scene) => {
                const Icon = scene.icon;
                const isSelected = selectedScene?.id === scene.id;

                return (
                  <div key={scene.id} className="relative group">
                    <button
                      onClick={() => handleSceneSelect(scene)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {scene.name}
                        </div>
                        <div className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                          {scene.description}
                        </div>
                        {scene.tags && scene.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scene.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {scene.isCustom && allowCustom && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditScene(scene);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="编辑场景"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteScene(scene.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="删除场景"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>该分类下暂无场景</p>
                {selectedCategory === 'custom' && allowCustom && (
                  <button
                    onClick={handleCreateCustomScene}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    创建第一个自定义场景
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Scene Details */}
      {selectedScene && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">场景描述</h4>
              <p className="text-sm text-blue-700">{selectedScene.context}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-2">建议角色</h4>
              <div className="flex flex-wrap gap-2">
                {selectedScene.suggestedCharacters.map((character, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {character}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scene Creation Modal */}
      {isCreatingCustom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingScene ? '编辑场景' : '创建自定义场景'}
                </h2>
                <button
                  onClick={handleCancelCustomScene}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 场景名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    场景名称 *
                  </label>
                  <input
                    type="text"
                    value={newScene.name || ''}
                    onChange={(e) => setNewScene({ ...newScene, name: e.target.value })}
                    placeholder="输入场景名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 场景描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    场景描述 *
                  </label>
                  <input
                    type="text"
                    value={newScene.description || ''}
                    onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                    placeholder="简短描述这个场景"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 场景背景 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    场景背景 *
                  </label>
                  <textarea
                    value={newScene.context || ''}
                    onChange={(e) => setNewScene({ ...newScene, context: e.target.value })}
                    placeholder="详细描述场景的背景和氛围"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 建议角色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    建议角色
                  </label>
                  <input
                    type="text"
                    value={newScene.suggestedCharacters?.join(', ') || ''}
                    onChange={(e) => setNewScene({
                      ...newScene,
                      suggestedCharacters: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="用逗号分隔，如：朋友, 同事, 客户"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <input
                    type="text"
                    value={newScene.tags?.join(', ') || ''}
                    onChange={(e) => setNewScene({
                      ...newScene,
                      tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="用逗号分隔，如：休闲, 商务, 创意"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveCustomScene}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingScene ? '保存修改' : '创建场景'}</span>
                </button>
                <button
                  onClick={handleCancelCustomScene}
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

export default SceneSelector;
