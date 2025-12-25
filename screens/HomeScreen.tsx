
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAdBlock } from '../context/AdBlockContext.tsx';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  StarIcon,
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import RoomCard from '../components/RoomCard.tsx';
import { MOCK_ROOMS, ALL_AMENITIES } from '../constants.ts';
import { PropertyType, Room } from '../types.ts';
import { searchAI } from '../services/geminiService.ts';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { adBlockActive, toggleAdBlock } = useAdBlock();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [localRooms, setLocalRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState<string>('');
  
  const [showAdBlockToast, setShowAdBlockToast] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('All');

  useEffect(() => {
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    setLocalRooms(userPosts);
    
    const storedName = localStorage.getItem('user_name');
    if (storedName) setUserName(storedName);
  }, []);

  const allRooms = useMemo(() => [...localRooms, ...MOCK_ROOMS], [localRooms]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice > 0) count++;
    if (maxPrice < 100000) count++;
    if (selectedAmenities.length > 0) count++;
    if (sortBy !== 'All') count++;
    if (selectedType !== 'All') count++;
    if (adBlockActive) count++;
    return count;
  }, [minPrice, maxPrice, selectedAmenities, sortBy, selectedType, adBlockActive]);

  const isAnyFilterActive = activeFilterCount > 0;

  const filteredRooms = useMemo(() => {
    let result = allRooms.filter(room => {
      const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || room.type === selectedType;
      const matchesPrice = room.price >= minPrice && room.price <= maxPrice;
      const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => room.amenities.includes(amenity));
      
      const matchesAdBlock = !adBlockActive || !room.isPremium;

      return matchesSearch && matchesType && matchesPrice && matchesAmenities && matchesAdBlock;
    });

    if (sortBy === 'Rating') {
      result = [...result].sort((a, b) => b.ownerRating - a.ownerRating);
    } else if (sortBy === 'PriceLow') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PriceHigh') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allRooms, searchQuery, selectedType, minPrice, maxPrice, selectedAmenities, sortBy, adBlockActive]);

  const handleToggleAdBlock = () => {
    toggleAdBlock();
    setShowAdBlockToast(true);
    setTimeout(() => setShowAdBlockToast(false), 2000);
  };

  const handleAiSearch = async () => {
    if (!navigator.onLine) return;
    if (!searchQuery) return;
    setIsAiSearching(true);
    const aiFilters = await searchAI(searchQuery);
    if (aiFilters) {
      if (aiFilters.propertyType) setSelectedType(aiFilters.propertyType);
      if (aiFilters.minPrice) setMinPrice(aiFilters.minPrice);
      if (aiFilters.maxPrice) setMaxPrice(aiFilters.maxPrice);
    }
    setIsAiSearching(false);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setSelectedAmenities([]);
    setSelectedType('All');
    setSortBy('All');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 animate-fade-in relative">
      {showAdBlockToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${adBlockActive ? 'bg-emerald-600/90 text-white border-emerald-400' : 'bg-gray-900/90 text-white border-white/10'}`}>
            {adBlockActive ? <ShieldCheckIcon className="w-5 h-5" /> : <ShieldExclamationIcon className="w-5 h-5" />}
            <span className="text-xs font-black uppercase tracking-widest">
              {adBlockActive ? t('ad_blocker_on') : t('ad_blocker_off')}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 sticky top-0 z-40 px-6 py-4 md:py-6 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center justify-between md:hidden mb-2">
            <h1 className={`text-xl font-black ${theme.text} dark:text-white tracking-tighter flex items-center gap-2`}>
              <span className={`w-7 h-7 ${theme.bg} rounded-lg flex items-center justify-center`}>
                <img src="https://cdn-icons-png.flaticon.com/512/609/609803.png" className="w-4 h-4 brightness-0 invert" alt="" />
              </span>
              MeraRoom
            </h1>
            <button 
              onClick={handleToggleAdBlock}
              className={`p-2 rounded-xl transition-all ${adBlockActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
            >
              <ShieldCheckIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden md:block">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
              {userName ? `${t('welcome_back')}, ${userName}` : 'Explore Properties'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Find your dream room across Pakistan</p>
          </div>

          <div className="flex-1 max-w-2xl flex items-center gap-3">
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                className={`w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:ring-2 ${theme.ring} focus:bg-white dark:focus:bg-slate-700 transition-all outline-none shadow-sm text-gray-900 dark:text-white ${adBlockActive ? 'ring-2 ring-emerald-400/30' : ''}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
              {isAiSearching && <div className={`absolute right-4 top-3.5 w-5 h-5 border-2 border-${theme.primary} border-t-transparent rounded-full animate-spin`} />}
            </div>
            
            <button 
              onClick={handleToggleAdBlock}
              title={t('ad_blocker')}
              className={`hidden md:flex p-3.5 rounded-2xl transition-all border items-center justify-center gap-2 ${adBlockActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 border-emerald-200 dark:border-emerald-500/30 shadow-sm' : 'bg-white dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-white/5'}`}
            >
              <ShieldCheckIcon className="w-6 h-6" />
              {adBlockActive && <span className="text-[10px] font-black uppercase tracking-widest">Ad-Free</span>}
            </button>

            <button 
              onClick={() => setShowFilters(true)}
              className={`p-3.5 rounded-2xl transition-all relative border flex items-center justify-center ${isAnyFilterActive ? `${theme.bg} text-white border-transparent shadow-lg` : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/5'}`}
            >
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 flex gap-3 overflow-x-auto hide-scrollbar">
          {['All', ...Object.values(PropertyType)].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${
                selectedType === type 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-slate-900 border-gray-900 dark:border-white' 
                  : `bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-${theme.primary}`
              }`}
            >
              {type === 'All' ? t('all') : type}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
              {filteredRooms.length} {t('properties_found')}
              {selectedType !== 'All' && <span className={`${theme.text} dark:text-indigo-400 font-medium text-sm`}>in {selectedType}s</span>}
            </h3>
            {adBlockActive && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <CheckIcon className="w-3 h-3" /> {t('organic_only')}
              </span>
            )}
          </div>
          {isAnyFilterActive && (
             <button onClick={resetFilters} className={`${theme.text} dark:text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline`}>{t('reset')}</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-32">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
              <MagnifyingGlassIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white transition-colors">No rooms match your search</h4>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto transition-colors">Try adjusting your filters or search for a broader location.</p>
            <button onClick={resetFilters} className={`${theme.bg} text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-${theme.primary}/20 transition-all`}>Clear All Filters</button>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-md relative z-10 h-full overflow-y-auto animate-slide-left shadow-2xl flex flex-col transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-xl text-gray-900 dark:text-white">Refine Search</h3>
                {activeFilterCount > 0 && (
                  <span className={`${theme.bg} text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <XMarkIcon className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </div>
            
            <div className="p-8 space-y-10 flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 bg-emerald-500 rounded-full`} />
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Content Control</label>
                </div>
                <button
                  onClick={handleToggleAdBlock}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${adBlockActive ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${adBlockActive ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500'}`}>
                      <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{t('ad_blocker')}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Hide Sponsored Results</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${adBlockActive ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adBlockActive ? 'left-7' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 ${theme.bg} rounded-full`} />
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Display Order</label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: t('all'), value: 'All', icon: ArrowsUpDownIcon, desc: 'Recommended first' },
                    { label: t('rating'), value: 'Rating', icon: StarIcon, desc: 'Highest rated owners' },
                    { label: t('price_low'), value: 'PriceLow', icon: BarsArrowUpIcon, desc: 'Affordable first' },
                    { label: t('price_high'), value: 'PriceHigh', icon: BarsArrowDownIcon, desc: 'Luxury first' }
                  ].map(sort => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-bold text-sm border transition-all ${sortBy === sort.value ? `${theme.bg} text-white border-transparent shadow-md` : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <sort.icon className="w-4 h-4" />
                        <div className="text-left">
                          <p className="block">{sort.label}</p>
                          <p className={`text-[10px] ${sortBy === sort.value ? 'text-white/70' : 'text-gray-400'} font-medium`}>{sort.desc}</p>
                        </div>
                      </div>
                      {sortBy === sort.value && <CheckIcon className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-4 ${theme.bg} rounded-full`} />
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Monthly Budget</label>
                  </div>
                  <span className={`${theme.text} dark:text-indigo-400 font-black text-lg`}>Rs. {maxPrice.toLocaleString()}</span>
                </div>
                
                <div className="px-2 space-y-3">
                   <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest">
                     <span>Min: Rs. 0</span>
                     <span>Max: Rs. 100k+</span>
                   </div>
                   <input 
                    type="range" min="0" max="100000" step="1000" value={maxPrice} 
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className={`w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${theme.primary} transition-all`}
                   />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 ${theme.bg} rounded-full`} />
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Property Category</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['All', ...Object.values(PropertyType)].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all text-center ${selectedType === type ? `${theme.bg} text-white border-transparent shadow-sm` : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 ${theme.bg} rounded-full`} />
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Must-Have Amenities</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity])}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold border transition-all ${selectedAmenities.includes(amenity) ? `${theme.bg} text-white border-transparent shadow-sm` : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'}`}
                    >
                      {amenity}
                      {selectedAmenities.includes(amenity) && <CheckIcon className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/5 sticky bottom-0 flex gap-3 transition-colors">
              <button 
                onClick={resetFilters}
                className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowFilters(false)} 
                className={`flex-[2] ${theme.bg} text-white font-black py-4 rounded-2xl shadow-xl shadow-${theme.primary}/20 transition-all flex items-center justify-center gap-2 text-sm`}
              >
                Show {filteredRooms.length} Properties
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
