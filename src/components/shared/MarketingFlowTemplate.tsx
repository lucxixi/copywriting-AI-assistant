import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Download,
  Play,
  CheckCircle,
  ArrowRight,
  Target,
  Users,
  MessageSquare,
  Settings
} from 'lucide-react';
import { ConversationFile, ScenarioAnalysis, MarketingFlow } from '../../types/prompts';

interface MarketingFlowTemplateProps {
  files: ConversationFile[];
  analyses: ScenarioAnalysis[];
  flows: MarketingFlow[];
  onFlowsChange: (flows: MarketingFlow[]) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  stages: Array<{
    name: string;
    description: string;
    expectedScenario: string;
    order: number;
  }>;
}

const MarketingFlowTemplate: React.FC<MarketingFlowTemplateProps> = ({
  files,
  analyses,
  flows,
  onFlowsChange,
  onError,
  onSuccess
}) => {
  const [selectedFlow, setSelectedFlow] = useState<MarketingFlow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PresetTemplate | null>(null);
  const [autoMatching, setAutoMatching] = useState(false);

  const presetTemplates: PresetTemplate[] = [
    {
      id: 'classic_3_stage',
      name: '经典三段式',
      description: '预热 → 预告 → 发布的经典营销流程',
      stages: [
        {
          name: '预热阶段',
          description: '市场预热，引起关注',
          expectedScenario: 'preheating',
          order: 1
        },
        {
          name: '预告阶段',
          description: '产品预告，展示特色',
          expectedScenario: 'preview',
          order: 2
        },
        {
          name: '正式发布',
          description: '正式发布，推动销售',
          expectedScenario: 'launch',
          order: 3
        }
      ]
    },
    {
      id: 'complete_5_stage',
      name: '完整五段式',
      description: '预热 → 预告 → 发布 → 促销 → 维护的完整流程',
      stages: [
        {
          name: '市场预热',
          description: '建立期待，预热市场',
          expectedScenario: 'preheating',
          order: 1
        },
        {
          name: '产品预告',
          description: '展示产品，介绍特色',
          expectedScenario: 'preview',
          order: 2
        },
        {
          name: '正式发布',
          description: '正式上市，开始销售',
          expectedScenario: 'launch',
          order: 3
        },
        {
          name: '促销推广',
          description: '促销活动，扩大销量',
          expectedScenario: 'launch',
          order: 4
        },
        {
          name: '客户维护',
          description: '客户服务，维护关系',
          expectedScenario: 'follow-up',
          order: 5
        }
      ]
    }
  ];

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) {
      onError('请输入流程名称');
      return;
    }

    if (!selectedTemplate) {
      onError('请选择模板');
      return;
    }

    const newFlow: MarketingFlow = {
      id: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newFlowName,
      stages: selectedTemplate.stages.map(stage => ({
        id: `stage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: stage.name,
        description: stage.description,
        fileIds: [],
        order: stage.order
      })),
      createdAt: new Date().toISOString()
    };

    const updatedFlows = [...flows, newFlow];
    onFlowsChange(updatedFlows);
    
    setIsCreating(false);
    setNewFlowName('');
    setSelectedTemplate(null);
    
    onSuccess(`营销流程 "${newFlowName}" 创建成功`);
  };

  const handleAutoMatch = async (flow: MarketingFlow) => {
    setAutoMatching(true);
    
    try {
      // 按时间排序文件
      const sortedFiles = [...files].sort((a, b) => 
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );

      // 自动匹配文件到阶段
      const updatedStages = flow.stages.map(stage => ({ ...stage, fileIds: [] }));
      
      sortedFiles.forEach((file, index) => {
        const analysis = analyses.find(a => a.fileId === file.id);
        if (analysis) {
          // 根据场景匹配到相应阶段
          const matchingStage = updatedStages.find(stage => {
            const template = presetTemplates.find(t => 
              t.stages.some(s => s.name === stage.name)
            );
            const templateStage = template?.stages.find(s => s.name === stage.name);
            return templateStage?.expectedScenario === analysis.scenario;
          });

          if (matchingStage) {
            matchingStage.fileIds.push(file.id);
          } else {
            // 如果没有精确匹配，按顺序分配
            const stageIndex = Math.min(index, updatedStages.length - 1);
            updatedStages[stageIndex].fileIds.push(file.id);
          }
        }
      });

      // 更新流程
      const updatedFlow = { ...flow, stages: updatedStages };
      const updatedFlows = flows.map(f => f.id === flow.id ? updatedFlow : f);
      onFlowsChange(updatedFlows);
      
      onSuccess('自动匹配完成');
    } catch (error) {
      onError('自动匹配失败');
    } finally {
      setAutoMatching(false);
    }
  };

  const handleDeleteFlow = (flowId: string) => {
    if (confirm('确定要删除这个营销流程吗？')) {
      const updatedFlows = flows.filter(f => f.id !== flowId);
      onFlowsChange(updatedFlows);
      
      if (selectedFlow?.id === flowId) {
        setSelectedFlow(null);
      }
      
      onSuccess('营销流程已删除');
    }
  };

  const getFileById = (fileId: string) => {
    return files.find(f => f.id === fileId);
  };

  const getAnalysisById = (fileId: string) => {
    return analyses.find(a => a.fileId === fileId);
  };

  const getScenarioEmoji = (scenario: string) => {
    const emojis = {
      preheating: '🔥',
      preview: '👀',
      launch: '🚀',
      'follow-up': '📞',
      unknown: '❓'
    };
    return emojis[scenario as keyof typeof emojis] || '❓';
  };

  const copyFlowToClipboard = (flow: MarketingFlow) => {
    const flowText = `营销流程: ${flow.name}\n\n${flow.stages.map((stage, index) => 
      `${index + 1}. ${stage.name}\n   ${stage.description}\n   文件数量: ${stage.fileIds.length}`
    ).join('\n\n')}`;
    
    navigator.clipboard.writeText(flowText);
    onSuccess('流程信息已复制到剪贴板');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 头部操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">营销流程模板</h3>
          <p className="text-gray-600 mt-1">创建和管理营销流程，自动匹配文件到各个阶段</p>
        </div>
        
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>创建流程</span>
        </button>
      </div>

      {/* 创建流程模态框 */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">创建营销流程</h3>
            
            <div className="space-y-4">
              {/* 流程名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">流程名称</label>
                <input
                  type="text"
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入营销流程名称"
                />
              </div>

              {/* 模板选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择模板</label>
                <div className="space-y-3">
                  {presetTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedTemplate?.id === template.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {template.stages.map((stage, index) => (
                              <React.Fragment key={stage.order}>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {stage.name}
                                </span>
                                {index < template.stages.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-gray-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewFlowName('');
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCreateFlow}
                disabled={!newFlowName.trim() || !selectedTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                创建流程
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 流程列表 */}
      {flows.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">已创建的流程 ({flows.length})</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedFlow?.id === flow.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Workflow className="w-5 h-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900">{flow.name}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{flow.stages.length} 个阶段</span>
                        <span>
                          {flow.stages.reduce((acc, stage) => acc + stage.fileIds.length, 0)} 个文件
                        </span>
                        <span>{new Date(flow.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAutoMatch(flow)}
                      disabled={autoMatching || files.length === 0}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-100 disabled:cursor-not-allowed"
                      title="自动匹配文件"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setSelectedFlow(selectedFlow?.id === flow.id ? null : flow)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="查看详情"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => copyFlowToClipboard(flow)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                      title="复制"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteFlow(flow.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 流程详情 */}
                {selectedFlow?.id === flow.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-3">流程阶段</h6>
                    
                    <div className="space-y-4">
                      {flow.stages.map((stage, index) => (
                        <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {stage.order}
                            </div>
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{stage.name}</h6>
                              <p className="text-sm text-gray-600">{stage.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {stage.fileIds.length} 个文件
                            </div>
                          </div>
                          
                          {/* 阶段文件 */}
                          {stage.fileIds.length > 0 && (
                            <div className="space-y-2">
                              {stage.fileIds.map((fileId) => {
                                const file = getFileById(fileId);
                                const analysis = getAnalysisById(fileId);
                                
                                if (!file) return null;
                                
                                return (
                                  <div key={fileId} className="flex items-center space-x-3 bg-white rounded p-3">
                                    <span className="text-lg">📄</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">{file.name}</div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        {analysis && (
                                          <>
                                            <span>{getScenarioEmoji(analysis.scenario)}</span>
                                            <span>{analysis.scenario}</span>
                                            <span>•</span>
                                          </>
                                        )}
                                        <span>{file.content.length} 字符</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {stage.fileIds.length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              暂无匹配文件
                            </div>
                          )}
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

      {/* 空状态 */}
      {flows.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">还没有创建任何营销流程</p>
          <p className="text-sm text-gray-400 mt-1">创建流程模板来组织你的营销对话</p>
        </div>
      )}

      {/* 自动匹配中状态 */}
      {autoMatching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">自动匹配中...</h3>
              <p className="text-gray-600">正在将文件匹配到相应的营销阶段</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingFlowTemplate;
