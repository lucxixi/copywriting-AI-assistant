import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Zap, 
  Target 
} from 'lucide-react';
import { storageService } from '../services/storage';
import { DashboardData, DashboardStat, RecentActivity } from '../types/dashboard';

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: [],
    recentActivity: [],
    apiConfigured: false,
    totalGenerations: 0,
    todayGenerations: 0,
    availableTemplates: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载仪表板数据
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const history = storageService.getGenerationHistory();
      const activeApi = storageService.getActiveApiConfig();
      const templates = storageService.getPromptTemplates();

      const today = new Date().toDateString();
      const todayGenerations = history.filter(h =>
        new Date(h.createdAt).toDateString() === today
      );

      const totalGenerations = history.length;
      const apiConfigured = !!activeApi;

      // 计算统计数据
      const stats: DashboardStat[] = [
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
        }
      ];

      // 获取最近活动
      const recentActivity: RecentActivity[] = history.slice(0, 4).map(h => ({
        type: getTypeLabel(h.type),
        title: h.result.substring(0, 30) + (h.result.length > 30 ? '...' : ''),
        time: getTimeAgo(h.createdAt),
        status: 'completed' as const
      }));

      setData({
        stats,
        recentActivity,
        apiConfigured,
        totalGenerations,
        todayGenerations: todayGenerations.length,
        availableTemplates: templates.length
      });
    } catch (err) {
      setError('加载仪表板数据失败');
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取类型标签
  const getTypeLabel = (type: string): string => {
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

  // 获取时间差
  const getTimeAgo = (dateString: string): string => {
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

  // 刷新数据
  const refreshData = () => {
    loadDashboardData();
  };

  // 初始化
  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refreshData
  };
} 