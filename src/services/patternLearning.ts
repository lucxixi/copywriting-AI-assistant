// 高级对话模式学习服务

export interface MicroPattern {
  id: string;
  type: 'linguistic' | 'temporal' | 'emotional' | 'structural';
  pattern: string;
  frequency: number;
  confidence: number;
  contexts: string[];
  examples: string[];
  effectiveness: number;
  metadata: {
    discovered: string;
    lastSeen: string;
    variations: string[];
  };
}

export interface CommunicationRhythm {
  averageSentenceLength: number;
  pauseFrequency: number;
  speechTempo: 'slow' | 'medium' | 'fast';
  rhythmPattern: number[]; // 句子长度序列
  variability: number; // 节奏变化程度
}

export interface EmotionalExpression {
  intensity: number; // 0-100
  expressionStyle: 'subtle' | 'moderate' | 'expressive';
  empathyLevel: number; // 0-100
  emotionalRange: string[];
  triggerPatterns: string[];
}

export interface LogicalStructure {
  preferredStructure: 'linear' | 'circular' | 'branching';
  argumentStyle: 'fact-based' | 'emotion-based' | 'mixed';
  transitionStyle: 'smooth' | 'abrupt' | 'gradual';
  conclusionPattern: string;
}

export interface InteractionPattern {
  initiationStyle: 'proactive' | 'reactive' | 'balanced';
  responseSpeed: 'immediate' | 'thoughtful' | 'delayed';
  topicGuidance: 'strong' | 'moderate' | 'weak';
  questionFrequency: number;
  confirmationSeeking: number;
}

export interface ContextualAdaptation {
  businessContext: AdaptationProfile;
  casualContext: AdaptationProfile;
  supportContext: AdaptationProfile;
  persuasionContext: AdaptationProfile;
}

export interface AdaptationProfile {
  formalityShift: number; // -100 to +100
  emotionalityShift: number;
  directnessShift: number;
  enthusiasmShift: number;
  vocabularyChanges: string[];
  structureChanges: string[];
  avoidedPatterns: string[];
}

export interface CommunicationProfile {
  id: string;
  name: string;
  baseCharacteristics: {
    formality: number;
    emotionality: number;
    directness: number;
    enthusiasm: number;
  };
  microPatterns: MicroPattern[];
  rhythm: CommunicationRhythm;
  emotionalExpression: EmotionalExpression;
  logicalStructure: LogicalStructure;
  interactionPattern: InteractionPattern;
  contextualAdaptation: ContextualAdaptation;
  learningMetrics: {
    totalConversations: number;
    patternAccuracy: number;
    adaptationSuccess: number;
    lastUpdated: string;
    confidenceScore: number;
  };
}

class PatternLearningService {
  private patterns: Map<string, MicroPattern> = new Map();
  private profiles: Map<string, CommunicationProfile> = new Map();
  private learningCallbacks: ((patterns: MicroPattern[]) => void)[] = [];
  private feedbackData: Map<string, { positive: number; negative: number; total: number }> = new Map();

  // 分析对话中的微观模式
  analyzeMicroPatterns(conversations: string[], speakerName: string): MicroPattern[] {
    const patterns: MicroPattern[] = [];

    // 分析开场模式
    const openingPatterns = this.extractOpeningPatterns(conversations);
    patterns.push(...openingPatterns);

    // 分析确认模式
    const confirmationPatterns = this.extractConfirmationPatterns(conversations);
    patterns.push(...confirmationPatterns);

    // 分析结束模式
    const closingPatterns = this.extractClosingPatterns(conversations);
    patterns.push(...closingPatterns);

    // 分析转折模式
    const transitionPatterns = this.extractTransitionPatterns(conversations);
    patterns.push(...transitionPatterns);

    // 分析强调模式
    const emphasisPatterns = this.extractEmphasisPatterns(conversations);
    patterns.push(...emphasisPatterns);

    return patterns;
  }

  // 提取开场模式
  private extractOpeningPatterns(conversations: string[]): MicroPattern[] {
    const openings = conversations
      .map(conv => conv.split(/[。！？.!?]/)[0])
      .filter(opening => opening.length > 0);

    const patterns = this.findCommonPatterns(openings, 'opening');
    return patterns.map(pattern => ({
      id: `opening_${Date.now()}_${Math.random()}`,
      type: 'linguistic' as const,
      pattern: pattern.text,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      contexts: ['conversation_start'],
      examples: pattern.examples,
      effectiveness: this.calculateEffectiveness(pattern),
      metadata: {
        discovered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        variations: pattern.variations
      }
    }));
  }

