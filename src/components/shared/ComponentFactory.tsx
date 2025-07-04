// 组件工厂 - 减少重复代码

import React from 'react';

// 通用加载状态组件
export const LoadingState: React.FC<{ message?: string }> = ({ message = '加载中...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div className="text-gray-600">{message}</div>
    </div>
  </div>
);

// 通用错误状态组件
export const ErrorState: React.FC<{ 
  message: string; 
  onRetry?: () => void;
  icon?: string;
}> = ({ message, onRetry, icon = '❌' }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">{icon}</div>
    <p className="text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        重试
      </button>
    )}
  </div>
);

// 通用空状态组件
export const EmptyState: React.FC<{
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon, title, description, action }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-4">{description}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

// 通用页面头部组件
export const PageHeader: React.FC<{
  icon: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}> = ({ icon, title, description, actions }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h1>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
    {actions && <div className="flex items-center space-x-3">{actions}</div>}
  </div>
);

// 通用卡片组件
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}> = ({ children, className = '', padding = 'medium' }) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// 通用按钮组件
export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// 通用输入框组件
export const Input: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false, 
  error, 
  disabled = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// 通用文本域组件
export const Textarea: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4, 
  required = false, 
  error, 
  disabled = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// 通用选择框组件
export const Select: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  required = false, 
  error, 
  disabled = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// 通用标签页组件
export const Tabs: React.FC<{
  tabs: { id: string; name: string; icon?: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onTabChange, className = '' }) => (
  <div className={`border-b border-gray-200 ${className}`}>
    <nav className="flex space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  </div>
);
