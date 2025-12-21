
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Room } from '../types';
import { useSavedRooms } from '../context/SavedRoomsContext';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { isSaved, toggleSave } = useSavedRooms();
  const saved = isSaved(room.id);

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98] group">
      <Link to={`/room/${room.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={room.images[0]} 
            alt={room.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {room.isPremium && (
              <div className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Premium
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
              <StarSolid className="w-3 h-3 text-amber-500" />
              {room.ownerRating}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-gray-900 font-bold text-lg leading-tight truncate pr-4">{room.title}</h3>
            <span className="text-indigo-600 font-extrabold text-lg whitespace-nowrap">
              Rs. {room.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-500 ml-1">/mo</span>
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-md font-medium">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded-md font-medium">
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
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
      >
        {saved ? (
          <HeartSolid className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default RoomCard;