  // 提取确认模式
  private extractConfirmationPatterns(conversations: string[]): MicroPattern[] {
    const confirmationKeywords = ['对吧', '是吧', '对不对', '是这样吗', '你觉得呢', '怎么样'];
    const confirmations = conversations.filter(conv => 
      confirmationKeywords.some(keyword => conv.includes(keyword))
    );

    const patterns = this.findCommonPatterns(confirmations, 'confirmation');
    return patterns.map(pattern => ({
      id: `confirmation_${Date.now()}_${Math.random()}`,
      type: 'emotional' as const,
      pattern: pattern.text,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      contexts: ['seeking_agreement', 'validation'],
      examples: pattern.examples,
      effectiveness: this.calculateEffectiveness(pattern),
      metadata: {
        discovered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        variations: pattern.variations
      }
    }));
  }

  // 提取结束模式
  private extractClosingPatterns(conversations: string[]): MicroPattern[] {
    const closings = conversations
      .map(conv => {
        const sentences = conv.split(/[。！？.!?]/);
        return sentences[sentences.length - 1] || sentences[sentences.length - 2];
      })
      .filter(closing => closing && closing.length > 0);

    const patterns = this.findCommonPatterns(closings, 'closing');
    return patterns.map(pattern => ({
      id: `closing_${Date.now()}_${Math.random()}`,
      type: 'linguistic' as const,
      pattern: pattern.text,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      contexts: ['conversation_end'],
      examples: pattern.examples,
      effectiveness: this.calculateEffectiveness(pattern),
      metadata: {
        discovered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        variations: pattern.variations
      }
    }));
  }

  // 提取转折模式
  private extractTransitionPatterns(conversations: string[]): MicroPattern[] {
    const transitionKeywords = ['但是', '不过', '然而', '另外', '还有', '而且', '所以', '因此'];
    const transitions = conversations
      .flatMap(conv => conv.split(/[。！？.!?]/))
      .filter(sentence => 
        transitionKeywords.some(keyword => sentence.includes(keyword))
      );

    const patterns = this.findCommonPatterns(transitions, 'transition');
    return patterns.map(pattern => ({
      id: `transition_${Date.now()}_${Math.random()}`,
      type: 'structural' as const,
      pattern: pattern.text,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      contexts: ['topic_change', 'argument_flow'],
      examples: pattern.examples,
      effectiveness: this.calculateEffectiveness(pattern),
      metadata: {
        discovered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        variations: pattern.variations
      }
    }));
  }

  // 提取强调模式
  private extractEmphasisPatterns(conversations: string[]): MicroPattern[] {
    const emphasisKeywords = ['真的', '确实', '非常', '特别', '尤其', '绝对'];
    const emphasis = conversations
      .flatMap(conv => conv.split(/[。！？.!?]/))
      .filter(sentence => 
        emphasisKeywords.some(keyword => sentence.includes(keyword))
      );

    const patterns = this.findCommonPatterns(emphasis, 'emphasis');
    return patterns.map(pattern => ({
      id: `emphasis_${Date.now()}_${Math.random()}`,
      type: 'emotional' as const,
      pattern: pattern.text,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      contexts: ['persuasion', 'conviction'],
      examples: pattern.examples,
      effectiveness: this.calculateEffectiveness(pattern),
      metadata: {
        discovered: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        variations: pattern.variations
      }
    }));
  }

