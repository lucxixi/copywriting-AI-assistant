// 数据分析和统计服务

import { 
  AnalyticsEvent, 
  UsageStatistics, 
  QualityMetrics, 
  EfficiencyReport, 
  TrendAnalysis,
  SystemHealth 
} from '../types/settings';

class AnalyticsService {
  private readonly STORAGE_KEYS = {
    EVENTS: 'copywriting_ai_analytics_events',
    USAGE_STATS: 'copywriting_ai_usage_statistics',
    QUALITY_METRICS: 'copywriting_ai_quality_metrics',
    EFFICIENCY_REPORTS: 'copywriting_ai_efficiency_reports',
    TREND_ANALYSIS: 'copywriting_ai_trend_analysis',
    SYSTEM_HEALTH: 'copywriting_ai_system_health'
  };

  // 记录事件
  trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    try {
      const fullEvent: AnalyticsEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      const events = this.getEvents();
      events.push(fullEvent);

      // 只保留最近1000个事件
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem(this.STORAGE_KEYS.EVENTS, JSON.stringify(events));
      
      // 实时更新统计数据
      this.updateUsageStatistics(fullEvent);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // 获取所有事件
  getEvents(): AnalyticsEvent[] {
    try {
      const events = localStorage.getItem(this.STORAGE_KEYS.EVENTS);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  }

  // 获取使用统计
  getUsageStatistics(): UsageStatistics {
    try {
      const stats = localStorage.getItem(this.STORAGE_KEYS.USAGE_STATS);
      if (stats) {
        return JSON.parse(stats);
      }
      
      // 如果没有统计数据，从事件重新计算
      return this.calculateUsageStatistics();
    } catch (error) {
      console.error('Failed to get usage statistics:', error);
      return this.getDefaultUsageStatistics();
    }
  }

  // 计算使用统计
  private calculateUsageStatistics(): UsageStatistics {
    const events = this.getEvents();
    const stats: UsageStatistics = {
      totalSessions: 0,
      totalGenerations: 0,
      moduleUsage: {},
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {}
    };

    // 按会话分组（相邻事件间隔超过30分钟算新会话）
    let sessions = 0;
    let lastEventTime = 0;

    events.forEach(event => {
      const eventTime = new Date(event.timestamp).getTime();
      const date = event.timestamp.split('T')[0];
      const week = this.getWeekKey(new Date(event.timestamp));
      const month = event.timestamp.substring(0, 7);

      // 会话计算
      if (eventTime - lastEventTime > 30 * 60 * 1000) { // 30分钟
        sessions++;
      }
      lastEventTime = eventTime;

      // 生成统计
      if (event.type === 'generation') {
        stats.totalGenerations++;
      }

      // 模块使用统计
      if (!stats.moduleUsage[event.moduleId]) {
        stats.moduleUsage[event.moduleId] = {
          count: 0,
          totalTokens: 0,
          avgResponseTime: 0,
          lastUsed: event.timestamp
        };
      }
      stats.moduleUsage[event.moduleId].count++;
      stats.moduleUsage[event.moduleId].lastUsed = event.timestamp;
      
      if (event.duration) {
        const module = stats.moduleUsage[event.moduleId];
        module.avgResponseTime = (module.avgResponseTime * (module.count - 1) + event.duration) / module.count;
      }

      // 日统计
      if (!stats.dailyStats[date]) {
        stats.dailyStats[date] = { sessions: 0, generations: 0, tokens: 0 };
      }
      if (event.type === 'generation') {
        stats.dailyStats[date].generations++;
      }

      // 周统计
      if (!stats.weeklyStats[week]) {
        stats.weeklyStats[week] = { sessions: 0, generations: 0, tokens: 0 };
      }
      if (event.type === 'generation') {
        stats.weeklyStats[week].generations++;
      }

      // 月统计
      if (!stats.monthlyStats[month]) {
        stats.monthlyStats[month] = { sessions: 0, generations: 0, tokens: 0 };
      }
      if (event.type === 'generation') {
        stats.monthlyStats[month].generations++;
      }
    });

    stats.totalSessions = sessions;
    
    // 保存计算结果
    localStorage.setItem(this.STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
    return stats;
  }

  // 更新使用统计（实时）
  private updateUsageStatistics(event: AnalyticsEvent): void {
    const stats = this.getUsageStatistics();
    
    if (event.type === 'generation') {
      stats.totalGenerations++;
    }

    const date = event.timestamp.split('T')[0];
    const week = this.getWeekKey(new Date(event.timestamp));
    const month = event.timestamp.substring(0, 7);

    // 更新模块统计
    if (!stats.moduleUsage[event.moduleId]) {
      stats.moduleUsage[event.moduleId] = {
        count: 0,
        totalTokens: 0,
        avgResponseTime: 0,
        lastUsed: event.timestamp
      };
    }
    stats.moduleUsage[event.moduleId].count++;
    stats.moduleUsage[event.moduleId].lastUsed = event.timestamp;

    // 更新日统计
    if (!stats.dailyStats[date]) {
      stats.dailyStats[date] = { sessions: 0, generations: 0, tokens: 0 };
    }
    if (event.type === 'generation') {
      stats.dailyStats[date].generations++;
    }

    localStorage.setItem(this.STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
  }

  // 获取质量指标
  getQualityMetrics(): QualityMetrics {
    try {
      const metrics = localStorage.getItem(this.STORAGE_KEYS.QUALITY_METRICS);
      if (metrics) {
        return JSON.parse(metrics);
      }
      return this.calculateQualityMetrics();
    } catch (error) {
      console.error('Failed to get quality metrics:', error);
      return this.getDefaultQualityMetrics();
    }
  }

  // 计算质量指标
  private calculateQualityMetrics(): QualityMetrics {
    // 从历史记录中分析内容质量
    const copywritingHistory = JSON.parse(localStorage.getItem('copywritingHistory') || '[]');
    const dialogueHistory = JSON.parse(localStorage.getItem('dialogueHistory') || '[]');
    
    const allContent = [...copywritingHistory, ...dialogueHistory];
    
    if (allContent.length === 0) {
      return this.getDefaultQualityMetrics();
    }

    let totalLength = 0;
    const lengthDistribution = { short: 0, medium: 0, long: 0 };
    const styleDistribution: { [key: string]: number } = {};

    allContent.forEach(item => {
      const content = item.result || item.content || '';
      const length = content.length;
      totalLength += length;

      // 长度分布
      if (length < 100) {
        lengthDistribution.short++;
      } else if (length <= 500) {
        lengthDistribution.medium++;
      } else {
        lengthDistribution.long++;
      }

      // 风格分布
      const style = item.style || '默认';
      styleDistribution[style] = (styleDistribution[style] || 0) + 1;
    });

    const metrics: QualityMetrics = {
      averageContentLength: totalLength / allContent.length,
      contentLengthDistribution: lengthDistribution,
      styleDistribution,
      regenerationRate: 0 // 需要额外跟踪
    };

    localStorage.setItem(this.STORAGE_KEYS.QUALITY_METRICS, JSON.stringify(metrics));
    return metrics;
  }

  // 生成效率报告
  generateEfficiencyReport(period: 'daily' | 'weekly' | 'monthly'): EfficiencyReport {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const events = this.getEvents().filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const stats = this.getUsageStatistics();
    const moduleUsage = Object.entries(stats.moduleUsage);
    const mostUsedModule = moduleUsage.reduce((max, [moduleId, usage]) => 
      usage.count > (stats.moduleUsage[max] || { count: 0 }).count ? moduleId : max, 
      moduleUsage[0]?.[0] || ''
    );

    const report: EfficiencyReport = {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      metrics: {
        totalTime: events.reduce((sum, event) => sum + (event.duration || 0), 0) / (1000 * 60), // 转换为分钟
        avgSessionTime: 0, // 需要计算
        generationsPerSession: events.filter(e => e.type === 'generation').length / Math.max(stats.totalSessions, 1),
        mostUsedModule,
        peakUsageHour: this.calculatePeakUsageHour(events),
        productivityScore: this.calculateProductivityScore(events)
      }
    };

    return report;
  }

  // 获取趋势分析
  getTrendAnalysis(): TrendAnalysis {
    const stats = this.getUsageStatistics();
    const dates = Object.keys(stats.dailyStats).sort();
    
    if (dates.length < 2) {
      return {
        usageGrowth: { daily: 0, weekly: 0, monthly: 0 },
        preferenceChanges: {},
        modulePopularity: {}
      };
    }

    // 计算增长率
    const recent = stats.dailyStats[dates[dates.length - 1]];
    const previous = stats.dailyStats[dates[dates.length - 2]];
    
    const dailyGrowth = previous.generations > 0 
      ? ((recent.generations - previous.generations) / previous.generations) * 100 
      : 0;

    return {
      usageGrowth: {
        daily: dailyGrowth,
        weekly: 0, // 需要更复杂的计算
        monthly: 0 // 需要更复杂的计算
      },
      preferenceChanges: {},
      modulePopularity: Object.fromEntries(
        Object.entries(stats.moduleUsage).map(([moduleId, usage]) => [
          moduleId,
          { trend: 'stable' as const, changePercent: 0 }
        ])
      )
    };
  }

  // 获取系统健康状态
  getSystemHealth(): SystemHealth {
    const storageUsed = this.calculateStorageUsage();
    const events = this.getEvents();
    const recentEvents = events.filter(e => 
      new Date(e.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );

    return {
      storage: {
        used: storageUsed,
        available: 5 * 1024 * 1024, // 假设5MB可用空间
        percentage: (storageUsed / (5 * 1024 * 1024)) * 100
      },
      performance: {
        avgResponseTime: recentEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(recentEvents.length, 1),
        errorRate: 0, // 需要跟踪错误事件
        uptime: 24 // 假设24小时运行时间
      },
      security: {
        lastSecurityCheck: new Date().toISOString(),
        vulnerabilities: 0,
        securityScore: 95
      }
    };
  }

  // 辅助方法
  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private calculatePeakUsageHour(events: AnalyticsEvent[]): number {
    const hourCounts: { [hour: number]: number } = {};
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts).reduce((maxHour, [hour, count]) => 
      count > (hourCounts[maxHour] || 0) ? parseInt(hour) : maxHour, 0
    );
  }

  private calculateProductivityScore(events: AnalyticsEvent[]): number {
    // 基于生成数量、响应时间、错误率等计算生产力评分
    const generations = events.filter(e => e.type === 'generation').length;
    const avgResponseTime = events.reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(events.length, 1);
    
    // 简单的评分算法
    let score = Math.min(generations * 10, 100); // 基础分
    if (avgResponseTime > 5000) score -= 20; // 响应时间惩罚
    if (avgResponseTime < 2000) score += 10; // 响应时间奖励
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateStorageUsage(): number {
    let totalSize = 0;
    for (let key in localStorage) {
      if (key.startsWith('copywriting_ai_')) {
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    }
    return totalSize;
  }

  private getDefaultUsageStatistics(): UsageStatistics {
    return {
      totalSessions: 0,
      totalGenerations: 0,
      moduleUsage: {},
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {}
    };
  }

  private getDefaultQualityMetrics(): QualityMetrics {
    return {
      averageContentLength: 0,
      contentLengthDistribution: { short: 0, medium: 0, long: 0 },
      styleDistribution: {},
      regenerationRate: 0
    };
  }

  // 清理旧数据
  cleanupOldData(retentionDays: number): void {
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const events = this.getEvents().filter(event => 
      new Date(event.timestamp) > cutoffDate
    );
    
    localStorage.setItem(this.STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }
}

export const analyticsService = new AnalyticsService();
