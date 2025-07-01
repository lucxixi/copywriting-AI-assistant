// 提示词模板系统

import { PromptTemplate, CopywritingType, WritingStyle, GenerationParams, BusinessContext, ProductInfo, DialogueStory, DialogueCharacter, DialogueLine, DialogueScene, DialogueRole } from '../types/prompts';
import { storageService } from './storage';

class PromptService {
  private builtInTemplates: PromptTemplate[] = [
    {
      id: 'welcome-friendly',
      name: '欢迎语-亲切温暖',
      type: 'welcome',
      style: 'friendly',
      systemPrompt: `你是一个专业的私域运营文案专家，擅长撰写温暖亲切的欢迎语文案。你的文案特点：
1. 语气亲切自然，像朋友一样交流
2. 突出用户价值和专属服务
3. 建立信任感和期待感
4. 适合私域社群和个人微信使用`,
      userPromptTemplate: `请为私域运营撰写一段欢迎语文案，要求：

业务信息：
- 品牌名称：{brandName}
- 产品/服务：{productName}
- 目标用户：{targetAudience}
- 品牌特色：{brandPersonality}

文案要求：
- 风格：亲切温暖，拉近距离
- 长度：{length}
- 包含emoji：{includeEmoji}
- 特殊要求：{customRequirements}

请生成一段专业的欢迎语文案，体现品牌温度和专业服务。`,
      variables: [
        { name: 'brandName', label: '品牌名称', type: 'text', required: true, placeholder: '请输入品牌名称' },
        { name: 'productName', label: '产品/服务', type: 'text', required: true, placeholder: '请输入主要产品或服务' },
        { name: 'targetAudience', label: '目标用户', type: 'text', required: false, placeholder: '如：年轻妈妈、上班族等' },
        { name: 'brandPersonality', label: '品牌特色', type: 'textarea', required: false, placeholder: '品牌的独特优势和特色' }
      ],
      examples: [
        '🎉 欢迎加入我们的大家庭！很高兴认识你，我是你的专属顾问小张 😊 在这里，你将获得第一手产品资讯、专业购买建议、独家优惠活动和贴心售后服务。有任何问题随时@我，让我们一起开启美好的购物之旅吧~ 💝'
      ],
      tags: ['欢迎语', '亲切', '私域'],
      isBuiltIn: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'product-professional',
      name: '产品推广-专业正式',
      type: 'product',
      style: 'professional',
      systemPrompt: `你是一个专业的产品营销文案专家，擅长撰写具有说服力的产品推广文案。你的文案特点：
1. 突出产品核心价值和差异化优势
2. 用数据和事实说话，增强可信度
3. 结合用户痛点，提供解决方案
4. 包含明确的行动号召`,
      userPromptTemplate: `请为以下产品撰写专业的推广文案：

产品信息：
- 产品名称：{productName}
- 产品描述：{productDescription}
- 核心卖点：{keyBenefits}
- 竞争优势：{competitiveAdvantages}
- 价格信息：{priceRange}

目标用户：{targetAudience}

促销信息：
- 活动类型：{promotionType}
- 优惠力度：{discount}
- 活动截止：{deadline}

文案要求：
- 风格：专业正式，权威可信
- 长度：{length}
- 包含emoji：{includeEmoji}
- 特殊要求：{customRequirements}

请生成一段有说服力的产品推广文案。`,
      variables: [
        { name: 'productName', label: '产品名称', type: 'text', required: true },
        { name: 'productDescription', label: '产品描述', type: 'textarea', required: true },
        { name: 'keyBenefits', label: '核心卖点', type: 'textarea', required: true, placeholder: '请列出3-5个核心卖点' },
        { name: 'targetAudience', label: '目标用户', type: 'text', required: true }
      ],
      examples: [],
      tags: ['产品推广', '专业', '营销'],
      isBuiltIn: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  constructor() {
    this.initializeBuiltInTemplates();
  }

  private initializeBuiltInTemplates(): void {
    const existingTemplates = storageService.getPromptTemplates();
    const builtInIds = existingTemplates.filter(t => t.isBuiltIn).map(t => t.id);
    
    // 添加新的内置模板
    this.builtInTemplates.forEach(template => {
      if (!builtInIds.includes(template.id)) {
        storageService.savePromptTemplate(template);
      }
    });
  }

  getTemplatesByType(type: CopywritingType): PromptTemplate[] {
    return storageService.getPromptTemplates().filter(t => t.type === type);
  }

  getTemplatesByStyle(style: WritingStyle): PromptTemplate[] {
    return storageService.getPromptTemplates().filter(t => t.style === style);
  }

  getTemplate(id: string): PromptTemplate | null {
    const templates = storageService.getPromptTemplates();
    return templates.find(t => t.id === id) || null;
  }

  generatePrompt(params: GenerationParams, businessContext?: BusinessContext): string {
    const { type, style, targetAudience, productInfo, keyPoints, length, includeEmoji, customRequirements } = params;
    
    let basePrompt = '';
    
    switch (type) {
      case 'welcome':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的欢迎语文案`;
        break;
      case 'product':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的产品推广文案`;
        break;
      case 'social':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的朋友圈分享文案`;
        break;
      case 'activity':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的活动营销文案`;
        break;
      case 'interaction':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的互动话题文案`;
        break;
      case 'service':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的客服话术`;
        break;
      case 'testimonial':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的用户反馈文案`;
        break;
      case 'lifestyle':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的生活场景文案`;
        break;
      case 'promotion':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的促销文案`;
        break;
      case 'education':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的教育内容文案`;
        break;
      case 'dialogue':
        basePrompt = `请生成一段${this.getStyleDescription(style)}的对话故事`;
        break;
      case 'product-analysis':
        basePrompt = `请进行产品分析并生成营销文案`;
        break;
      default:
        basePrompt = `请生成一段${this.getStyleDescription(style)}的文案`;
    }

    let prompt = basePrompt;

    if (businessContext?.brandName) {
      prompt += `\n品牌名称：${businessContext.brandName}`;
    }

    if (businessContext?.productName) {
      prompt += `\n产品名称：${businessContext.productName}`;
    }

    if (businessContext?.productDescription) {
      prompt += `\n产品描述：${businessContext.productDescription}`;
    }

    if (targetAudience) {
      prompt += `\n目标受众：${targetAudience}`;
    } else if (businessContext?.targetAudience) {
      prompt += `\n目标受众：${businessContext.targetAudience}`;
    }

    if (productInfo) {
      prompt += `\n产品信息：${productInfo}`;
    }

    if (keyPoints && keyPoints.length > 0) {
      prompt += `\n关键卖点：${keyPoints.join('、')}`;
    }

    if (businessContext?.keyBenefits && businessContext.keyBenefits.length > 0) {
      prompt += `\n核心优势：${businessContext.keyBenefits.join('、')}`;
    }

    if (businessContext?.promotionInfo) {
      const { type, discount, deadline, conditions } = businessContext.promotionInfo;
      prompt += `\n促销信息：${type}，${discount}，截止时间：${deadline}`;
      if (conditions) {
        prompt += `，条件：${conditions}`;
      }
    }

    if (length) {
      prompt += `\n文案长度：${this.getLengthDescription(length)}`;
    }

    if (includeEmoji) {
      prompt += `\n要求：适当使用表情符号增加亲和力`;
    }

    if (customRequirements) {
      prompt += `\n特殊要求：${customRequirements}`;
    }

    return prompt;
  }

  private findBestTemplate(type: CopywritingType, style: WritingStyle): PromptTemplate | null {
    const templates = storageService.getPromptTemplates();
    
    // 优先匹配类型和风格都相同的模板
    let template = templates.find(t => t.type === type && t.style === style);
    
    // 如果没有完全匹配的，优先匹配类型
    if (!template) {
      template = templates.find(t => t.type === type);
    }
    
    return template || null;
  }

  private fillTemplate(template: PromptTemplate, params: GenerationParams, context: BusinessContext): string {
    let prompt = template.userPromptTemplate;
    
    // 替换业务上下文变量
    const allContext = { ...context, ...params };
    
    // 处理特殊变量
    const specialVars = {
      length: this.getLengthDescription(params.length),
      includeEmoji: params.includeEmoji ? '是' : '否',
      includeHashtags: params.includeHashtags ? '是' : '否',
      keyBenefits: Array.isArray(context.keyBenefits) ? context.keyBenefits.join('\n- ') : context.keyBenefits || '',
      competitiveAdvantages: Array.isArray(context.competitiveAdvantages) ? context.competitiveAdvantages.join('\n- ') : context.competitiveAdvantages || ''
    };

    // 替换所有变量
    Object.entries({ ...allContext, ...specialVars }).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      prompt = prompt.replace(regex, String(value || ''));
    });

    return prompt;
  }

