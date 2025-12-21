
import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  SparklesIcon, 
  XMarkIcon,
  CheckIcon,
  StarIcon,
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import RoomCard from '../components/RoomCard';
import { MOCK_ROOMS, ALL_AMENITIES } from '../constants';
import { PropertyType } from '../types';
import { searchAI } from '../services/geminiService';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('All');

  const isPriceFiltered = minPrice > 0 || maxPrice < 100000;
  const isBedroomsFiltered = bedrooms !== null;
  const isAmenitiesFiltered = selectedAmenities.length > 0;
  const isSortActive = sortBy !== 'All';
  const isAnyFilterActive = isPriceFiltered || isBedroomsFiltered || isAmenitiesFiltered || isSortActive;

  const filteredRooms = useMemo(() => {
    let result = MOCK_ROOMS.filter(room => {
      const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || room.type === selectedType;
      const matchesPrice = room.price >= minPrice && room.price <= maxPrice;
      const matchesBedrooms = bedrooms === null || room.bedrooms === bedrooms || (bedrooms === 4 && room.bedrooms >= 4);
      const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => room.amenities.includes(amenity));

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms && matchesAmenities;
    });

    if (sortBy === 'Rating') {
      result = [...result].sort((a, b) => b.ownerRating - a.ownerRating);
    } else if (sortBy === 'PriceLow') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PriceHigh') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedType, minPrice, maxPrice, bedrooms, selectedAmenities, sortBy]);

  const handleAiSearch = async () => {
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

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Location not supported");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mocking finding the nearest location name for the demo
        setSearchQuery("Lahore"); // Typically you'd use reverse geocoding here
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location Access Denied");
        }
      }
    );
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setBedrooms(null);
    setSelectedAmenities([]);
    setSelectedType('All');
    setSortBy('All');
    setSearchQuery('');
    setLocationError(null);
  };

  const priceGap = 5000;
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (maxPrice - val >= priceGap) setMinPrice(val);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val - minPrice >= priceGap) setMaxPrice(val);
  };

  const leftPercent = (minPrice / 100000) * 100;
  const rightPercent = 100 - (maxPrice / 100000) * 100;

  return (
    <div className="flex flex-col animate-fade-in relative min-h-screen bg-slate-50">
      <header className="p-6 pb-2 sticky top-0 bg-white/90 backdrop-blur-xl z-30 shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">MeraRoom</h1>
            <p className="text-gray-500 text-sm font-medium">Smart discovery</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 group">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search or try AI..."
              className="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-11 pr-14 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
            <button 
              onClick={handleGetLocation}
              disabled={isLocating}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${isLocating ? 'animate-pulse text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
              title="Find near me"
            >
              <MapPinIcon className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className={`p-3.5 rounded-2xl transition-all relative ${isAnyFilterActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6" />
            {isAnyFilterActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
            )}
          </button>
        </div>

        {locationError && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between animate-fade-in">
            <span>{locationError}</span>
            <button onClick={() => setLocationError(null)}><XMarkIcon className="w-3 h-3" /></button>
          </div>
        )}

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-1 px-1">
          {['All', ...Object.values(PropertyType)].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedType === type ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-100'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="px-6 space-y-6 pt-6 pb-24">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'Property' : 'Properties'} Found
          </h2>
          {isAnyFilterActive && (
             <button onClick={resetFilters} className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Reset</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="bg-white rounded-t-[32px] relative z-10 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="p-6 sticky top-0 bg-white border-b border-gray-100 z-10 flex justify-between items-center">
              <button onClick={() => setShowFilters(false)} className="p-1"><XMarkIcon className="w-6 h-6 text-gray-900" /></button>
              <h3 className="font-black text-lg text-gray-900">Filter & Sort</h3>
              <button onClick={resetFilters} className="text-xs font-bold text-indigo-600 uppercase">Reset All</button>
            </div>
            
            <div className="p-6 space-y-10 pb-10">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sort By</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'All', value: 'All', icon: ArrowsUpDownIcon },
                    { label: 'Rating', value: 'Rating', icon: StarIcon },
                    { label: 'Price: Low', value: 'PriceLow', icon: BarsArrowUpIcon },
                    { label: 'Price: High', value: 'PriceHigh', icon: BarsArrowDownIcon }
                  ].map(sort => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm border transition-all ${sortBy === sort.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      <sort.icon className="w-4 h-4" />
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Price Range (Rs.)</h4>
                  <span className="text-indigo-600 font-black text-base">{minPrice.toLocaleString()} - {maxPrice.toLocaleString()}</span>
                </div>
                <div className="px-2 pt-4">
                  <div className="range-slider">
                    <div className="progress" style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }} />
                    <input type="range" min="0" max="100000" step="500" value={minPrice} onChange={handleMinPriceChange}/>
                    <input type="range" min="0" max="100000" step="500" value={maxPrice} onChange={handleMaxPriceChange}/>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowFilters(false)} className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 active:scale-95 transition-transform">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
