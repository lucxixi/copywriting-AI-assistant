import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, Users, Zap, Clock, Target, Award, ArrowUp, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storage';
import { GenerationHistory } from '../types/api';

const Dashboard: React.FC = () => {
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([]);
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const history = storageService.getGenerationHistory();
    const activeApi = storageService.getActiveApiConfig();

    setGenerationHistory(history);
    setApiConfigured(!!activeApi);
  };

  // 计算统计数据
  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayGenerations = generationHistory.filter(h =>
      new Date(h.createdAt).toDateString() === today
    );

    const totalGenerations = generationHistory.length;
    const templates = storageService.getPromptTemplates();

    return [
      {
        label: '今日生成文案',
        value: todayGenerations.length.toString(),
        change: totalGenerations > 0 ? '+' + Math.round((todayGenerations.length / totalGenerations) * 100) + '%' : '0%',
        icon: FileText,
        color: 'blue',
        trend: 'up'
      },
      {
        label: '总生成次数',
        value: totalGenerations.toString(),
        change: totalGenerations > 0 ? '+100%' : '0%',
        icon: Zap,
        color: 'purple',
        trend: 'up'
      },
      {
        label: '可用模板',
        value: templates.length.toString(),
        change: templates.length > 0 ? '+' + templates.length : '0',
        icon: Users,
        color: 'green',
        trend: 'up'
      },
      {
        label: 'API状态',
        value: apiConfigured ? '已配置' : '未配置',
        change: apiConfigured ? '正常' : '需配置',
        icon: Target,
        color: apiConfigured ? 'green' : 'orange',
        trend: 'up'
      },
    ];
  };

  const getRecentActivity = () => {
    return generationHistory.slice(0, 4).map(h => ({
      type: getTypeLabel(h.type),
      title: h.result.substring(0, 30) + (h.result.length > 30 ? '...' : ''),
      time: getTimeAgo(h.createdAt),
      status: 'completed'
    }));
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      welcome: '欢迎语',
      product: '产品推广',
      social: '朋友圈',
      activity: '活动营销',
      interaction: '互动话题',
      service: '客服话术',
      testimonial: '用户反馈',
      lifestyle: '生活场景'
    };
    return labels[type] || type;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    return `${diffDays}天前`;
  };

  const stats = calculateStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* API配置提醒 */}
      {!apiConfigured && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">需要配置API</h3>
              <p className="text-sm text-orange-700 mt-1">
                请先在系统设置中配置AI API，才能开始生成文案。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">工作台概览</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">掌握您的私域文案运营全貌</p>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>最后更新: 刚刚</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
          };

          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-xs sm:text-sm font-medium">
                  <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">最近生成</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">查看全部</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{activity.type}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">还没有生成任何文案</p>
                <p className="text-xs">开始创作您的第一个文案吧</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">可用模板</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">管理模板</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {storageService.getPromptTemplates().slice(0, 4).map((template, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.isBuiltIn ? '内置模板' : '自定义模板'}
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{getTypeLabel(template.type)}</div>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {template.style}
                  </div>
                </div>
              </div>
            ))}
            {storageService.getPromptTemplates().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">还没有可用的模板</p>
                <p className="text-xs">系统会自动加载内置模板</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">快速开始</h3>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">选择一个模板开始创作您的专业文案</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200 text-sm sm:text-base">
              创建模板
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm sm:text-base">
              开始创作
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;