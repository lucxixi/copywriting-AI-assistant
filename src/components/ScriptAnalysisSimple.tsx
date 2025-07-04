import React, { useState } from 'react';
import {
  Upload,
  FileText,
  BarChart3,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const ScriptAnalysisSimple: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setError('');
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError('请先上传文件');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // 模拟分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = `分析完成！
      
文件数量: ${files.length}
分析结果:
- 识别到 ${Math.floor(Math.random() * 3) + 1} 个角色
- 检测到营销场景: ${['预热阶段', '预览阶段', '正式发布'][Math.floor(Math.random() * 3)]}
- 语调风格: ${['友好', '专业', '轻松'][Math.floor(Math.random() * 3)]}
- 正式程度: ${Math.floor(Math.random() * 40) + 60}%

关键发现:
- 使用了有效的痛点挖掘技巧
- 展现了良好的产品价值传达
- 建立了信任和权威感`;

      setAnalysisResult(result);
    } catch (err) {
      setError('分析过程出错，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setAnalysisResult('');
    setError('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <span>📊</span>
          <span>话术分析中心</span>
        </h1>
        <p className="text-gray-600 mt-1">上传对话文件，AI智能分析营销场景和角色特征</p>
      </div>

      {/* 文件上传区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">📁 文件上传</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900">上传对话文件</h4>
            <p className="text-gray-500">支持 TXT、DOCX、PDF 格式</p>
            <input
              type="file"
              multiple
              accept=".txt,.docx,.pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* 已上传文件列表 */}
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">已上传文件 ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || files.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
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
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            清空
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* 分析结果 */}
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">分析结果</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {analysisResult}
            </pre>
          </div>
          
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={() => navigator.clipboard.writeText(analysisResult)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <span>📋</span>
              <span>复制结果</span>
            </button>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {files.length === 0 && !analysisResult && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">上传对话文件开始智能分析</p>
          <p className="text-sm text-gray-400 mt-1">支持多文件批量分析，识别营销场景和角色特征</p>
        </div>
      )}

      {/* 功能说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">🚀 功能特色</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 多文件批量上传和分析</li>
          <li>• 智能识别营销场景（预热、预览、发布、跟进）</li>
          <li>• 自动检测对话角色和特征</li>
          <li>• 分析语言风格和表达模式</li>
          <li>• 提取营销技巧和改进建议</li>
        </ul>
      </div>
    </div>
  );
};

export default ScriptAnalysisSimple;
