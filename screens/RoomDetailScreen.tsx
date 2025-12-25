
import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  HeartIcon, 
  ShareIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ChatBubbleOvalLeftEllipsisIcon,
  CheckBadgeIcon,
  CheckIcon,
  WifiIcon,
  ShieldCheckIcon,
  KeyIcon,
  TruckIcon,
  BoltIcon,
  HomeModernIcon,
  SparklesIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  XMarkIcon as HeroXMarkIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon } from '@heroicons/react/24/solid';
import { MOCK_ROOMS } from '../constants';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { Room } from '../types';

const getAmenityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('wifi')) return <WifiIcon className="w-5 h-5" />;
  if (n.includes('ac') || n.includes('air')) return <SparklesIcon className="w-5 h-5" />;
  if (n.includes('security')) return <ShieldCheckIcon className="w-5 h-5" />;
  if (n.includes('parking')) return <TruckIcon className="w-5 h-5" />;
  if (n.includes('backup') || n.includes('power')) return <BoltIcon className="w-5 h-5" />;
  if (n.includes('bath')) return <KeyIcon className="w-5 h-5" />;
  if (n.includes('kitchen')) return <HomeModernIcon className="w-5 h-5" />;
  return <CheckCircleIcon className="w-5 h-5" />;
};

const RoomDetailScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedRooms();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const room = useMemo(() => {
    const mockMatch = MOCK_ROOMS.find(r => r.id === id);
    if (mockMatch) return mockMatch;
    
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    return userPosts.find((r: Room) => r.id === id) as Room | undefined;
  }, [id]);

  const saved = id ? isSaved(id) : false;

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!room) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
        <HeroXMarkIcon className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-xl font-black text-gray-900">Property Not Found</h2>
      <p className="text-gray-500 text-sm">This listing might have been removed or doesn't exist.</p>
      <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100">Go Home</button>
    </div>
  );

  const shareText = `🔥 Hot Deal on MeraRoom!\n\nCheck out this ${room.type} in ${room.location}.\nPrice: Rs. ${room.price.toLocaleString()}/mo\n\nView details:`;
  const shareUrl = window.location.href;

  const handleSocialShare = (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    let url = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
    }
    window.open(url, '_blank');
    setShowShareDrawer(false);
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `MeraRoom: ${room.title}`, text: shareText, url: shareUrl });
      } catch (err) { 
        console.log('Error sharing:', err); 
        setShowShareDrawer(true);
      }
    } else {
      setShowShareDrawer(true);
    }
  };

  return (
    <div className="flex flex-col pb-40 animate-fade-in relative bg-white">
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10 animate-slide-up">
          <CheckIcon className="w-4 h-4 text-emerald-400" />
          {showToast}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleSystemShare}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <ShareIcon className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={() => room.id && toggleSave(room.id)}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            {saved ? <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5 text-gray-900" />}
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[400px] bg-slate-100 overflow-hidden">
        <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-10 right-6 flex items-center gap-2">
           <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black border border-white/20 uppercase tracking-widest">
            {room.rentCycle}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-[40px] -mt-10 p-8 space-y-8 relative z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
        {/* Header Info */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{room.type}</span>
              {room.isPremium && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <StarIcon className="w-3 h-3" /> Premium
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">{room.title}</h1>
            <div className="flex items-center text-gray-500 font-bold text-sm">
              <MapPinIcon className="w-4 h-4 mr-1.5 text-indigo-500" />
              {room.location}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-indigo-600">Rs. {room.price.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fixed Rent</p>
          </div>
        </div>

        {/* Video Tour Section */}
        {room.video && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VideoCameraIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-gray-900">Virtual Video Tour</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">HD Quality</span>
            </div>
            <div 
              className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 bg-black group cursor-pointer"
              onClick={handleVideoPlay}
            >
              <video 
                ref={videoRef}
                src={room.video} 
                controls={isPlaying} 
                playsInline
                className="w-full h-full object-cover"
                poster={room.images[0]}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center transition-all duration-500">
                  <PlayCircleIcon className="w-20 h-20 text-white/90 drop-shadow-2xl animate-pulse" />
                  <p className="text-white text-[10px] font-black uppercase tracking-widest mt-4 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                    Tap to Watch Tour
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Description */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-gray-900">Description</h3>
          </div>
          <p className={`text-gray-600 text-sm leading-relaxed font-medium ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
            {room.description}
          </p>
          <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="text-indigo-600 text-xs font-black uppercase tracking-widest">
            {isDescExpanded ? 'Show less' : 'Read more'}
          </button>
        </section>

        {/* Amenities */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-gray-900">Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            {room.amenities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-indigo-600 bg-white p-2 rounded-xl shadow-sm">{getAmenityIcon(a)}</div>
                <span className="text-xs text-gray-700 font-bold">{a}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Host */}
        <section className="pt-6 border-t border-gray-100">
          <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4">
            <div className="relative">
              <img src={room.ownerPhoto} alt={room.ownerName} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1 rounded-full border border-white">
                <CheckBadgeIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900">{room.ownerName}</h4>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Verified Owner</p>
            </div>
          </div>
        </section>
      </div>

      {/* Share Drawer */}
      {showShareDrawer && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareDrawer(false)} />
          <div className="bg-white rounded-t-[40px] p-8 space-y-6 relative z-10 animate-slide-up shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Share Listing</h3>
              <button onClick={() => setShowShareDrawer(false)} className="p-2 bg-gray-100 rounded-full">
                <HeroXMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                   <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase">WhatsApp</span>
              </button>
              <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                   <ShareIcon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase">Facebook</span>
              </button>
              <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
                   <EllipsisHorizontalIcon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase">Twitter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-2xl border-t border-gray-100 z-40 pb-safe-area">
        <div className="max-w-md mx-auto flex gap-4">
          <button className="flex-[0.4] bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /> Chat
          </button>
          <a href={`tel:${room.ownerPhone}`} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95 transition-all">
            <PhoneIcon className="w-5 h-5" /> Call Owner
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailScreen;
