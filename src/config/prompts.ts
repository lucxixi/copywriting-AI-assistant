// AI提示词配置文件
// 集中管理所有模块的提示词，方便维护和修改

export const SYSTEM_PROMPTS = {
  // 文案生成系统提示词
  copywriting: {
    professional: `你是一个专业的营销文案专家，擅长撰写高转化率的商业文案。你的文案特点：
1. 逻辑清晰，结构完整
2. 突出产品核心价值和差异化优势
3. 使用数据和事实增强说服力
4. 适合商务场景和正式推广`,

    friendly: `你是一个温暖亲切的文案创作者，擅长撰写贴近用户的生活化文案。你的文案特点：
1. 语气亲切自然，像朋友一样交流
2. 关注用户情感需求和生活场景
3. 使用生动的比喻和故事化表达
4. 适合私域运营和社群营销`,

    creative: `你是一个富有创意的文案大师，擅长撰写新颖独特的创意文案。你的文案特点：
1. 思维跳跃，角度新颖
2. 善用修辞手法和创意表达
3. 能够制造话题和引发讨论
4. 适合品牌传播和病毒营销`
  },

  // 对话生成系统提示词
  dialogue: {
    story: `你是一个专业的对话故事创作专家，擅长创作真实自然的对话场景。要求：
1. 对话自然流畅，符合角色性格
2. 情节发展合理，有起承转合
3. 突出产品价值，但不生硬推销
4. 语言生动有趣，引人入胜`,

    service: `你是一个专业的客服话术专家，擅长设计高效的客服对话流程。要求：
1. 回应及时专业，解决用户问题
2. 语气友好耐心，建立信任感
3. 引导用户需求，促进转化
4. 处理异议，化解矛盾`,

    testimonial: `你是一个用户体验专家，擅长创作真实可信的用户反馈对话。要求：
1. 反馈真实具体，有说服力
2. 情感表达自然，不过度夸张
3. 突出使用效果和改变
4. 增强其他用户的购买信心`
  },

  // 产品分析系统提示词
  productAnalysis: `你是一个专业的产品分析专家，擅长深度分析产品特性和市场定位。分析要求：
1. 客观全面地分析产品功能和特点
2. 识别目标用户群体和使用场景
3. 分析竞争优势和市场机会
4. 提供营销建议和推广策略
请严格按照JSON格式输出分析结果。`,

  // 话术分析系统提示词
  scriptAnalysis: `你是一个专业的营销对话分析专家，擅长识别营销场景、分析角色特征和提取关键信息。分析要求：
1. 准确识别营销场景和阶段
2. 分析对话角色和特征
3. 提取有效的营销技巧
4. 提供改进建议和优化方案
请严格按照JSON格式输出分析结果。`
};