  // 查找常见模式
  private findCommonPatterns(texts: string[], type: string) {
    const patternMap = new Map<string, { count: number; examples: string[] }>();
    
    texts.forEach(text => {
      // 简化的模式识别 - 实际应用中可以使用更复杂的NLP技术
      const words = text.split(/\s+/);
      if (words.length >= 2) {
        const pattern = words.slice(0, 2).join(' ');
        if (!patternMap.has(pattern)) {
          patternMap.set(pattern, { count: 0, examples: [] });
        }
        const entry = patternMap.get(pattern)!;
        entry.count++;
        if (entry.examples.length < 3) {
          entry.examples.push(text);
        }
      }
    });

    return Array.from(patternMap.entries())
      .filter(([pattern, data]) => data.count >= 2) // 至少出现2次
      .map(([pattern, data]) => ({
        text: pattern,
        frequency: data.count / texts.length,
        confidence: Math.min(data.count / 5, 1), // 最多5次达到100%置信度
        examples: data.examples,
        variations: data.examples.map(ex => ex.substring(0, 20) + '...')
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5); // 取前5个最常见的模式
  }

  // 计算模式效果
  private calculateEffectiveness(pattern: any): number {
    // 简化的效果计算 - 基于频率和置信度
    return Math.min((pattern.frequency * 0.7 + pattern.confidence * 0.3) * 100, 100);
  }

  // 分析沟通节奏
  analyzeCommunicationRhythm(conversations: string[]): CommunicationRhythm {
    const sentences = conversations.flatMap(conv => 
      conv.split(/[。！？.!?]/).filter(s => s.trim().length > 0)
    );

    const lengths = sentences.map(s => s.length);
    const averageLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    // 计算节奏变化
    const variability = this.calculateVariability(lengths);
    
    return {
      averageSentenceLength: Math.round(averageLength),
      pauseFrequency: this.estimatePauseFrequency(conversations),
      speechTempo: this.classifyTempo(averageLength),
      rhythmPattern: lengths.slice(0, 10), // 前10个句子的长度模式
      variability
    };
  }

  private calculateVariability(lengths: number[]): number {
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - mean, 2), 0) / lengths.length;
    return Math.sqrt(variance) / mean; // 变异系数
  }

  private estimatePauseFrequency(conversations: string[]): number {
    // 简化的停顿频率估算 - 基于标点符号
    const totalPauses = conversations.reduce((count, conv) => {
      return count + (conv.match(/[，,、]/g) || []).length;
    }, 0);
    const totalSentences = conversations.reduce((count, conv) => {
      return count + (conv.match(/[。！？.!?]/g) || []).length;
    }, 0);
    
    return totalSentences > 0 ? totalPauses / totalSentences : 0;
  }

  private classifyTempo(averageLength: number): 'slow' | 'medium' | 'fast' {
    if (averageLength < 8) return 'fast';
    if (averageLength > 15) return 'slow';
    return 'medium';
  }

  // 保存学习到的模式
  savePattern(pattern: MicroPattern): void {
    this.patterns.set(pattern.id, pattern);
    // 这里可以添加持久化逻辑
  }

  // 保存沟通档案
  saveProfile(profile: CommunicationProfile): void {
    this.profiles.set(profile.id, profile);
    // 这里可以添加持久化逻辑
  }

  // 获取所有模式
  getAllPatterns(): MicroPattern[] {
    return Array.from(this.patterns.values());
  }

  // 获取所有档案
  getAllProfiles(): CommunicationProfile[] {
    return Array.from(this.profiles.values());
  }

  // 实时学习相关方法

  // 注册学习回调
  onPatternLearned(callback: (patterns: MicroPattern[]) => void): void {
    this.learningCallbacks.push(callback);
  }

  // 移除学习回调
  removePatternCallback(callback: (patterns: MicroPattern[]) => void): void {
    const index = this.learningCallbacks.indexOf(callback);
    if (index > -1) {
      this.learningCallbacks.splice(index, 1);
    }
  }

  // 触发学习回调
  private notifyPatternLearned(): void {
    const patterns = this.getAllPatterns();
    this.learningCallbacks.forEach(callback => callback(patterns));
  }

  // 增量学习新对话
  learnFromNewConversation(conversations: string[], speakerName: string): void {
    const newPatterns = this.analyzeMicroPatterns(conversations, speakerName);

    // 更新现有模式或添加新模式
    newPatterns.forEach(pattern => {
      const existingPattern = this.findSimilarPattern(pattern);
      if (existingPattern) {
        this.updatePatternFrequency(existingPattern, pattern);
      } else {
        this.savePattern(pattern);
      }
    });

    this.notifyPatternLearned();
  }

