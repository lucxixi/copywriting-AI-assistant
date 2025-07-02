import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, ShoppingBag } from 'lucide-react';
import { ProductAnalysisResult } from '../types/prompts';
import { storageService } from '../services/storage';
import CharacterEditorSimple, { Character } from './shared/CharacterEditorSimple';

const DialogueGeneratorTest: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysisResult | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductAnalysisResult[]>([]);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);

  console.log('DialogueGeneratorTest rendering...', {
    selectedProduct,
    availableProducts: availableProducts.length,
    apiConfigured
  });

  useEffect(() => {
    loadAvailableProducts();
    checkApiConfiguration();
    initializeDefaultCharacters();
  }, []);

  const initializeDefaultCharacters = () => {
    const defaultCharacters: Character[] = [
      {
        id: 'char_1',
        name: '小李',
        role: 'customer',
        personality: '有明确痛点的用户，关注产品实用性',
        isPreset: true
      },
      {
        id: 'char_2',
        name: '小王',
        role: 'friend',
        personality: '关心朋友的人，乐于分享经验',
        isPreset: true
      }
    ];
    setCharacters(defaultCharacters);
  };

  const checkApiConfiguration = () => {
    const activeApi = storageService.getActiveApiConfig();
    setApiConfigured(!!activeApi);
  };

  const loadAvailableProducts = () => {
    const products = storageService.getProductAnalyses();
    setAvailableProducts(products);
  };
  
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 bg-gray-50">
      {/* Left Panel - Input */}
      <div className="lg:w-1/2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">对话创作测试</h3>
          <p className="text-gray-600">这是一个简化的测试版本，用于验证组件是否能正常渲染。</p>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">对话创作功能正在加载...</span>
            </div>
          </div>
        </div>

        {/* Character Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CharacterEditorSimple
            characters={characters}
            onCharactersChange={setCharacters}
            maxCharacters={5}
          />
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:w-1/2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">生成结果</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">配置参数后点击生成开始创作</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueGeneratorTest;
