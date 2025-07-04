// API配置文件
// 集中管理所有API相关的配置和常量

// 内置API密钥（仅用于测试，生产环境应该由用户配置）
export const BUILTIN_API_KEYS = {
  gemini: 'AIzaSyBlFLArgo9GmeniLt7NeNou8RfkcfXD5ow'
};

// API提供商配置
export const API_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      'gpt-4o',
      'gpt-4o-mini', 
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo'
    ],
    defaultModel: 'gpt-4o-mini',
    maxTokens: 4000,
    temperature: 0.7
  },
  
  claude: {
    name: 'Claude (Anthropic)',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ],
    defaultModel: 'claude-3-5-sonnet-20241022',
    maxTokens: 4000,
    temperature: 0.7
  },
  
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ],
    defaultModel: 'gemini-1.5-flash',
    maxTokens: 2000,
    temperature: 0.7
  },
  
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3.1-8b-instruct:free'
    ],
    defaultModel: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 4000,
    temperature: 0.7
  },
  
  together: {
    name: 'Together.ai',
    baseUrl: 'https://api.together.xyz/v1',
    models: [
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'mistralai/Mixtral-8x7B-Instruct-v0.1'
    ],
    defaultModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    maxTokens: 4000,
    temperature: 0.7
  },
  
  siliconflow: {
    name: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    models: [
      'deepseek-ai/DeepSeek-V2.5',
      'Qwen/Qwen2.5-7B-Instruct',
      'meta-llama/Meta-Llama-3.1-8B-Instruct'
    ],
    defaultModel: 'Qwen/Qwen2.5-7B-Instruct',
    maxTokens: 4000,
    temperature: 0.7
  }
};

// API请求配置
export const API_CONFIG = {
  // 请求超时时间（毫秒）
  timeout: 30000,
  
  // 重试配置
  retry: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2
  },
  
  // 速率限制
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerMinute: 100000
  },
  
  // 默认参数
  defaults: {
    maxTokens: 2000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0
  }
};

// 错误消息映射
export const API_ERROR_MESSAGES = {
  // 通用错误
  'network_error': '网络连接失败，请检查网络设置',
  'timeout': '请求超时，请稍后重试',
  'invalid_api_key': 'API密钥无效，请检查配置',
  'quota_exceeded': 'API配额已用完，请检查账户余额',
  'rate_limit': '请求频率过高，请稍后重试',
  
  // OpenAI错误
  'invalid_request_error': '请求参数错误',
  'authentication_error': 'OpenAI API密钥验证失败',
  'permission_error': '没有访问权限',
  'not_found_error': '请求的资源不存在',
  'rate_limit_error': 'OpenAI API请求频率限制',
  'api_error': 'OpenAI API服务错误',
  'overloaded_error': 'OpenAI API服务过载',
  
  // Claude错误
  'invalid_request': 'Claude API请求无效',
  'authentication_failed': 'Claude API认证失败',
  'forbidden': 'Claude API访问被禁止',
  'not_found': 'Claude API资源未找到',
  'rate_limited': 'Claude API请求频率限制',
  'server_error': 'Claude API服务器错误',
  
  // Gemini错误
  'INVALID_ARGUMENT': 'Gemini API参数无效',
  'UNAUTHENTICATED': 'Gemini API认证失败',
  'PERMISSION_DENIED': 'Gemini API权限被拒绝',
  'NOT_FOUND': 'Gemini API资源未找到',
  'RESOURCE_EXHAUSTED': 'Gemini API资源耗尽',
  'INTERNAL': 'Gemini API内部错误'
};

// 获取API提供商配置
export const getProviderConfig = (provider: string) => {
  return API_PROVIDERS[provider as keyof typeof API_PROVIDERS];
};

// 获取错误消息
export const getErrorMessage = (errorCode: string): string => {
  return API_ERROR_MESSAGES[errorCode as keyof typeof API_ERROR_MESSAGES] || '未知错误';
};

// 验证API配置
export const validateApiConfig = (config: Record<string, unknown>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.provider) {
    errors.push('请选择API提供商');
  }
  
  if (!config.apiKey && config.provider !== 'gemini') {
    errors.push('请输入API密钥');
  }
  
  if (!config.model) {
    errors.push('请选择模型');
  }
  
  if (config.maxTokens && (config.maxTokens < 1 || config.maxTokens > 8000)) {
    errors.push('最大令牌数应在1-8000之间');
  }
  
  if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('温度值应在0-2之间');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// 格式化API响应
export const formatApiResponse = (response: Record<string, unknown>, provider: string) => {
  switch (provider) {
    case 'openai':
    case 'openrouter':
    case 'together':
    case 'siliconflow':
      return {
        content: response.choices?.[0]?.message?.content || '',
        usage: response.usage,
        model: response.model
      };
      
    case 'claude':
      return {
        content: response.content?.[0]?.text || '',
        usage: response.usage,
        model: response.model
      };
      
    case 'gemini':
      return {
        content: response.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: response.usageMetadata,
        model: response.modelVersion
      };
      
    default:
      return {
        content: response.content || response.text || '',
        usage: response.usage,
        model: response.model
      };
  }
};

// 构建API请求体
export const buildRequestBody = (provider: string, request: Record<string, unknown>) => {
  const { prompt, systemPrompt, maxTokens, temperature, model } = request;
  
  switch (provider) {
    case 'openai':
    case 'openrouter':
    case 'together':
    case 'siliconflow':
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });
      
      return {
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      };
      
    case 'claude':
      return {
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      };
      
    case 'gemini':
      const parts = [];
      if (systemPrompt) {
        parts.push({ text: systemPrompt });
      }
      parts.push({ text: prompt });
      
      return {
        contents: [{ parts }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature
        }
      };
      
    default:
      return { prompt, maxTokens, temperature };
  }
};