  private getLengthDescription(length?: string): string {
    switch (length) {
      case 'short':
        return '简短精炼（50-100字）';
      case 'medium':
        return '适中长度（100-200字）';
      case 'long':
        return '详细完整（200-500字）';
      default:
        return '适中长度';
    }
  }

  private getStyleDescription(style: WritingStyle): string {
    switch (style) {
      case 'professional':
        return '专业正式';
      case 'friendly':
        return '亲切温暖';
      case 'humorous':
        return '幽默风趣';
      case 'urgent':
        return '紧迫感';
      case 'emotional':
        return '情感化';
      case 'casual':
        return '轻松随意';
      default:
        return '专业正式';
    }
  }

  private generateFallbackPrompt(params: GenerationParams, context: BusinessContext): string {
    const typeDescriptions = {
      welcome: '欢迎语文案',
      product: '产品推广文案',
      social: '朋友圈分享文案',
      activity: '活动营销文案',
      interaction: '互动话题文案',
      service: '客服话术',
      testimonial: '用户反馈文案',
      lifestyle: '生活场景文案',
      promotion: '促销文案',
      education: '教育内容文案'
    };

    const styleDescriptions = {
      professional: '专业正式',
      friendly: '亲切温暖',
      humorous: '幽默风趣',
      urgent: '紧迫感',
      emotional: '情感化',
      casual: '轻松随意'
    };

    return `请为私域运营撰写一段${typeDescriptions[params.type]}，要求：

风格：${styleDescriptions[params.style]}
目标用户：${params.targetAudience || '通用用户'}
产品信息：${params.productInfo || context.productName || ''}
关键要点：${params.keyPoints?.join('、') || ''}
长度要求：${this.getLengthDescription(params.length)}
包含emoji：${params.includeEmoji ? '是' : '否'}
特殊要求：${params.customRequirements || '无'}

请生成专业、有吸引力的文案内容。`;
  }

