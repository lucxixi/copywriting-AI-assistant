// AI API调用服务 - 重构版本

import { ApiConfig, ApiResponse, GenerationRequest } from '../types/api';
import { storageService } from './storage';
import {
  BUILTIN_API_KEYS,
  API_CONFIG,
  getProviderConfig,
  getErrorMessage,
  formatApiResponse,
  buildRequestBody
} from '../config/api';
import { settingsManager } from './settingsManager';

class ApiService {
  async generateContent(request: GenerationRequest): Promise<ApiResponse> {
    // 优先从 settingsManager 获取激活的 API Key
    const settings = settingsManager.loadSettings();
    const apiKeys = settings.apiKeys || [];
    const activeId = settings.activeApiKeyId;
    const activeKey = apiKeys.find(k => k.id === activeId);

    if (!activeKey) {
      return {
        success: false,
        error: '请先在系统设置中添加并激活一个API Key'
      };
    }

    // 组装 ApiConfig
    const apiConfig = {
      id: activeKey.id,
      name: activeKey.name,
      provider: activeKey.provider,
      apiKey: activeKey.key,
      baseUrl: '',
      model: settings.model || '',
      maxTokens: undefined,
      temperature: undefined,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    };

    try {
      return await this.callAPI(apiConfig, request);
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  private async callAPI(config: ApiConfig, request: GenerationRequest): Promise<ApiResponse> {
    const providerConfig = getProviderConfig(config.provider);
    if (!providerConfig) {
      throw new Error('不支持的API提供商');
    }

    const url = this.buildApiUrl(config, providerConfig);
    const headers = this.buildHeaders(config);
    const body = buildRequestBody(config.provider, {
      ...request,
      model: config.model || providerConfig.defaultModel
    });

    const response = await this.makeRequest(url, headers, body);
    const formattedResponse = formatApiResponse(response, config.provider);

    return {
      success: true,
      content: formattedResponse.content,
      usage: formattedResponse.usage
    };
  }

  private buildApiUrl(config: ApiConfig, providerConfig: Record<string, unknown>): string {
    const baseUrl = config.baseUrl || providerConfig.baseUrl;

    switch (config.provider) {
      case 'openai':
      case 'openrouter':
      case 'together':
      case 'siliconflow':
        return `${baseUrl}/chat/completions`;
      case 'claude':
        return `${baseUrl}/messages`;
      case 'gemini':
        return `${baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;
      default:
        return `${baseUrl}/generate`;
    }
  }

  private buildHeaders(config: ApiConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (config.provider) {
      case 'openai':
      case 'openrouter':
      case 'together':
      case 'siliconflow':
        headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
      case 'claude':
        headers['x-api-key'] = config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'gemini':
        // Gemini使用URL参数传递API密钥
        break;
    }

    return headers;
  }

  private async makeRequest(url: string, headers: Record<string, string>, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(this.parseErrorMessage(errorData, response.status));
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private parseErrorMessage(errorData: Record<string, unknown>, status: number): string {
    // 根据不同API提供商解析错误消息
    const error = errorData.error as Record<string, unknown> | undefined;
    if (error?.message) {
      return error.message as string;
    }
    if (errorData.message) {
      return errorData.message as string;
    }
    return getErrorMessage(`HTTP_${status}`) || `HTTP ${status} 错误`;
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return '请求超时，请稍后重试';
      }
      return error.message;
    }
    return '未知错误';
  }

  // API连接测试
  async testApiConnection(config: ApiConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const testRequest: GenerationRequest = {
        prompt: '请回复"连接测试成功"',
        maxTokens: 50,
        temperature: 0.1
      };

      const response = await this.callAPI(config, testRequest);
      return { success: response.success, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error)
      };
    }
  }

  // 获取可用模型列表
  getAvailableModels(provider: string): string[] {
    const providerConfig = getProviderConfig(provider);
    return providerConfig?.models || [];
  }
}

export const apiService = new ApiService();
