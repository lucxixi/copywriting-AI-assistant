// 云端存储服务（示例实现）

interface CloudStorageConfig {
  apiUrl: string;
  apiKey?: string;
  userId?: string;
}

interface SyncResult {
  success: boolean;
  message: string;
  conflicts?: any[];
}

class CloudStorageService {
  private config: CloudStorageConfig;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: any[] = [];
  
  constructor(config: CloudStorageConfig) {
    this.config = config;
    this.setupOnlineListener();
  }
  
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  // 保存数据到云端
  async saveToCloud(key: string, data: any): Promise<boolean> {
    try {
      if (!this.isOnline) {
        // 离线时添加到同步队列
        this.syncQueue.push({ action: 'save', key, data, timestamp: Date.now() });
        return false;
      }
      
      const response = await fetch(`${this.config.apiUrl}/data/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-User-ID': this.config.userId || 'anonymous'
        },
        body: JSON.stringify({
          data,
          timestamp: Date.now(),
          version: '2.0.0'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      // 失败时添加到同步队列
      this.syncQueue.push({ action: 'save', key, data, timestamp: Date.now() });
      return false;
    }
  }
  
  // 从云端加载数据
  async loadFromCloud(key: string): Promise<any> {
    try {
      if (!this.isOnline) {
        return null;
      }
      
      const response = await fetch(`${this.config.apiUrl}/data/${key}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-User-ID': this.config.userId || 'anonymous'
        }
      });
      
      if (response.status === 404) {
        return null; // 数据不存在
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return null;
    }
  }
  
  // 同步本地和云端数据
  async syncData(): Promise<SyncResult> {
    try {
      if (!this.isOnline) {
        return { success: false, message: '网络连接不可用' };
      }
      
      const localData = this.getAllLocalData();
      const cloudData = await this.getAllCloudData();
      
      const conflicts: any[] = [];
      let syncCount = 0;
      
      // 比较并同步每个数据项
      for (const key of Object.keys(localData)) {
        const local = localData[key];
        const cloud = cloudData[key];
        
        if (!cloud) {
          // 云端没有，上传本地数据
          await this.saveToCloud(key, local.data);
          syncCount++;
        } else if (local.timestamp > cloud.timestamp) {
          // 本地更新，上传到云端
          await this.saveToCloud(key, local.data);
          syncCount++;
        } else if (cloud.timestamp > local.timestamp) {
          // 云端更新，下载到本地
          this.saveToLocal(key, cloud.data);
          syncCount++;
        } else if (JSON.stringify(local.data) !== JSON.stringify(cloud.data)) {
          // 时间戳相同但数据不同，标记为冲突
          conflicts.push({ key, local: local.data, cloud: cloud.data });
        }
      }
      
      // 检查云端独有的数据
      for (const key of Object.keys(cloudData)) {
        if (!localData[key]) {
          this.saveToLocal(key, cloudData[key].data);
          syncCount++;
        }
      }
      
      return {
        success: true,
        message: `同步完成，处理了 ${syncCount} 个数据项`,
        conflicts: conflicts.length > 0 ? conflicts : undefined
      };
      
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, message: '同步失败：' + (error as Error).message };
    }
  }
  
  // 处理同步队列
  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }
    
    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      try {
        if (item.action === 'save') {
          await this.saveToCloud(item.key, item.data);
        }
      } catch (error) {
        console.error('Failed to process sync queue item:', error);
        // 重新添加到队列
        this.syncQueue.push(item);
      }
    }
  }
  
  // 获取所有本地数据
  private getAllLocalData(): Record<string, any> {
    const data: Record<string, any> = {};
    
    for (let key in localStorage) {
      if (key.startsWith('copywriting_ai_')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = {
              data: JSON.parse(value),
              timestamp: Date.now() // 简化实现，实际应该存储真实的修改时间
            };
          }
        } catch (error) {
          console.error(`Failed to parse local data for key ${key}:`, error);
        }
      }
    }
    
    return data;
  }
  
  // 获取所有云端数据
  private async getAllCloudData(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.config.apiUrl}/data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-User-ID': this.config.userId || 'anonymous'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get all cloud data:', error);
      return {};
    }
  }
  
  // 保存到本地
  private saveToLocal(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save to local storage for key ${key}:`, error);
    }
  }
  
  // 解决冲突
  async resolveConflict(key: string, resolution: 'local' | 'cloud' | 'merge'): Promise<boolean> {
    try {
      const localData = JSON.parse(localStorage.getItem(key) || '{}');
      const cloudData = await this.loadFromCloud(key);
      
      let resolvedData;
      
      switch (resolution) {
        case 'local':
          resolvedData = localData;
          break;
        case 'cloud':
          resolvedData = cloudData;
          break;
        case 'merge':
          // 简单的合并策略，实际应该根据数据类型定制
          resolvedData = { ...cloudData, ...localData };
          break;
        default:
          return false;
      }
      
      // 同时更新本地和云端
      this.saveToLocal(key, resolvedData);
      await this.saveToCloud(key, resolvedData);
      
      return true;
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      return false;
    }
  }
  
  // 检查连接状态
  isConnected(): boolean {
    return this.isOnline;
  }
  
  // 获取同步队列状态
  getSyncQueueStatus(): { count: number; items: any[] } {
    return {
      count: this.syncQueue.length,
      items: this.syncQueue
    };
  }
}

// 使用示例配置
export const createCloudStorageService = (config: CloudStorageConfig) => {
  return new CloudStorageService(config);
};

// 默认配置（需要根据实际后端服务调整）
export const defaultCloudConfig: CloudStorageConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.your-domain.com',
  apiKey: process.env.REACT_APP_API_KEY,
  userId: 'user-id' // 应该从用户认证系统获取
};
