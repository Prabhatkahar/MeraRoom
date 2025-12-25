import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import HomeScreen from './screens/HomeScreen.tsx';
import PostRoomScreen from './screens/PostRoomScreen.tsx';
import RoomDetailScreen from './screens/RoomDetailScreen.tsx';
import InquiriesScreen from './screens/InquiriesScreen.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import SavedRoomsScreen from './screens/SavedRoomsScreen.tsx';
import PostProcessingScreen from './screens/PostProcessingScreen.tsx';
import InstallBanner from './components/InstallBanner.tsx';
import MeraBot from './components/MeraBot.tsx';
import { SavedRoomsProvider } from './context/SavedRoomsContext.tsx';
import { LanguageProvider, useTranslation } from './context/LanguageContext.tsx';
import { InstallProvider } from './context/InstallContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AdBlockProvider } from './context/AdBlockContext.tsx';
import { WifiIcon } from '@heroicons/react/24/solid';

const OfflineNotification: React.FC = () => {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-1.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest animate-fade-in">
      <WifiIcon className="w-3 h-3" />
      {t('working_offline')}
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="relative">
        <OfflineNotification />
        <Layout>
          <InstallBanner />
          <MeraBot />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/room/:id" element={<RoomDetailScreen />} />
            <Route path="/post" element={<PostRoomScreen />} />
            <Route path="/inquiries" element={<InquiriesScreen />} />
            <Route path="/saved" element={<SavedRoomsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/optimizations" element={<PostProcessingScreen />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <InstallProvider>
        <LanguageProvider>
          <AdBlockProvider>
            <SavedRoomsProvider>
              <AppContent />
            </SavedRoomsProvider>
          </AdBlockProvider>
        </LanguageProvider>
      </InstallProvider>
    </ThemeProvider>
  );
};

export default App;