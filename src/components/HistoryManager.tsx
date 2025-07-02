import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Download,
  Trash2,
  Star,
  Copy,
  Eye,
  Settings,
  Clock,
  Tag,
  User,
  ChevronDown,
  X,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  BarChart3,
  FileText,
  Heart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { GenerationHistory } from '../types/api';
import { storageService } from '../services/storage';

const HistoryManager: React.FC = () => {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<GenerationHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    historyMaxRecords: 100,
    historyRetentionDays: 30,
    autoCleanup: true
  });
  const [selectedItem, setSelectedItem] = useState<GenerationHistory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadHistory();
    loadPreferences();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchTerm, selectedType, selectedDateRange]);

  const loadHistory = () => {
    const historyData = storageService.getGenerationHistory();
    setHistory(historyData);
  };

  const loadPreferences = () => {
    const userPrefs = storageService.getUserPreferences();
    setPreferences({
      historyMaxRecords: userPrefs.historyMaxRecords || 100,
      historyRetentionDays: userPrefs.historyRetentionDays || 30,
      autoCleanup: userPrefs.autoCleanup !== false
    });
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('history_favorites');
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
  };

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem('history_favorites', JSON.stringify(Array.from(newFavorites)));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // 按类型筛选
    if (selectedType !== 'all') {
      if (selectedType === 'favorites') {
        filtered = filtered.filter(item => favorites.has(item.id));
      } else {
        filtered = filtered.filter(item => item.type === selectedType);
      }
    }

    // 按时间筛选
    if (selectedDateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.createdAt) >= cutoffDate);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(item.parameters).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      welcome: Heart,
      product: ShoppingBag,
      social: MessageSquare,
      activity: Calendar,
      dialogue: MessageSquare,
      script: BarChart3,
      analysis: FileText
    };
    return icons[type as keyof typeof icons] || BookOpen;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      welcome: '欢迎语',
      product: '产品分析',
      social: '社交分享',
      activity: '活动营销',
      dialogue: '对话故事',
      script: '话术分析',
      analysis: '分析类'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    saveFavorites(newFavorites);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // 可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleExport = () => {
    const dataToExport = selectedItems.size > 0 
      ? filteredHistory.filter(item => selectedItems.has(item.id))
      : filteredHistory;

    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: dataToExport.length,
      records: dataToExport
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBatchDelete = () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedItems.size} 条记录吗？此操作不可恢复。`)) {
      const updatedHistory = history.filter(item => !selectedItems.has(item.id));
      // 这里需要更新存储服务中的历史记录
      localStorage.setItem('copywriting_ai_generation_history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      setSelectedItems(new Set());
    }
  };

  const savePreferences = () => {
    const userPrefs = storageService.getUserPreferences();
    const updatedPrefs = { ...userPrefs, ...preferences };
    storageService.saveUserPreferences(updatedPrefs);
    setShowSettings(false);
  };

  const handleViewDetail = (item: GenerationHistory) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
    setShowDetailModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const types = [
    { id: 'all', name: '全部类型', icon: BookOpen },
    { id: 'favorites', name: '收藏夹', icon: Star },
    { id: 'welcome', name: '欢迎语', icon: Heart },
    { id: 'product', name: '产品分析', icon: ShoppingBag },
    { id: 'social', name: '社交分享', icon: MessageSquare },
    { id: 'dialogue', name: '对话故事', icon: MessageSquare },
    { id: 'script', name: '话术分析', icon: BarChart3 }
  ];

  const dateRanges = [
    { id: 'all', name: '全部时间' },
    { id: 'today', name: '今天' },
    { id: 'week', name: '最近一周' },
    { id: 'month', name: '最近一月' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">历史记录</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            管理您的生成历史，共 {filteredHistory.length} 条记录
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>设置</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索历史记录..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 筛选器 */}
          <div className="flex flex-wrap gap-2">
            {/* 类型筛选 */}
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 时间筛选 */}
            <div className="flex flex-wrap gap-2">
              {dateRanges.map((range) => {
                const isSelected = selectedDateRange === range.id;
                return (
                  <button
                    key={range.id}
                    onClick={() => setSelectedDateRange(range.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{range.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 批量操作 */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              已选择 {selectedItems.size} 条记录
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>导出选中</span>
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除选中</span>
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>取消选择</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录列表 */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            const isFavorite = favorites.has(item.id);
            const isSelected = selectedItems.has(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border transition-all ${
                  isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* 选择框 */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const newSelected = new Set(selectedItems);
                          if (e.target.checked) {
                            newSelected.add(item.id);
                          } else {
                            newSelected.delete(item.id);
                          }
                          setSelectedItems(newSelected);
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />

                      {/* 类型图标 */}
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <TypeIcon className="w-5 h-5 text-blue-600" />
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-blue-600">
                            {getTypeLabel(item.type)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </span>
                          {isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>

                        {/* 生成结果预览 */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-800 line-clamp-3">
                            {item.result.length > 200
                              ? `${item.result.substring(0, 200)}...`
                              : item.result
                            }
                          </p>
                        </div>

                        {/* 参数信息 */}
                        {item.parameters && Object.keys(item.parameters).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Object.entries(item.parameters).slice(0, 3).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {key}: {String(value).substring(0, 20)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite
                            ? 'text-yellow-500 hover:bg-yellow-50'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50'
                        }`}
                        title={isFavorite ? '取消收藏' : '添加收藏'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopy(item.result)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="复制内容"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleViewDetail(item)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史记录</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' || selectedDateRange !== 'all'
                ? '没有找到符合条件的记录，请尝试调整筛选条件'
                : '还没有生成任何内容，去创建您的第一个作品吧！'
              }
            </p>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {selectedItem.type === 'copywriting' && <FileText className="w-4 h-4 text-blue-600" />}
                  {selectedItem.type === 'product_analysis' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                  {selectedItem.type === 'dialogue_story' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                  {selectedItem.type === 'script_analysis' && <BookOpen className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedItem.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedItem.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 基本信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">基本信息</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">类型:</span>
                    <span className="text-sm font-medium">
                      {selectedItem.type === 'copywriting' && '文案生成'}
                      {selectedItem.type === 'product_analysis' && '产品分析'}
                      {selectedItem.type === 'dialogue_story' && '对话故事'}
                      {selectedItem.type === 'script_analysis' && '话术分析'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">创建时间:</span>
                    <span className="text-sm font-medium">{new Date(selectedItem.timestamp).toLocaleString()}</span>
                  </div>
                  {selectedItem.metadata && (
                    <>
                      {selectedItem.metadata.scriptCount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">脚本数量:</span>
                          <span className="text-sm font-medium">{selectedItem.metadata.scriptCount}</span>
                        </div>
                      )}
                      {selectedItem.metadata.analysisType && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">分析类型:</span>
                          <span className="text-sm font-medium">{selectedItem.metadata.analysisType}</span>
                        </div>
                      )}
                      {selectedItem.metadata.features && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">特征:</span>
                          <span className="text-sm font-medium">{selectedItem.metadata.features.join(', ')}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 内容详情 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">内容详情</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {typeof selectedItem.content === 'string'
                      ? selectedItem.content
                      : JSON.stringify(selectedItem.content, null, 2)
                    }
                  </pre>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleCopy(selectedItem.content)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                复制内容
              </button>
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryManager;
