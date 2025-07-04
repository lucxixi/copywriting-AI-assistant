import React, { useState, useEffect } from 'react';
import {
  Download,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  Brain,
  Sparkles,
  Copy
} from 'lucide-react';
import { ScenarioAnalysis, ConversationFile } from '../../types/prompts';
import { storageService } from '../../services/storage';

interface LearnedCharacter {
  id: string;
  name: string;
  role: string;
  characteristics: string[];
  style: {
    tone: string;
    formality: number;
    emotionality: number;
  };
  sourceFile: string;
  scenario: string;
}

interface StyleImporterProps {
  onCharacterImport: (character: any) => void;
  onStyleApply: (style: any) => void;
  onClose: () => void;
}

const StyleImporter: React.FC<StyleImporterProps> = ({
  onCharacterImport,
  onStyleApply,
  onClose
}) => {
  const [learnedCharacters, setLearnedCharacters] = useState<LearnedCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<LearnedCharacter | null>(null);
  const [importMode, setImportMode] = useState<'character' | 'style'>('character');

  useEffect(() => {
    loadLearnedCharacters();
  }, []);

  const loadLearnedCharacters = () => {
    const analyses = storageService.getScenarioAnalyses();
    const files = storageService.getConversationFiles();
    
    const characters: LearnedCharacter[] = [];
    
    analyses.forEach(analysis => {
      const sourceFile = files.find(f => f.id === analysis.fileId);
      
      analysis.characters.forEach(character => {
        characters.push({
          id: `${analysis.id}_${character.id}`,
          name: character.name,
          role: character.role,
          characteristics: character.characteristics,
          style: analysis.style,
          sourceFile: sourceFile?.name || '未知文件',
          scenario: analysis.scenario
        });
      });
    });
    
    setLearnedCharacters(characters);
  };

  const handleImportCharacter = () => {
    if (!selectedCharacter) return;
    
    // 转换为对话创作组件需要的格式
    const characterData = {
      name: selectedCharacter.name,
      role: selectedCharacter.role,
      personality: selectedCharacter.characteristics.join(', '),
      speakingStyle: {
        tone: selectedCharacter.style.tone,
        formality: selectedCharacter.style.formality,
        emotionality: selectedCharacter.style.emotionality
      },
      background: `从${selectedCharacter.sourceFile}中学习的${selectedCharacter.scenario}场景角色`,
      goals: ['保持风格一致性', '有效传达信息'],
      constraints: ['遵循学习到的表达习惯']
    };
    
    onCharacterImport(characterData);
    onClose();
  };

  const handleApplyStyle = () => {
    if (!selectedCharacter) return;
    
    const styleData = {
      tone: selectedCharacter.style.tone,
      formality: selectedCharacter.style.formality,
      emotionality: selectedCharacter.style.emotionality,
      characteristics: selectedCharacter.characteristics,
      source: `${selectedCharacter.sourceFile} - ${selectedCharacter.scenario}场景`
    };
    
    onStyleApply(styleData);
    onClose();
  };

  const getScenarioLabel = (scenario: string) => {
    const labels = {
      preheating: { name: '预热阶段', emoji: '🔥', color: 'blue' },
      preview: { name: '预览阶段', emoji: '👀', color: 'purple' },
      launch: { name: '正式发布', emoji: '🚀', color: 'green' },
      'follow-up': { name: '后续跟进', emoji: '📞', color: 'orange' },
      unknown: { name: '未知场景', emoji: '❓', color: 'gray' }
    };
    return labels[scenario as keyof typeof labels] || labels.unknown;
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      '销售员': '💼',
      '客户': '👤',
      '意见领袖': '⭐',
      '客服': '🎧',
      '推广者': '📢',
      '支持者': '👍'
    };
    return icons[role as keyof typeof icons] || '👤';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>导入学习风格</span>
              </h3>
              <p className="text-gray-600 mt-1">从已分析的对话中导入角色风格和表达特征</p>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {/* 导入模式选择 */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setImportMode('character')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                importMode === 'character'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>导入角色</span>
            </button>
            
            <button
              onClick={() => setImportMode('style')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                importMode === 'style'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>应用风格</span>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex h-96">
          {/* 左侧角色列表 */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                学习到的角色 ({learnedCharacters.length})
              </h4>
              
              {learnedCharacters.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">暂无学习到的角色</p>
                  <p className="text-gray-400 text-xs mt-1">请先在话术分析中上传并分析文件</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {learnedCharacters.map((character) => {
                    const scenario = getScenarioLabel(character.scenario);
                    const isSelected = selectedCharacter?.id === character.id;
                    
                    return (
                      <div
                        key={character.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                        onClick={() => setSelectedCharacter(character)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getRoleIcon(character.role)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{character.name}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {character.role}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs">{scenario.emoji}</span>
                              <span className="text-xs text-gray-500">{scenario.name}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 truncate">{character.sourceFile}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 右侧详情 */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-4">
              {selectedCharacter ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">角色详情</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getRoleIcon(selectedCharacter.role)}</span>
                        <span className="font-medium">{selectedCharacter.name}</span>
                        <span className="text-sm text-gray-500">({selectedCharacter.role})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        来源: {selectedCharacter.sourceFile}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">风格特征</h5>
                    <div className="space-y-2">
                      <div className="bg-blue-50 rounded p-2">
                        <div className="text-sm font-medium text-blue-900">语调</div>
                        <div className="text-sm text-blue-700">{selectedCharacter.style.tone}</div>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <div className="text-sm font-medium text-green-900">正式程度</div>
                        <div className="text-sm text-green-700">{selectedCharacter.style.formality}%</div>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-sm font-medium text-purple-900">情感程度</div>
                        <div className="text-sm text-purple-700">{selectedCharacter.style.emotionality}%</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">角色特征</h5>
                    <div className="space-y-1">
                      {selectedCharacter.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Target className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-700">{characteristic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 预览效果 */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      {importMode === 'character' ? '导入效果' : '应用效果'}
                    </h5>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-sm text-yellow-800">
                        {importMode === 'character' ? (
                          <>
                            将创建一个名为 <strong>{selectedCharacter.name}</strong> 的角色，
                            具有 <strong>{selectedCharacter.style.tone}</strong> 的语调风格，
                            正式程度 <strong>{selectedCharacter.style.formality}%</strong>，
                            情感程度 <strong>{selectedCharacter.style.emotionality}%</strong>
                          </>
                        ) : (
                          <>
                            将应用 <strong>{selectedCharacter.name}</strong> 的表达风格，
                            包括语调、正式程度和情感特征，用于指导对话生成
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">请选择一个角色查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {importMode === 'character' ? '导入角色到对话创作' : '应用风格到对话生成'}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                取消
              </button>
              
              <button
                onClick={importMode === 'character' ? handleImportCharacter : handleApplyStyle}
                disabled={!selectedCharacter}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                <Download className="w-4 h-4" />
                <span>{importMode === 'character' ? '导入角色' : '应用风格'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleImporter;
