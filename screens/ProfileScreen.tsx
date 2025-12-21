
import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  ArrowDownTrayIcon, 
  BellIcon,
  ChevronRightIcon,
  ShareIcon,
  CheckIcon,
  QrCodeIcon,
  GlobeAltIcon,
  ArrowUpOnSquareIcon,
  EllipsisVerticalIcon,
  MoonIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CameraIcon,
  MapPinIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const ProfileScreen: React.FC = () => {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState({
    camera: 'unknown',
    location: 'unknown'
  });

  const APP_URL = "https://meraroom.web.app";

  useEffect(() => {
    // Attempting to check permission status if supported by browser
    if ('permissions' in navigator) {
      Promise.all([
        navigator.permissions.query({ name: 'camera' as any }).catch(() => null),
        navigator.permissions.query({ name: 'geolocation' as any }).catch(() => null)
      ]).then(([camera, geo]) => {
        setPermissionStatus({
          camera: camera?.state || 'unknown',
          location: geo?.state || 'unknown'
        });
      });
    }
  }, []);

  const copyWebsiteLink = () => {
    navigator.clipboard.writeText(APP_URL);
    setShowToast("Link Copied!");
    setTimeout(() => setShowToast(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'bg-emerald-100 text-emerald-700';
      case 'denied': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col animate-fade-in bg-slate-50 min-h-screen pb-24 relative">
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 border border-white/10 animate-slide-up">
          <CheckIcon className="w-4 h-4 text-emerald-400" />
          {showToast}
        </div>
      )}

      <header className="bg-white p-6 pb-12 rounded-b-[50px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl rotate-3">
            <UserCircleIcon className="w-16 h-16 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Guest User</h1>
            <p className="text-gray-500 font-bold text-sm tracking-tight">Manage Your Privacy</p>
          </div>
        </div>
      </header>

      <div className="px-6 -mt-8 space-y-6">
        {/* Hardware Permissions Manager */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Privacy Controls</h2>
            <div className="p-1 rounded-full bg-indigo-50">
              <ShieldCheckIcon className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 block">Location Access</span>
                  <span className="text-[10px] text-gray-400 font-medium italic">Only used for searching</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(permissionStatus.location)}`}>
                {permissionStatus.location}
              </span>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <CameraIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 block">Camera Access</span>
                  <span className="text-[10px] text-gray-400 font-medium italic">For property photos</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(permissionStatus.camera)}`}>
                {permissionStatus.camera}
              </span>
            </div>
          </div>
          <p className="px-4 text-[9px] text-gray-400 font-bold leading-relaxed">
            <ExclamationCircleIcon className="w-3 h-3 inline mr-1 -mt-0.5" />
            We only ask for permission when you click on relevant features. You can change these anytime in browser settings.
          </p>
        </section>

        {/* Support & Links */}
        <div className="bg-indigo-900 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-110">
            <GlobeAltIcon className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-white font-black text-lg">MeraRoom Web App</h3>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <span className="text-indigo-50 font-black text-sm truncate pr-4">{APP_URL.replace('https://', '')}</span>
              <button onClick={copyWebsiteLink} className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Copy</button>
            </div>
            <button onClick={() => window.location.href = '#/'} className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
              <ShareIcon className="w-5 h-5" /> Invite To App
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-10">
          MeraRoom v1.4.0 • User Controlled
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
