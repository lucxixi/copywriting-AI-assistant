import React from 'react';
import { User, Bot, Copy, Save, Star } from 'lucide-react';

interface DialogueLine {
  speaker: string;
  content: string;
  emotion?: string;
}

interface DialogueDisplayProps {
  dialogue: string;
  characters: Array<{ name: string; role: string; personality: string }>;
  onCopy?: () => void;
  onSaveAsTemplate?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const DialogueDisplay: React.FC<DialogueDisplayProps> = ({
  dialogue,
  characters,
  onCopy,
  onSaveAsTemplate,
  onFavorite,
  isFavorite = false
}) => {
  // 解析对话内容
  const parseDialogue = (text: string): DialogueLine[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const dialogueLines: DialogueLine[] = [];

    lines.forEach(line => {
      // 匹配格式：[角色名]：对话内容（情感描述）
      const match = line.match(/^\[?([^\]：]+)\]?[：:]\s*(.+)$/);
      if (match) {
        const speaker = match[1].trim();
        let content = match[2].trim();
        let emotion = '';

        // 提取情感描述
        const emotionMatch = content.match(/^(.+?)（(.+?)）$/);
        if (emotionMatch) {
          content = emotionMatch[1].trim();
          emotion = emotionMatch[2].trim();
        }

        dialogueLines.push({ speaker, content, emotion });
      }
    });

    return dialogueLines;
  };

  const dialogueLines = parseDialogue(dialogue);

  // 获取角色头像颜色
  const getAvatarColor = (speaker: string, index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  // 获取角色信息
  const getCharacterInfo = (speaker: string) => {
    return characters.find(char => 
      char.name === speaker || 
      char.name.includes(speaker) || 
      speaker.includes(char.name)
    );
  };

  if (!dialogue || dialogueLines.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Bot className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无对话内容</h3>
        <p className="text-gray-600">
          请完善产品信息、场景设置和角色配置，然后点击生成对话
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">对话故事</h3>
        <div className="flex items-center space-x-2">
          {onFavorite && (
            <button
              onClick={onFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={isFavorite ? '取消收藏' : '收藏'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>复制</span>
            </button>
          )}
          {onSaveAsTemplate && (
            <button
              onClick={onSaveAsTemplate}
              className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>保存模板</span>
            </button>
          )}
        </div>
      </div>

      {/* 对话内容 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {dialogueLines.map((line, index) => {
            const characterInfo = getCharacterInfo(line.speaker);
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  isEven ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                {/* 角色头像 */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(line.speaker, index)}`}>
                    {line.speaker.charAt(0)}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1 max-w-16 truncate">
                    {line.speaker}
                  </div>
                </div>

                {/* 对话气泡 */}
                <div className={`flex-1 max-w-xs ${isEven ? 'mr-8' : 'ml-8'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isEven
                        ? 'bg-blue-500 text-white rounded-bl-sm'
                        : 'bg-gray-100 text-gray-900 rounded-br-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{line.content}</p>
                    {line.emotion && (
                      <p className={`text-xs mt-1 ${
                        isEven ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        （{line.emotion}）
                      </p>
                    )}
                  </div>
                  
                  {/* 角色信息提示 */}
                  {characterInfo && (
                    <div className={`text-xs text-gray-500 mt-1 ${
                      isEven ? 'text-left' : 'text-right'
                    }`}>
                      {characterInfo.role} · {characterInfo.personality.substring(0, 20)}
                      {characterInfo.personality.length > 20 ? '...' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 统计信息 */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>共 {dialogueLines.length} 轮对话</span>
            <span>约 {dialogue.length} 字</span>
          </div>
        </div>
      </div>

      {/* 原始文本（可折叠） */}
      <details className="bg-gray-50 rounded-lg">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          查看原始文本
        </summary>
        <div className="px-4 pb-4">
          <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
            {dialogue}
          </pre>
        </div>
      </details>
    </div>
  );
};

export default DialogueDisplay;
