import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { getMeraBotResponse } from '../services/geminiService';
import { useTheme } from '../context/ThemeContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const MeraBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am MeraBot. How can I help you find your dream room today?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const botResponse = await getMeraBotResponse([...messages, userMessage]);
    setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[70] w-14 h-14 ${theme.bg} text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce`}
        style={{ animationDuration: '3s' }}
      >
        <ChatBubbleLeftRightIcon className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 md:w-96 md:h-[550px] z-[80] flex flex-col bg-white dark:bg-slate-900 shadow-2xl md:rounded-[32px] overflow-hidden animate-slide-up border dark:border-white/5">
          {/* Header */}
          <div className={`${theme.bg} p-6 flex justify-between items-center text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">MeraBot AI</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  Online Now
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950 transition-colors">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                  msg.role === 'user' 
                    ? `${theme.bg} text-white rounded-tr-none` 
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border dark:border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none border dark:border-white/5 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-white/5 transition-colors">
            <div className="relative">
              <input 
                autoFocus
                type="text"
                placeholder="Ask MeraBot anything..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-5 pr-14 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`absolute right-2 top-2 w-10 h-10 ${theme.bg} text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 ml-2">
              <FaceSmileIcon className="w-4 h-4 text-gray-400" />
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Powered by Gemini 3</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeraBot;