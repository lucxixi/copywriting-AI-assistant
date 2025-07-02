import React, { useState, useEffect } from 'react';
import {
  User,
  BarChart3,
  TrendingUp,
  Target,
  Heart,
  Briefcase,
  MessageCircle,
  Settings,
  Save,
  Download,
  Star,
  Zap,
  Brain,
  Activity,
  Clock,
  Users
} from 'lucide-react';

interface StyleDimension {
  name: string;
  value: number; // 0-100
  description: string;
  examples: string[];
}

interface ContextualProfile {
  context: string;
  adjustments: {
    formality: number;
    emotionality: number;
    directness: number;
    enthusiasm: number;
  };
  specificPatterns: string[];
  avoidedPatterns: string[];
  effectiveness: number;
}

interface CommunicationStyleProfile {
  id: string;
  name: string;
  baseStyle: {
    formality: StyleDimension;
    emotionality: StyleDimension;
    directness: StyleDimension;
    enthusiasm: StyleDimension;
  };
  contextualProfiles: ContextualProfile[];
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  adaptabilityScore: number;
  consistencyScore: number;
  effectivenessScore: number;
  lastUpdated: string;
}

interface CommunicationStyleProfilerProps {
  analysisResult?: any;
  onProfileSave?: (profile: CommunicationStyleProfile) => void;
}

const CommunicationStyleProfiler: React.FC<CommunicationStyleProfilerProps> = ({
  analysisResult,
  onProfileSave
}) => {
  const [profile, setProfile] = useState<CommunicationStyleProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string>('business');

  useEffect(() => {
    if (analysisResult?.analysis?.characters) {
      generateStyleProfile();
    }
  }, [analysisResult]);

  const generateStyleProfile = async () => {
    if (!analysisResult?.analysis?.characters) return;

    setIsGenerating(true);
    try {
      // 模拟生成详细的沟通风格档案
      const character = analysisResult.analysis.characters[0]; // 取第一个角色
      
      const newProfile: CommunicationStyleProfile = {
        id: `profile_${Date.now()}`,
        name: character.name || '用户',
        baseStyle: {
          formality: {
            name: '正式程度',
            value: calculateFormalityScore(character),
            description: '在正式和非正式表达之间的倾向',
            examples: ['您好', '请问', '谢谢您']
          },
          emotionality: {
            name: '情感表达',
            value: calculateEmotionalityScore(character),
            description: '情感表达的丰富程度和强度',
            examples: ['太棒了！', '我很开心', '😊']
          },
          directness: {
            name: '直接程度',
            value: calculateDirectnessScore(character),
            description: '表达观点的直接性和明确性',
            examples: ['我认为', '直接说', '明确表示']
          },
          enthusiasm: {
            name: '热情度',
            value: calculateEnthusiasmScore(character),
            description: '表达热情和积极性的程度',
            examples: ['太好了！', '非常棒', '我很兴奋']
          }
        },
        contextualProfiles: generateContextualProfiles(character),
        strengthsAndWeaknesses: analyzeStrengthsAndWeaknesses(character),
        adaptabilityScore: Math.floor(Math.random() * 30 + 70),
        consistencyScore: Math.floor(Math.random() * 25 + 75),
        effectivenessScore: Math.floor(Math.random() * 20 + 80),
        lastUpdated: new Date().toISOString()
      };

      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to generate style profile:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateFormalityScore = (character: any): number => {
    // 基于语言模式计算正式程度
    const formalWords = character.languagePatterns?.fillerWords?.filter((word: string) => 
      ['您', '请', '谢谢', '不好意思'].includes(word)
    ).length || 0;
    return Math.min(formalWords * 20 + 40, 100);
  };

  const calculateEmotionalityScore = (character: any): number => {
    // 基于emoji和情感词汇计算情感表达度
    const emojiCount = character.languagePatterns?.emojis?.length || 0;
    const emotionalWords = character.languagePatterns?.catchphrases?.filter((phrase: string) => 
      ['太好了', '很开心', '很棒', '喜欢'].some(word => phrase.includes(word))
    ).length || 0;
    return Math.min((emojiCount * 15 + emotionalWords * 10) + 30, 100);
  };

  const calculateDirectnessScore = (character: any): number => {
    // 基于表达方式计算直接程度
    const directPhrases = character.samplePhrases?.filter((phrase: string) => 
      ['我认为', '我觉得', '直接说', '明确'].some(word => phrase.includes(word))
    ).length || 0;
    return Math.min(directPhrases * 25 + 50, 100);
  };

  const calculateEnthusiasmScore = (character: any): number => {
    // 基于热情表达计算热情度
    const enthusiasticWords = character.languagePatterns?.catchphrases?.filter((phrase: string) => 
      ['太棒了', '非常', '很好', '厉害'].some(word => phrase.includes(word))
    ).length || 0;
    return Math.min(enthusiasticWords * 20 + 40, 100);
  };

  const generateContextualProfiles = (character: any): ContextualProfile[] => {
    return [
      {
        context: '商务场合',
        adjustments: {
          formality: 25,
          emotionality: -15,
          directness: 10,
          enthusiasm: -5
        },
        specificPatterns: ['您好', '请问', '谢谢您的时间'],
        avoidedPatterns: ['哈哈', '太棒了', '😊'],
        effectiveness: 85
      },
      {
        context: '日常交流',
        adjustments: {
          formality: -20,
          emotionality: 30,
          directness: -10,
          enthusiasm: 20
        },
        specificPatterns: ['哈哈', '太好了', '😊', '嗯嗯'],
        avoidedPatterns: ['您好', '请问', '谢谢您'],
        effectiveness: 90
      },
      {
        context: '客服支持',
        adjustments: {
          formality: 15,
          emotionality: 10,
          directness: 20,
          enthusiasm: 15
        },
        specificPatterns: ['我来帮您', '没问题', '很高兴为您服务'],
        avoidedPatterns: ['不知道', '可能', '大概'],
        effectiveness: 88
      }
    ];
  };

  const analyzeStrengthsAndWeaknesses = (character: any) => {
    return {
      strengths: [
        '表达清晰，逻辑性强',
        '善于使用情感表达增强亲和力',
        '能够根据场合调整沟通风格',
        '回应及时，互动性好'
      ],
      weaknesses: [
        '在正式场合可能过于随意',
        '有时情感表达可能过于丰富',
        '需要提高专业术语的使用'
      ],
      recommendations: [
        '在商务场合减少口语化表达',
        '增加数据和事实支撑',
        '保持现有的亲和力优势',
        '继续发挥情感共鸣能力'
      ]
    };
  };

  const renderStyleDimension = (dimension: StyleDimension) => {
    const getColorClass = (value: number) => {
      if (value >= 80) return 'bg-green-500';
      if (value >= 60) return 'bg-blue-500';
      if (value >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{dimension.name}</h4>
          <span className="text-sm font-semibold text-gray-700">{dimension.value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${getColorClass(dimension.value)}`}
            style={{ width: `${dimension.value}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mb-2">{dimension.description}</p>
        <div className="flex flex-wrap gap-1">
          {dimension.examples.slice(0, 3).map((example, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {example}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderContextualProfile = (contextProfile: ContextualProfile) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">{contextProfile.context}</h4>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">{contextProfile.effectiveness}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <h5 className="text-xs font-medium text-gray-700 mb-1">调整策略</h5>
            <div className="space-y-1 text-xs">
              {Object.entries(contextProfile.adjustments).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{
                    key === 'formality' ? '正式度' :
                    key === 'emotionality' ? '情感度' :
                    key === 'directness' ? '直接度' : '热情度'
                  }:</span>
                  <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                    {value > 0 ? '+' : ''}{value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-700 mb-1">特定模式</h5>
            <div className="flex flex-wrap gap-1">
              {contextProfile.specificPatterns.slice(0, 3).map((pattern, i) => (
                <span key={i} className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 text-purple-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600">正在生成沟通风格档案...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">暂无风格档案，请先进行对话分析</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 档案概览 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{profile.name} 的沟通风格档案</h3>
              <p className="text-sm text-gray-600">最后更新: {new Date(profile.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={() => onProfileSave?.(profile)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存档案</span>
          </button>
        </div>

        {/* 综合评分 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{profile.adaptabilityScore}%</div>
            <div className="text-sm text-gray-600">适应性</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.consistencyScore}%</div>
            <div className="text-sm text-gray-600">一致性</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{profile.effectivenessScore}%</div>
            <div className="text-sm text-gray-600">有效性</div>
          </div>
        </div>
      </div>

      {/* 基础风格维度 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          基础风格维度
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(profile.baseStyle).map((dimension, index) => (
            <div key={index}>
              {renderStyleDimension(dimension)}
            </div>
          ))}
        </div>
      </div>

      {/* 情境适应档案 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 text-green-600 mr-2" />
          情境适应档案
        </h4>
        <div className="space-y-4">
          {profile.contextualProfiles.map((contextProfile, index) => (
            <div key={index}>
              {renderContextualProfile(contextProfile)}
            </div>
          ))}
        </div>
      </div>

      {/* 优势与建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            沟通优势
          </h4>
          <ul className="space-y-2">
            {profile.strengthsAndWeaknesses.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-green-800 flex items-start">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            改进建议
          </h4>
          <ul className="space-y-2">
            {profile.strengthsAndWeaknesses.recommendations.map((recommendation, i) => (
              <li key={i} className="text-sm text-blue-800 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunicationStyleProfiler;
