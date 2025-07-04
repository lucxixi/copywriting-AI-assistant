import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Target,
  Brain,
  Play,
  Loader,
  CheckCircle,
  AlertCircle,
  Eye,
  Copy,
  Download
} from 'lucide-react';
import { ConversationFile, ScenarioAnalysis } from '../../types/prompts';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';

interface ScenarioDetectorProps {
  files: ConversationFile[];
  analyses: ScenarioAnalysis[];
  onAnalysesChange: (analyses: ScenarioAnalysis[]) => void;
  apiConfigured: boolean;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const ScenarioDetector: React.FC<ScenarioDetectorProps> = ({
  files,
  analyses,
  onAnalysesChange,
  apiConfigured,
  onError,
  onSuccess
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ScenarioAnalysis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{current: number, total: number}>({current: 0, total: 0});

  // 添加错误边界处理
  React.useEffect(() => {
    console.log('ScenarioDetector mounted with:', { files: files?.length, analyses: analyses?.length, apiConfigured });
  }, [files, analyses, apiConfigured]);

  const scenarioLabels = {
    preheating: { name: '预热阶段', color: 'blue', emoji: '🔥' },
    preview: { name: '预览阶段', color: 'purple', emoji: '👀' },
    launch: { name: '正式发布', color: 'green', emoji: '🚀' },
    'follow-up': { name: '后续跟进', color: 'orange', emoji: '📞' },
    unknown: { name: '未知场景', color: 'gray', emoji: '❓' }
  };

  const generateAnalysisPrompt = (file: ConversationFile): string => {
    return `请分析以下对话内容，识别营销场景和角色信息：

对话内容：
${file.content}

请按照以下JSON格式输出分析结果：
{
  "scenario": "preheating|preview|launch|follow-up|unknown",
  "confidence": 0.85,
  "characters": [
    {
      "id": "char_1",
      "name": "角色名称",
      "role": "销售员|客户|意见领袖|其他",
      "characteristics": ["特征1", "特征2", "特征3"]
    }
  ],
  "keyPoints": ["关键点1", "关键点2", "关键点3"],
  "style": {
    "tone": "正式|友好|专业|轻松",
    "formality": 75,
    "emotionality": 60
  },
  "reasoning": "分析推理过程"
}

分析要求：
1. 场景分类：
   - preheating: 产品预热、市场预告
   - preview: 产品展示、功能介绍
   - launch: 正式发布、销售推广
   - follow-up: 客户服务、反馈收集
   - unknown: 无法明确分类

2. 角色识别：准确识别对话中的每个角色及其特征
3. 关键点提取：提取对话中的重要信息和卖点
4. 风格分析：分析整体语调和表达风格
5. 置信度评估：对分析结果的可信度评分(0-1)`;
  };

  const handleAnalyzeAll = async () => {
    if (!apiConfigured) {
      onError('请先配置AI API');
      return;
    }

    if (files.length === 0) {
      onError('请先上传文件');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress({current: 0, total: files.length});
    
    const newAnalyses: ScenarioAnalysis[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setAnalysisProgress({current: i + 1, total: files.length});

      try {
        // 检查是否已经分析过
        const existingAnalysis = analyses.find(a => a.fileId === file.id);
        if (existingAnalysis) {
          newAnalyses.push(existingAnalysis);
          successCount++;
          continue;
        }

        const prompt = generateAnalysisPrompt(file);
        const response = await apiService.generateContent({
          prompt,
          systemPrompt: `你是一个专业的营销对话分析专家，擅长识别营销场景、分析角色特征和提取关键信息。请严格按照JSON格式输出分析结果。`,
          maxTokens: 1500,
          temperature: 0.3
        });

        if (response.success && response.content) {
          try {
            // 清理API返回的内容，移除markdown代码块标记
            let cleanContent = response.content.trim();

            // 移除可能的markdown代码块标记
            if (cleanContent.startsWith('```json')) {
              cleanContent = cleanContent.replace(/^```json\s*/, '');
            }
            if (cleanContent.startsWith('```')) {
              cleanContent = cleanContent.replace(/^```\s*/, '');
            }
            if (cleanContent.endsWith('```')) {
              cleanContent = cleanContent.replace(/\s*```$/, '');
            }

            // 尝试解析JSON结果
            const analysisData = JSON.parse(cleanContent);
            
            const analysis: ScenarioAnalysis = {
              id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              fileId: file.id,
              scenario: analysisData.scenario || 'unknown',
              confidence: analysisData.confidence || 0.5,
              characters: analysisData.characters || [],
              keyPoints: analysisData.keyPoints || [],
              style: {
                tone: analysisData.style?.tone || '未知',
                formality: analysisData.style?.formality || 50,
                emotionality: analysisData.style?.emotionality || 50
              }
            };

            newAnalyses.push(analysis);
            successCount++;
          } catch (parseError) {
            console.error('解析分析结果失败:', parseError);
            // 创建基础分析结果
            const basicAnalysis: ScenarioAnalysis = {
              id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              fileId: file.id,
              scenario: 'unknown',
              confidence: 0.3,
              characters: [{
                id: 'char_1',
                name: '未识别角色',
                role: '未知',
                characteristics: ['需要人工确认']
              }],
              keyPoints: ['AI分析失败，需要人工分析'],
              style: {
                tone: '未知',
                formality: 50,
                emotionality: 50
              }
            };
            newAnalyses.push(basicAnalysis);
            errorCount++;
          }
        } else {
          onError(`分析文件失败: ${file.name}`);
          errorCount++;
        }
      } catch (error) {
        console.error('分析过程出错:', error);
        errorCount++;
      }

      // 添加延迟避免API限制
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsAnalyzing(false);
    setAnalysisProgress({current: 0, total: 0});
    
    onAnalysesChange(newAnalyses);
    
    if (successCount > 0) {
      onSuccess(`成功分析 ${successCount} 个文件${errorCount > 0 ? `，${errorCount} 个文件失败` : ''}`);
    } else {
      onError('所有文件分析失败');
    }
  };

  const handleAnalyzeSingle = async (file: ConversationFile) => {
    if (!apiConfigured) {
      onError('请先配置AI API');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const prompt = generateAnalysisPrompt(file);
      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的营销对话分析专家，擅长识别营销场景、分析角色特征和提取关键信息。请严格按照JSON格式输出分析结果。`,
        maxTokens: 1500,
        temperature: 0.3
      });

      if (response.success && response.content) {
        try {
          // 清理API返回的内容，移除markdown代码块标记
          let cleanContent = response.content.trim();

          // 移除可能的markdown代码块标记
          if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.replace(/^```json\s*/, '');
          }
          if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/^```\s*/, '');
          }
          if (cleanContent.endsWith('```')) {
            cleanContent = cleanContent.replace(/\s*```$/, '');
          }

          const analysisData = JSON.parse(cleanContent);
          
          const analysis: ScenarioAnalysis = {
            id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fileId: file.id,
            scenario: analysisData.scenario || 'unknown',
            confidence: analysisData.confidence || 0.5,
            characters: analysisData.characters || [],
            keyPoints: analysisData.keyPoints || [],
            style: {
              tone: analysisData.style?.tone || '未知',
              formality: analysisData.style?.formality || 50,
              emotionality: analysisData.style?.emotionality || 50
            }
          };

          // 更新分析结果
          const updatedAnalyses = analyses.filter(a => a.fileId !== file.id);
          updatedAnalyses.push(analysis);
          onAnalysesChange(updatedAnalyses);
          
          onSuccess(`文件 ${file.name} 分析完成`);
        } catch (parseError) {
          console.error('JSON解析失败:', parseError);
          console.error('API返回内容长度:', response.content?.length);
          console.error('API返回内容:', response.content);
          console.error('清理后内容:', cleanContent);

          // 尝试修复常见的JSON问题
          let fixedContent = cleanContent;

          // 检查是否有未完成的字符串（在引号中被截断）
          const lastQuoteIndex = fixedContent.lastIndexOf('"');
          const lastColonIndex = fixedContent.lastIndexOf(':');

          // 如果最后一个引号在最后一个冒号之后，说明可能是值被截断
          if (lastQuoteIndex > lastColonIndex && !fixedContent.trim().endsWith('"')) {
            // 尝试关闭未完成的字符串
            fixedContent += '"';
            console.log('修复未完成的字符串');
          }

          // 如果JSON被截断，尝试添加缺失的结束符
          if (!fixedContent.trim().endsWith('}')) {
            // 计算需要关闭的括号数量
            const openBraces = (fixedContent.match(/\{/g) || []).length;
            const closeBraces = (fixedContent.match(/\}/g) || []).length;
            const openBrackets = (fixedContent.match(/\[/g) || []).length;
            const closeBrackets = (fixedContent.match(/\]/g) || []).length;

            // 添加缺失的结束符
            for (let i = 0; i < openBrackets - closeBrackets; i++) {
              fixedContent += ']';
            }
            for (let i = 0; i < openBraces - closeBraces; i++) {
              fixedContent += '}';
            }

            console.log('尝试修复后的内容:', fixedContent);

            try {
              const analysisData = JSON.parse(fixedContent);

              const analysis: ScenarioAnalysis = {
                id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fileId: file.id,
                scenario: analysisData.scenario || 'unknown',
                confidence: analysisData.confidence || 0.5,
                characters: analysisData.characters || [],
                keyPoints: analysisData.keyPoints || [],
                createdAt: new Date().toISOString(),
                style: {
                  tone: analysisData.style?.tone || '未知',
                  formality: analysisData.style?.formality || 50,
                  emotionality: analysisData.style?.emotionality || 50
                }
              };

              const updatedAnalyses = analyses.filter(a => a.fileId !== file.id);
              updatedAnalyses.push(analysis);
              onAnalysesChange(updatedAnalyses);

              onSuccess(`文件 ${file.name} 分析完成（已修复JSON格式）`);
              return;
            } catch (fixError) {
              console.error('修复JSON失败:', fixError);
            }
          }

          onError(`分析结果解析失败: ${response.content?.substring(0, 200)}...`);
        }
      } else {
        onError('分析失败，请重试');
      }
    } catch (error) {
      onError('分析过程出错');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    onSuccess('已复制到剪贴板');
  };

  const getFileById = (fileId: string) => {
    return files.find(f => f.id === fileId);
  };

  const getAnalysisForFile = (fileId: string) => {
    return analyses.find(a => a.fileId === fileId);
  };

  try {
    return (
      <div className="p-6 space-y-6">
      {/* 操作区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">场景分析</h3>
          <p className="text-gray-600 mt-1">AI智能识别营销场景和角色特征</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                {analysisProgress.total > 0 
                  ? `分析中 ${analysisProgress.current}/${analysisProgress.total}`
                  : '分析中...'
                }
              </span>
            </div>
          )}
          
          <button
            onClick={handleAnalyzeAll}
            disabled={isAnalyzing || files.length === 0 || !apiConfigured}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            <Brain className="w-4 h-4" />
            <span>批量分析</span>
          </button>
        </div>
      </div>

      {/* 文件分析状态 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">文件分析状态</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => {
              const analysis = getAnalysisForFile(file.id);
              const scenario = analysis ? scenarioLabels[analysis.scenario] : null;
              
              return (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-xl">📄</span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          {analysis ? (
                            <>
                              <span className="flex items-center space-x-1">
                                <span>{scenario?.emoji}</span>
                                <span className={`text-${scenario?.color}-600 font-medium`}>
                                  {scenario?.name}
                                </span>
                              </span>
                              <span>置信度: {Math.round((analysis.confidence || 0) * 100)}%</span>
                              <span>{analysis.characters.length} 个角色</span>
                            </>
                          ) : (
                            <span className="text-gray-400">未分析</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {analysis && (
                        <button
                          onClick={() => setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleAnalyzeSingle(file)}
                        disabled={isAnalyzing || !apiConfigured}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 disabled:cursor-not-allowed"
                        title={analysis ? "重新分析" : "分析"}
                      >
                        <Brain className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* 分析详情 */}
                  {selectedAnalysis?.id === analysis?.id && selectedAnalysis && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* 场景信息 */}
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">场景信息</h6>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{scenario?.emoji}</span>
                            <span className={`font-medium text-${scenario?.color}-600`}>
                              {scenario?.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              (置信度: {Math.round((selectedAnalysis.confidence || 0) * 100)}%)
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>语调: {selectedAnalysis.style?.tone || '未知'}</div>
                            <div>正式程度: {selectedAnalysis.style?.formality || 0}%</div>
                            <div>情感程度: {selectedAnalysis.style?.emotionality || 0}%</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 角色信息 */}
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">识别角色 ({selectedAnalysis.characters?.length || 0})</h6>
                        <div className="space-y-2">
                          {selectedAnalysis.characters?.map((character, index) => (
                            <div key={character.id} className="bg-blue-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">{character.name}</span>
                                <span className="text-sm text-blue-600">({character.role})</span>
                              </div>
                              <div className="text-sm text-blue-700">
                                特征: {character.characteristics?.join(', ') || '无'}
                              </div>
                            </div>
                          )) || []}
                        </div>
                      </div>

                      {/* 关键点 */}
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">关键点</h6>
                        <div className="bg-green-50 rounded-lg p-3">
                          <ul className="space-y-1">
                            {selectedAnalysis.keyPoints?.map((point, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-start space-x-2">
                                <Target className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            )) || []}
                          </ul>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(analysis, null, 2))}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded"
                        >
                          <Copy className="w-3 h-3" />
                          <span>复制</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 空状态 */}
      {files.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">请先上传文件进行分析</p>
          <p className="text-sm text-gray-400 mt-1">AI将自动识别营销场景和角色特征</p>
        </div>
      )}
      
      {/* API未配置提示 */}
      {!apiConfigured && files.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">请先在系统设置中配置AI API以使用分析功能</span>
          </div>
        </div>
      )}
      </div>
    );
  } catch (error) {
    console.error('ScenarioDetector error:', error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">组件加载错误</h3>
              <p className="text-red-600 text-sm mt-1">
                场景分析组件遇到错误，请刷新页面重试。错误信息：{error instanceof Error ? error.message : '未知错误'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ScenarioDetector;
