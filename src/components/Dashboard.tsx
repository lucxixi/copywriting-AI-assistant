import React from 'react';
import { TrendingUp, FileText, Users, Zap, Clock, Target, Award, ArrowUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      label: '今日生成文案', 
      value: '127', 
      change: '+23%', 
      icon: FileText, 
      color: 'blue',
      trend: 'up'
    },
    { 
      label: '模板使用次数', 
      value: '1,834', 
      change: '+12%', 
      icon: Zap, 
      color: 'purple',
      trend: 'up'
    },
    { 
      label: '活跃用户数', 
      value: '89', 
      change: '+8%', 
      icon: Users, 
      color: 'green',
      trend: 'up'
    },
    { 
      label: '平均转化率', 
      value: '18.5%', 
      change: '+5.2%', 
      icon: Target, 
      color: 'orange',
      trend: 'up'
    },
  ];

  const recentActivity = [
    { type: '产品推广', title: '春季新品发布会文案', time: '5分钟前', status: 'completed' },
    { type: '活动营销', title: '限时优惠促销文案', time: '12分钟前', status: 'completed' },
    { type: '用户互动', title: '社群话题讨论引导', time: '25分钟前', status: 'pending' },
    { type: '客服回复', title: '售后服务标准话术', time: '1小时前', status: 'completed' },
  ];

  const topTemplates = [
    { name: '产品介绍模板', usage: 342, efficiency: 92 },
    { name: '活动推广模板', usage: 287, efficiency: 88 },
    { name: '用户互动模板', usage: 234, efficiency: 85 },
    { name: '朋友圈分享模板', usage: 198, efficiency: 90 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">最近活动</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">查看全部</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
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
            ))}
          </div>
        </div>

        {/* Top Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">热门模板</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">管理模板</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {topTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">使用 {template.usage} 次</div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{template.efficiency}%</div>
                    <div className="text-xs text-gray-500">效率</div>
                  </div>
                  <div className="w-8 sm:w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${template.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
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