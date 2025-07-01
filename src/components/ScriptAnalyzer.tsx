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
  Copy
} from 'lucide-react';
import { apiService } from '../services/api';
import { promptService } from '../services/prompts';
import { storageService } from '../services/storage';
import { ScriptAnalysisResult, ConversationScript } from '../types/prompts';

const ScriptAnalyzer: React.FC = () => {
  const [scripts, setScripts] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScriptAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState(false);

  React.useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').filter(line => line.trim());
      setScripts(lines);
    };
    reader.readAsText(file);
  };

  const handleManualInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = event.target.value.split('\n').filter(line => line.trim());
    setScripts(lines);
  };

  const handleAnalyze = async () => {
    if (!apiConfigured) {
      setError('请先在系统设置中配置AI API');
      return;
    }

    if (scripts.length === 0) {
      setError('请先输入或上传对话内容');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const prompt = promptService.generateScriptAnalysisPrompt(scripts);
      
      const response = await apiService.generateContent({
        prompt,
        systemPrompt: `你是一个专业的对话分析专家，擅长分析营销对话中的角色定位和有效技巧。请严格按照要求的格式输出分析结果。`,
        maxTokens: 2000,
        temperature: 0.3
      });

      if (response.success && response.content) {
        // 解析AI返回的分析结果
        const parsedResult = parseAnalysisResult(response.content, scripts);
        setAnalysisResult(parsedResult);
        
        // 保存分析结果
        storageService.saveScriptAnalysis(parsedResult);
      } else {
        setError(response.error || '分析失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中发生错误');
    } finally {
      setIsAnalyzing(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传文件（支持txt格式）
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">选择文件</span>
                  </div>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500">未选择文件</span>
              </div>
            </div>

            {/* 手动输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                或手动输入对话内容（每行一条）
              </label>
              <textarea
                className="w-full h-64 border rounded-lg px-3 py-2 text-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入对话内容，每行一条消息..."
                onChange={handleManualInput}
                value={scripts.join('\n')}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || scripts.length === 0 || !apiConfigured}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    <span>开始分析</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：分析结果 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分析结果</h3>
            
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
              <div className="space-y-4">
                {/* 分析摘要 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">角色分布</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">{analysisResult.summary.promoterCount}</div>
                      <div className="text-xs text-gray-500">推广者</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">{analysisResult.summary.customerCount}</div>
                      <div className="text-xs text-gray-500">客户</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-600">{analysisResult.summary.supporterCount}</div>
                      <div className="text-xs text-gray-500">托</div>
                    </div>
                  </div>
                </div>

                {/* 营销技巧 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">有效技巧</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.summary.effectiveTechniques.map((technique, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 复制按钮 */}
                <button
                  onClick={() => copyToClipboard(JSON.stringify(analysisResult, null, 2))}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制分析结果</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {apiConfigured ? '输入对话内容后点击分析开始' : '请先配置AI API后开始使用'}
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
