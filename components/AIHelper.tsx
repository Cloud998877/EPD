
import React, { useState, useRef, useEffect } from 'react';
import { askGeminiAboutDoc } from '../geminiService';
import { Icons, QUICK_QUESTIONS } from '../constants';

const AIHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAsk = async (text?: string) => {
    const question = text || query;
    if (!question.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    if (!text) setQuery('');
    
    setIsLoading(true);
    const res = await askGeminiAboutDoc(question);
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'ai', text: res }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-[380px] md:w-[450px] flex flex-col max-h-[650px] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="p-5 bg-slate-900 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Icons.Sparkles className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI 전문가 가이드</h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Expert Consulting System</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div ref={scrollRef} className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 min-h-[400px]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <Icons.Sparkles className="text-blue-600 w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-lg">무엇을 도와드릴까요?</h4>
                  <p className="text-sm text-slate-500">준비 서류가 낯설거나 어려운 용어가 있다면 질문해주세요.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAsk(q)}
                      className="text-left text-xs bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl transition-all shadow-sm font-medium text-slate-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="전문가에게 질문하기..."
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
              <button
                onClick={() => handleAsk()}
                disabled={isLoading || !query.trim()}
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black disabled:opacity-50 transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white h-16 px-8 rounded-full shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 border-2 border-white/10"
        >
          <Icons.Sparkles className="text-blue-400" />
          <span className="font-bold tracking-tight">AI 전문가 가이드</span>
        </button>
      )}
    </div>
  );
};

export default AIHelper;
