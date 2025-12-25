
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { 
  CameraIcon, 
  SparklesIcon, 
  ChevronLeftIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  PhoneIcon,
  BanknotesIcon,
  MapPinIcon,
  WifiIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlayIcon,
  StopIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { PropertyType, RentCycle, Room } from '../types';
import { generateRoomDescription } from '../services/geminiService';

const PostRoomScreen: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Camera & Recording States
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const [previews, setPreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

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

  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to resolve "Cannot find namespace 'NodeJS'" error in browser-based TypeScript environments.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { 
        setToast("Video too large (max 50MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      try {
        setCameraActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setToast("Camera/Mic access denied");
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (isRecording) stopRecording();
    setCameraActive(false);
  };

  const handleCaptureClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      videoChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result as string);
          setCameraActive(false);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAiDescription = async () => {
    if (!navigator.onLine) {
      setToast(t('working_offline'));
      return;
    }
    if (!formData.title || !formData.location) {
      setToast("Enter title and location first");
      return;
    }
    setLoading(true);
    const desc = await generateRoomDescription(formData.title, formData.location, formData.amenities);
    setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const simulateUpload = () => {
    if (!formData.ownerPhone) {
      setToast("Contact number required");
      return;
    }
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        const newRoom: Room = {
          id: `local-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          location: formData.location,
          type: formData.type,
          rentCycle: formData.cycle,
          images: previews.length > 0 ? previews : ['https://picsum.photos/seed/newpost/800/600'],
          video: videoPreview || undefined,
          amenities: formData.amenities,
          bedrooms: 1,
          ownerName: language === 'hi' ? 'आप (अतिथि)' : 'You (Guest)',
          ownerPhone: formData.ownerPhone,
          ownerPhoto: 'https://picsum.photos/seed/guest/100/100',
          ownerRating: 5.0,
          createdAt: new Date().toISOString(),
          isPremium: false
        };
        const existingLocalPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
        localStorage.setItem('user_posts', JSON.stringify([newRoom, ...existingLocalPosts]));
        setTimeout(() => {
          setUploading(false);
          setIsSuccess(true);
        }, 500);
      }
      setUploadStatus('Publishing listing...');
    }, 300);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-white dark:bg-slate-950 transition-colors">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircleIcon className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{navigator.onLine ? 'Live!' : 'Saved!'}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10">Property is ready for viewing.</p>
        <button onClick={() => navigate('/')} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
          <GlobeAltIcon className="w-5 h-5" /> View Feed
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl animate-slide-up flex items-center gap-2">
          {!navigator.onLine && <WifiIcon className="w-4 h-4 text-red-400" />}
          {toast}
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 mb-8 border-4 border-indigo-100 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin" />
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Processing Listing...</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{uploadStatus}</p>
        </div>
      )}

      <header className="p-4 flex items-center border-b dark:border-white/5 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2"><ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" /></button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900 dark:text-white mr-8">{t('post_listing')}</h1>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); simulateUpload(); }} className="p-6 space-y-8">
        {/* Media Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('property_details')}</label>
            <span className="text-[10px] font-black text-indigo-500 uppercase">{previews.length} / 6 Photos</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden shadow-sm group">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            {previews.length < 6 && (
              <button 
                type="button"
                onClick={() => toggleCamera()}
                className="aspect-square bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all border-2 border-dashed border-indigo-200 dark:border-indigo-500/20"
              >
                <CameraIcon className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
              </button>
            )}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all border-2 border-dashed border-gray-200 dark:border-white/5"
            >
              <PhotoIcon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            multiple 
            accept="image/*" 
          />
        </div>

        {/* Video Tour Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Video Tour</label>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Recommended</span>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1.5 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    {isRecording ? `REC ${formatTime(recordingTime)}` : 'VIEWFINDER'}
                  </div>
                </>
              ) : videoPreview ? (
                <video src={videoPreview} controls className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-gray-600 dark:text-gray-500 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <VideoCameraIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">No video captured yet</p>
                    <p className="text-[10px] font-medium opacity-60">Record a walkthrough for better matching</p>
                  </div>
                </div>
              )}
              
              {videoPreview && !cameraActive && (
                <button 
                  type="button"
                  onClick={() => setVideoPreview(null)}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white active:scale-90 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={toggleCamera}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${cameraActive ? 'bg-red-50 text-red-600 border-2 border-red-100' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none'}`}
              >
                {cameraActive ? <><NoSymbolIcon className="w-4 h-4" /> Close Camera</> : <><VideoCameraIcon className="w-4 h-4" /> Open Camera</>}
              </button>

              <button 
                type="button"
                disabled={!cameraActive}
                onClick={handleCaptureClick}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-300'} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isRecording ? <><StopIcon className="w-4 h-4" /> Stop Recording</> : <><PlayIcon className="w-4 h-4" /> Capture Video</>}
              </button>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={videoFileInputRef} 
            onChange={handleVideoSelect} 
            className="hidden" 
            accept="video/*" 
          />
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <input 
            type="text" placeholder={t('listing_title')} required
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 dark:text-white"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <div className="relative">
            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" placeholder={t('location_placeholder')} required
              className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 dark:text-white"
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <BanknotesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="number" placeholder={t('monthly_rent')} required
                className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 dark:text-white"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <select 
              className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 dark:text-white"
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PropertyType})}
            >
              {Object.values(PropertyType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('contact_info')}</label>
          <div className="relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="tel" placeholder={t('mobile_number')} required
              className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-bold text-gray-900 dark:text-white"
              value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
            />
          </div>
        </div>

        {/* AI Description */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('description')}</label>
            <button 
              type="button" onClick={handleAiDescription} disabled={loading}
              className="text-[10px] font-black uppercase flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              {loading ? 'Processing...' : t('ai_generate')}
            </button>
          </div>
          <textarea 
            rows={4}
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 dark:text-white"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 transition-all"
        >
          <CloudArrowUpIcon className="w-6 h-6" />
          {t('upload_listing')}
        </button>
      </form>
    </div>
  );
};

export default PostRoomScreen;
