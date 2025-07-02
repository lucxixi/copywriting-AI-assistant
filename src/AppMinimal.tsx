import React from 'react';

function AppMinimal() {
  console.log('AppMinimal rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#111827',
        marginBottom: '16px'
      }}>
        文案AI助手 - 最小测试版本
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: '12px'
        }}>
          基础功能测试
        </h2>
        
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          这是一个不依赖任何外部组件的最小版本，用于测试基础React渲染。
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => alert('按钮点击正常！')}
          >
            测试按钮
          </button>
          
          <button 
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => console.log('控制台输出正常！')}
          >
            控制台测试
          </button>
        </div>
        
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #93c5fd',
          borderRadius: '6px',
          padding: '12px'
        }}>
          <p style={{ color: '#1e40af', margin: 0 }}>
            ✅ 如果您能看到这个页面，说明React基础渲染正常
            <br />
            ✅ 如果按钮能点击，说明事件处理正常
            <br />
            ✅ 如果样式正常显示，说明CSS处理正常
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppMinimal;
