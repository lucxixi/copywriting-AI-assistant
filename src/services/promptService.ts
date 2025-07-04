// 简化的提示词服务
// 替换原有的复杂prompts.ts文件

import { getSystemPrompt, getUserPromptTemplate, fillPromptTemplate } from '../config/prompts';

interface PromptRequest {
  module: string;
  type: string;
  style?: string;
  variables: Record<string, any>;
}

interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
}

class PromptService {
  // 生成完整的提示词
  generatePrompt(request: PromptRequest): PromptResult {
    const systemPrompt = getSystemPrompt(request.module, request.style);
    const userPromptTemplate = getUserPromptTemplate(request.module, request.type);
    const userPrompt = fillPromptTemplate(userPromptTemplate, request.variables);

    return {
      systemPrompt,
      userPrompt
    };
  }

  // 文案生成提示词
  generateCopywritingPrompt(variables: {
    copyType: string;
    style: string;
    productName: string;
    coreFeatures: string;
    targetAudience: string;
    keyBenefits: string;
    competitiveAdvantages?: string;
    length: string;
    includeEmoji: boolean;
    includeHashtags?: boolean;
    customRequirements?: string;
  }): PromptResult {
    return this.generatePrompt({
      module: 'copywriting',
      type: variables.copyType,
      style: variables.style,
      variables
    });
  }

  // 对话生成提示词
  generateDialoguePrompt(variables: {
    sceneType: string;
    productName: string;
    coreFeatures: string;
    targetAudience: string;
    useScenarios: string;
    characterDescriptions: string;
    painPoints: string;
    dialogueRounds: number;
    style: string;
    emotionalTone: string;
  }): PromptResult {
    return this.generatePrompt({
      module: 'dialogue',
      type: variables.sceneType,
      variables
    });
  }

  // 产品分析提示词
  generateProductAnalysisPrompt(productInfo: string): PromptResult {
    return this.generatePrompt({
      module: 'productAnalysis',
      type: 'analysis',
      variables: { productInfo }
    });
  }

  // 话术分析提示词
  generateScriptAnalysisPrompt(conversationContent: string): PromptResult {
    return this.generatePrompt({
      module: 'scriptAnalysis',
      type: 'analysis',
      variables: { conversationContent }
    });
  }

  // 获取长度描述
  private getLengthDescription(length: string): string {
    const lengthMap: Record<string, string> = {
      short: '简短（50-100字）',
      medium: '中等（100-300字）',
      long: '详细（300-500字）',
      'extra-long': '超长（500字以上）'
    };
    return lengthMap[length] || '中等长度';
  }

  // 格式化角色描述
  formatCharacterDescriptions(characters: any[]): string {
    return characters.map(char => 
      `${char.name}（${this.getRoleDisplayName(char.role)}）：${char.personality}`
    ).join('\n');
  }

  // 获取角色显示名称
  private getRoleDisplayName(role: string): string {
    const roleMap: Record<string, string> = {
      customer: '客户',
      friend: '朋友',
      family: '家人',
      colleague: '同事',
      service: '客服',
      user: '用户',
      expert: '专家',
      salesperson: '销售员'
    };
    return roleMap[role] || role;
  }

  // 格式化痛点列表
  formatPainPoints(painPoints: any[]): string {
    return painPoints.map(point => 
      `- ${point.title}: ${point.description}`
    ).join('\n');
  }

  // 验证提示词变量
  validatePromptVariables(module: string, type: string, variables: Record<string, any>): {
    valid: boolean;
    missingFields: string[];
  } {
    const requiredFields = this.getRequiredFields(module, type);
    const missingFields = requiredFields.filter(field => !variables[field]);

    return {
      valid: missingFields.length === 0,
      missingFields
    };
  }

  // 获取必需字段
  private getRequiredFields(module: string, type: string): string[] {
    const fieldMap: Record<string, Record<string, string[]>> = {
      copywriting: {
        product: ['productName', 'coreFeatures', 'targetAudience', 'keyBenefits'],
        welcome: ['brandName', 'productName', 'targetAudience'],
        promotion: ['activityName', 'discountInfo', 'productInfo']
      },
      dialogue: {
        story: ['productName', 'coreFeatures', 'characterDescriptions'],
        service: ['serviceScenario', 'productInfo', 'customerIssue']
      },
      productAnalysis: {
        analysis: ['productInfo']
      },
      scriptAnalysis: {
        analysis: ['conversationContent']
      }
    };

    return fieldMap[module]?.[type] || [];
  }
}

export const promptService = new PromptService();
