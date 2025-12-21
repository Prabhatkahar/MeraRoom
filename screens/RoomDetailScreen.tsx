import React, { useState } from 'react';
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
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  GlobeAltIcon,
  LinkIcon,
  ArrowUpOnSquareIcon,
  XMarkIcon as HeroXMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon } from '@heroicons/react/24/solid';
import { MOCK_ROOMS } from '../constants';
import { useSavedRooms } from '../context/SavedRoomsContext';

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
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  
  const room = MOCK_ROOMS.find(r => r.id === id);
  const saved = id ? isSaved(id) : false;

  if (!room) return <div className="p-20 text-center font-bold text-gray-500">Property not found</div>;

  const shareText = `🔥 Hot Deal on MeraRoom!\n\nCheck out this ${room.type} in ${room.location}.\nPrice: Rs. ${room.price.toLocaleString()}/mo\n\nView details:`;
  const shareUrl = window.location.href;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(`${label} Copied`);
    setTimeout(() => setShowToast(null), 2000);
    if (showShareDrawer) setShowShareDrawer(false);
  };

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
      {/* Toast Notification */}
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

        {/* Quick Social Share Buttons */}
        <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShareIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Share with friends</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase">
              <SparklesIcon className="w-3 h-3" />
              Viral Now
            </div>
          </div>
          <div className="flex justify-between gap-4">
            {[
              { id: 'whatsapp', name: 'WhatsApp', color: 'bg-emerald-500', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
              { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
              { id: 'twitter', name: 'Twitter', color: 'bg-black', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968830.png' }
            ].map(platform => (
              <button 
                key={platform.id}
                onClick={() => handleSocialShare(platform.id as any)}
                className="flex-1 flex flex-col items-center gap-2 group active:scale-90 transition-all"
              >
                <div className={`${platform.color} w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-100 transition-all p-4`}>
                  <img src={platform.icon} alt={platform.name} className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{platform.name}</span>
              </button>
            ))}
            <button 
              onClick={() => setShowShareDrawer(true)}
              className="flex-1 flex flex-col items-center gap-2 group active:scale-90 transition-all"
            >
              <div className="bg-white border-2 border-slate-200 w-14 h-14 rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-slate-50 transition-all">
                <EllipsisHorizontalIcon className="w-6 h-6 text-slate-600" />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">More</span>
            </button>
          </div>
        </section>

        {/* Payment & Reservation */}
        {(room.ownerUpi || room.paymentPhone) && (
          <section className="bg-indigo-950 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-10 -mr-6 -mt-6">
              <BanknotesIcon className="w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Direct Booking</h3>
                  <p className="text-[10px] text-indigo-300 font-bold">Secure your spot instantly</p>
                </div>
              </div>

              <div className="space-y-3">
                {room.ownerUpi && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">UPI ID</p>
                      <p className="text-sm font-bold truncate pr-4">{room.ownerUpi}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(room.ownerUpi!, 'UPI ID')}
                      className="bg-white text-indigo-900 p-2.5 rounded-xl shadow-lg active:scale-90 transition-all"
                    >
                      <ClipboardDocumentCheckIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
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
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleCopy(shareUrl, 'Link')}
                className="bg-indigo-50 p-6 rounded-[24px] flex flex-col items-center gap-3 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <span className="font-black text-indigo-900 text-xs uppercase tracking-widest">Copy Link</span>
              </button>
              <button 
                onClick={handleSystemShare}
                className="bg-slate-50 p-6 rounded-[24px] flex flex-col items-center gap-3 border border-slate-100 active:scale-95 transition-all"
              >
                <div className="bg-white p-3 rounded-2xl text-slate-600 shadow-sm border border-slate-200">
                  <ArrowUpOnSquareIcon className="w-6 h-6" />
                </div>
                <span className="font-black text-slate-900 text-xs uppercase tracking-widest">More Options</span>
              </button>
            </div>

            <div className="flex gap-4 pt-4 overflow-x-auto hide-scrollbar">
              {[
                { id: 'whatsapp', name: 'WhatsApp', color: 'bg-emerald-500', icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' },
                { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' },
                { id: 'twitter', name: 'Twitter', color: 'bg-black', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968830.png' }
              ].map(platform => (
                <button 
                  key={platform.id}
                  onClick={() => handleSocialShare(platform.id as any)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 active:scale-90 transition-all"
                >
                  <div className={`${platform.color} w-16 h-16 rounded-3xl flex items-center justify-center p-4`}>
                    <img src={platform.icon} alt={platform.name} className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{platform.name}</span>
                </button>
              ))}
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

const EllipsisHorizontalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

export default RoomDetailScreen;
