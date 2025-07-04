import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplateStats } from './TemplateStats';
import { TemplateFilterBar } from './TemplateFilterBar';
import { TemplateList } from './TemplateList';
import { TemplateForm } from './TemplateForm';
import { UnifiedTemplate, TemplateFormData } from '../../types/unified-template';
import FileUploadManager from '../shared/FileUploadManager';

export function TemplateManager() {
  const {
    templates,
    stats,
    filters,
    isLoading,
    error,
    updateFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    activateTemplate
  } = useTemplates();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UnifiedTemplate | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setShowUploadSection(false);
  };

  const handleEditTemplate = (template: UnifiedTemplate) => {
    setEditingTemplate(template);
    setIsCreating(true);
    setShowUploadSection(false);
  };

  const handleViewTemplate = (template: UnifiedTemplate) => {
    console.log('查看模板详情:', template);
  };

  const handleSaveTemplate = async (formData: TemplateFormData) => {
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      handleCancelForm();
    } catch (error) {
      console.error('保存模板失败:', error);
    }
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingTemplate(null);
    setShowUploadSection(false);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('确定要删除这个模板吗？此操作不可恢复。')) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error('删除模板失败:', error);
      }
    }
  };

  const handleUseTemplate = async (id: string) => {
    try {
      await activateTemplate(id);
      alert('正在使用模板...');
    } catch (error) {
      console.error('使用模板失败:', error);
    }
  };

  const handleUploadTemplateClick = () => {
    setShowUploadSection(true);
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleUploadedFile = async (fileName: string, content: string) => {
    try {
      const newTemplate: TemplateFormData = {
        name: fileName.split('.')[0],
        type: 'dialogue',
        category: 'interaction',
        content: { parsedText: content },
        metadata: {
          description: `Uploaded from ${fileName}`,
          tags: ['uploaded', 'dialogue'],
          difficulty: 'intermediate',
          estimatedTime: 5,
          targetAudience: ['all'],
          language: 'zh-CN',
        },
        isActive: true,
      };
      await createTemplate(newTemplate);
      alert('模板上传成功并已保存！');
      setShowUploadSection(false);
    } catch (err) {
      console.error('上传模板失败:', err);
      alert('上传模板失败，请重试！');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">统一模板管理</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">管理所有类型的模板，支持分类、搜索和统计</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateTemplate}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>创建模板</span>
          </button>
          <button
            onClick={handleUploadTemplateClick}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all shadow-md text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>上传对话模板</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <TemplateStats stats={stats} />

      <TemplateFilterBar 
        filters={filters} 
        onFiltersChange={updateFilters} 
      />

      <TemplateList
        templates={templates}
        onUseTemplate={handleUseTemplate}
        onViewTemplate={handleViewTemplate}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      {(isCreating || editingTemplate) && (
        <TemplateForm
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      )}

      {showUploadSection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">上传对话模板</h2>
          <FileUploadManager onFileUpload={handleUploadedFile} />
          <button
            onClick={handleCancelForm}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消上传
          </button>
        </div>
      )}
    </div>
  );
} 