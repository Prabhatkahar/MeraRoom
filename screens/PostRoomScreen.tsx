
import React, { useState, useRef } from 'react';
import { 
  CameraIcon, 
  SparklesIcon, 
  ChevronLeftIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  LinkIcon,
  PhotoIcon,
  PhoneIcon,
  BanknotesIcon,
  MapPinIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { PropertyType, RentCycle } from '../types';
import { generateRoomDescription } from '../services/geminiService';

const PostRoomScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: PropertyType.ROOM,
    cycle: RentCycle.MONTHLY,
    description: '',
    amenities: [] as string[],
    ownerPhone: '',
    ownerUpi: '',
    paymentPhone: ''
  });

  const availableAmenities = ['WiFi', 'AC', 'Attached Bath', 'Laundry', 'Security', 'Parking', 'Backup Power', 'Mess', 'Kitchen'];

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const handleAiDescription = async () => {
    if (!formData.title || !formData.location) {
      setToast("Please enter title and location first");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setLoading(true);
    const desc = await generateRoomDescription(formData.title, formData.location, formData.amenities);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const simulateUpload = () => {
    if (!formData.ownerPhone) {
      setToast("Please add your contact number");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setUploading(true);
    const statuses = ['Optimizing images...', 'Syncing with Cloud...', 'Publishing to Feed...'];
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setIsSuccess(true);
        }, 800);
      }
      setUploadProgress(progress);
      setUploadStatus(statuses[Math.floor((progress / 100) * statuses.length)] || 'Finishing...');
    }, 400);
  };

  const handleMediaChoice = (source: 'camera' | 'gallery') => {
    setShowMediaPicker(false);
    if (source === 'camera') {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-white">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircleIcon className="w-14 h-14 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Live on Web!</h1>
        <p className="text-gray-500 font-medium mb-10">Your property is now visible to renters.</p>
        <button onClick={() => navigate('/')} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
          <GlobeAltIcon className="w-5 h-5" /> View Feed
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 relative min-h-screen bg-slate-50">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl animate-slide-up">
          {toast}
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-10 text-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Publishing...</h2>
          <p className="text-indigo-600 font-bold text-sm">{uploadStatus}</p>
        </div>
      )}

      <header className="p-4 flex items-center border-b sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2"><ChevronLeftIcon className="w-6 h-6 text-gray-700" /></button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900 mr-8">Post Listing</h1>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); simulateUpload(); }} className="p-6 space-y-8">
        {/* Media Section */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Property Photos</label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="aspect-square bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CameraIcon className="w-8 h-8 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</span>
            </button>
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="aspect-square bg-gray-100 rounded-2xl" />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" />
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" />
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Property Details</label>
          <div className="relative">
            <input 
              type="text" placeholder="Listing Title" required
              className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="relative">
            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" placeholder="Location (City, Area)" required
              className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <BanknotesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="number" placeholder="Monthly Rent" required
                className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <select 
              className="w-full bg-white border border-gray-100 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-500"
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
            >
              {Object.values(PropertyType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Information</label>
          <div className="relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="tel" placeholder="Mobile Number (e.g. 03001234567)" required
              className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-bold text-gray-700"
              value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
            />
          </div>
        </div>

        {/* AI Description */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <button 
              type="button"
              onClick={handleAiDescription}
              disabled={loading}
              className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              {loading ? 'Thinking...' : 'AI Generate'}
            </button>
          </div>
          <textarea 
            placeholder="Tell us about the space, house rules, and who you're looking for..."
            rows={4}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Amenities</label>
          <div className="grid grid-cols-3 gap-2">
            {availableAmenities.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`py-2.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  formData.amenities.includes(amenity) 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-gray-500 border-gray-100'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Payment Option (Optional) */}
        <div className="bg-slate-100 rounded-[32px] p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BanknotesIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Payment Security (Optional)</h3>
          </div>
          <p className="text-[10px] text-gray-500 font-bold leading-relaxed px-1">
            Allow tenants to see your payment info for direct booking security.
          </p>
          <input 
            type="text" placeholder="UPI ID (optional)"
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none text-xs"
            value={formData.ownerUpi} onChange={e => setFormData({...formData, ownerUpi: e.target.value})}
          />
          <input 
            type="tel" placeholder="Easypaisa/JazzCash No. (optional)"
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none text-xs"
            value={formData.paymentPhone} onChange={e => setFormData({...formData, paymentPhone: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <CloudArrowUpIcon className="w-6 h-6" />
          Upload Listing
        </button>
      </form>

      {/* Media Picker Sheet */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMediaPicker(false)} />
          <div className="bg-white rounded-t-[32px] p-8 space-y-4 relative z-10 animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
            <h3 className="text-lg font-black text-gray-900 mb-2">Select Source</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleMediaChoice('camera')}
                className="bg-indigo-50 p-6 rounded-[24px] flex flex-col items-center gap-2 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="bg-indigo-600 p-3 rounded-full text-white shadow-lg">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <span className="font-bold text-indigo-900 text-sm">Open Camera</span>
              </button>
              <button 
                onClick={() => handleMediaChoice('gallery')}
                className="bg-slate-50 p-6 rounded-[24px] flex flex-col items-center gap-2 border border-slate-100 active:scale-95 transition-all"
              >
                <div className="bg-white p-3 rounded-full text-slate-600 shadow-sm border border-slate-100">
                  <PhotoIcon className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 text-sm">Pick Gallery</span>
              </button>
            </div>
            <button onClick={() => setShowMediaPicker(false)} className="w-full py-4 text-gray-400 font-bold text-sm mt-4">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostRoomScreen;
