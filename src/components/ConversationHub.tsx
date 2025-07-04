import React, { useState } from 'react';
import {
  MessageSquare,
  BarChart3,
  BookOpen,
  Sparkles
} from 'lucide-react';
import DialogueWeChatSimulator from './DialogueWeChatSimulator';
import ScriptAnalysisSimple from './ScriptAnalysisSimple';

type TabType = 'dialogue' | 'script';

interface TabConfig {
  id: TabType;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const ConversationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dialogue');

  const tabs: TabConfig[] = [
    {
      id: 'dialogue',
      name: '创作',
      icon: MessageSquare,
      description: '微信群聊对话生成，模拟真实私域运营场景',
      color: 'blue'
    },
    {
      id: 'script',
      name: '分析',
      icon: BarChart3,
      description: '分析营销对话中的角色定位和有效技巧',
      color: 'purple'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dialogue':
        return <DialogueWeChatSimulator />;
      case 'script':
        return <ScriptAnalysisSimple />;
      default:
        return <DialogueWeChatSimulator />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">对话创作中心</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">微信群聊对话生成，分析营销话术，突出产品价值</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? `bg-white text-${tab.color}-600 shadow-sm`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.slice(0, 2)}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Description */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <p className="text-sm text-purple-700">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ConversationHub;
