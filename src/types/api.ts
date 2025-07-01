// API配置相关类型定义

export interface ApiConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'custom' | 'gemini';
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface GenerationHistory {
  id: string;
  type: string;
  style: string;
  prompt: string;
  result: string;
  apiConfig: string;
  createdAt: string;
  parameters: Record<string, any>;
}

// API提供商预设配置
export const API_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-3.5-turbo'
  },
  claude: {
    name: 'Claude (Anthropic)',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultModel: 'claude-3-sonnet'
  },
  custom: {
    name: '自定义API',
    baseUrl: '',
    models: [],
    defaultModel: ''
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-pro'],
    defaultModel: 'gemini-2.5-flash'
  }
} as const;
