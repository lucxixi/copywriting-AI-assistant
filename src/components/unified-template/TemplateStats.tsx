import { BookOpen, BarChart3, Star, Settings } from 'lucide-react';
import { TemplateStats as TemplateStatsType } from '../../types/unified-template';

interface TemplateStatsProps {
  stats: TemplateStatsType;
}

export function TemplateStats({ stats }: TemplateStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">总模板数</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalTemplates}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">总使用次数</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalUsage}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">平均评分</p>
            <p className="text-xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">活跃模板</p>
            <p className="text-xl font-bold text-gray-900">{stats.activeTemplates}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 