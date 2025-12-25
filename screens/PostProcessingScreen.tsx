import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronLeftIcon, 
  CommandLineIcon, 
  LinkIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import CodeArchitectBot from '../components/CodeArchitectBot';

const PostProcessingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Project configuration');
  const [saveLoading, setSaveLoading] = useState(false);
  const [showArchitect, setShowArchitect] = useState(false);
  
  // GitHub Deployment State
  const [githubUser, setGithubUser] = useState(localStorage.getItem('github_user') || '');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const generatedUrl = githubUser 
    ? `https://${githubUser.toLowerCase().replace(/\s+/g, '')}.github.io/MeraRoom` 
    : 'https://[username].github.io/MeraRoom';

  useEffect(() => {
    localStorage.setItem('github_user', githubUser);
  }, [githubUser]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const menuItems = [
    { name: 'Project overview', path: '#' },
    { name: 'Project configuration', path: '#', active: true },
    { name: 'Deploys', path: '#' },
    { name: 'GitHub Deployment', path: '#' },
    { name: 'Logs & metrics', path: '#' },
    { name: 'Domain management', path: '#' },
  ];

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => setSaveLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 flex flex-col animate-fade-in transition-colors">
      {showArchitect && <CodeArchitectBot onClose={() => setShowArchitect(false)} />}

      {/* Mobile Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white">Optimization Dashboard</h1>
        </div>
        
        <button 
          onClick={() => setShowArchitect(true)}
          className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <CommandLineIcon className="w-4 h-4" />
          MeraArchitect
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 p-6 space-y-1 transition-colors">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                item.name === activeTab 
                  ? `${theme.text} bg-${theme.primaryLight} dark:bg-white/5 border-l-4 border-${theme.primary}` 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="flex items-center justify-between">
                {item.name}
                {item.name === 'Logs & metrics' && <ChevronDownIcon className="w-3 h-3" />}
              </span>
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8 pb-32">
          
          {/* AI Architect Hero Card */}
          <div className="bg-gradient-to-br from-gray-900 to-indigo-950 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-400/30 transition-all duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center">
                <CpuChipIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Technical Architect</h2>
              <p className="text-gray-300 text-sm max-w-lg leading-relaxed font-medium">
                Need help fixing deployment errors or arranging your project data? Launch the 
                MeraArchitect bot for high-budget technical reasoning.
              </p>
              <button 
                onClick={() => setShowArchitect(true)}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
              >
                <CommandLineIcon className="w-5 h-5" />
                Launch Fixer Console
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post processing & Deployment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Control the post processing and GitHub deployment settings for MeraRoom.
            </p>
          </div>

          {/* GitHub Deployment Card */}
          <div className="bg-[#0d1117] text-white border border-gray-800 rounded-2xl shadow-xl overflow-hidden group">
            <div className="p-6 border-b border-gray-800 bg-[#161b22] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-6 h-6" alt="GitHub" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">{t('github_deploy')}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">GitHub Pages Assistant</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                Ready to Sync
              </span>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('github_user')}</label>
                  <input 
                    type="text" 
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="e.g. janesmith"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl py-4 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-400"
                  />
                </div>

                <div className="bg-[#161b22] rounded-2xl p-6 border border-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{t('generated_url')}</p>
                      <p className={`text-sm font-mono font-bold ${githubUser ? 'text-indigo-400' : 'text-gray-600'}`}>
                        {generatedUrl}
                      </p>
                    </div>
                    <button 
                      onClick={handleCopyUrl}
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all active:scale-90"
                    >
                      {showCopySuccess ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" /> : <ClipboardDocumentIcon className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <CodeBracketIcon className="w-4 h-4" /> 1. Create Repo
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Create a new repository named <span className="text-white font-bold">"MeraRoom"</span> on your GitHub account.
                  </p>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <GlobeAltIcon className="w-4 h-4" /> 2. Enable Pages
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Go to Settings &gt; Pages and select <span className="text-white font-bold">"main"</span> branch as the source.
                  </p>
                </div>
              </div>

              <button 
                className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                onClick={() => window.open('https://github.com/new', '_blank')}
              >
                Go to GitHub <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Snippet Injection Card (Standard Optimizations) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Snippet injection
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Inject SEO meta-tags or custom analytics scripts into the details page of your listings.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Injection Point</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 rounded-md py-3 px-3 text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors">
                      <option>Insert before &lt;/head&gt;</option>
                      <option>Insert after &lt;body&gt;</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-3.5 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Snippet name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Google Analytics" 
                    className="w-full border border-gray-200 dark:border-white/5 bg-white dark:bg-slate-800 rounded-md py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HTML Markup</label>
                  <textarea 
                    rows={4}
                    placeholder="<!-- Add your script here -->"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 rounded-md py-3 px-3 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSave}
                  className={`bg-[#31cbd2] hover:bg-[#2bb2b9] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm transition-all`}
                >
                  {saveLoading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostProcessingScreen;