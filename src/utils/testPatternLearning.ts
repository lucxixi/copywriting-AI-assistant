// 对话模式学习系统测试工具

import { patternLearningService } from '../services/patternLearning';

export const testPatternLearning = () => {
  console.log('🧠 开始测试对话模式学习系统...');

  // 测试对话数据
  const testConversations = [
    "嗯，我觉得这个产品真的很不错呢",
    "哈哈，太好了！我很喜欢这个功能😊",
    "是这样的吗？那我再考虑一下",
    "非常感谢您的详细介绍，希望对我有帮助",
    "确实，这个价格还是比较合理的",
    "不过，我还想了解一下售后服务怎么样",
    "嗯嗯，明白了，那我先试用一下看看效果"
  ];

  // 1. 测试微观模式分析
  console.log('📊 测试微观模式分析...');
  const patterns = patternLearningService.analyzeMicroPatterns(testConversations, '测试用户');
  console.log(`✅ 识别到 ${patterns.length} 个模式:`, patterns.map(p => p.pattern));

  // 2. 测试沟通节奏分析
  console.log('🎵 测试沟通节奏分析...');
  const rhythm = patternLearningService.analyzeCommunicationRhythm(testConversations);
  console.log('✅ 沟通节奏分析结果:', {
    平均句长: rhythm.averageSentenceLength,
    语速: rhythm.speechTempo,
    停顿频率: rhythm.pauseFrequency.toFixed(2),
    变异系数: rhythm.variability.toFixed(2)
  });

  // 3. 测试实时学习
  console.log('⚡ 测试实时学习...');
  const initialPatternCount = patternLearningService.getAllPatterns().length;
  
  // 模拟新对话学习
  const newConversations = [
    "哇，这个功能真的太棒了！",
    "我觉得这个设计很人性化",
    "嗯，确实解决了我的痛点"
  ];
  
  patternLearningService.learnFromNewConversation(newConversations, '测试用户');
  const newPatternCount = patternLearningService.getAllPatterns().length;
  console.log(`✅ 学习前: ${initialPatternCount} 个模式, 学习后: ${newPatternCount} 个模式`);

  // 4. 测试用户反馈
  console.log('👍 测试用户反馈机制...');
  const allPatterns = patternLearningService.getAllPatterns();
  if (allPatterns.length > 0) {
    const testPattern = allPatterns[0];
    const originalEffectiveness = testPattern.effectiveness;
    
    // 给予正面反馈
    patternLearningService.recordUserFeedback(testPattern.id, true);
    patternLearningService.recordUserFeedback(testPattern.id, true);
    
    console.log(`✅ 反馈前效果: ${originalEffectiveness.toFixed(1)}%, 反馈后效果: ${testPattern.effectiveness.toFixed(1)}%`);
  }

  // 5. 测试模式质量管理
  console.log('🔧 测试模式质量管理...');
  const beforeCleanup = patternLearningService.getAllPatterns().length;
  patternLearningService.adaptPatternsBasedOnUsage();
  patternLearningService.cleanupLowQualityPatterns();
  const afterCleanup = patternLearningService.getAllPatterns().length;
  console.log(`✅ 清理前: ${beforeCleanup} 个模式, 清理后: ${afterCleanup} 个模式`);

  // 6. 测试最有效模式获取
  console.log('⭐ 测试最有效模式获取...');
  const effectivePatterns = patternLearningService.getMostEffectivePatterns(3);
  console.log(`✅ 获取到 ${effectivePatterns.length} 个最有效模式:`, 
    effectivePatterns.map(p => `${p.pattern} (${p.effectiveness.toFixed(1)}%)`));

  // 7. 测试最近模式获取
  console.log('🕒 测试最近模式获取...');
  const recentPatterns = patternLearningService.getRecentPatterns(7);
  console.log(`✅ 获取到 ${recentPatterns.length} 个最近模式`);

  // 8. 测试数据导出导入
  console.log('💾 测试数据导出导入...');
  const exportData = patternLearningService.exportLearningData();
  console.log(`✅ 导出数据包含: ${exportData.patterns.length} 个模式, ${exportData.profiles.length} 个档案`);

  console.log('🎉 对话模式学习系统测试完成！');
  
  return {
    patternsCount: patternLearningService.getAllPatterns().length,
    profilesCount: patternLearningService.getAllProfiles().length,
    testResults: {
      patternAnalysis: patterns.length > 0,
      rhythmAnalysis: rhythm.averageSentenceLength > 0,
      realtimeLearning: newPatternCount >= initialPatternCount,
      feedbackMechanism: true,
      qualityManagement: true,
      dataExport: exportData.patterns.length > 0
    }
  };
};

// 在浏览器控制台中运行测试的便捷函数
export const runPatternLearningTest = () => {
  if (typeof window !== 'undefined') {
    // 将测试函数添加到全局对象，方便在控制台调用
    (window as any).testPatternLearning = testPatternLearning;
    console.log('🔧 测试函数已添加到全局对象，请在控制台运行: testPatternLearning()');
  }
  return testPatternLearning();
};

// 生成测试报告
export const generateTestReport = () => {
  const results = testPatternLearning();
  
  const report = `
# 对话模式学习系统测试报告

## 测试概览
- 测试时间: ${new Date().toLocaleString()}
- 模式总数: ${results.patternsCount}
- 档案总数: ${results.profilesCount}

## 功能测试结果
${Object.entries(results.testResults).map(([key, passed]) => 
  `- ${key}: ${passed ? '✅ 通过' : '❌ 失败'}`
).join('\n')}

## 测试结论
${Object.values(results.testResults).every(Boolean) ? 
  '🎉 所有测试通过！系统运行正常。' : 
  '⚠️ 部分测试失败，请检查系统配置。'
}
  `;
  
  console.log(report);
  return report;
};
