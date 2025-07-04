import { Clock, AlertCircle, ArrowUp, FileText } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export function Dashboard() {
  const { data, isLoading, error, refreshData } = useDashboard();

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* API配置提醒 */}
      {!data.apiConfigured && (
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

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">加载失败</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
        {data.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center`}>
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
            <button 
              onClick={refreshData}
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
            >
              刷新
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, index) => (
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">快速操作</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <div>生成文案</div>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-300 hover:text-green-600 transition-colors text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <div>产品分析</div>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <div>对话生成</div>
              </div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div>系统设置</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 