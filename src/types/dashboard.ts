export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  trend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  type: string;
  title: string;
  time: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivity: RecentActivity[];
  apiConfigured: boolean;
  totalGenerations: number;
  todayGenerations: number;
  availableTemplates: number;
}

export interface DashboardFilters {
  timeRange: 'today' | 'week' | 'month' | 'all';
  type: string | 'all';
} 