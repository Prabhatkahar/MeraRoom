
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  PlusCircleIcon as PlusSolid, 
  HeartIcon as HeartSolid, 
  ChatBubbleLeftRightIcon as ChatSolid, 
  UserCircleIcon as UserSolid,
  CommandLineIcon as CommandLineSolid
} from '@heroicons/react/24/solid';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const [userName, setUserName] = useState<string>('Guest User');

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) setUserName(storedName);

    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('user_name');
      if (updatedName) setUserName(updatedName);
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('user_name_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user_name_updated', handleStorageChange);
    };
  }, []);
  
  const navItems = [
    { name: t('home'), path: '/', icon: HomeIcon, activeIcon: HomeSolid },
    { name: t('inquiries'), path: '/inquiries', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolid },
    { name: t('post'), path: '/post', icon: PlusCircleIcon, activeIcon: PlusSolid },
    { name: t('saved'), path: '/saved', icon: HeartIcon, activeIcon: HeartSolid },
    { name: t('profile'), path: '/profile', icon: UserCircleIcon, activeIcon: UserSolid },
    { name: 'Optimize', path: '/optimizations', icon: CommandLineIcon, activeIcon: CommandLineSolid },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 flex-col sticky top-0 h-screen z-50 shadow-sm transition-colors duration-300">
        <div className="p-8">
          <h1 className={`text-2xl font-black ${theme.text} tracking-tighter flex items-center gap-2 transition-colors`}>
            <span className={`w-8 h-8 ${theme.bg} rounded-lg flex items-center justify-center transition-colors`}>
              <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" className="w-5 h-5 brightness-0 invert" alt="" />
            </span>
            MeraRoom
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                    ? `bg-${theme.primaryLight} dark:bg-white/5 ${theme.text} dark:text-white shadow-sm` 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <item.activeIcon className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-white/5">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 bg-${theme.primaryLight} dark:bg-white/10 rounded-xl flex items-center justify-center ${theme.text} dark:text-white`}>
              <UserCircleIcon className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-gray-900 dark:text-white truncate">{userName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Active Status</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 px-2 pb-safe-area shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[60] transition-colors duration-300">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center space-y-1 transition-all ${
                  isActive ? `${theme.text} dark:text-white scale-110` : 'text-gray-400 dark:text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <item.activeIcon className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                  <span className="text-[10px] font-bold">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
