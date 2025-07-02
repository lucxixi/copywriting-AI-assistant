import React, { useState } from 'react';
import {
  Upload,
  MessageSquare,
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  Loader,
  FileText,
  CheckCircle,
  Copy,
  Brain,
  File,
  Image,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import { promptService } from '../services/prompts';
import { storageService } from '../services/storage';
import { fileProcessorService, FileProcessResult } from '../services/fileProcessor';
import { ScriptAnalysisResult, ConversationScript } from '../types/prompts';
import EnhancedAnalysisDisplay from './shared/EnhancedAnalysisDisplay';
import AdvancedPatternLearning from './shared/AdvancedPatternLearning';

const ScriptAnalyzer: React.FC = () => {
  const [scripts, setScripts] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScriptAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'patterns'>('analysis');
  const [uploadedFile, setUploadedFile] = useState<FileProcessResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  React.useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  // 生成增强的分析提示词
  const generateEnhancedAnalysisPrompt = (scripts: string[]): string => {
    const conversationText = scripts.join('\n');

    return `请对以下对话进行深度分析，重点学习每个角色的对话模式和表达习惯：

对话内容：
${conversationText}

请按照以下JSON格式输出详细分析结果：

{
  "characters": [
    {
      "name": "角色名称",
      "role": "角色身份/职业",
      "personality": "性格特征描述",
      "speakingStyle": {
        "formality": "正式度(formal/informal/mixed)",
        "tone": "语调(friendly/professional/enthusiastic/calm/persuasive)",
        "emotionalLevel": "情感丰富度(high/medium/low)",
        "directness": "直接程度(direct/indirect/balanced)"
      },
      "languagePatterns": {
        "fillerWords": ["语气词列表", "比如：嗯", "啊", "呢"],
        "emojis": ["常用emoji列表"],
        "catchphrases": ["口头禅或常用表达"],
        "questionPatterns": ["常用疑问句式"],
        "affirmationPatterns": ["常用肯定表达"],
        "transitionWords": ["常用连接词"]
      },
      "communicationHabits": {
        "averageMessageLength": "平均消息长度(short/medium/long)",
        "responseSpeed": "回应风格(quick/thoughtful/detailed)",
        "initiationStyle": "主动性(proactive/reactive/balanced)",
        "persuasionTechniques": ["使用的说服技巧"]
      },
      "contextualBehavior": {
        "businessScenarios": "商务场合的表达特点",
        "casualScenarios": "日常场合的表达特点",
        "problemSolving": "解决问题时的表达方式",
        "emotionalSupport": "提供情感支持时的表达方式"
      },
      "samplePhrases": ["该角色的典型表达示例"]
    }
  ],
  "conversationAnalysis": {
    "overallTone": "整体对话氛围",
    "scenario": "对话场景类型",
    "purpose": "对话目的",
    "effectiveness": "对话效果评估",
    "keyMoments": ["关键转折点或亮点"],
    "improvementSuggestions": ["改进建议"]
  },
  "learnablePatterns": {
    "successfulTechniques": ["成功的沟通技巧"],
    "emotionalTriggers": ["情感触发点"],
    "persuasionFlow": "说服逻辑流程",
    "adaptableTemplates": [
      {
        "situation": "适用场景",
        "template": "话术模板",
        "variables": ["可变元素"],
        "effectiveness": "预期效果"
      }
    ]
  },
  "styleTransferGuide": {
    "formalToInformal": "正式转非正式的转换规则",
    "informalToFormal": "非正式转正式的转换规则",
    "emotionalAdjustment": "情感调节指南",
    "audienceAdaptation": "受众适配建议"
  }
}

分析要求：
1. 精准识别每个说话者的身份和角色
2. 深度分析语言风格和表达习惯
3. 提取可学习的对话模式和技巧
4. 识别语气词、emoji、口头禅等个性化元素
5. 分析不同场合下的表达方式变化
6. 生成可复用的话术模板
7. 提供风格转换和适配指南

请确保输出的JSON格式正确，数据完整且具有实用价值。`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setError('');

    try {
      const result = await fileProcessorService.processFile(file);

      if (result.success && result.content) {
        setUploadedFile(result);
        const lines = result.content.split('\n').filter(line => line.trim());
        setScripts(lines);
      } else {
        setError(result.error || '文件处理失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理过程中发生错误');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleManualInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = event.target.value.split('\n').filter(line => line.trim());
    setScripts(lines);
    // 如果手动输入，清除上传的文件信息
    if (uploadedFile) {
      setUploadedFile(null);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setScripts([]);
    setError('');
  };

  const handleAnalyze = async () => {
    console.log('🔍 开始分析 - 调试信息:');
    console.log('API配置状态:', apiConfigured);
    console.log('脚本数量:', scripts.length);
    console.log('脚本内容预览:', scripts.slice(0, 3));

    if (!apiConfigured) {
      const activeConfig = storageService.getActiveApiConfig();
      console.log('❌ API未配置 - 当前配置:', activeConfig);
      setError('请先在系统设置中配置AI API');
      return;
    }

    if (scripts.length === 0) {
      console.log('❌ 脚本内容为空');
      setError('请先输入或上传对话内容');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // 获取API配置信息用于调试
      const activeConfig = storageService.getActiveApiConfig();
      console.log('📡 使用的API配置:', {
        provider: activeConfig?.provider,
        model: activeConfig?.model,
        hasApiKey: !!activeConfig?.apiKey
      });

      // 使用增强的分析提示词
      const prompt = generateEnhancedAnalysisPrompt(scripts);
      console.log('📝 生成的提示词长度:', prompt.length);
      console.log('📝 提示词预览:', prompt.substring(0, 200) + '...');

      const requestPayload = {
        prompt,
        systemPrompt: `你是一个顶级的对话分析专家和语言学习专家，具备以下能力：
1. 精准识别对话中的不同角色和身份
2. 深度分析每个角色的语言风格、表达习惯和情感特征
3. 提取语气词、emoji、口头禅等个性化表达元素
4. 识别不同场合下的说话方式和语调变化
5. 生成可学习和复用的对话模式

请严格按照JSON格式输出详细的分析结果，确保数据结构完整且准确。`,
        maxTokens: 3000,
        temperature: 0.2
      };

      console.log('🚀 发送API请求...');
      const startTime = Date.now();

      const response = await apiService.generateContent(requestPayload);

      const endTime = Date.now();
      console.log(`⏱️ API响应时间: ${endTime - startTime}ms`);
      console.log('📥 API响应:', {
        success: response.success,
        hasContent: !!response.content,
        contentLength: response.content?.length,
        error: response.error
      });

      if (response.success && response.content) {
        console.log('✅ API调用成功，开始解析结果...');
        console.log('📄 原始响应内容预览:', response.content.substring(0, 500) + '...');

        try {
          // 解析增强的AI分析结果
          const parsedResult = parseEnhancedAnalysisResult(response.content, scripts);
          console.log('✅ 结果解析成功:', parsedResult);

          setAnalysisResult(parsedResult);

          // 保存分析结果
          storageService.saveScriptAnalysis(parsedResult);

          // 保存到通用历史记录
          const historyRecord = {
            id: `script_${Date.now()}`,
            type: 'script',
            style: 'analysis',
            prompt,
            result: response.content,
            apiConfig: storageService.getActiveApiId(),
            createdAt: new Date().toISOString(),
            parameters: {
              scriptCount: scripts.length,
              analysisType: 'enhanced_conversation',
              features: ['role_recognition', 'style_learning', 'pattern_extraction']
            }
          };
          storageService.saveGenerationHistory(historyRecord);

          console.log('✅ 分析完成并保存成功');
        } catch (parseError) {
          console.error('❌ 结果解析失败:', parseError);
          console.log('🔍 尝试解析的内容:', response.content);

          // 尝试创建一个基本的分析结果，至少显示原始内容
          try {
            const basicResult: ScriptAnalysisResult = {
              scripts: scripts.map((script, index) => ({
                id: `script-${index}`,
                content: script,
                speaker: '未知',
                timestamp: new Date().toISOString(),
                analysis: {
                  sentiment: '中性',
                  keywords: [],
                  intent: '未分析',
                  confidence: 0
                }
              })),
              analysis: {
                summary: '分析解析失败，但内容已保存',
                characters: [],
                conversationFlow: [],
                learnablePatterns: [],
                recommendations: ['请检查API配置或重新尝试分析']
              },
              metadata: {
                totalScripts: scripts.length,
                analysisDate: new Date().toISOString(),
                rawContent: response.content
              }
            };

            setAnalysisResult(basicResult);

            // 仍然保存到历史记录
            const historyRecord: GenerationHistory = {
              id: Date.now().toString(),
              type: 'script_analysis',
              title: '话术分析',
              content: response.content,
              timestamp: new Date().toISOString(),
              metadata: {
                scriptCount: scripts.length,
                analysisType: 'enhanced_conversation',
                features: ['role_recognition', 'style_analysis', 'pattern_learning'],
                parseError: parseError instanceof Error ? parseError.message : '解析错误'
              }
            };
            storageService.saveGenerationHistory(historyRecord);

          } catch (fallbackError) {
            console.error('❌ 创建基本结果也失败:', fallbackError);
            setError(`结果解析失败: ${parseError instanceof Error ? parseError.message : '未知解析错误'}`);
          }
        }
      } else {
        console.error('❌ API调用失败:', response.error);
        setError(response.error || '分析失败，请重试');
      }
    } catch (err) {
      console.error('❌ 分析过程异常:', err);
      if (err instanceof Error) {
        console.error('错误堆栈:', err.stack);
      }
      setError(err instanceof Error ? err.message : '分析过程中发生错误');
    } finally {
      setIsAnalyzing(false);
      console.log('🏁 分析流程结束');
    }
  };

  // 解析增强的AI分析结果
  const parseEnhancedAnalysisResult = (content: string, originalScripts: string[]): ScriptAnalysisResult => {
    console.log('🔍 开始解析AI响应结果...');
    console.log('📄 原始内容长度:', content.length);

    try {
      // 清理可能的markdown代码块标记
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('🧹 清理后的内容预览:', cleanContent.substring(0, 200) + '...');

      // 尝试找到JSON开始和结束位置
      const jsonStart = cleanContent.indexOf('{');
      const jsonEnd = cleanContent.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('未找到有效的JSON格式内容');
      }

      const jsonContent = cleanContent.substring(jsonStart, jsonEnd + 1);
      console.log('📋 提取的JSON内容长度:', jsonContent.length);

      // 尝试解析JSON格式的分析结果
      const enhancedResult = JSON.parse(jsonContent);
      console.log('✅ JSON解析成功:', Object.keys(enhancedResult));

      // 验证必要的字段
      if (!enhancedResult.characters && !enhancedResult.conversationAnalysis) {
        console.warn('⚠️ 响应缺少必要字段，使用基础解析');
        throw new Error('响应格式不完整');
      }

      // 转换为现有的ScriptAnalysisResult格式，同时保留增强信息
      const scripts: ConversationScript[] = originalScripts.map((script, index) => {
        // 尝试匹配脚本到角色
        const matchedCharacter = enhancedResult.characters?.find((char: any) =>
          script.toLowerCase().includes(char.name?.toLowerCase()) ||
          script.includes(char.name)
        );

        return {
          id: `script_${index}`,
          content: script,
          role: matchedCharacter?.role || 'unknown',
          speaker: matchedCharacter?.name || `角色${index + 1}`,
          analysis: {
            speakingStyle: matchedCharacter?.speakingStyle,
            languagePatterns: matchedCharacter?.languagePatterns,
            communicationHabits: matchedCharacter?.communicationHabits,
            contextualBehavior: matchedCharacter?.contextualBehavior,
            samplePhrases: matchedCharacter?.samplePhrases
          }
        };
      });

      const result = {
        id: `analysis_${Date.now()}`,
        scripts,
        analysis: {
          characters: enhancedResult.characters || [],
          conversationFlow: enhancedResult.conversationAnalysis || {},
          learnablePatterns: enhancedResult.learnablePatterns || {},
          styleTransferGuide: enhancedResult.styleTransferGuide || {},
          keyInsights: enhancedResult.conversationAnalysis?.keyMoments || [],
          improvementSuggestions: enhancedResult.conversationAnalysis?.improvementSuggestions || [],
          overallEffectiveness: enhancedResult.conversationAnalysis?.effectiveness || 'unknown'
        },
        createdAt: new Date().toISOString(),
        metadata: {
          analysisType: 'enhanced',
          scriptCount: originalScripts.length,
          charactersIdentified: enhancedResult.characters?.length || 0,
          patternsExtracted: Object.keys(enhancedResult.learnablePatterns || {}).length
        }
      };

      console.log('✅ 解析结果构建成功:', {
        scriptsCount: result.scripts.length,
        charactersCount: result.analysis.characters.length,
        hasPatterns: !!result.analysis.learnablePatterns
      });

      return result;
    } catch (error) {
      console.error('❌ 增强解析失败:', error);
      console.log('🔄 降级到基础解析模式');
      console.log('📄 失败的内容:', content.substring(0, 1000) + '...');

      // 降级到基础解析
      return parseAnalysisResult(content, originalScripts);
    }
  };

  const parseAnalysisResult = (content: string, originalScripts: string[]): ScriptAnalysisResult => {
    // 简单的解析逻辑，实际项目中可能需要更复杂的解析
    const scripts: ConversationScript[] = originalScripts.map((script, index) => ({
      id: `script_${index}`,
      content: script,
      role: 'promoter', // 默认值，实际应该从AI返回中解析
      confidence: 0.8,
      createdAt: new Date().toISOString()
    }));

    return {
      scripts,
      summary: {
        promoterCount: scripts.filter(s => s.role === 'promoter').length,
        customerCount: scripts.filter(s => s.role === 'customer').length,
        supporterCount: scripts.filter(s => s.role === 'supporter').length,
        commonThemes: ['产品优势', '用户需求', '购买决策'],
        effectiveTechniques: ['痛点挖掘', '价值展示', '信任建立']
      }
    };
  };

  const handleClear = () => {
    setScripts([]);
    setAnalysisResult(null);
    setError('');
  };

  // 从历史记录加载分析结果
  const loadFromHistory = (historyItem: GenerationHistory) => {
    if (historyItem.type === 'script_analysis') {
      try {
        // 尝试从历史记录重建分析结果
        if (historyItem.metadata?.rawContent) {
          // 如果有原始内容，尝试重新解析
          const parsedResult = parseEnhancedAnalysisResult(historyItem.metadata.rawContent, []);
          setAnalysisResult(parsedResult);
        } else {
          // 否则创建一个基本的显示结果
          const basicResult: ScriptAnalysisResult = {
            scripts: [],
            analysis: {
              summary: '从历史记录加载的分析结果',
              characters: [],
              conversationFlow: [],
              learnablePatterns: [],
              recommendations: []
            },
            metadata: {
              totalScripts: historyItem.metadata?.scriptCount || 0,
              analysisDate: historyItem.timestamp,
              rawContent: typeof historyItem.content === 'string' ? historyItem.content : JSON.stringify(historyItem.content)
            }
          };
          setAnalysisResult(basicResult);
        }
        setError('');
      } catch (error) {
        console.error('从历史记录加载失败:', error);
        setError('从历史记录加载失败，请重新分析');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSaveAsTemplate = (template: any) => {
    try {
      let templateToSave;

      if (template.type === 'character') {
        // 保存角色模板
        templateToSave = {
          id: `template_${Date.now()}`,
          name: `${template.name}角色模板`,
          type: 'dialogue' as const,
          category: 'character' as const,
          content: {
            character: template.data,
            prompt: `基于${template.name}的角色特征创建对话`,
            systemPrompt: `你需要模仿${template.name}的说话风格和表达习惯`,
            variables: ['对话场景', '对话目的', '产品信息'],
            examples: template.data.samplePhrases || []
          },
          metadata: {
            description: `基于真实对话分析的${template.name}角色模板`,
            tags: ['角色模板', template.data.role, '话术分析'],
            difficulty: 'intermediate' as const,
            estimatedTime: 10,
            targetAudience: ['营销人员', '客服人员', '销售代表'],
            language: 'zh-CN' as const
          },
          usage: {
            useCount: 0,
            rating: 5,
            feedback: [],
            successRate: 100
          },
          isBuiltIn: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (template.type === 'dialogue_template') {
        // 保存对话模板
        templateToSave = {
          id: `template_${Date.now()}`,
          name: `${template.name}话术模板`,
          type: 'dialogue' as const,
          category: 'script' as const,
          content: {
            template: template.data.template,
            situation: template.data.situation,
            variables: template.data.variables || [],
            effectiveness: template.data.effectiveness,
            prompt: `在${template.data.situation}场景下使用以下话术模板`,
            systemPrompt: `你是一个专业的话术专家，请根据模板和变量生成适合的对话内容`
          },
          metadata: {
            description: `基于成功案例提取的${template.name}话术模板`,
            tags: ['话术模板', '成功案例', '可复用'],
            difficulty: 'beginner' as const,
            estimatedTime: 5,
            targetAudience: ['销售人员', '客服人员', '营销人员'],
            language: 'zh-CN' as const
          },
          usage: {
            useCount: 0,
            rating: 5,
            feedback: [],
            successRate: 100
          },
          isBuiltIn: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      if (templateToSave) {
        storageService.saveUnifiedTemplate(templateToSave);
        alert('模板保存成功！您可以在模板管理中查看和使用。');
      }
    } catch (error) {
      console.error('保存模板失败:', error);
      alert('模板保存失败，请重试。');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入区域 */}
        <div className="space-y-6">
          {/* API配置提示 */}
          {!apiConfigured && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">请先在系统设置中配置AI API</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">输入对话内容</h2>
            
            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* 文件上传 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                上传话术文档
              </label>

              {/* 支持格式提示 */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">支持的文件格式：</p>
                    <p className="text-xs text-blue-700 mt-1">
                      📄 Word文档 (.docx, .doc) • 📋 PDF文档 (.pdf) • 📝 文本文件 (.txt, .rtf)
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Word和PDF文档中的图片信息也会被识别和处理
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="cursor-pointer block">
                  <div className={`flex items-center justify-center space-x-3 px-6 py-4 border-2 border-dashed rounded-xl transition-all ${
                    isProcessingFile
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                    {isProcessingFile ? (
                      <>
                        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-sm font-medium text-blue-700">正在处理文件...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">点击选择文件或拖拽到此处</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept={fileProcessorService.getAcceptString()}
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingFile}
                  />
                </label>

                {/* 文件信息显示 */}
                {uploadedFile && uploadedFile.metadata && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <File className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-green-900">{uploadedFile.metadata.fileName}</h4>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-green-700">
                            📁 大小: {fileProcessorService.formatFileSize(uploadedFile.metadata.fileSize)}
                          </p>
                          <p className="text-xs text-green-700">
                            📄 类型: {uploadedFile.metadata.fileType}
                          </p>
                          {uploadedFile.metadata.pageCount && (
                            <p className="text-xs text-green-700">
                              📖 页数: {uploadedFile.metadata.pageCount}
                            </p>
                          )}
                          {uploadedFile.images && uploadedFile.images.length > 0 && (
                            <p className="text-xs text-green-700">
                              🖼️ 包含图片: {uploadedFile.images.length} 张
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ 文件已成功处理
                          </span>
                          <button
                            onClick={handleClearFile}
                            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                          >
                            清除文件
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 手动输入 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  或手动输入对话内容（每行一条）
                </label>
                {scripts.length > 0 && (
                  <span className="text-xs text-gray-500">
                    已输入 {scripts.length} 行内容
                  </span>
                )}
              </div>
              <textarea
                className="w-full h-64 border rounded-lg px-3 py-2 text-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入对话内容，每行一条消息...&#10;例如：&#10;客户：你好，我想了解一下这个产品&#10;客服：您好！很高兴为您介绍我们的产品"
                onChange={handleManualInput}
                value={scripts.join('\n')}
              />
            </div>

            {/* 状态信息 */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API状态:</span>
                  <span className={`font-medium ${apiConfigured ? 'text-green-600' : 'text-red-600'}`}>
                    {apiConfigured ? '✅ 已配置' : '❌ 未配置'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">内容状态:</span>
                  <span className={`font-medium ${scripts.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {scripts.length > 0 ? `✅ 已加载 (${scripts.length} 行)` : '⏳ 等待内容'}
                  </span>
                </div>
                {uploadedFile && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">文件状态:</span>
                    <span className="font-medium text-blue-600">
                      📄 {uploadedFile.metadata?.fileName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || scripts.length === 0 || !apiConfigured}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>AI分析中...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    <span>开始分析</span>
                  </>
                )}
              </button>

              {/* 测试API连接按钮 */}
              {apiConfigured && (
                <button
                  onClick={async () => {
                    console.log('🧪 测试API连接...');
                    try {
                      const activeConfig = storageService.getActiveApiConfig();
                      if (activeConfig) {
                        const testResult = await apiService.testApiConnection(activeConfig);
                        console.log('🧪 API测试结果:', testResult);
                        if (testResult.success) {
                          alert('✅ API连接测试成功！');
                        } else {
                          alert(`❌ API连接测试失败: ${testResult.error}`);
                        }
                      }
                    } catch (error) {
                      console.error('🧪 API测试异常:', error);
                      alert(`❌ API测试异常: ${error instanceof Error ? error.message : '未知错误'}`);
                    }
                  }}
                  className="px-3 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  title="测试API连接"
                >
                  🧪
                </button>
              )}

              <button
                onClick={handleClear}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                清空
              </button>
            </div>

            {/* 提示信息 */}
            {!apiConfigured && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700">
                      请先配置AI API才能开始分析
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      console.log('🔧 尝试自动配置默认API...');
                      // 强制重新检查API配置，这会触发默认配置的创建
                      const config = storageService.getActiveApiConfig();
                      if (config) {
                        setApiConfigured(true);
                        console.log('✅ 默认API配置已创建');
                      } else {
                        console.log('❌ 自动配置失败，请手动配置');
                      }
                    }}
                    className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                  >
                    自动配置
                  </button>
                </div>
              </div>
            )}

            {apiConfigured && scripts.length === 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    请上传文档或手动输入对话内容后开始分析
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：分析结果 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">基础分析</span>
              </button>
              <button
                onClick={() => setActiveTab('patterns')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                  activeTab === 'patterns'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">模式学习</span>
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab === 'analysis' ? '话术分析结果' : '对话模式学习'}
            </h3>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <p className="text-gray-600">AI正在分析对话内容...</p>
                </div>
              </div>
            ) : analysisResult ? (
              <div>
                {activeTab === 'analysis' ? (
                  <EnhancedAnalysisDisplay
                    analysisResult={analysisResult}
                    onCopy={copyToClipboard}
                    onSaveAsTemplate={handleSaveAsTemplate}
                  />
                ) : (
                  <AdvancedPatternLearning
                    analysisResult={analysisResult}
                    onPatternSave={(pattern) => {
                      console.log('Pattern saved:', pattern);
                      // 这里可以添加保存模式的逻辑
                    }}
                    onProfileSave={(profile) => {
                      console.log('Profile saved:', profile);
                      // 这里可以添加保存档案的逻辑
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  {activeTab === 'analysis' ? (
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  ) : (
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-gray-500">
                    {apiConfigured
                      ? `输入对话内容后点击分析开始${activeTab === 'patterns' ? '学习对话模式' : ''}`
                      : '请先配置AI API后开始使用'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptAnalyzer;
