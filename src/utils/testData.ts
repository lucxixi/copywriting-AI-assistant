import { ProductAnalysisResult } from '../types/prompts';
import { storageService } from '../services/storage';

// 创建测试产品数据
export const createTestProductData = () => {
  const testProducts: ProductAnalysisResult[] = [
    {
      id: 'test_product_1',
      product: {
        name: '智能保温杯',
        category: 'daily',
        description: '一款具有温度显示和保温功能的智能水杯，可以通过手机APP控制温度',
        features: ['智能温控', '温度显示', 'APP控制', '304不锈钢', '12小时保温'],
        benefits: ['随时喝到适温水', '健康饮水提醒', '时尚外观设计', '安全材质'],
        targetAudience: '上班族、学生、健康意识人群',
        priceRange: '199-299元'
      },
      painPoints: [
        '担心价格偏高，性价比不够',
        '不确定智能功能是否实用',
        '担心电池续航能力',
        '怀疑保温效果是否真的好'
      ],
      marketingCopy: '智能保温，温度可见，让每一口水都是最适合的温度',
      keySellingPoints: [
        '精准温控技术，误差±1°C',
        '12小时超长保温',
        '食品级304不锈钢',
        '智能提醒，养成健康饮水习惯',
        '时尚外观，商务办公首选'
      ]
    },
    {
      id: 'test_product_2',
      product: {
        name: '蓝牙降噪耳机',
        category: 'electronics',
        description: '专业级主动降噪蓝牙耳机，支持高清音质和长续航',
        features: ['主动降噪', '蓝牙5.0', '30小时续航', '快充技术', 'Hi-Fi音质'],
        benefits: ['沉浸式音乐体验', '通话清晰', '佩戴舒适', '续航持久'],
        targetAudience: '音乐爱好者、通勤族、学生',
        priceRange: '399-599元'
      },
      painPoints: [
        '担心降噪效果不如宣传',
        '怀疑音质是否真的好',
        '担心佩戴不舒适',
        '价格相比普通耳机偏高'
      ],
      marketingCopy: '静享音乐，降噪黑科技让世界安静下来',
      keySellingPoints: [
        '40dB深度降噪，隔绝外界干扰',
        'Hi-Fi级音质，还原真实声音',
        '人体工学设计，长时间佩戴不累',
        '30小时超长续航，一周一充',
        '快充15分钟，播放3小时'
      ]
    },
    {
      id: 'test_product_3',
      product: {
        name: '有机护肤面膜',
        category: 'beauty',
        description: '采用天然有机成分的补水保湿面膜，温和不刺激',
        features: ['有机成分', '深层补水', '温和配方', '无添加', '植物精华'],
        benefits: ['肌肤水润有光泽', '改善干燥粗糙', '温和不过敏', '天然安全'],
        targetAudience: '25-40岁女性、护肤爱好者、敏感肌人群',
        priceRange: '89-129元'
      },
      painPoints: [
        '担心效果不明显',
        '怀疑是否真的纯天然',
        '价格比普通面膜贵',
        '不确定是否适合自己肌肤'
      ],
      marketingCopy: '天然有机，给肌肤最温柔的呵护',
      keySellingPoints: [
        '100%有机认证成分',
        '7天见效，肌肤水润透亮',
        '敏感肌可用，温和不刺激',
        '无防腐剂、无香精添加',
        '植物精华深层滋养'
      ]
    }
  ];

  // 保存测试数据到本地存储
  testProducts.forEach(product => {
    storageService.saveProductAnalysis(product);
  });

  console.log('测试产品数据已创建并保存');
  return testProducts;
};

// 检查是否需要创建测试数据
export const initializeTestData = () => {
  const existingProducts = storageService.getProductAnalyses();
  
  if (existingProducts.length === 0) {
    console.log('未找到产品数据，创建测试数据...');
    return createTestProductData();
  } else {
    console.log(`已存在 ${existingProducts.length} 个产品数据`);
    return existingProducts;
  }
};
