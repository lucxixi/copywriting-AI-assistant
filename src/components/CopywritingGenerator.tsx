import React, { useState } from 'react';
import { 
  Wand2, 
  Settings, 
  Copy, 
  Download, 
  RefreshCw, 
  Star,
  MessageSquare,
  ShoppingBag,
  Users,
  Calendar,
  Headphones,
  ThumbsUp,
  Heart,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CopywritingGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState('product');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const copywritingTypes = [
    { id: 'welcome', label: '欢迎语文案', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'product', label: '产品推广', icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { id: 'social', label: '朋友圈分享', icon: Users, color: 'from-purple-500 to-indigo-500' },
    { id: 'activity', label: '活动营销', icon: Calendar, color: 'from-orange-500 to-red-500' },
    { id: 'interaction', label: '互动话题', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { id: 'service', label: '客服话术', icon: Headphones, color: 'from-teal-500 to-cyan-500' },
    { id: 'testimonial', label: '用户反馈', icon: ThumbsUp, color: 'from-amber-500 to-orange-500' },
    { id: 'lifestyle', label: '生活场景', icon: Star, color: 'from-violet-500 to-purple-500' },
  ];

  const writingStyles = [
    { id: 'professional', label: '专业正式', description: '商务场合，权威可信' },
    { id: 'friendly', label: '亲切温暖', description: '拉近距离，增加好感' },
    { id: 'humorous', label: '幽默风趣', description: '轻松活泼，增强记忆' },
    { id: 'urgent', label: '紧迫感', description: '营造稀缺，促进行动' },
  ];

  const sampleContent = {
    product: "🌟 【春季新品首发】限时特惠来袭！\n\n亲爱的朋友们，我们期待已久的春季新品终于上线啦！✨\n\n💫 核心亮点：\n• 采用进口优质材料，品质保证\n• 独家专利技术，效果显著\n• 48小时快速发货，贴心服务\n\n🎁 限时福利：\n前100名下单立享8折优惠\n满299免邮费\n购买即送精美礼品一份\n\n⏰ 活动截止：本周日24:00\n\n心动不如行动，数量有限，抢完即止！\n点击链接立即购买 👆",
    welcome: "🎉 欢迎加入我们的大家庭！\n\n很高兴认识你，我是你的专属顾问小张 😊\n\n在这里，你将获得：\n✅ 第一手产品资讯\n✅ 专业购买建议\n✅ 独家优惠活动\n✅ 贴心售后服务\n\n有任何问题随时@我，我会第一时间为你解答！\n\n让我们一起开启美好的购物之旅吧~ 💝",
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(sampleContent[selectedType as keyof typeof sampleContent] || sampleContent.product);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">智能文案生成</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">AI驱动的个性化文案创作工具</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">高级设置</span>
            {showAdvancedSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Copywriting Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">文案类型</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {copywritingTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className={`font-medium text-xs sm:text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'} leading-tight`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Writing Style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">文案风格</h3>
            <div className="space-y-2 sm:space-y-3">
              {writingStyles.map((style) => (
                <label key={style.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={selectedStyle === style.id}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{style.label}</div>
                    <div className="text-xs text-gray-500 leading-tight">{style.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters - Collapsible on mobile */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ${!showAdvancedSettings ? 'hidden sm:block' : ''}`}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">参数设置</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文案长度</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>短文案 (50-100字)</option>
                  <option>中等长度 (100-200字)</option>
                  <option>长文案 (200+字)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标用户</label>
                <input 
                  type="text" 
                  placeholder="例：25-35岁职场女性"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                <input 
                  type="text" 
                  placeholder="输入产品或服务名称"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>AI创作中...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>开始生成</span>
              </>
            )}
          </button>
        </div>

        {/* Generation Results */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Preview Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">生成结果</h3>
              {generatedContent && (
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">复制</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">导出</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="min-h-48 sm:min-h-64 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32 sm:h-40">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">AI正在为您精心创作...</p>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600">版本 1</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 sm:h-40">
                  <div className="text-center">
                    <Wand2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">选择文案类型和参数，点击生成开始创作</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">快速模板</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: '限时优惠模板', desc: '营造紧迫感，促进转化', usage: 234 },
                { title: '新品发布模板', desc: '突出产品亮点和价值', usage: 189 },
                { title: '用户好评模板', desc: '社会证明，建立信任', usage: 156 },
                { title: '活动邀请模板', desc: '增强参与感和期待感', usage: 142 },
              ].map((template, index) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{template.title}</h4>
                    <span className="text-xs text-gray-500">{template.usage}人使用</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{template.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingGenerator;