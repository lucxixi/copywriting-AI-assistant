// 文件处理服务 - 支持多种格式的文件解析
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FileProcessResult {
  success: boolean;
  content?: string;
  images?: string[]; // base64 编码的图片
  error?: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    pageCount?: number;
  };
}

class FileProcessorService {
  // 支持的文件类型
  private supportedTypes = {
    'text/plain': 'txt',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'application/pdf': 'pdf',
    'text/rtf': 'rtf',
    'application/rtf': 'rtf'
  };

  // 获取支持的文件扩展名
  getSupportedExtensions(): string[] {
    return ['.txt', '.docx', '.doc', '.pdf', '.rtf'];
  }

  // 获取 accept 属性字符串
  getAcceptString(): string {
    return Object.keys(this.supportedTypes).join(',') + ',.txt,.docx,.doc,.pdf,.rtf';
  }

  // 检查文件类型是否支持
  isFileTypeSupported(file: File): boolean {
    const extension = this.getFileExtension(file.name).toLowerCase();
    return this.getSupportedExtensions().includes(extension) || 
           this.supportedTypes.hasOwnProperty(file.type);
  }

  // 获取文件扩展名
  private getFileExtension(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  // 主要的文件处理方法
  async processFile(file: File): Promise<FileProcessResult> {
    try {
      if (!this.isFileTypeSupported(file)) {
        return {
          success: false,
          error: `不支持的文件格式。支持的格式：${this.getSupportedExtensions().join(', ')}`
        };
      }

      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || this.getFileExtension(file.name)
      };

      // 根据文件类型选择处理方法
      const extension = this.getFileExtension(file.name).toLowerCase();
      
      switch (extension) {
        case '.txt':
        case '.rtf':
          return await this.processTxtFile(file, metadata);
        case '.docx':
          return await this.processDocxFile(file, metadata);
        case '.pdf':
          return await this.processPdfFile(file, metadata);
        default:
          // 尝试按 MIME 类型处理
          if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return await this.processDocxFile(file, metadata);
          } else if (file.type === 'application/pdf') {
            return await this.processPdfFile(file, metadata);
          } else {
            return await this.processTxtFile(file, metadata);
          }
      }
    } catch (error) {
      return {
        success: false,
        error: `文件处理失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 处理文本文件
  private async processTxtFile(file: File, metadata: any): Promise<FileProcessResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve({
          success: true,
          content: content.trim(),
          metadata
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          error: '文本文件读取失败'
        });
      };
      reader.readAsText(file, 'UTF-8');
    });
  }

  // 处理 DOCX 文件
  private async processDocxFile(file: File, metadata: any): Promise<FileProcessResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      // 尝试提取图片
      const imageResult = await mammoth.images.imgElement(arrayBuffer);
      const images: string[] = [];
      
      // 处理图片（如果有的话）
      if (imageResult && imageResult.messages) {
        // 这里可以进一步处理图片，但 mammoth 主要用于文本提取
        // 图片提取需要更复杂的处理
      }

      return {
        success: true,
        content: result.value.trim(),
        images,
        metadata: {
          ...metadata,
          pageCount: 1 // DOCX 没有明确的页数概念
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `DOCX 文件处理失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 处理 PDF 文件
  private async processPdfFile(file: File, metadata: any): Promise<FileProcessResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const images: string[] = [];
      
      // 提取每一页的文本
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        // 可以在这里添加图片提取逻辑
        // 但这需要更复杂的实现
      }

      return {
        success: true,
        content: fullText.trim(),
        images,
        metadata: {
          ...metadata,
          pageCount: pdf.numPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `PDF 文件处理失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 格式化文件大小显示
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const fileProcessorService = new FileProcessorService();
