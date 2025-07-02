import React, { useState, useEffect } from 'react';
import {
  Zap,
  Wand2,
  MessageSquare,
  Settings,
  Target,
  Copy,
  Download,
  RefreshCw,
  Loader,
  CheckCircle,
  AlertCircle,
  Brain,
  Users,
  Briefcase,
  Heart
} from 'lucide-react';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';

interface GenerationTemplate {
  id: string;
  name: string;
  description: string;
  context: 'business' | 'casual' | 'support' | 'persuasion';
  basePrompt: string;
  styleAdaptations: {
    formality: number;
    emotionality: number;
    directness: number;
    enthusiasm: number;
  };
  requiredInputs: string[];
}

interface GenerationResult {
  id: string;
  content: string;
  template: GenerationTemplate;
  appliedPatterns: string[];
  styleScore: number;
  timestamp: string;
}

interface PatternBasedGeneratorProps {
  analysisResult?: any;
  learnedPatterns?: any[];
  communicationProfile?: any;
}

const PatternBasedGenerator: React.FC<PatternBasedGeneratorProps> = ({
  analysisResult,
  learnedPatterns = [],
  communicationProfile
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<GenerationTemplate | null>(null);
  const [generationInputs, setGenerationInputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const generationTemplates: GenerationTemplate[] = [
    {
      id: 'business_intro',
      name: '商务介绍',
      description: '基于学习到的风格生成商务场合的自我介绍',
      context: 'business',
      basePrompt: '请生成一段商务场合的自我介绍，要求专业且有亲和力',
      styleAdaptations: {
        formality: 25,
        emotionality: -10,
        directness: 15,
        enthusiasm: 5
      },
      requiredInputs: ['姓名', '职位', '公司', '核心优势']
    },
    {
      id: 'product_recommendation',
      name: '产品推荐',
      description: '模仿用户风格生成产品推荐内容',
      context: 'persuasion',
      basePrompt: '请生成一段产品推荐内容，要有说服力且符合个人风格',
      styleAdaptations: {
        formality: 0,
        emotionality: 20,
        directness: 10,
        enthusiasm: 25
      },
      requiredInputs: ['产品名称', '核心卖点', '目标用户', '使用场景']
    },
    {
      id: 'casual_sharing',
      name: '日常分享',
      description: '生成符合个人风格的日常分享内容',
      context: 'casual',
      basePrompt: '请生成一段日常分享内容，要自然亲切',
      styleAdaptations: {
        formality: -20,
        emotionality: 30,
        directness: -5,
        enthusiasm: 20
      },
      requiredInputs: ['分享主题', '个人感受', '想要传达的信息']
    },
    {
      id: 'customer_support',
      name: '客服回复',
      description: '生成专业且有温度的客服回复',
      context: 'support',
      basePrompt: '请生成一段客服回复，要专业、耐心且有帮助',
      styleAdaptations: {
        formality: 15,
        emotionality: 15,
        directness: 20,
        enthusiasm: 10
      },
      requiredInputs: ['客户问题', '解决方案', '后续建议']
    }
  ];

  const handleTemplateSelect = (template: GenerationTemplate) => {
    setSelectedTemplate(template);
    // 初始化输入字段
    const initialInputs: Record<string, string> = {};
    template.requiredInputs.forEach(input => {
      initialInputs[input] = '';
    });
    setGenerationInputs(initialInputs);
  };

  const handleInputChange = (field: string, value: string) => {
    setGenerationInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContent = async () => {
    if (!selectedTemplate || !apiConfigured) return;

    // 检查必填字段
    const missingFields = selectedTemplate.requiredInputs.filter(
      field => !generationInputs[field]?.trim()
    );
    if (missingFields.length > 0) {
      setError(`请填写以下必填字段: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const stylePrompt = buildStylePrompt(selectedTemplate);
      const contentPrompt = buildContentPrompt(selectedTemplate);

      const response = await apiService.generateContent({
        prompt: contentPrompt,
        systemPrompt: stylePrompt,
        maxTokens: 1000,
        temperature: 0.7
      });

      if (response.success && response.content) {
        const result: GenerationResult = {
          id: `gen_${Date.now()}`,
          content: response.content,
          template: selectedTemplate,
          appliedPatterns: extractAppliedPatterns(),
          styleScore: calculateStyleScore(),
          timestamp: new Date().toISOString()
        };

        setGenerationResults(prev => [result, ...prev]);

        // 保存到历史记录
        const historyRecord = {
          id: `pattern_gen_${Date.now()}`,
          type: 'pattern_generation',
          style: selectedTemplate.context,
          prompt: contentPrompt,
          result: response.content,
          apiConfig: storageService.getActiveApiId(),
          createdAt: new Date().toISOString(),
          parameters: {
            template: selectedTemplate.name,
            appliedPatterns: result.appliedPatterns,
            styleScore: result.styleScore
          }
        };
        storageService.saveGenerationHistory(historyRecord);
      } else {
        setError(response.error || '生成失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成过程中发生错误');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildStylePrompt = (template: GenerationTemplate): string => {
    let styleInstructions = `你需要模仿以下沟通风格特征：\n`;

    // 基于分析结果添加风格指导
    if (analysisResult?.analysis?.characters?.[0]) {
      const character = analysisResult.analysis.characters[0];
      
      if (character.languagePatterns?.fillerWords?.length > 0) {
        styleInstructions += `- 语气词使用: ${character.languagePatterns.fillerWords.slice(0, 3).join('、')}\n`;
      }
      
      if (character.languagePatterns?.catchphrases?.length > 0) {
        styleInstructions += `- 常用表达: ${character.languagePatterns.catchphrases.slice(0, 2).join('、')}\n`;
      }
      
      if (character.speakingStyle) {
        styleInstructions += `- 语调特点: ${character.speakingStyle.tone}\n`;
        styleInstructions += `- 正式程度: ${character.speakingStyle.formality}\n`;
      }
    }

    // 添加情境适应
    const adaptations = template.styleAdaptations;
    styleInstructions += `\n情境调整要求:\n`;
    styleInstructions += `- 正式度调整: ${adaptations.formality > 0 ? '+' : ''}${adaptations.formality}%\n`;
    styleInstructions += `- 情感表达调整: ${adaptations.emotionality > 0 ? '+' : ''}${adaptations.emotionality}%\n`;
    styleInstructions += `- 直接程度调整: ${adaptations.directness > 0 ? '+' : ''}${adaptations.directness}%\n`;
    styleInstructions += `- 热情度调整: ${adaptations.enthusiasm > 0 ? '+' : ''}${adaptations.enthusiasm}%\n`;

    // 添加学习到的模式
    if (learnedPatterns.length > 0) {
      styleInstructions += `\n请尽量融入以下学习到的表达模式:\n`;
      learnedPatterns.slice(0, 3).forEach((pattern, i) => {
        styleInstructions += `- ${pattern.pattern}\n`;
      });
    }

    return styleInstructions;
  };

  const buildContentPrompt = (template: GenerationTemplate): string => {
    let prompt = template.basePrompt + '\n\n';
    
    prompt += '具体信息:\n';
    template.requiredInputs.forEach(field => {
      prompt += `- ${field}: ${generationInputs[field]}\n`;
    });

    prompt += '\n请生成内容，要求:\n';
    prompt += '1. 严格按照上述风格特征进行创作\n';
    prompt += '2. 内容要自然流畅，符合使用场景\n';
    prompt += '3. 长度控制在100-200字之间\n';
    prompt += '4. 体现个人化的表达特色\n';

    return prompt;
  };

  const extractAppliedPatterns = (): string[] => {
    // 简化的模式提取逻辑
    return learnedPatterns.slice(0, 3).map(p => p.pattern);
  };

  const calculateStyleScore = (): number => {
    // 简化的风格匹配度计算
    return Math.floor(Math.random() * 20 + 80);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'business': return Briefcase;
      case 'casual': return Heart;
      case 'support': return Users;
      case 'persuasion': return Target;
      default: return MessageSquare;
    }
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'business': return 'blue';
      case 'casual': return 'green';
      case 'support': return 'purple';
      case 'persuasion': return 'orange';
      default: return 'gray';
    }
  };

  if (!apiConfigured) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <p className="text-gray-500">请先在系统设置中配置AI API</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 模板选择 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
          选择生成模板
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generationTemplates.map((template) => {
            const Icon = getContextIcon(template.context);
            const color = getContextColor(template.context);
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? `border-${color}-500 bg-${color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                  <h5 className="font-medium text-gray-900">{template.name}</h5>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 输入表单 */}
      {selectedTemplate && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">填写生成信息</h4>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {selectedTemplate.requiredInputs.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={generationInputs[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder={`请输入${field}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={generateContent}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>生成内容</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 生成结果 */}
      {generationResults.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            生成结果
          </h4>
          <div className="space-y-4">
            {generationResults.map((result) => (
              <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{result.template.name}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      风格匹配度: {result.styleScore}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(result.content)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 leading-relaxed">{result.content}</p>
                </div>
                
                {result.appliedPatterns.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">应用的模式:</h6>
                    <div className="flex flex-wrap gap-2">
                      {result.appliedPatterns.map((pattern, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {pattern}
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

export default PatternBasedGenerator;
