
import React, { useState, useEffect } from 'react';
import { DevicePhoneMobileIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const InstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the app is already installed/in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasClosedBanner = localStorage.getItem('install_banner_closed');
    
    // Only show if mobile, not standalone, and not recently closed
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && !isStandalone && !hasClosedBanner) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    localStorage.setItem('install_banner_closed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[60] animate-slide-up">
      <div className="bg-indigo-900 rounded-3xl p-5 shadow-2xl border border-white/20 flex items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-110">
          <DevicePhoneMobileIcon className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <ArrowDownTrayIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-black text-sm">Experience the App</h4>
            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Install for offline access</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => window.location.href = '#/profile'} 
            className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all"
          >
            Install Now
          </button>
          <button onClick={closeBanner} className="p-1 text-indigo-300">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