  // 对话话术分析提示词
  generateScriptAnalysisPrompt(scripts: string[]): string {
    return `请分析以下对话话术，判断每句话是推广者、客户还是托说的话，并提取有效的营销技巧：

对话内容：
${scripts.map((script, index) => `${index + 1}. ${script}`).join('\n')}

请按以下格式分析：
1. 角色判断：对每句话标注角色（推广者/客户/托）
2. 可信度：给出判断的可信度（0-1）
3. 有效技巧：提取对话中的有效营销技巧
4. 总结：统计各角色数量，总结常见主题

注意：
- 推广者：主动推销产品，强调优势
- 客户：表达需求、疑虑或购买意愿
- 托：看似客户但实际在帮推广者说话`;
  }

  // 产品分析提示词
  generateProductAnalysisPrompt(productInfo: string, imageText?: string): string {
    let prompt = `请分析以下产品信息，生成详细的产品文案：

产品信息：${productInfo}`;

    if (imageText) {
      prompt += `\n\n从产品图片中提取的文字信息：${imageText}`;
    }

    prompt += `\n\n请按以下格式分析：
1. 产品基本信息：
   - 产品名称
   - 产品类型（日用品/食品/保健品/美妆/电子/服装/其他）
   - 目标用户群体
   - 价格区间（如能判断）

2. 产品功能特点：
   - 列出明确提到的功能特点
   - 注意：只列出明确提到的功能，不要虚构

3. 用户痛点分析：
   - 基于产品类型分析目标用户可能遇到的问题
   - 产品如何解决这些问题

4. 营销文案：
   - 生成吸引人的产品推广文案
   - 突出产品优势，但不要夸大功能

5. 关键卖点：
   - 提炼3-5个核心卖点

请确保所有信息都基于提供的内容，不要添加未提及的功能或功效。`;
    
    return prompt;
  }

  // 对话故事生成提示词
  generateDialogueStoryPrompt(
    product: ProductInfo, 
    painPoints: string[], 
    scene: DialogueScene,
    characters: DialogueRole[]
  ): string {
    const sceneConfigs = {
      story: '故事创作',
      service: '客服话术',
      testimonial: '用户反馈',
      lifestyle: '生活场景',
      interaction: '互动话题'
    };

    const characterDescriptions = characters.map(char => 
      `${char.name}（${char.role === 'customer' ? '客户' : 
                      char.role === 'friend' ? '朋友' : 
                      char.role === 'family' ? '家人' : 
                      char.role === 'colleague' ? '同事' : 
                      char.role === 'service' ? '客服' :
                      char.role === 'user' ? '用户' : '专家'}）：${char.personality}`
    ).join('、');

    return `请创作一个关于${product.name}的${sceneConfigs[scene]}，要求：

产品信息：
- 产品名称：${product.name}
- 产品描述：${product.description}
- 目标用户：${product.targetAudience}
- 主要功能：${product.features.join('、')}
- 产品优势：${product.benefits.join('、')}

用户痛点：${painPoints.join('、')}

对话角色：${characterDescriptions}

场景要求：
${scene === 'story' ? '创作一个有情节的对话故事，突出产品如何解决用户痛点，包含冲突和解决方案。' :
  scene === 'service' ? '客服与客户的对话场景，客服需要专业地解答客户问题，展示产品价值。' :
  scene === 'testimonial' ? '用户向朋友分享使用体验的对话，突出产品优势和实际效果。' :
  scene === 'lifestyle' ? '日常生活中的产品使用场景，体现产品在生活中的实际价值。' :
  '社交媒体互动对话，吸引用户参与讨论，增加产品曝光。'}

请按照以下格式输出对话内容：
角色1：对话内容（情感状态）
角色2：对话内容（情感状态）
...

要求：
1. 对话自然流畅，符合各角色的性格特点
2. 突出产品解决痛点的能力，但不要虚构功能
3. 情感真实，有共鸣感
4. 对话长度适中，包含3-5轮对话
5. 每个角色都要有发言机会`;
  }
}

export const promptService = new PromptService();
