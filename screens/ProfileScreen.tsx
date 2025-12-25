
import React, { useState, useEffect } from 'react';
import { useTranslation, Language } from '../context/LanguageContext.tsx';
import { useInstall } from '../context/InstallContext.tsx';
import { useTheme, ThemeColor } from '../context/ThemeContext.tsx';
import { useAdBlock } from '../context/AdBlockContext.tsx';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  CheckIcon, 
  ShieldCheckIcon, 
  LanguageIcon,
  SparklesIcon,
  ShareIcon,
  SwatchIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon as HeroXMarkIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { isInstallable, isInstalled, promptInstall } = useInstall();
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { adBlockActive, toggleAdBlock } = useAdBlock();
  const navigate = useNavigate();
  
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState<string>('Guest User');
  const [tempName, setTempName] = useState<string>('');
  const [showShareDrawer, setShowShareDrawer] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
      setTempName(storedName);
    } else {
      setTempName('Guest User');
    }
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      localStorage.setItem('user_name', tempName);
      setUserName(tempName);
      setIsEditingName(false);
      setShowToast("Name Updated");
      setTimeout(() => setShowToast(null), 3000);
      window.dispatchEvent(new Event('user_name_updated'));
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url);
    setShowToast(t('link_copied'));
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSocialShare = (platform: 'whatsapp' | 'native') => {
    const shareText = t('app_share_msg');
    const shareUrl = window.location.origin + window.location.pathname;

    if (platform === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
      window.open(url, '_blank');
    } else if (platform === 'native' && navigator.share) {
      navigator.share({
        title: 'MeraRoom',
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    }
    setShowShareDrawer(false);
  };

  return (
    <div className="flex flex-col animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 relative transition-colors duration-300">
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 border border-white/10 animate-slide-up">
          <CheckIcon className="w-4 h-4 text-emerald-400" />
          {showToast}
        </div>
      )}

      <header className="bg-white dark:bg-slate-900 p-6 pb-12 rounded-b-[50px] shadow-sm relative overflow-hidden text-center transition-colors">
        <div className={`absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-${theme.primaryLight} dark:bg-white/5 rounded-full blur-3xl opacity-50`}></div>
        <div className={`w-24 h-24 bg-gradient-to-tr from-${theme.primary} to-${theme.primaryDark} rounded-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl mx-auto rotate-3 mb-4 transition-all duration-500`}>
          <UserCircleIcon className="w-16 h-16 text-white" />
        </div>
        
        {isEditingName ? (
          <div className="relative z-10 max-w-xs mx-auto space-y-3">
             <input 
              autoFocus
              className={`w-full bg-slate-50 dark:bg-slate-800 border-2 border-${theme.primary} rounded-xl py-2 px-4 text-center font-black text-xl outline-none text-gray-900 dark:text-white`}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
             />
             <div className="flex gap-2">
               <button onClick={() => setIsEditingName(false)} className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 py-2 rounded-lg text-xs font-bold uppercase">Cancel</button>
               <button onClick={handleSaveName} className={`flex-1 ${theme.bg} text-white py-2 rounded-lg text-xs font-bold uppercase shadow-lg shadow-${theme.primary}/20`}>{t('save_name')}</button>
             </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{userName}</h1>
            <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <PencilSquareIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
        
        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-tight mt-1">{t('privacy_controls')}</p>
      </header>

      <div className="px-6 -mt-8 space-y-6">
        {/* Appearance Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Appearance</h2>
            <MoonIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-orange-50 text-orange-500'}`}>
                  {isDarkMode ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isDarkMode ? 'Battery Saver Active' : 'Light Mode Active'}</p>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'left-7' : 'left-1'}`}>
                   {isDarkMode ? <MoonIcon className="w-3 h-3 text-indigo-600" /> : <SunIcon className="w-3 h-3 text-orange-500" />}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('invite_friends')}</h2>
            <SparklesIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Love using MeraRoom? Spread the word and help others find their next home!</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleSocialShare('whatsapp')}
                  className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 py-3 rounded-2xl text-xs font-black uppercase tracking-wider"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  WhatsApp
                </button>
                <button 
                  onClick={() => setShowShareDrawer(true)}
                  className={`flex items-center justify-center gap-2 bg-${theme.primaryLight} dark:bg-white/5 ${theme.text} dark:text-indigo-400 py-3 rounded-2xl text-xs font-black uppercase tracking-wider`}
                >
                  <ShareIcon className="w-4 h-4" />
                  {t('more_options')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Blocker Setting */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('ad_blocker')}</h2>
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${adBlockActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                  {adBlockActive ? <ShieldCheckIcon className="w-6 h-6" /> : <ShieldExclamationIcon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Clean Feed Mode</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{adBlockActive ? 'Blocking Sponsored Content' : 'Showing All Content'}</p>
                </div>
              </div>
              <button 
                onClick={toggleAdBlock}
                className={`w-12 h-6 rounded-full relative transition-colors ${adBlockActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${adBlockActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Theme Selection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">App Theme</h2>
            <SwatchIcon className={`w-4 h-4 ${theme.text}`} />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col gap-4">
             <div className="flex justify-between items-center">
               {['indigo', 'emerald', 'rose', 'amber', 'slate'].map((id) => (
                 <button
                   key={id}
                   onClick={() => setTheme(id as ThemeColor)}
                   className={`relative w-10 h-10 rounded-full bg-${id}-600 shadow-lg transition-transform active:scale-90 ${theme.id === id ? 'ring-4 ring-offset-4 ring-gray-200 dark:ring-slate-700' : ''}`}
                 >
                   {theme.id === id && <CheckIcon className="w-5 h-5 text-white absolute inset-0 m-auto" />}
                 </button>
               ))}
             </div>
          </div>
        </section>

        {/* Language Selection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('language')}</h2>
            <LanguageIcon className={`w-4 h-4 ${theme.text}`} />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-2 border border-gray-100 dark:border-white/5 flex shadow-sm">
            <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${language === 'en' ? `${theme.bg} text-white shadow-lg` : 'text-gray-400'}`}>English</button>
            <button onClick={() => setLanguage('hi')} className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${language === 'hi' ? `${theme.bg} text-white shadow-lg` : 'text-gray-400'}`}>हिन्दी</button>
          </div>
        </section>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-10">MeraRoom v1.8.0 • Shield Enabled</p>
      </div>

      {/* Share Drawer */}
      {showShareDrawer && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareDrawer(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-t-[40px] p-8 space-y-6 relative z-10 animate-slide-up shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{t('share_app')}</h3>
              <button onClick={() => setShowShareDrawer(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                <HeroXMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{t('copy_link')}</span>
              </button>
              {navigator.share && (
                <button 
                  onClick={() => handleSocialShare('native')}
                  className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <ShareIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{t('more_options')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
