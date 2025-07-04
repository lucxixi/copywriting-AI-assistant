// 数据备份和恢复服务

import { settingsManager } from './settingsManager';
import { storageService } from './storage';

class BackupService {
  private readonly BACKUP_KEY = 'copywriting_ai_backup_data';
  
  // 导出所有数据
  exportAllData(): string {
    try {
      const allData = {
        // 系统设置
        settings: settingsManager.loadSettings(),
        
        // 业务数据
        apiConfigs: storageService.getApiConfigs(),
        promptTemplates: storageService.getPromptTemplates(),
        generationHistory: storageService.getGenerationHistory(),
        businessContext: storageService.getBusinessContext(),
        userPreferences: storageService.getUserPreferences(),
        
        // 产品相关
        productAnalyses: storageService.getProductAnalyses(),
        productTemplates: storageService.getProductTemplates(),
        
        // 对话相关
        dialogueStories: storageService.getDialogueStories(),
        dialogueTemplates: storageService.getDialogueTemplates(),
        
        // 统一模板
        unifiedTemplates: storageService.getUnifiedTemplates(),
        
        // 话术分析
        scriptAnalyses: storageService.getScriptAnalyses(),
        scriptTemplates: storageService.getScriptTemplates(),
        conversationFiles: storageService.getConversationFiles(),
        scenarioAnalyses: storageService.getScenarioAnalyses(),
        
        // 元数据
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };
      
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('数据导出失败');
    }
  }
  
  // 导入所有数据
  importAllData(dataJson: string): void {
    try {
      const data = JSON.parse(dataJson);
      
      // 验证数据格式
      if (!data.version || !data.exportDate) {
        throw new Error('无效的备份文件格式');
      }
      
      // 确认导入
      if (!confirm('导入数据将覆盖现有所有数据，确定要继续吗？')) {
        return;
      }
      
      // 导入系统设置
      if (data.settings) {
        settingsManager.saveSettings(data.settings);
      }
      
      // 导入业务数据
      if (data.apiConfigs) {
        data.apiConfigs.forEach((config: any) => storageService.saveApiConfig(config));
      }
      
      if (data.promptTemplates) {
        data.promptTemplates.forEach((template: any) => storageService.savePromptTemplate(template));
      }
      
      if (data.generationHistory) {
        localStorage.setItem('copywriting_ai_generation_history', JSON.stringify(data.generationHistory));
      }
      
      if (data.businessContext) {
        storageService.saveBusinessContext(data.businessContext);
      }
      
      if (data.userPreferences) {
        storageService.saveUserPreferences(data.userPreferences);
      }
      
      // 导入产品数据
      if (data.productAnalyses) {
        storageService.saveProductAnalyses(data.productAnalyses);
      }
      
      if (data.productTemplates) {
        data.productTemplates.forEach((template: any) => storageService.saveProductTemplate(template));
      }
      
      // 导入对话数据
      if (data.dialogueStories) {
        data.dialogueStories.forEach((story: any) => storageService.saveDialogueStory(story));
      }
      
      if (data.dialogueTemplates) {
        data.dialogueTemplates.forEach((template: any) => storageService.saveDialogueTemplate(template));
      }
      
      // 导入统一模板
      if (data.unifiedTemplates) {
        data.unifiedTemplates.forEach((template: any) => storageService.saveUnifiedTemplate(template));
      }
      
      // 导入话术分析数据
      if (data.scriptAnalyses) {
        data.scriptAnalyses.forEach((analysis: any) => storageService.saveScriptAnalysis(analysis));
      }
      
      if (data.scriptTemplates) {
        data.scriptTemplates.forEach((template: any) => storageService.saveScriptTemplate(template));
      }
      
      if (data.conversationFiles) {
        storageService.saveConversationFiles(data.conversationFiles);
      }
      
      if (data.scenarioAnalyses) {
        data.scenarioAnalyses.forEach((analysis: any) => storageService.saveScenarioAnalysis(analysis));
      }
      
      alert('数据导入成功！页面将刷新以应用新数据。');
      window.location.reload();
      
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('数据导入失败：' + (error as Error).message);
    }
  }
  
  // 自动备份到本地文件
  downloadBackup(): void {
    try {
      const data = this.exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `copywriting-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
      alert('备份下载失败');
    }
  }
  
  // 从文件恢复
  uploadBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          this.importAllData(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsText(file);
    });
  }
  
  // 检查存储使用情况
  getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
    items: { key: string; size: number }[];
  } {
    let totalUsed = 0;
    const items: { key: string; size: number }[] = [];
    
    for (let key in localStorage) {
      if (key.startsWith('copywriting_ai_')) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        totalUsed += size;
        items.push({ key, size });
      }
    }
    
    // localStorage通常限制为5MB
    const available = 5 * 1024 * 1024;
    const percentage = (totalUsed / available) * 100;
    
    return {
      used: totalUsed,
      available,
      percentage,
      items: items.sort((a, b) => b.size - a.size)
    };
  }
  
  // 清理旧数据
  cleanupOldData(retentionDays: number = 30): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      // 清理历史记录
      const history = storageService.getGenerationHistory();
      const filteredHistory = history.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= cutoffDate;
      });
      
      if (filteredHistory.length < history.length) {
        localStorage.setItem('copywriting_ai_generation_history', JSON.stringify(filteredHistory));
        console.log(`清理了 ${history.length - filteredHistory.length} 条历史记录`);
      }
      
      // 清理分析事件
      const events = JSON.parse(localStorage.getItem('copywriting_ai_analytics_events') || '[]');
      const filteredEvents = events.filter((event: any) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= cutoffDate;
      });
      
      if (filteredEvents.length < events.length) {
        localStorage.setItem('copywriting_ai_analytics_events', JSON.stringify(filteredEvents));
        console.log(`清理了 ${events.length - filteredEvents.length} 条分析事件`);
      }
      
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }
  
  // 定期自动备份
  setupAutoBackup(intervalDays: number = 7): void {
    const lastBackup = localStorage.getItem('copywriting_ai_last_backup');
    const now = new Date().getTime();
    
    if (!lastBackup || (now - parseInt(lastBackup)) > intervalDays * 24 * 60 * 60 * 1000) {
      // 创建自动备份
      try {
        const data = this.exportAllData();
        localStorage.setItem('copywriting_ai_auto_backup', data);
        localStorage.setItem('copywriting_ai_last_backup', now.toString());
        console.log('自动备份已创建');
      } catch (error) {
        console.error('自动备份失败:', error);
      }
    }
  }
  
  // 恢复自动备份
  restoreAutoBackup(): void {
    try {
      const backup = localStorage.getItem('copywriting_ai_auto_backup');
      if (backup) {
        this.importAllData(backup);
      } else {
        alert('没有找到自动备份数据');
      }
    } catch (error) {
      console.error('恢复自动备份失败:', error);
      alert('恢复自动备份失败');
    }
  }
}

export const backupService = new BackupService();
