
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, HeartIcon, StarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Room } from '../types.ts';
import { useSavedRooms } from '../context/SavedRoomsContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { isSaved, toggleSave } = useSavedRooms();
  const { theme } = useTheme();
  const saved = isSaved(room.id);

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300 active:scale-[0.98] group">
      <Link to={`/room/${room.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={room.images[0]} 
            alt={room.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {room.isPremium && (
              <div className={`${theme.bg} text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg transition-colors`}>
                Premium
              </div>
            )}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
              <StarSolid className="w-3 h-3 text-amber-500" />
              {room.ownerRating}
            </div>
            {room.video && (
              <div className="bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg">
                <VideoCameraIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight truncate pr-4 transition-colors">{room.title}</h3>
            <span className={`${theme.text} dark:text-indigo-400 font-extrabold text-lg whitespace-nowrap transition-colors`}>
              Rs. {room.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">/mo</span>
            </span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[11px] px-2 py-0.5 rounded-md font-medium">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleSave(room.id);
        }}
        className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
      >
        {saved ? (
          <HeartSolid className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
};

export default RoomCard;
