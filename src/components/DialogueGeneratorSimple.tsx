import React, { useState } from 'react';
import { MessageSquare, Wand2 } from 'lucide-react';

const DialogueGeneratorSimple: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [dialogueStory, setDialogueStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setDialogueStory(`
基于产品信息：${productInfo || '示例产品'}

生成的对话故事：

客户：我最近在找这类产品，你们的有什么特色吗？

销售：我们的产品确实有几个独特的优势。首先，它的质量非常可靠，我们有严格的质量控制体系。

客户：听起来不错，价格怎么样？

销售：价格方面我们很有竞争力，而且现在还有优惠活动。最重要的是，我们提供完善的售后服务。

客户：那我考虑一下。

销售：没问题，如果您有任何问题，随时可以联系我。我可以给您留个联系方式。
      `);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">对话创作</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：配置区域 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品信息
                  </label>
                  <textarea
                    value={productInfo}
                    onChange={(e) => setProductInfo(e.target.value)}
                    placeholder="请输入产品的基本信息、特点、优势等..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">生成设置</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">对话风格</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="natural">自然对话</option>
                      <option value="professional">专业销售</option>
                      <option value="casual">轻松随意</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">对话长度</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="short">简短（3-5轮）</option>
                      <option value="medium">中等（6-10轮）</option>
                      <option value="long">较长（10+轮）</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">语调风格</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="friendly">友好亲切</option>
                      <option value="professional">专业严谨</option>
                      <option value="enthusiastic">热情积极</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>生成对话</span>
                    </>
                  )}
                </button>
              </div>

              {/* 右侧：结果显示 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生成的对话内容
                </label>
                <div className="h-96 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
                  {dialogueStory ? (
                    <div className="whitespace-pre-wrap text-sm text-gray-800">
                      {dialogueStory}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      点击"生成对话"按钮开始创作...
                    </div>
                  )}
                </div>
                
                {dialogueStory && (
                  <div className="mt-4 flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      保存对话
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                      复制内容
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                      保存为模板
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 使用提示</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 详细描述产品信息可以生成更准确的对话内容</li>
              <li>• 可以根据不同场景调整对话风格和语调</li>
              <li>• 生成的对话可以保存为模板，方便后续使用</li>
              <li>• 支持对生成的内容进行编辑和优化</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueGeneratorSimple;
