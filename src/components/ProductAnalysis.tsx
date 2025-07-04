import React, { useState } from 'react';
import { ProductAnalysisResult } from '../types/prompts';

const ProductAnalysis: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('图片大小不能超过10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件');
        return;
      }

      setUploadedImage(file);
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!productInfo.trim() && !uploadedImage) {
      setError('请输入产品信息或上传产品图片');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: ProductAnalysisResult = {
        id: `analysis_${Date.now()}`,
        product: {
          name: productInfo.split('\n')[0] || '智能产品',
          category: 'other',
          description: productInfo || '智能便捷的生活用品',
          features: ['智能操作', '便捷使用', '时尚设计'],
          benefits: ['提升效率', '节省时间', '改善体验'],
          targetAudience: '年轻消费者',
          imageUrl: imagePreview,
        },
        painPoints: [
          '传统产品功能单一',
          '操作复杂，学习成本高',
          '价格昂贵，性价比低',
          '设计老旧，缺乏美感'
        ],
        keySellingPoints: [
          '智能便捷，操作简单',
          '高性价比，物超所值',
          '时尚设计，颜值在线',
          '品质保证，售后无忧'
        ],
        marketingCopy: '告别繁琐操作，拥抱智能生活！我们的产品不仅功能强大，更有着超高的性价比。简约时尚的设计，让你的生活更加精彩。现在购买，享受限时优惠！'
      };

      setAnalysisResult(mockResult);
    } catch {
      setError('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    if (analysisResult) {
      try {
        const copyText = `📊 产品分析结果

🏷️ 产品信息：
• 产品名称：${analysisResult.product.name}
• 产品类型：${analysisResult.product.category}
• 目标用户：${analysisResult.product.targetAudience}

💡 核心卖点：
${analysisResult.keySellingPoints.map(point => `• ${point}`).join('\n')}

😰 用户痛点：
${analysisResult.painPoints.map(point => `• ${point}`).join('\n')}

📝 营销文案：
${analysisResult.marketingCopy}`;

        await navigator.clipboard.writeText(copyText);
        const button = document.getElementById('copy-button');
        if (button) {
          const originalText = button.textContent;
          button.textContent = '已复制！';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      } catch {
        setError('复制失败，请手动复制');
      }
    }
  };

  const handleSave = () => {
    if (analysisResult) {
      const savedProducts = JSON.parse(localStorage.getItem('productAnalyses') || '[]');
      savedProducts.push(analysisResult);
      localStorage.setItem('productAnalyses', JSON.stringify(savedProducts));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setProductInfo('');
    setUploadedImage(null);
    setImagePreview('');
    setAnalysisResult(null);
    setError('');
    setSaveSuccess(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          🔍 产品分析
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          上传产品图片，AI智能分析产品特点和营销策略
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 左侧：输入区域 */}
        <div>
          <div style={{ 
            background: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
              📝 产品信息
            </h2>
            
            {/* 产品描述输入 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                产品描述 <span style={{ color: '#999' }}>(可选)</span>
              </label>
              <textarea
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                placeholder="请描述您的产品特点、功能、目标用户等信息..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'none',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 图片上传 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                产品图片 <span style={{ color: '#999' }}>(可选)</span>
              </label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                position: 'relative'
              }}>
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setImagePreview('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      删除图片
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📷</div>
                    <p style={{ color: '#666', margin: '0 0 8px 0' }}>点击上传产品图片</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>支持 JPG、PNG 格式，最大 10MB</p>
                  </div>
                )}
                {!imagePreview && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!productInfo.trim() && !uploadedImage)}
                style={{
                  flex: 1,
                  background: isAnalyzing || (!productInfo.trim() && !uploadedImage) ? '#d1d5db' : '#2563eb',
                  color: 'white',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isAnalyzing || (!productInfo.trim() && !uploadedImage) ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {isAnalyzing ? '🔄 分析中...' : '🚀 开始分析'}
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#374151',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 重置
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>❌ {error}</p>
              </div>
            )}

            {/* 成功提示 */}
            {saveSuccess && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px'
              }}>
                <p style={{ color: '#16a34a', fontSize: '14px', margin: 0 }}>✅ 分析结果已保存到产品管理</p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：结果区域 */}
        <div>
          <div style={{ 
            background: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>📊 分析结果</h2>
              {analysisResult && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    id="copy-button"
                    onClick={handleCopy}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📋 复制结果
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      background: saveSuccess ? '#f0fdf4' : '#faf5ff',
                      color: saveSuccess ? '#16a34a' : '#9333ea',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {saveSuccess ? '✅ 已保存' : '💾 保存到产品管理'}
                  </button>
                </div>
              )}
            </div>

            {analysisResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 产品信息 */}
                <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#1e40af', margin: '0 0 12px 0' }}>🏷️ 产品信息</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    <div><strong>产品名称：</strong>{analysisResult.product.name}</div>
                    <div><strong>目标用户：</strong>{analysisResult.product.targetAudience}</div>
                    <div><strong>产品描述：</strong>{analysisResult.product.description}</div>
                  </div>
                </div>

                {/* 核心卖点 */}
                <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#166534', margin: '0 0 12px 0' }}>💡 核心卖点</h3>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '14px' }}>
                    {analysisResult.keySellingPoints.map((point, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* 用户痛点 */}
                <div style={{ background: '#fffbeb', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#92400e', margin: '0 0 12px 0' }}>😰 用户痛点</h3>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '14px' }}>
                    {analysisResult.painPoints.map((point, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* 营销文案 */}
                <div style={{ background: '#faf5ff', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#6b21a8', margin: '0 0 12px 0' }}>📝 营销文案</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, color: '#374151' }}>
                    {analysisResult.marketingCopy}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                <p style={{ margin: '0 0 8px 0' }}>请输入产品信息或上传图片开始分析</p>
                <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>AI将为您生成详细的产品分析报告</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalysis;
