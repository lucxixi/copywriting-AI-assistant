import React, { useRef, useState } from 'react';
import { fileProcessorService } from '../../services/fileProcessor';

interface FileUploadManagerProps {
  onFileUpload: (fileName: string, content: string) => void;
  acceptedFileTypes?: string; // e.g., ".pdf,.txt,.docx"
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  onFileUpload,
  acceptedFileTypes = fileProcessorService.getAcceptString()
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);
      setError(null);
      try {
        const result = await fileProcessorService.processFile(file);
        if (result.success && result.content) {
          onFileUpload(file.name, result.content);
        } else {
          setError(result.error || '文件处理失败。');
          setFileName(null); // Clear file name on error
        }
      } catch (err) {
        setError(`文件处理异常: ${err instanceof Error ? err.message : '未知错误'}`);
        setFileName(null); // Clear file name on error
      } finally {
        setIsProcessing(false);
      }
    } else {
      setFileName(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{
      border: '2px dashed #e0e0e0', borderRadius: '8px', padding: '20px', textAlign: 'center',
      backgroundColor: '#f9f9f9', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '120px'
    }} onClick={handleButtonClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        style={{ display: 'none' }}
      />
      {
        isProcessing ? (
          <p style={{ fontSize: '16px', color: '#2563eb', fontWeight: '500' }}>正在处理文件...</p>
        ) : fileName ? (
          <p style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>已选择文件: <span style={{ color: '#2563eb' }}>{fileName}</span></p>
        ) : (
          <p style={{ fontSize: '16px', color: '#666' }}>点击或拖拽文件到此区域上传</p>
        )
      }
      {error && <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '5px' }}>错误: {error}</p>}
      <p style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>支持文件类型: {acceptedFileTypes}</p>
      <button
        onClick={handleButtonClick}
        disabled={isProcessing} // Disable button when processing
        style={{
          marginTop: '15px', padding: '8px 18px', border: 'none', borderRadius: '6px',
          backgroundColor: isProcessing ? '#a8a8a8' : '#2563eb', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {isProcessing ? '处理中...' : '选择文件'}
      </button>
    </div>
  );
};

export default FileUploadManager;
