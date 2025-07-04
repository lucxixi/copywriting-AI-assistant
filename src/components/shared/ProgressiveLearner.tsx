import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Clock,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { ConversationFile, ScenarioAnalysis } from '../../types/prompts';

interface LearningPattern {
  id: string;
  type: 'style' | 'technique' | 'flow' | 'character';
  pattern: string;
  frequency: number;
  confidence: number;
  sources: string[]; // 文件ID列表
  evolution: Array<{
    stage: string;
    description: string;
    examples: string[];
  }>;
}

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'consistency' | 'evolution' | 'recommendation';
  confidence: number;
  evidence: string[];
}

interface ProgressiveLearnerProps {
  files: ConversationFile[];
  analyses: ScenarioAnalysis[];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const ProgressiveLearner: React.FC<ProgressiveLearnerProps> = ({
  files,
  analyses,
  onError,
  onSuccess
}) => {
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<LearningPattern | null>(null);

  useEffect(() => {
    if (files.length > 0 && analyses.length > 0) {
      performProgressiveLearning();
    }
  }, [files, analyses]);

  const performProgressiveLearning = () => {
    setIsLearning(true);
    
    try {
      // 按时间排序文件
      const sortedFiles = [...files].sort((a, b) => 
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );

      // 分析时序模式
      const timeSequencePatterns = analyzeTimeSequence(sortedFiles, analyses);
      
      // 分析风格演进
      const styleEvolutionPatterns = analyzeStyleEvolution(sortedFiles, analyses);
      
      // 分析角色一致性
      const characterConsistencyPatterns = analyzeCharacterConsistency(analyses);
      
      // 分析营销技巧
      const marketingTechniquePatterns = analyzeMarketingTechniques(analyses);

      const allPatterns = [
        ...timeSequencePatterns,
        ...styleEvolutionPatterns,
        ...characterConsistencyPatterns,
        ...marketingTechniquePatterns
      ];

      setLearningPatterns(allPatterns);

      // 生成学习洞察
      const generatedInsights = generateLearningInsights(allPatterns, analyses);
      setInsights(generatedInsights);

      onSuccess(`学习完成，发现 ${allPatterns.length} 个模式和 ${generatedInsights.length} 个洞察`);
    } catch (error) {
      onError('学习过程出错');
      console.error('Progressive learning error:', error);
    } finally {
      setIsLearning(false);
    }
  };

  const analyzeTimeSequence = (sortedFiles: ConversationFile[], analyses: ScenarioAnalysis[]): LearningPattern[] => {
    const patterns: LearningPattern[] = [];
    
    // 分析场景序列
    const scenarioSequence = sortedFiles.map(file => {
      const analysis = analyses.find(a => a.fileId === file.id);
      return analysis?.scenario || 'unknown';
    });

    if (scenarioSequence.length >= 2) {
      const sequencePattern = scenarioSequence.join(' → ');
      patterns.push({
        id: `seq_${Date.now()}`,
        type: 'flow',
        pattern: `营销流程序列: ${sequencePattern}`,
        frequency: 1,
        confidence: 0.8,
        sources: sortedFiles.map(f => f.id),
        evolution: scenarioSequence.map((scenario, index) => ({
          stage: `阶段 ${index + 1}`,
          description: getScenarioDescription(scenario),
          examples: [sortedFiles[index]?.name || '']
        }))
      });
    }

    return patterns;
  };

  const analyzeStyleEvolution = (sortedFiles: ConversationFile[], analyses: ScenarioAnalysis[]): LearningPattern[] => {
    const patterns: LearningPattern[] = [];
    
    // 分析正式程度变化
    const formalityTrend = analyses.map(a => a.style.formality);
    if (formalityTrend.length >= 2) {
      const trend = calculateTrend(formalityTrend);
      patterns.push({
        id: `formality_${Date.now()}`,
        type: 'style',
        pattern: `正式程度${trend > 0 ? '递增' : trend < 0 ? '递减' : '保持稳定'}`,
        frequency: 1,
        confidence: Math.abs(trend) > 0.1 ? 0.7 : 0.4,
        sources: analyses.map(a => a.fileId),
        evolution: formalityTrend.map((value, index) => ({
          stage: `文件 ${index + 1}`,
          description: `正式程度: ${value}%`,
          examples: [`${getScenarioDescription(analyses[index]?.scenario || 'unknown')}`]
        }))
      });
    }

    // 分析情感程度变化
    const emotionalityTrend = analyses.map(a => a.style.emotionality);
    if (emotionalityTrend.length >= 2) {
      const trend = calculateTrend(emotionalityTrend);
      patterns.push({
        id: `emotionality_${Date.now()}`,
        type: 'style',
        pattern: `情感表达${trend > 0 ? '递增' : trend < 0 ? '递减' : '保持稳定'}`,
        frequency: 1,
        confidence: Math.abs(trend) > 0.1 ? 0.7 : 0.4,
        sources: analyses.map(a => a.fileId),
        evolution: emotionalityTrend.map((value, index) => ({
          stage: `文件 ${index + 1}`,
          description: `情感程度: ${value}%`,
          examples: [`${getScenarioDescription(analyses[index]?.scenario || 'unknown')}`]
        }))
      });
    }

    return patterns;
  };

  const analyzeCharacterConsistency = (analyses: ScenarioAnalysis[]): LearningPattern[] => {
    const patterns: LearningPattern[] = [];
    
    // 统计角色出现频率
    const roleFrequency: Record<string, number> = {};
    const roleCharacteristics: Record<string, string[]> = {};
    
    analyses.forEach(analysis => {
      analysis.characters.forEach(character => {
        roleFrequency[character.role] = (roleFrequency[character.role] || 0) + 1;
        if (!roleCharacteristics[character.role]) {
          roleCharacteristics[character.role] = [];
        }
        roleCharacteristics[character.role].push(...character.characteristics);
      });
    });

    // 为每个常见角色创建一致性模式
    Object.entries(roleFrequency).forEach(([role, frequency]) => {
      if (frequency >= 2) {
        const characteristics = [...new Set(roleCharacteristics[role])];
        patterns.push({
          id: `role_${role}_${Date.now()}`,
          type: 'character',
          pattern: `${role}角色一致性模式`,
          frequency,
          confidence: frequency / analyses.length,
          sources: analyses.filter(a => a.characters.some(c => c.role === role)).map(a => a.fileId),
          evolution: [{
            stage: '角色特征',
            description: `${role}的典型特征`,
            examples: characteristics.slice(0, 5)
          }]
        });
      }
    });

    return patterns;
  };

  const analyzeMarketingTechniques = (analyses: ScenarioAnalysis[]): LearningPattern[] => {
    const patterns: LearningPattern[] = [];
    
    // 分析关键点模式
    const allKeyPoints = analyses.flatMap(a => a.keyPoints);
    const keyPointFrequency: Record<string, number> = {};
    
    allKeyPoints.forEach(point => {
      // 简单的关键词提取
      const keywords = point.split(/[，。！？,.\!?]/).map(s => s.trim()).filter(s => s.length > 2);
      keywords.forEach(keyword => {
        keyPointFrequency[keyword] = (keyPointFrequency[keyword] || 0) + 1;
      });
    });

    // 找出高频技巧
    const frequentTechniques = Object.entries(keyPointFrequency)
      .filter(([_, freq]) => freq >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5);

    frequentTechniques.forEach(([technique, frequency]) => {
      patterns.push({
        id: `technique_${technique}_${Date.now()}`,
        type: 'technique',
        pattern: `营销技巧: ${technique}`,
        frequency,
        confidence: frequency / analyses.length,
        sources: analyses.filter(a => a.keyPoints.some(kp => kp.includes(technique))).map(a => a.fileId),
        evolution: [{
          stage: '应用场景',
          description: `在多个场景中使用的技巧`,
          examples: allKeyPoints.filter(kp => kp.includes(technique)).slice(0, 3)
        }]
      });
    });

    return patterns;
  };

  const generateLearningInsights = (patterns: LearningPattern[], analyses: ScenarioAnalysis[]): LearningInsight[] => {
    const insights: LearningInsight[] = [];

    // 流程完整性洞察
    const flowPatterns = patterns.filter(p => p.type === 'flow');
    if (flowPatterns.length > 0) {
      insights.push({
        id: `insight_flow_${Date.now()}`,
        title: '营销流程分析',
        description: '检测到完整的营销流程序列，建议保持这种渐进式的推广策略',
        type: 'recommendation',
        confidence: 0.8,
        evidence: flowPatterns.map(p => p.pattern)
      });
    }

    // 风格一致性洞察
    const stylePatterns = patterns.filter(p => p.type === 'style');
    const consistentStyles = stylePatterns.filter(p => p.confidence > 0.6);
    if (consistentStyles.length > 0) {
      insights.push({
        id: `insight_style_${Date.now()}`,
        title: '风格演进趋势',
        description: '发现明显的风格变化趋势，这种演进有助于适应不同营销阶段',
        type: 'evolution',
        confidence: 0.7,
        evidence: consistentStyles.map(p => p.pattern)
      });
    }

    // 角色一致性洞察
    const characterPatterns = patterns.filter(p => p.type === 'character');
    if (characterPatterns.length > 0) {
      insights.push({
        id: `insight_character_${Date.now()}`,
        title: '角色一致性',
        description: '角色设定保持良好的一致性，有助于建立可信的品牌形象',
        type: 'consistency',
        confidence: 0.75,
        evidence: characterPatterns.map(p => p.pattern)
      });
    }

    // 技巧应用洞察
    const techniquePatterns = patterns.filter(p => p.type === 'technique');
    if (techniquePatterns.length > 0) {
      insights.push({
        id: `insight_technique_${Date.now()}`,
        title: '营销技巧运用',
        description: '识别出多个有效的营销技巧，建议在未来的对话中继续使用',
        type: 'improvement',
        confidence: 0.8,
        evidence: techniquePatterns.map(p => p.pattern)
      });
    }

    return insights;
  };

  const calculateTrend = (values: number[]): number => {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / 100; // 归一化
  };

  const getScenarioDescription = (scenario: string): string => {
    const descriptions = {
      preheating: '预热阶段 - 市场预告',
      preview: '预览阶段 - 产品展示',
      launch: '正式发布 - 销售推广',
      'follow-up': '后续跟进 - 客户服务',
      unknown: '未知场景'
    };
    return descriptions[scenario as keyof typeof descriptions] || '未知场景';
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'style': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'technique': return <Target className="w-5 h-5 text-green-600" />;
      case 'flow': return <ArrowRight className="w-5 h-5 text-purple-600" />;
      case 'character': return <Users className="w-5 h-5 text-orange-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'consistency': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'evolution': return <ArrowRight className="w-5 h-5 text-purple-600" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 学习概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">学习模式</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{learningPatterns.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">洞察发现</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">{insights.length}</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">时序分析</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{files.length}</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-900">置信度</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">
            {learningPatterns.length > 0 
              ? Math.round(learningPatterns.reduce((acc, p) => acc + p.confidence, 0) / learningPatterns.length * 100)
              : 0}%
          </div>
        </div>
      </div>

      {/* 学习模式 */}
      {learningPatterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">发现的学习模式</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {learningPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPattern?.id === pattern.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPattern(selectedPattern?.id === pattern.id ? null : pattern)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPatternIcon(pattern.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{pattern.pattern}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>频率: {pattern.frequency}</span>
                        <span>置信度: {Math.round(pattern.confidence * 100)}%</span>
                        <span>来源: {pattern.sources.length} 个文件</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 模式详情 */}
                {selectedPattern?.id === pattern.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">演进过程</h5>
                    <div className="space-y-3">
                      {pattern.evolution.map((stage, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{stage.stage}</div>
                            <div className="text-sm text-gray-600 mt-1">{stage.description}</div>
                            {stage.examples.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                示例: {stage.examples.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 学习洞察 */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">学习洞察</h3>
          
          <div className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {Math.round(insight.confidence * 100)}% 置信度
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{insight.description}</p>
                    
                    {insight.evidence.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">支持证据:</h5>
                        <ul className="space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                              <span className="text-gray-400">•</span>
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {files.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">请先上传文件并完成分析</p>
          <p className="text-sm text-gray-400 mt-1">系统将自动学习对话模式和营销技巧</p>
        </div>
      )}

      {/* 学习中状态 */}
      {isLearning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">正在学习中...</h3>
              <p className="text-gray-600">AI正在分析对话模式和营销技巧</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveLearner;
