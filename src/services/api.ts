// AI API调用服务

import { ApiConfig, ApiResponse, GenerationRequest } from '../types/api';
import { storageService } from './storage';

class ApiService {
  async generateContent(request: GenerationRequest): Promise<ApiResponse> {
    const apiConfig = storageService.getActiveApiConfig();
    // Gemini内置API key
    const GEMINI_BUILTIN_KEY = 'AIzaSyBlFLArgo9GmeniLt7NeNou8RfkcfXD5ow';
    if (!apiConfig) {
      return {
        success: false,
        error: '请先配置并激活一个AI API'
      };
    }
    // Gemini内置key优先级：用户自定义>内置
    if (apiConfig.provider === 'gemini' && !apiConfig.apiKey) {
      apiConfig.apiKey = GEMINI_BUILTIN_KEY;
    }
    try {
      switch (apiConfig.provider) {
        case 'openai':
          return await this.callOpenAI(apiConfig, request);
        case 'claude':
          return await this.callClaude(apiConfig, request);
        case 'custom':
          return await this.callCustomAPI(apiConfig, request);
        case 'gemini':
          return await this.callGemini(apiConfig, request);
        default:
          return {
            success: false,
            error: '不支持的API提供商'
          };
      }
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  private async callOpenAI(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    const url = `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`;
    
    const messages = [];
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }
    messages.push({
      role: 'user',
      content: request.prompt
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature || config.temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }

  private async callClaude(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    const url = `${config.baseUrl || 'https://api.anthropic.com/v1'}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature || config.temperature || 0.7,
        system: request.systemPrompt || '',
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      }
    };
  }

  private async callCustomAPI(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    if (!config.baseUrl) {
      throw new Error('自定义API需要配置baseUrl');
    }

    // 这里实现通用的自定义API调用逻辑
    // 可以根据需要支持不同的API格式
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        prompt: request.prompt,
        system_prompt: request.systemPrompt,
        max_tokens: request.maxTokens || config.maxTokens || 1000,
        temperature: request.temperature || config.temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // 尝试从不同的响应格式中提取内容
    const content = data.content || data.text || data.response || data.output || '';
    
    return {
      success: true,
      content: content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }

  private async callGemini(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    // 参考官方API文档 https://ai.google.dev/gemini-api/docs/quickstart?lang=python&hl=zh-cn
    const url = `${config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${config.model}:generateContent`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.apiKey
    };
    const body = {
      contents: [
        {
          parts: [
            { text: request.prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: request.temperature ?? config.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? config.maxTokens ?? 1000
      }
    };
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    // Gemini响应结构
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
      success: true,
      content,
      usage: undefined // Gemini暂不返回token用量
    };
  }

  async testApiConnection(config: ApiConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const testRequest: GenerationRequest = {
        prompt: '请回复"连接测试成功"',
        maxTokens: 50,
        temperature: 0.1
      };

      const response = await this.generateContentWithConfig(config, testRequest);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '连接测试失败'
      };
    }
  }

  private async generateContentWithConfig(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    try {
      switch (config.provider) {
        case 'openai':
          return await this.callOpenAI(config, request);
        case 'claude':
          return await this.callClaude(config, request);
        case 'custom':
          return await this.callCustomAPI(config, request);
        case 'gemini':
          return await this.callGemini(config, request);
        default:
          return {
            success: false,
            error: '不支持的API提供商'
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  getAvailableModels(provider: string): string[] {
    switch (provider) {
      case 'openai':
        return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'];
      case 'claude':
        return ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
      case 'gemini':
        return ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      case 'custom':
        return [];
      default:
        return [];
    }
  }
}

export const apiService = new ApiService();