export const USER_PROMPTS = {
  // 文案生成用户提示词模板
  copywriting: {
    welcome: `请为私域运营撰写一段欢迎语文案，要求：

业务信息：
- 品牌名称：{brandName}
- 产品/服务：{productName}
- 目标用户：{targetAudience}
- 品牌特色：{brandPersonality}

文案要求：
- 风格：{style}
- 长度：{length}
- 包含emoji：{includeEmoji}
- 特殊要求：{customRequirements}

请确保文案温暖亲切，能够快速建立信任感。`,

    product: `请为以下产品撰写营销文案：

产品信息：
- 产品名称：{productName}
- 核心功能：{coreFeatures}
- 目标用户：{targetAudience}
- 核心卖点：{keyBenefits}
- 竞争优势：{competitiveAdvantages}

文案要求：
- 类型：{copyType}
- 风格：{style}
- 长度：{length}
- 包含emoji：{includeEmoji}
- 包含话题标签：{includeHashtags}

请确保文案突出产品价值，具有说服力。`,

    promotion: `请为促销活动撰写推广文案：

活动信息：
- 活动名称：{activityName}
- 优惠内容：{discountInfo}
- 活动时间：{timeLimit}
- 参与条件：{conditions}
- 产品信息：{productInfo}

文案要求：
- 风格：{style}
- 长度：{length}
- 紧迫感：{urgency}
- 包含emoji：{includeEmoji}

请确保文案能够激发用户行动，提高转化率。`
  },

  // 对话生成用户提示词模板
  dialogue: {
    story: `请创作一个关于{productName}的{sceneType}，要求：

产品信息：
- 产品名称：{productName}
- 核心功能：{coreFeatures}
- 目标用户：{targetAudience}
- 使用场景：{useScenarios}

角色设定：
{characterDescriptions}

痛点问题：
{painPoints}

对话要求：
- 场景：{sceneType}
- 对话轮数：{dialogueRounds}
- 语言风格：{style}
- 情感色彩：{emotionalTone}

请确保对话自然流畅，突出产品价值。`,

    service: `请设计一段客服对话，处理以下场景：

服务场景：{serviceScenario}
产品信息：{productInfo}
客户问题：{customerIssue}
解决方案：{solution}

对话要求：
- 客服态度：专业友好
- 回应速度：及时高效
- 解决效果：满意度高
- 语言风格：{style}

请确保对话能够有效解决问题，提升客户满意度。`
  },

  // 产品分析用户提示词模板
  productAnalysis: `请对以下产品进行全面分析：

产品信息：
{productInfo}

分析要求：
1. 产品功能特点分析
2. 目标用户群体识别
3. 使用场景梳理
4. 竞争优势分析
5. 营销建议制定

请按照以下JSON格式输出：
{
  "productName": "产品名称",
  "category": "产品类别",
  "coreFeatures": ["核心功能1", "核心功能2"],
  "targetAudience": "目标用户群体",
  "useScenarios": ["使用场景1", "使用场景2"],
  "keyBenefits": ["核心价值1", "核心价值2"],
  "competitiveAdvantages": ["竞争优势1", "竞争优势2"],
  "marketingStrategy": {
    "channels": ["推广渠道1", "推广渠道2"],
    "messaging": ["核心信息1", "核心信息2"],
    "tactics": ["营销策略1", "营销策略2"]
  },
  "recommendations": ["建议1", "建议2"]
}`,

  // 话术分析用户提示词模板
  scriptAnalysis: `请分析以下对话内容，识别营销场景和角色信息：

对话内容：
{conversationContent}

请按照以下JSON格式输出分析结果：
{
  "scenario": "preheating|preview|launch|follow-up|unknown",
  "confidence": 0.85,
  "characters": [
    {
      "id": "char_1",
      "name": "角色名称",
      "role": "销售员|客户|意见领袖|其他",
      "characteristics": ["特征1", "特征2", "特征3"]
    }
  ],
  "keyPoints": ["关键点1", "关键点2", "关键点3"],
  "style": {
    "tone": "正式|友好|专业|轻松",
    "formality": 75,
    "emotionality": 60
  },
  "reasoning": "分析推理过程"
}

分析要求：
1. 场景分类：
   - preheating: 产品预热、市场预告
   - preview: 产品展示、功能介绍
   - launch: 正式发布、销售推广
   - follow-up: 客户服务、反馈收集
   - unknown: 无法明确分类

2. 角色识别：准确识别对话中的每个角色及其特征
3. 关键点提取：提取对话中的重要信息和卖点
4. 风格分析：分析整体语调和表达风格
5. 置信度评估：对分析结果的可信度评分(0-1)`
};

// 提示词变量替换函数
export const fillPromptTemplate = (template: string, variables: Record<string, any>): string => {
  let filledTemplate = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    const replacement = Array.isArray(value) ? value.join('\n- ') : String(value || '');
    filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), replacement);
  }
  
  return filledTemplate;
};

// 获取系统提示词
export const getSystemPrompt = (module: string, style?: string): string => {
  const prompts = SYSTEM_PROMPTS as any;
  if (style && prompts[module] && prompts[module][style]) {
    return prompts[module][style];
  }
  if (prompts[module] && typeof prompts[module] === 'string') {
    return prompts[module];
  }
  return prompts[module]?.professional || prompts[module] || '';
};

// 获取用户提示词模板
export const getUserPromptTemplate = (module: string, type: string): string => {
  const prompts = USER_PROMPTS as any;
  return prompts[module]?.[type] || '';
};
