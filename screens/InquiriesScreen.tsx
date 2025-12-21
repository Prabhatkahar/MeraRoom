
import React from 'react';
import { 
  EnvelopeIcon, 
  EllipsisHorizontalIcon, 
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const InquiriesScreen: React.FC = () => {
  const mockInquiries = [
    {
      id: '1',
      sender: 'Zain Malik',
      room: 'Modern Cozy Single Room',
      date: '2 hours ago',
      message: 'Hi, is this room still available for rent? I can visit today.',
      status: 'new'
    },
    {
      id: '2',
      sender: 'Amna Batool',
      room: 'Executive Studio Apartment',
      date: 'Yesterday',
      message: 'Interested in the apartment. Can you tell me about the backup power?',
      status: 'replied'
    }
  ];

  return (
    <div className="flex flex-col animate-fade-in">
      <header className="p-6 pb-4 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-black text-gray-900">Inquiries</h1>
        <p className="text-gray-500 text-sm font-medium">Manage your rental communications</p>
      </header>

      <div className="p-4 space-y-4">
        {mockInquiries.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.status === 'new' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.sender}</h3>
                  <p className="text-xs text-gray-400 font-medium">{item.date}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Regarding</p>
              <p className="text-sm font-bold text-gray-700 truncate mb-2">{item.room}</p>
              <p className="text-sm text-gray-600 line-clamp-2 italic">"{item.message}"</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.status === 'new' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase">
                    <ClockIcon className="w-3.5 h-3.5" /> Pending Response
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
                    <CheckCircleIcon className="w-3.5 h-3.5" /> Replied
                  </span>
                )}
              </div>
              <button className={`px-5 py-2 rounded-xl text-xs font-bold ${item.status === 'new' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {item.status === 'new' ? 'Reply Now' : 'View Thread'}
              </button>
            </div>
          </div>
        ))}

        {mockInquiries.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium">
            No inquiries yet. Keep your listings fresh!
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesScreen;
