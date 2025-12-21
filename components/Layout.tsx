
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  PlusCircleIcon as PlusSolid, 
  HeartIcon as HeartSolid, 
  ChatBubbleLeftRightIcon as ChatSolid, 
  UserCircleIcon as UserSolid 
} from '@heroicons/react/24/solid';

const BottomNavBar: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Inquiries', path: '/inquiries', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolid },
    { name: 'Post', path: '/post', icon: PlusCircleIcon, activeIcon: PlusSolid },
    { name: 'Saved', path: '/saved', icon: HeartIcon, activeIcon: HeartSolid },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon, activeIcon: UserSolid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-safe-area shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? <item.activeIcon className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-lg mx-auto min-h-screen bg-white shadow-sm">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

export default Layout;
