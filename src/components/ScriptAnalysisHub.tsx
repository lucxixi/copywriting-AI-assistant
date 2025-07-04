import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  BarChart3,
  Brain,
  Workflow,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader,
  Info
} from 'lucide-react';
import { ConversationFile, ScenarioAnalysis, MarketingFlow } from '../types/prompts';
import { storageService } from '../services/storage';
import FileUploadManager from './shared/FileUploadManager';
import ScenarioDetector from './shared/ScenarioDetector';
import ProgressiveLearner from './shared/ProgressiveLearner';
import MarketingFlowTemplate from './shared/MarketingFlowTemplate';

type TabType = 'upload' | 'analysis' | 'learning' | 'templates';

interface TabConfig {
  id: TabType;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const ScriptAnalysisHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [files, setFiles] = useState<ConversationFile[]>([]);
  const [analyses, setAnalyses] = useState<ScenarioAnalysis[]>([]);
  const [marketingFlows, setMarketingFlows] = useState<MarketingFlow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const tabs: TabConfig[] = [
    {
      id: 'upload',
      name: '文件管理',
      icon: Upload,
      description: '上传和管理对话文件',
      color: 'blue'
    },
    {
      id: 'analysis',
      name: '场景分析',
      icon: BarChart3,
      description: '智能识别场景和角色',
      color: 'purple'
    },
    {
      id: 'learning',
      name: '学习系统',
      icon: Brain,
      description: '渐进式学习和模式积累',
      color: 'green'
    },
    {
      id: 'templates',
      name: '流程模板',
      icon: Workflow,
      description: '营销流程模板管理',
      color: 'orange'
    }
  ];

  useEffect(() => {
    checkApiConfiguration();
    loadData();
  }, []);

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const loadData = () => {
    // 加载已保存的数据
    const savedFiles = storageService.getConversationFiles() || [];
    const savedAnalyses = storageService.getScenarioAnalyses() || [];
    const savedFlows = storageService.getMarketingFlows() || [];
    
    setFiles(savedFiles);
    setAnalyses(savedAnalyses);
    setMarketingFlows(savedFlows);
  };

  const handleFilesChange = (newFiles: ConversationFile[]) => {
    setFiles(newFiles);
    storageService.saveConversationFiles(newFiles);
    
    // 清除相关的分析结果
    const fileIds = newFiles.map(f => f.id);
    const filteredAnalyses = analyses.filter(a => fileIds.includes(a.fileId));
    setAnalyses(filteredAnalyses);
    storageService.saveScenarioAnalyses(filteredAnalyses);
  };

  const handleAnalysesChange = (newAnalyses: ScenarioAnalysis[]) => {
    setAnalyses(newAnalyses);
    storageService.saveScenarioAnalyses(newAnalyses);
  };

  const handleFlowsChange = (newFlows: MarketingFlow[]) => {
    setMarketingFlows(newFlows);
    storageService.saveMarketingFlows(newFlows);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <FileUploadManager
            files={files}
            onFilesChange={handleFilesChange}
            onError={showError}
            onSuccess={showSuccess}
          />
        );
      case 'analysis':
        return (
          <ScenarioDetector
            files={files}
            analyses={analyses}
            onAnalysesChange={handleAnalysesChange}
            apiConfigured={apiConfigured}
            onError={showError}
            onSuccess={showSuccess}
          />
        );
      case 'learning':
        return (
          <ProgressiveLearner
            files={files}
            analyses={analyses}
            onError={showError}
            onSuccess={showSuccess}
          />
        );
      case 'templates':
        return (
          <MarketingFlowTemplate
            files={files}
            analyses={analyses}
            flows={marketingFlows}
            onFlowsChange={handleFlowsChange}
            onError={showError}
            onSuccess={showSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getTabStats = () => {
    return {
      files: files.length,
      analyses: analyses.length,
      flows: marketingFlows.length,
      characters: analyses.reduce((acc, a) => acc + a.characters.length, 0)
    };
  };

  const stats = getTabStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>📊</span>
                <span>话术分析中心</span>
              </h1>
              <p className="text-gray-600 mt-1">智能分析营销对话，学习表达模式，生成流程模板</p>
            </div>
            
            {/* 统计信息 */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.files}</div>
                <div className="text-gray-500">文件</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.analyses}</div>
                <div className="text-gray-500">分析</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.characters}</div>
                <div className="text-gray-500">角色</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.flows}</div>
                <div className="text-gray-500">流程</div>
              </div>
            </div>
          </div>

          {/* 状态提示 */}
          {!apiConfigured && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">请先在系统设置中配置AI API以使用分析功能</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}
        </div>

        {/* 标签页导航 */}
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                    isActive
                      ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-2 border-${tab.color}-500`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'upload' && files.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {files.length}
                    </span>
                  )}
                  {tab.id === 'analysis' && analyses.length > 0 && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {analyses.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ScriptAnalysisHub;
