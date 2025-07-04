import React, { useState } from 'react';
import { useDialogue } from '../hooks/useDialogue';
import { useProducts } from '../hooks/useProducts';
import { ProductAnalysisResult } from '../types/product';
import { settingsManager } from '../services/settingsManager';
import { Copy } from 'lucide-react';

const DialogueWeChatSimulator: React.FC = () => {
  const { products } = useProducts();
  const { generateDialogue, isGenerating } = useDialogue();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [rounds, setRounds] = useState<number>(8);
  const [result, setResult] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct: ProductAnalysisResult | null = products.find(p => p.id === selectedProductId) || null;

  const handleGenerate = async () => {
    setError(null);
    setResult('');
    if (!selectedProduct) {
      setError('请选择产品');
      return;
    }
    try {
      const dialogue = await generateDialogue(
        selectedProduct,
        '',
        {
          id: 'scene_wechat',
          name: '微信群聊',
          type: 'interaction',
          description: '微信群聊日常购物/护肤/健康等分享场景',
          characters: [],
          scenario: '',
          promptTemplate: '',
          isCustom: true
        },
        { length: getLengthType(rounds), style: 'casual', tone: 'friendly', includeEmotions: true, customRequirements: '模拟真实微信群聊氛围，穿插表情包' }
      );
      setResult(dialogue);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setCopySuccess(false);
    }
  };

  // 关键词替换预览
  const keywordReplacements = settingsManager.loadSettings().contentFilterSettings?.keywordReplacements || [];
  const replacedResult = keywordReplacements.reduce((text: string, { original, replacement }: { original: string; replacement: string }) => {
    if (original) {
      const reg = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      return text.replace(reg, replacement);
    }
    return text;
  }, result);

  // 对话轮数与 length 映射
  const getLengthType = (rounds: number): 'short' | 'medium' | 'long' => {
    if (rounds <= 6) return 'short';
    if (rounds <= 12) return 'medium';
    return 'long';
  };

  // 示例对话
  const exampleDialogue = `**小美**：大家好呀，最近有没有什么好用的护肤新品推荐？[微笑]

**阿强**：我前两天刚入手了「水光焕颜精华」，用完皮肤真的很水润！

**小美**：真的吗？敏感肌能用吗？

**阿强**：可以的，我也是敏感肌，用着很温和，没有刺痛感。

**小李**：我也在用，感觉毛孔都细腻了不少[赞]

**小美**：心动了！哪里买比较划算呀？

**阿强**：我是在小程序上买的，最近有活动，买一送一[红包]

**小美**：太棒了，链接发我一下呗～

**阿强**：好的，稍等，我这就发[链接]`;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* 左侧参数区 */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div>
          <label className="block font-bold mb-2">选择产品</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
          >
            <option value="">请选择产品</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.product.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-2">对话轮数</label>
          <input
            type="number"
            min={4}
            max={30}
            value={rounds}
            onChange={e => setRounds(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : '生成微信群聊对话'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>

      {/* 右侧结果区 */}
      <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">微信群聊对话预览</h2>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="复制对话"
            disabled={!result}
          >
            <Copy className="w-4 h-4" />
            <span>{copySuccess ? '已复制' : '复制'}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4" style={{ maxHeight: 320, overflowY: 'auto' }}>
          {replacedResult ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-800" style={{ fontFamily: 'inherit' }}>{replacedResult}</pre>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-400" style={{ fontFamily: 'inherit' }}>{exampleDialogue}</pre>
          )}
        </div>
        {keywordReplacements.length > 0 && result && (
          <div className="mt-4 text-xs text-gray-500">
            <span className="font-bold text-blue-600">已应用关键词替换：</span>
            {keywordReplacements.map((k: { id: string; original: string; replacement: string }) => (
              <span key={k.id} className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-1 mx-1">{k.original} → {k.replacement}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueWeChatSimulator; 