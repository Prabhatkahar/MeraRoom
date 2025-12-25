import React, { useState, useRef, useEffect } from 'react';
import { 
  CommandLineIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  FolderIcon,
  FolderOpenIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { fixAndArrangeCode } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const CodeArchitectBot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'chat' | 'arrange'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'MeraArchitect v1.8.0 Online. I have detected project structure issues. Use the "Arrange" tab to see the proposed organization or ask me to fix specific errors.' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, view]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await fixAndArrangeCode(input);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  const projectStructure = [
    { name: 'lib/', type: 'folder', open: true, children: [
      { name: 'models/', type: 'folder', children: [{ name: 'room_model.ts', type: 'file' }] },
      { name: 'views/', type: 'folder', children: [
        { name: 'home_view.tsx', type: 'file' },
        { name: 'post_view.tsx', type: 'file' }
      ]},
      { name: 'controllers/', type: 'folder', children: [{ name: 'room_controller.ts', type: 'file' }] },
      { name: 'services/', type: 'folder', children: [{ name: 'gemini_service.ts', type: 'file' }] },
      { name: 'main.tsx', type: 'file' }
    ]},
    { name: 'assets/', type: 'folder', children: [{ name: 'logo.png', type: 'file' }] },
    { name: 'index.html', type: 'file' }
  ];

  const renderTree = (items: any[], depth = 0) => {
    return items.map((item, idx) => (
      <div key={idx} style={{ paddingLeft: `${depth * 20}px` }} className="py-1">
        <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 rounded px-2">
          {item.type === 'folder' ? (
            <FolderIcon className="w-4 h-4 text-amber-400" />
          ) : (
            <DocumentIcon className="w-4 h-4 text-blue-400" />
          )}
          <span className={`text-[11px] font-mono ${item.type === 'folder' ? 'text-gray-300' : 'text-gray-400'}`}>
            {item.name}
          </span>
        </div>
        {item.children && renderTree(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[80vh] bg-[#0d1117] border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Terminal Header */}
        <div className="bg-[#161b22] p-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 px-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            </div>
            <div className="flex bg-[#0d1117] rounded-lg p-1">
              <button 
                onClick={() => setView('chat')}
                className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${view === 'chat' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}
              >
                Terminal
              </button>
              <button 
                onClick={() => setView('arrange')}
                className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${view === 'arrange' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}
              >
                Arrange
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg text-gray-500">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {view === 'chat' ? (
            <div className="flex-1 flex flex-col bg-[#0d1117]">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl font-mono text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-[#161b22] text-emerald-400 border border-emerald-500/20 rounded-tl-none'
                    }`}>
                      {msg.role === 'bot' && <span className="text-emerald-600 mr-2">$ architect:</span>}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#161b22] p-4 rounded-2xl animate-pulse text-emerald-500 font-mono text-[10px]">
                      <span className="animate-bounce">_</span> RUNNING COMPILER...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#161b22] border-t border-gray-800">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-emerald-500 font-mono text-xs font-bold">&gt;</span>
                  <input 
                    autoFocus
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl py-4 pl-10 pr-14 text-xs font-mono text-emerald-400 outline-none"
                    placeholder="Describe the error or arrangement needed..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={handleSend} disabled={loading || !input.trim()} className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-lg active:scale-90 transition-all">
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex bg-[#0d1117] p-8 overflow-y-auto">
              <div className="w-full max-w-lg mx-auto">
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FolderOpenIcon className="w-5 h-5 text-indigo-400" />
                  Proposed Project Tree
                </h3>
                <div className="bg-[#161b22] rounded-3xl p-6 border border-gray-800 shadow-inner">
                  {renderTree(projectStructure)}
                </div>
                <div className="mt-8 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                  <h4 className="text-indigo-400 font-bold text-xs mb-2">Architect's Note</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    This structure follows the <strong>lib/</strong> architecture you requested. It separates logic (services) from presentation (views) to prevent module loading errors and "missing node" conflicts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeArchitectBot;