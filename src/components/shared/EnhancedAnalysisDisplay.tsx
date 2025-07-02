import React, { useState } from 'react';
import {
  User,
  MessageSquare,
  TrendingUp,
  Brain,
  Target,
  Lightbulb,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  Heart,
  Briefcase,
  Users,
  BookOpen
} from 'lucide-react';
import { ScriptAnalysisResult } from '../../types/prompts';

interface EnhancedAnalysisDisplayProps {
  analysisResult: ScriptAnalysisResult;
  onCopy?: (content: string) => void;
  onSaveAsTemplate?: (template: any) => void;
}

const EnhancedAnalysisDisplay: React.FC<EnhancedAnalysisDisplayProps> = ({
  analysisResult,
  onCopy,
  onSaveAsTemplate
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleCopyContent = (content: string, type: string) => {
    if (onCopy) {
      onCopy(content);
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  const handleSaveTemplate = (template: any) => {
    if (onSaveAsTemplate) {
      onSaveAsTemplate(template);
    }
  };

  const renderCharacterAnalysis = () => {
    if (!analysisResult.analysis?.characters?.length) return null;

    return (
      <div className="space-y-4">
        {analysisResult.analysis.characters.map((character, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{character.name}</h4>
                  <p className="text-sm text-gray-600">{character.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleSaveTemplate({
                  type: 'character',
                  name: character.name,
                  data: character
                })}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>保存模板</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">性格特征</h5>
                <p className="text-sm text-gray-600">{character.personality}</p>
              </div>

              {character.speakingStyle && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">说话风格</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">正式度：</span>
                      <span className="text-gray-900">{character.speakingStyle.formality}</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">语调：</span>
                      <span className="text-gray-900">{character.speakingStyle.tone}</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">情感度：</span>
                      <span className="text-gray-900">{character.speakingStyle.emotionalLevel}</span>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <span className="text-gray-500">直接度：</span>
                      <span className="text-gray-900">{character.speakingStyle.directness}</span>
                    </div>
                  </div>
                </div>
              )}

              {character.languagePatterns && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">语言特征</h5>
                  <div className="space-y-2">
                    {character.languagePatterns.fillerWords?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">语气词：</span>
                        {character.languagePatterns.fillerWords.map((word, i) => (
                          <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    )}
                    {character.languagePatterns.emojis?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">常用emoji：</span>
                        {character.languagePatterns.emojis.map((emoji, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">
                            {emoji}
                          </span>
                        ))}
                      </div>
                    )}
                    {character.languagePatterns.catchphrases?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500">口头禅：</span>
                        {character.languagePatterns.catchphrases.map((phrase, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {character.samplePhrases?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">典型表达</h5>
                  <div className="space-y-1">
                    {character.samplePhrases.slice(0, 3).map((phrase, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                        <span className="text-gray-700">"{phrase}"</span>
                        <button
                          onClick={() => handleCopyContent(phrase, 'phrase')}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLearnablePatterns = () => {
    const patterns = analysisResult.analysis?.learnablePatterns;
    if (!patterns) return null;

    return (
      <div className="space-y-4">
        {patterns.successfulTechniques?.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Zap className="w-4 h-4 text-yellow-500 mr-2" />
              成功技巧
            </h4>
            <div className="space-y-2">
              {patterns.successfulTechniques.map((technique, i) => (
                <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{technique}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {patterns.adaptableTemplates?.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
              可复用模板
            </h4>
            <div className="space-y-3">
              {patterns.adaptableTemplates.map((template, i) => (
                <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-blue-900">{template.situation}</h5>
                      <p className="text-xs text-blue-600">预期效果：{template.effectiveness}</p>
                    </div>
                    <button
                      onClick={() => handleSaveTemplate({
                        type: 'dialogue_template',
                        name: template.situation,
                        data: template
                      })}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>保存</span>
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-700 font-mono">{template.template}</p>
                  </div>
                  {template.variables?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">可变元素：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map((variable, j) => (
                          <span key={j} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {variable}
                          </span>
                        ))}
                      </div>
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

  const sections = [
    {
      id: 'overview',
      title: '对话概览',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          {analysisResult.analysis?.conversationFlow && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">场景：</span>{analysisResult.analysis.conversationFlow.scenario}</div>
                  <div><span className="text-gray-500">目的：</span>{analysisResult.analysis.conversationFlow.purpose}</div>
                  <div><span className="text-gray-500">整体语调：</span>{analysisResult.analysis.conversationFlow.overallTone}</div>
                  <div><span className="text-gray-500">效果评估：</span>{analysisResult.analysis.conversationFlow.effectiveness}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">统计信息</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">对话轮数：</span>{analysisResult.scripts?.length || 0}</div>
                  <div><span className="text-gray-500">识别角色：</span>{analysisResult.analysis?.characters?.length || 0}</div>
                  <div><span className="text-gray-500">提取模式：</span>{analysisResult.metadata?.patternsExtracted || 0}</div>
                  <div><span className="text-gray-500">分析类型：</span>{analysisResult.metadata?.analysisType || 'basic'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'characters',
      title: '角色分析',
      icon: Users,
      content: renderCharacterAnalysis()
    },
    {
      id: 'patterns',
      title: '学习模式',
      icon: Brain,
      content: renderLearnablePatterns()
    },
    {
      id: 'insights',
      title: '关键洞察',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          {analysisResult.analysis?.keyInsights?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">重要发现</h4>
              <div className="space-y-2">
                {analysisResult.analysis.keyInsights.map((insight, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-green-50 p-3 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {analysisResult.analysis?.improvementSuggestions?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">改进建议</h4>
              <div className="space-y-2">
                {analysisResult.analysis.improvementSuggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const Icon = section.icon;
        const isExpanded = expandedSections.has(section.id);
        
        return (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
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
  );
};

export default EnhancedAnalysisDisplay;
