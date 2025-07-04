import React, { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const defaultConversations: Conversation[] = [
  { id: '1', title: '新的对话', messages: [] }
];

function fakeAIReply(input: string): Promise<string> {
  return new Promise(resolve => setTimeout(() => resolve('🤖 AI回复：' + input), 600));
}

const DialogueBoard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(defaultConversations);
  const [activeId, setActiveId] = useState('1');
  const [input, setInput] = useState('');
  const activeConv = conversations.find(c => c.id === activeId)!;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now() + '', role: 'user', content: input };
    setConversations(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c));
    setInput('');
    const aiReply = await fakeAIReply(input);
    const aiMsg: Message = { id: Date.now() + '', role: 'ai', content: aiReply };
    setConversations(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, aiMsg] } : c));
  };

  const handleNewConv = () => {
    const newId = Date.now() + '';
    setConversations(cs => [...cs, { id: newId, title: '新对话', messages: [] }]);
    setActiveId(newId);
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <aside style={{ width: 180, borderRight: '1px solid #eee', padding: 12 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>💬 会话列表</div>
        {conversations.map(c => (
          <button key={c.id} onClick={() => setActiveId(c.id)} style={{ display: 'block', width: '100%', padding: 8, marginBottom: 6, background: c.id === activeId ? '#e0e7ff' : 'transparent', border: 'none', borderRadius: 6, textAlign: 'left', fontWeight: c.id === activeId ? 'bold' : 'normal', color: c.id === activeId ? '#2563eb' : '#222', cursor: 'pointer' }}>{c.title}</button>
        ))}
        <button onClick={handleNewConv} style={{ marginTop: 10, width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: 8, fontSize: 14, cursor: 'pointer' }}>➕ 新建对话</button>
      </aside>
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {activeConv.messages.length === 0 && <div style={{ color: '#bbb', textAlign: 'center', marginTop: 40 }}>暂无消息，开始对话吧！</div>}
          {activeConv.messages.map(m => (
            <div key={m.id} style={{ margin: '12px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <span style={{ display: 'inline-block', padding: 10, borderRadius: 8, background: m.role === 'user' ? '#dbeafe' : '#f3f4f6', color: '#222', maxWidth: 360 }}>{m.role === 'user' ? '🧑‍💻' : '🤖'} {m.content}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="输入内容..." style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 }} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} />
          <button onClick={handleSend} style={{ marginLeft: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0 22px', fontSize: 15, cursor: 'pointer' }}>发送</button>
        </div>
      </section>
    </div>
  );
};

export default DialogueBoard; 