  // 查找相似模式
  private findSimilarPattern(newPattern: MicroPattern): MicroPattern | null {
    for (const pattern of this.patterns.values()) {
      if (pattern.type === newPattern.type &&
          this.calculateSimilarity(pattern.pattern, newPattern.pattern) > 0.8) {
        return pattern;
      }
    }
    return null;
  }

  // 计算文本相似度
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  // 更新模式频率
  private updatePatternFrequency(existingPattern: MicroPattern, newPattern: MicroPattern): void {
    existingPattern.frequency = (existingPattern.frequency + newPattern.frequency) / 2;
    existingPattern.confidence = Math.min(existingPattern.confidence + 0.1, 1.0);
    existingPattern.examples = [...new Set([...existingPattern.examples, ...newPattern.examples])].slice(0, 5);
    existingPattern.metadata.lastSeen = new Date().toISOString();
  }

  // 用户反馈学习
  recordUserFeedback(patternId: string, isPositive: boolean): void {
    if (!this.feedbackData.has(patternId)) {
      this.feedbackData.set(patternId, { positive: 0, negative: 0, total: 0 });
    }

    const feedback = this.feedbackData.get(patternId)!;
    if (isPositive) {
      feedback.positive++;
    } else {
      feedback.negative++;
    }
    feedback.total++;

    // 更新模式的有效性分数
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      pattern.effectiveness = (feedback.positive / feedback.total) * 100;

      // 如果负面反馈过多，降低置信度
      if (feedback.negative / feedback.total > 0.6) {
        pattern.confidence = Math.max(pattern.confidence - 0.2, 0.1);
      }
    }
  }

  // 自适应学习 - 根据使用情况调整模式
  adaptPatternsBasedOnUsage(): void {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.patterns.forEach((pattern, id) => {
      const lastSeen = new Date(pattern.metadata.lastSeen);

      // 如果模式很久没有使用，降低其重要性
      if (lastSeen < oneWeekAgo) {
        pattern.confidence = Math.max(pattern.confidence - 0.05, 0.1);
      }

      // 如果模式经常被使用且反馈良好，提高其重要性
      const feedback = this.feedbackData.get(id);
      if (feedback && feedback.total > 5 && feedback.positive / feedback.total > 0.8) {
        pattern.confidence = Math.min(pattern.confidence + 0.1, 1.0);
        pattern.effectiveness = Math.min(pattern.effectiveness + 5, 100);
      }
    });
  }

  // 获取最有效的模式
  getMostEffectivePatterns(limit: number = 10): MicroPattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => (b.effectiveness * b.confidence) - (a.effectiveness * a.confidence))
      .slice(0, limit);
  }

  // 获取最近学习的模式
  getRecentPatterns(days: number = 7): MicroPattern[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return Array.from(this.patterns.values())
      .filter(pattern => new Date(pattern.metadata.discovered) > cutoffDate)
      .sort((a, b) => new Date(b.metadata.discovered).getTime() - new Date(a.metadata.discovered).getTime());
  }

  // 清理低质量模式
  cleanupLowQualityPatterns(): void {
    const patternsToRemove: string[] = [];

    this.patterns.forEach((pattern, id) => {
      // 移除置信度过低的模式
      if (pattern.confidence < 0.2) {
        patternsToRemove.push(id);
      }

      // 移除效果很差的模式
      const feedback = this.feedbackData.get(id);
      if (feedback && feedback.total > 10 && feedback.positive / feedback.total < 0.3) {
        patternsToRemove.push(id);
      }
    });

    patternsToRemove.forEach(id => {
      this.patterns.delete(id);
      this.feedbackData.delete(id);
    });

    if (patternsToRemove.length > 0) {
      this.notifyPatternLearned();
    }
  }

  // 导出学习数据
  exportLearningData(): any {
    return {
      patterns: Array.from(this.patterns.entries()),
      profiles: Array.from(this.profiles.entries()),
      feedback: Array.from(this.feedbackData.entries()),
      exportDate: new Date().toISOString()
    };
  }

  // 导入学习数据
  importLearningData(data: any): void {
    if (data.patterns) {
      this.patterns = new Map(data.patterns);
    }
    if (data.profiles) {
      this.profiles = new Map(data.profiles);
    }
    if (data.feedback) {
      this.feedbackData = new Map(data.feedback);
    }
    this.notifyPatternLearned();
  }
}

export const patternLearningService = new PatternLearningService();
