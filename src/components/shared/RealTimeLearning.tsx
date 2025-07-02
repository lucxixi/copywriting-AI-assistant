import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Upload,
  Activity,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { patternLearningService, MicroPattern } from '../../services/patternLearning';

interface RealTimeLearningProps {
  onPatternUpdate?: (patterns: MicroPattern[]) => void;
}

const RealTimeLearning: React.FC<RealTimeLearningProps> = ({
  onPatternUpdate
}) => {
  const [recentPatterns, setRecentPatterns] = useState<MicroPattern[]>([]);
  const [effectivePatterns, setEffectivePatterns] = useState<MicroPattern[]>([]);
  const [learningStats, setLearningStats] = useState({
    totalPatterns: 0,
    recentPatterns: 0,
    averageEffectiveness: 0,
    learningRate: 0
  });
  const [isLearning, setIsLearning] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLearningData();
    
    // 注册实时学习回调
    const handlePatternLearned = (patterns: MicroPattern[]) => {
      loadLearningData();
      onPatternUpdate?.(patterns);
    };
    
    patternLearningService.onPatternLearned(handlePatternLearned);
    
    // 定期清理和优化
    const cleanupInterval = setInterval(() => {
      patternLearningService.adaptPatternsBasedOnUsage();
      patternLearningService.cleanupLowQualityPatterns();
    }, 5 * 60 * 1000); // 每5分钟执行一次

    return () => {
      patternLearningService.removePatternCallback(handlePatternLearned);
      clearInterval(cleanupInterval);
    };
  }, [onPatternUpdate]);

  const loadLearningData = () => {
    const allPatterns = patternLearningService.getAllPatterns();
    const recent = patternLearningService.getRecentPatterns(7);
    const effective = patternLearningService.getMostEffectivePatterns(5);
    
    setRecentPatterns(recent);
    setEffectivePatterns(effective);
    
    // 计算统计数据
    const totalEffectiveness = allPatterns.reduce((sum, p) => sum + p.effectiveness, 0);
    const averageEffectiveness = allPatterns.length > 0 ? totalEffectiveness / allPatterns.length : 0;
    
    setLearningStats({
      totalPatterns: allPatterns.length,
      recentPatterns: recent.length,
      averageEffectiveness: Math.round(averageEffectiveness),
      learningRate: recent.length > 0 ? Math.round((recent.length / 7) * 10) / 10 : 0
    });
  };

  const handlePatternFeedback = (patternId: string, isPositive: boolean) => {
    patternLearningService.recordUserFeedback(patternId, isPositive);
    setFeedbackGiven(prev => new Set(prev).add(patternId));
    loadLearningData(); // 重新加载数据以反映变化
  };

  const simulateNewLearning = async () => {
    setIsLearning(true);
    
    // 模拟新对话学习
    const sampleConversations = [
      "嗯，我觉得这个产品真的很不错",
      "哈哈，太好了！我很喜欢这个功能",
      "是这样的吗？那我再考虑一下",
      "非常感谢您的详细介绍"
    ];
    
    try {
      patternLearningService.learnFromNewConversation(sampleConversations, '用户');
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Learning simulation failed:', error);
    } finally {
      setIsLearning(false);
    }
  };

  const exportLearningData = () => {
    const data = patternLearningService.exportLearningData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPatternCard = (pattern: MicroPattern, showFeedback: boolean = true) => {
    const hasGivenFeedback = feedbackGiven.has(pattern.id);
    
    return (
      <div key={pattern.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              pattern.type === 'linguistic' ? 'bg-blue-500' :
              pattern.type === 'emotional' ? 'bg-pink-500' :
              pattern.type === 'structural' ? 'bg-green-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm font-medium text-gray-800">
              {pattern.type === 'linguistic' ? '语言模式' :
               pattern.type === 'emotional' ? '情感模式' :
               pattern.type === 'structural' ? '结构模式' : '其他模式'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {(pattern.confidence * 100).toFixed(0)}%
            </span>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
              {pattern.effectiveness.toFixed(0)}%
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mb-2">"{pattern.pattern}"</p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            频率: {(pattern.frequency * 100).toFixed(1)}% | 
            发现: {new Date(pattern.metadata.discovered).toLocaleDateString()}
          </div>
          
          {showFeedback && !hasGivenFeedback && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePatternFeedback(pattern.id, true)}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="这个模式很有用"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handlePatternFeedback(pattern.id, false)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="这个模式不太准确"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {hasGivenFeedback && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 学习统计 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 text-purple-600 mr-2" />
            实时学习状态
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={simulateNewLearning}
              disabled={isLearning}
              className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
            >
              {isLearning ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>学习中...</span>
                </>
              ) : (
                <>
                  <Brain className="w-3 h-3" />
                  <span>模拟学习</span>
                </>
              )}
            </button>
            <button
              onClick={exportLearningData}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Download className="w-3 h-3" />
              <span>导出数据</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{learningStats.totalPatterns}</div>
            <div className="text-sm text-gray-600">总模式数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{learningStats.recentPatterns}</div>
            <div className="text-sm text-gray-600">近期新增</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{learningStats.averageEffectiveness}%</div>
            <div className="text-sm text-gray-600">平均有效性</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{learningStats.learningRate}</div>
            <div className="text-sm text-gray-600">学习速率/天</div>
          </div>
        </div>
      </div>

      {/* 最近学习的模式 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          最近学习的模式 (7天内)
        </h4>
        
        {recentPatterns.length > 0 ? (
          <div className="space-y-3">
            {recentPatterns.slice(0, 5).map(pattern => renderPatternCard(pattern))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">最近没有学习到新模式</p>
            <p className="text-sm text-gray-400">进行更多对话分析来学习新的表达模式</p>
          </div>
        )}
      </div>

      {/* 最有效的模式 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 text-yellow-600 mr-2" />
          最有效的模式
        </h4>
        
        {effectivePatterns.length > 0 ? (
          <div className="space-y-3">
            {effectivePatterns.map(pattern => renderPatternCard(pattern, false))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">暂无有效性数据</p>
            <p className="text-sm text-gray-400">需要更多用户反馈来评估模式有效性</p>
          </div>
        )}
      </div>

      {/* 学习提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-900 mb-1">实时学习说明</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 系统会自动从新的对话分析中学习表达模式</li>
              <li>• 您的反馈将帮助系统改进模式识别的准确性</li>
              <li>• 系统会定期清理低质量模式并优化学习效果</li>
              <li>• 学习数据可以导出备份，也可以在其他设备上导入</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeLearning;
