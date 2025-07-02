import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Users,
  MessageCircle,
  Clock,
  Target,
  Zap,
  BookOpen,
  Settings,
  BarChart3,
  Lightbulb,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Star,
  Activity
} from 'lucide-react';
import { patternLearningService, MicroPattern, CommunicationRhythm } from '../../services/patternLearning';
import CommunicationStyleProfiler from './CommunicationStyleProfiler';
import PatternBasedGenerator from './PatternBasedGenerator';
import RealTimeLearning from './RealTimeLearning';

interface CommunicationPattern {
  id: string;
  type: 'linguistic' | 'temporal' | 'emotional' | 'contextual';
  pattern: string;
  frequency: number;
  confidence: number;
  contexts: string[];
  examples: string[];
  effectiveness: number;
}

interface CommunicationProfile {
  id: string;
  name: string;
  baseStyle: {
    formality: number; // 0-100
    emotionality: number; // 0-100
    directness: number; // 0-100
    enthusiasm: number; // 0-100
  };
  adaptationRules: {
    businessContext: AdaptationRule;
    casualContext: AdaptationRule;
    supportContext: AdaptationRule;
    persuasionContext: AdaptationRule;
  };
  patterns: CommunicationPattern[];
  learningMetrics: {
    totalConversations: number;
    patternAccuracy: number;
    adaptationSuccess: number;
    lastUpdated: string;
  };
}

interface AdaptationRule {
  formalityAdjustment: number;
  emotionalityAdjustment: number;
  directnessAdjustment: number;
  enthusiasmAdjustment: number;
  specificPatterns: string[];
  avoidPatterns: string[];
}

interface AdvancedPatternLearningProps {
  analysisResult?: any;
  onPatternSave?: (pattern: CommunicationPattern) => void;
  onProfileSave?: (profile: CommunicationProfile) => void;
}

