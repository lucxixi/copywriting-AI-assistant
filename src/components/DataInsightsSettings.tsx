// 数据洞察设置组件

import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics';
import { UsageStatistics, QualityMetrics, EfficiencyReport, TrendAnalysis, SystemHealth } from '../types/settings';

interface DataInsightsSettingsProps {
  dataInsightsEnabled: boolean;
  collectUsageData: boolean;
  generateReports: boolean;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  onSettingsChange: (settings: {
    enabled: boolean;
    collectUsageData: boolean;
    generateReports: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  }) => void;
}

const DataInsightsSettings: React.FC<DataInsightsSettingsProps> = ({
  dataInsightsEnabled,
  collectUsageData,
  generateReports,
  reportFrequency,
  onSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'quality' | 'efficiency' | 'trends' | 'health'>('overview');
  const [usageStats, setUsageStats] = useState<UsageStatistics | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [efficiencyReport, setEfficiencyReport] = useState<EfficiencyReport | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: '概览', icon: '📊' },
    { id: 'usage', name: '使用统计', icon: '📈' },
    { id: 'quality', name: '质量分析', icon: '⭐' },
    { id: 'efficiency', name: '效率报告', icon: '⚡' },
    { id: 'trends', name: '趋势分析', icon: '📉' },
    { id: 'health', name: '系统健康', icon: '💚' }
  ];

  useEffect(() => {
    if (dataInsightsEnabled) {
      loadAllData();
    }
  }, [dataInsightsEnabled]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usage, quality, efficiency, trends, health] = await Promise.all([
        Promise.resolve(analyticsService.getUsageStatistics()),
        Promise.resolve(analyticsService.getQualityMetrics()),
        Promise.resolve(analyticsService.generateEfficiencyReport('weekly')),
        Promise.resolve(analyticsService.getTrendAnalysis()),
        Promise.resolve(analyticsService.getSystemHealth())
      ]);

      setUsageStats(usage);
      setQualityMetrics(quality);
      setEfficiencyReport(efficiency);
      setTrendAnalysis(trends);
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{formatNumber(usageStats?.totalGenerations || 0)}</div>
          <div className="text-sm text-blue-700">总生成次数</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{usageStats?.totalSessions || 0}</div>
          <div className="text-sm text-green-700">总会话数</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{Object.keys(usageStats?.moduleUsage || {}).length}</div>
          <div className="text-sm text-purple-700">使用模块数</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{Math.round(qualityMetrics?.averageContentLength || 0)}</div>
          <div className="text-sm text-orange-700">平均内容长度</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">模块使用排行</h4>
          <div className="space-y-3">
            {Object.entries(usageStats?.moduleUsage || {})
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 5)
              .map(([moduleId, usage]) => (
                <div key={moduleId} className="flex items-center justify-between">
                  <span className="text-gray-700">{moduleId}</span>
                  <span className="font-medium text-gray-900">{usage.count} 次</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">内容长度分布</h4>
          <div className="space-y-3">
            {qualityMetrics && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">短内容 (&lt;100字)</span>
                  <span className="font-medium text-gray-900">{qualityMetrics.contentLengthDistribution.short}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">中等内容 (100-500字)</span>
                  <span className="font-medium text-gray-900">{qualityMetrics.contentLengthDistribution.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">长内容 (&gt;500字)</span>
                  <span className="font-medium text-gray-900">{qualityMetrics.contentLengthDistribution.long}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsageStats = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">模块使用详情</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">模块</th>
                <th className="text-right py-2">使用次数</th>
                <th className="text-right py-2">平均响应时间</th>
                <th className="text-right py-2">最后使用</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(usageStats?.moduleUsage || {}).map(([moduleId, usage]) => (
                <tr key={moduleId} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{moduleId}</td>
                  <td className="py-2 text-right">{usage.count}</td>
                  <td className="py-2 text-right">{Math.round(usage.avgResponseTime)}ms</td>
                  <td className="py-2 text-right text-gray-500">
                    {usage.lastUsed ? new Date(usage.lastUsed).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">日使用统计</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(usageStats?.dailyStats || {})
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 10)
              .map(([date, stats]) => (
                <div key={date} className="flex justify-between text-sm">
                  <span className="text-gray-600">{date}</span>
                  <span className="font-medium">{stats.generations} 次</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">周使用统计</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(usageStats?.weeklyStats || {})
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 8)
              .map(([week, stats]) => (
                <div key={week} className="flex justify-between text-sm">
                  <span className="text-gray-600">{week}</span>
                  <span className="font-medium">{stats.generations} 次</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">月使用统计</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(usageStats?.monthlyStats || {})
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, stats]) => (
                <div key={month} className="flex justify-between text-sm">
                  <span className="text-gray-600">{month}</span>
                  <span className="font-medium">{stats.generations} 次</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQualityMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">内容质量指标</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">平均内容长度</span>
                <span className="font-medium">{Math.round(qualityMetrics?.averageContentLength || 0)} 字符</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">重新生成率</span>
                <span className="font-medium">{(qualityMetrics?.regenerationRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">风格分布</h4>
          <div className="space-y-2">
            {Object.entries(qualityMetrics?.styleDistribution || {}).map(([style, count]) => (
              <div key={style} className="flex justify-between items-center">
                <span className="text-gray-700">{style}</span>
                <span className="font-medium">{count} 次</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">存储使用情况</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">已使用</span>
              <span className="font-medium">{formatBytes(systemHealth?.storage.used || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">可用空间</span>
              <span className="font-medium">{formatBytes(systemHealth?.storage.available || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(systemHealth?.storage.percentage || 0, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 text-center">
              {(systemHealth?.storage.percentage || 0).toFixed(1)}% 已使用
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">性能指标</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">平均响应时间</span>
              <span className="font-medium">{Math.round(systemHealth?.performance.avgResponseTime || 0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">错误率</span>
              <span className="font-medium">{(systemHealth?.performance.errorRate || 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">运行时间</span>
              <span className="font-medium">{systemHealth?.performance.uptime || 0}h</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">安全状态</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">安全评分</span>
              <span className="font-medium text-green-600">{systemHealth?.security.securityScore || 0}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">漏洞数量</span>
              <span className="font-medium">{systemHealth?.security.vulnerabilities || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">最后检查</span>
              <span className="font-medium text-sm">
                {systemHealth?.security.lastSecurityCheck 
                  ? new Date(systemHealth.security.lastSecurityCheck).toLocaleDateString()
                  : '-'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!dataInsightsEnabled) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">数据洞察未启用</h3>
        <p className="text-gray-600 mb-6">启用数据洞察功能来查看详细的使用统计和分析报告</p>
        <button
          onClick={() => onSettingsChange({
            enabled: true,
            collectUsageData,
            generateReports,
            reportFrequency
          })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          启用数据洞察
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 设置控制 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-3">数据洞察设置</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={collectUsageData}
              onChange={(e) => onSettingsChange({
                enabled: dataInsightsEnabled,
                collectUsageData: e.target.checked,
                generateReports,
                reportFrequency
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">收集使用数据</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={generateReports}
              onChange={(e) => onSettingsChange({
                enabled: dataInsightsEnabled,
                collectUsageData,
                generateReports: e.target.checked,
                reportFrequency
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">生成报告</span>
          </label>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">报告频率</label>
            <select
              value={reportFrequency}
              onChange={(e) => onSettingsChange({
                enabled: dataInsightsEnabled,
                collectUsageData,
                generateReports,
                reportFrequency: e.target.value as any
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">每日</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">加载数据中...</div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'usage' && renderUsageStats()}
            {activeTab === 'quality' && renderQualityMetrics()}
            {activeTab === 'health' && renderSystemHealth()}
          </>
        )}
      </div>
    </div>
  );
};

export default DataInsightsSettings;
