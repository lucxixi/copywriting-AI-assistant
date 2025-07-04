# Google Gemini API 配置指南

## 🚀 快速开始

我们的AI文案助手现在支持Google Gemini API！这是Google官方提供的强大多模态AI模型，支持文本、图像、音频和视频处理。

## 📋 支持的模型

### Gemini 2.5 系列（最新）
- **Gemini 2.5 Pro** - 最强推理能力，适合复杂任务
- **Gemini 2.5 Flash** - 最佳性价比，适合大多数场景
- **Gemini 2.5 Flash Lite** - 成本优化，适合高频调用

### Gemini 2.0 系列
- **Gemini 2.0 Flash** - 新一代功能，高速处理
- **Gemini 2.0 Flash Lite** - 轻量版本，低延迟

### Gemini 1.5 系列（稳定版）
- **Gemini 1.5 Pro** - 长上下文处理（2M tokens）
- **Gemini 1.5 Flash** - 快速多模态处理（1M tokens）
- **Gemini 1.5 Flash 8B** - 小型高效模型

### 专用模型
- **Text Embedding 004** - 文本嵌入
- **Gemini Embedding (Exp)** - 实验性嵌入模型

## 🔑 获取API密钥

### 步骤1：访问Google AI Studio
1. 打开 [Google AI Studio](https://aistudio.google.com/apikey)
2. 使用您的Google账号登录

### 步骤2：创建API密钥
1. 点击 "Create API Key" 按钮
2. 选择项目或创建新项目
3. 复制生成的API密钥

### 步骤3：在系统中配置
1. 打开AI文案助手
2. 进入 "⚙️ 系统设置"
3. 在 "API配置" 标签页点击 "➕ 添加密钥"
4. 选择 "Google Gemini"
5. 输入密钥名称和API密钥
6. 点击 "添加密钥"

## ⚙️ 配置建议

### 推荐模型选择
- **日常文案生成**: Gemini 1.5 Flash
- **复杂分析任务**: Gemini 2.5 Pro  
- **高频批量处理**: Gemini 2.5 Flash Lite
- **长文档处理**: Gemini 1.5 Pro

### 参数设置建议
- **Temperature**: 0.7（平衡创造性和准确性）
- **Max Tokens**: 2000-4000（根据需求调整）
- **Top P**: 0.9（保持多样性）

## 🔧 技术特性

### API端点
```
https://generativelanguage.googleapis.com/v1beta
```

### 支持功能
- ✅ 文本生成
- ✅ 多模态输入（文本、图像、音频、视频）
- ✅ 长上下文处理（最高2M tokens）
- ✅ 结构化输出
- ✅ 函数调用
- ✅ 代码执行
- ✅ 搜索增强

### 定价优势
- 相比其他提供商更具性价比
- 免费额度充足，适合个人和小团队
- 按使用量计费，无最低消费

## 🛠️ 使用示例

### 文案生成
```
模型: gemini-1.5-flash
Temperature: 0.7
Max Tokens: 2000
适用场景: 营销文案、产品描述、社交媒体内容
```

### 产品分析
```
模型: gemini-2.5-pro
Temperature: 0.3
Max Tokens: 4000
适用场景: 市场分析、竞品研究、用户反馈分析
```

### 对话创作
```
模型: gemini-1.5-flash
Temperature: 0.8
Max Tokens: 3000
适用场景: 客服对话、销售话术、互动剧本
```

## 🔍 故障排除

### 常见问题

**Q: API密钥无效**
A: 确保从Google AI Studio复制了完整的API密钥，检查是否有多余的空格

**Q: 配额超限**
A: 检查Google AI Studio中的配额使用情况，考虑升级计划

**Q: 模型不可用**
A: 某些模型可能在特定地区不可用，尝试使用其他模型

**Q: 响应速度慢**
A: 尝试使用Flash系列模型，或减少输入内容长度

### 错误代码
- `400`: 请求格式错误，检查参数设置
- `401`: API密钥无效或过期
- `403`: 权限不足或配额超限
- `429`: 请求频率过高，稍后重试
- `500`: 服务器错误，稍后重试

## 📞 支持

如果您在使用过程中遇到问题：

1. 查看 [Google AI Studio 文档](https://ai.google.dev/gemini-api/docs)
2. 检查系统设置中的连接测试
3. 查看浏览器控制台的错误信息
4. 联系技术支持

## 🎉 开始使用

现在您可以：
1. ✅ 添加Google Gemini API密钥
2. ✅ 选择适合的模型
3. ✅ 配置生成参数
4. ✅ 开始创作优质内容！

享受Google Gemini带来的强大AI能力！🚀