const AdvancedPatternLearning: React.FC<AdvancedPatternLearningProps> = ({
  analysisResult,
  onPatternSave,
  onProfileSave
}) => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'profiles' | 'generation' | 'realtime'>('patterns');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['micro-patterns']));
  const [learningMode, setLearningMode] = useState<'automatic' | 'guided'>('automatic');
  const [selectedProfile, setSelectedProfile] = useState<CommunicationProfile | null>(null);
  const [learnedPatterns, setLearnedPatterns] = useState<MicroPattern[]>([]);
  const [communicationRhythm, setCommunicationRhythm] = useState<CommunicationRhythm | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 当分析结果变化时，进行模式学习
  useEffect(() => {
    if (analysisResult?.scripts && analysisResult.scripts.length > 0) {
      performPatternLearning();
    }
  }, [analysisResult]);

  const performPatternLearning = async () => {
    if (!analysisResult?.scripts) return;

    setIsAnalyzing(true);
    try {
      // 提取对话内容
      const conversations = analysisResult.scripts.map((script: any) => script.content);

      // 分析微观模式
      const patterns = patternLearningService.analyzeMicroPatterns(conversations, '用户');
      setLearnedPatterns(patterns);

      // 分析沟通节奏
      const rhythm = patternLearningService.analyzeCommunicationRhythm(conversations);
      setCommunicationRhythm(rhythm);

    } catch (error) {
      console.error('Pattern learning failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // 微观模式分析
  const renderMicroPatternAnalysis = () => {
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Brain className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-2" />
            <p className="text-gray-600">正在学习对话模式...</p>
          </div>
        </div>
      );
    }

    if (!learnedPatterns.length && !communicationRhythm) {
      return (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无学习到的模式，请先进行对话分析</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* 沟通节奏分析 */}
        {communicationRhythm && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">沟通节奏分析</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  变异系数: {(communicationRhythm.variability * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 语言节奏分析 */}
              <div className="bg-white p-3 rounded border">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Activity className="w-4 h-4 text-green-500 mr-1" />
                  语言节奏
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">平均句长:</span>
                    <span className="text-gray-900">{communicationRhythm.averageSentenceLength}字</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">停顿频率:</span>
                    <span className="text-gray-900">{communicationRhythm.pauseFrequency.toFixed(1)}/句</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">语速偏好:</span>
                    <span className="text-gray-900">{
                      communicationRhythm.speechTempo === 'fast' ? '较快' :
                      communicationRhythm.speechTempo === 'slow' ? '较慢' : '中等'
                    }</span>
                  </div>
                </div>
              </div>

              {/* 情感表达模式 */}
              <div className="bg-white p-3 rounded border">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageCircle className="w-4 h-4 text-pink-500 mr-1" />
                  情感表达
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">情感强度:</span>
                    <span className="text-gray-900">中等</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">表达方式:</span>
                    <span className="text-gray-900">含蓄+直接</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">共情能力:</span>
                    <span className="text-gray-900">较强</span>
                  </div>
                </div>
              </div>

              {/* 逻辑结构偏好 */}
              <div className="bg-white p-3 rounded border">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Target className="w-4 h-4 text-purple-500 mr-1" />
                  逻辑结构
                </h5>
                <div className="space-y-1 text-xs">
                  <div className="text-gray-600">偏好: 总分总结构</div>
                  <div className="text-gray-600">论证: 事实+情感</div>
                  <div className="text-gray-600">转折: 温和过渡</div>
                </div>
              </div>

              {/* 互动模式 */}
              <div className="bg-white p-3 rounded border">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 text-orange-500 mr-1" />
                  互动模式
                </h5>
                <div className="space-y-1 text-xs">
                  <div className="text-gray-600">主动性: 平衡型</div>
                  <div className="text-gray-600">回应速度: 适中</div>
                  <div className="text-gray-600">话题引导: 善于引导</div>
                </div>
              </div>
            </div>

            {/* 节奏模式可视化 */}
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium text-gray-700 mb-2">节奏模式</h5>
              <div className="flex items-center space-x-1">
                {communicationRhythm.rhythmPattern.slice(0, 8).map((length, i) => (
                  <div
                    key={i}
                    className="bg-blue-200 rounded"
                    style={{
                      height: `${Math.max(length / 2, 8)}px`,
                      width: '12px'
                    }}
                    title={`句子${i + 1}: ${length}字`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">句子长度变化模式</p>
            </div>
          </div>
        )}

        {/* 学习到的具体模式 */}
        {learnedPatterns.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">学习到的语言模式</h4>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                共发现 {learnedPatterns.length} 个模式
              </span>
            </div>

            <div className="space-y-3">
              {learnedPatterns.slice(0, 6).map((pattern, index) => (
                <div key={pattern.id} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
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
                      <span className="text-xs text-gray-500">
                        频率: {(pattern.frequency * 100).toFixed(1)}%
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(pattern.pattern)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">"{pattern.pattern}"</p>
                  {pattern.examples.length > 0 && (
                    <div className="text-xs text-gray-500">
                      示例: {pattern.examples[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 情境适应分析
  const renderContextualAdaptation = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Settings className="w-5 h-5 text-green-600 mr-2" />
            情境适应规则学习
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 商务场合适应 */}
            <div className="bg-white p-4 rounded border">
              <h5 className="font-medium text-gray-800 mb-3">商务场合</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">正式度调整:</span>
                  <span className="text-green-600">+25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">情感表达:</span>
                  <span className="text-blue-600">-15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">直接程度:</span>
                  <span className="text-purple-600">+10%</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <strong>学习到的模式:</strong> 使用"您"称呼，避免口语化表达，增加数据支撑
              </div>
            </div>

            {/* 日常场合适应 */}
            <div className="bg-white p-4 rounded border">
              <h5 className="font-medium text-gray-800 mb-3">日常场合</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">正式度调整:</span>
                  <span className="text-red-600">-20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">情感表达:</span>
                  <span className="text-green-600">+30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">亲和力:</span>
                  <span className="text-pink-600">+40%</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <strong>学习到的模式:</strong> 增加emoji使用，语气词更丰富，表达更生动
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'patterns', label: '模式学习', icon: Brain },
    { id: 'profiles', label: '风格档案', icon: Users },
    { id: 'generation', label: '智能生成', icon: Zap },
    { id: 'realtime', label: '实时学习', icon: Activity }
  ];

  const sections = [
    {
      id: 'micro-patterns',
      title: '微观模式分析',
      icon: Brain,
      content: renderMicroPatternAnalysis()
    },
    {
      id: 'contextual-adaptation',
      title: '情境适应学习',
      icon: Settings,
      content: renderContextualAdaptation()
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="w-6 h-6 text-purple-600 mr-2" />
          高级对话模式学习
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value as 'automatic' | 'guided')}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="automatic">自动学习</option>
            <option value="guided">引导学习</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'patterns' && (
          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'profiles' && (
          <CommunicationStyleProfiler
            analysisResult={analysisResult}
            onProfileSave={(profile) => {
              console.log('Communication profile saved:', profile);
              if (onProfileSave) {
                onProfileSave(profile);
              }
            }}
          />
        )}

        {activeTab === 'generation' && (
          <PatternBasedGenerator
            analysisResult={analysisResult}
            learnedPatterns={learnedPatterns}
            communicationProfile={selectedProfile}
          />
        )}

        {activeTab === 'realtime' && (
          <RealTimeLearning
            onPatternUpdate={(patterns) => {
              setLearnedPatterns(patterns);
              console.log('Real-time patterns updated:', patterns.length);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedPatternLearning;
