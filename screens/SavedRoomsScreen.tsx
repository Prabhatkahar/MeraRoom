
import React, { useMemo } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import RoomCard from '../components/RoomCard';
import { MOCK_ROOMS } from '../constants';
import { useSavedRooms } from '../context/SavedRoomsContext';
import { Link } from 'react-router-dom';
import { Room } from '../types';

const SavedRoomsScreen: React.FC = () => {
  const { savedIds } = useSavedRooms();
  
  const allRooms = useMemo(() => {
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    return [...userPosts, ...MOCK_ROOMS] as Room[];
  }, []);

  const savedRooms = useMemo(() => {
    return allRooms.filter(room => savedIds.includes(room.id));
  }, [allRooms, savedIds]);

  return (
    <div className="flex flex-col animate-fade-in min-h-screen bg-slate-50">
      <header className="p-6 pb-4 bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900">Saved Rooms</h1>
        <p className="text-gray-500 text-sm font-medium">Your favorite properties in one place</p>
      </header>

      <div className="p-6 space-y-6 pb-24">
        {savedRooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {savedRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <HeartIcon className="w-10 h-10 text-indigo-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No saved rooms yet</h2>
            <p className="text-gray-500 text-sm max-w-[240px] mb-8">
              Explore listings and tap the heart icon to save them for later.
            </p>
            <Link 
              to="/" 
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRoomsScreen;
