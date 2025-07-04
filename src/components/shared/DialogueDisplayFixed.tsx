import React, { useState } from 'react';

interface DialogueDisplayProps {
  content: string;
}

const DialogueDisplayFixed: React.FC<DialogueDisplayProps> = ({ content }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `对话_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseDialogue = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const dialogueLines: Array<{ speaker: string; content: string; type: 'dialogue' | 'description' }> = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 检查是否是对话格式 (角色名: 内容)
      const dialogueMatch = trimmedLine.match(/^([^:：]+)[：:](.+)$/);
      if (dialogueMatch) {
        const [, speaker, content] = dialogueMatch;
        dialogueLines.push({
          speaker: speaker.trim(),
          content: content.trim(),
          type: 'dialogue'
        });
      } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
        // 场景描述
        dialogueLines.push({
          speaker: '',
          content: trimmedLine,
          type: 'description'
        });
      } else if (trimmedLine.length > 0) {
        // 其他内容作为描述
        dialogueLines.push({
          speaker: '',
          content: trimmedLine,
          type: 'description'
        });
      }
    }
    
    return dialogueLines;
  };

  const dialogueLines = parseDialogue(content);

  const getSpeakerIcon = (speaker: string) => {
    const lowerSpeaker = speaker.toLowerCase();
    if (lowerSpeaker.includes('客户') || lowerSpeaker.includes('用户') || lowerSpeaker.includes('买家')) {
      return '🛒';
    } else if (lowerSpeaker.includes('销售') || lowerSpeaker.includes('客服') || lowerSpeaker.includes('卖家')) {
      return '👨‍💼';
    } else if (lowerSpeaker.includes('朋友') || lowerSpeaker.includes('好友')) {
      return '👥';
    } else {
      return '💬';
    }
  };

  const getSpeakerColor = (speaker: string) => {
    const lowerSpeaker = speaker.toLowerCase();
    if (lowerSpeaker.includes('客户') || lowerSpeaker.includes('用户') || lowerSpeaker.includes('买家')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerSpeaker.includes('销售') || lowerSpeaker.includes('客服') || lowerSpeaker.includes('卖家')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerSpeaker.includes('朋友') || lowerSpeaker.includes('好友')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* 操作按钮 */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="复制对话"
        >
          <span>{copySuccess ? '✅' : '📋'}</span>
          <span>{copySuccess ? '已复制' : '复制'}</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="下载对话"
        >
          <span>💾</span>
          <span>下载</span>
        </button>
      </div>

      {/* 对话内容 */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {dialogueLines.map((line, index) => (
            <div key={index}>
              {line.type === 'dialogue' ? (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getSpeakerIcon(line.speaker)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSpeakerColor(line.speaker)}`}>
                        {line.speaker}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-gray-800">{line.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 italic">{line.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 原始文本 */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          📄 查看原始文本
        </summary>
        <div className="mt-2 p-3 bg-gray-100 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{content}</pre>
        </div>
      </details>
    </div>
  );
};

export default DialogueDisplayFixed;
