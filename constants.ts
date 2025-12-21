
import { PropertyType, RentCycle, Room } from './types';

export const ALL_AMENITIES = ['WiFi', 'AC', 'Attached Bath', 'Laundry', 'Security', 'Parking', 'Backup Power', 'Mess', 'Kitchen'];

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    title: 'Modern Cozy Single Room',
    description: 'A beautiful single room with high ceilings, plenty of sunlight, and a private balcony. Located in a quiet neighborhood near the city center.',
    price: 4500,
    location: 'Gulberg, Lahore',
    type: PropertyType.ROOM,
    rentCycle: RentCycle.MONTHLY,
    images: [
      'https://picsum.photos/seed/room1/800/600',
      'https://picsum.photos/seed/room1b/800/600'
    ],
    amenities: ['WiFi', 'AC', 'Attached Bath', 'Laundry'],
    bedrooms: 1,
    ownerName: 'Ali Khan',
    ownerPhone: '+92 300 1234567',
    ownerPhoto: 'https://picsum.photos/seed/user1/100/100',
    ownerRating: 4.8,
    ownerUpi: 'alikhan@upi',
    paymentPhone: '03001234567',
    createdAt: '2023-10-01'
  },
  {
    id: '2',
    title: 'Executive Studio Apartment',
    description: 'Fully furnished executive studio with modern kitchen and high-speed internet. Ideal for students or young professionals.',
    price: 15000,
    location: 'DHA Phase 5, Karachi',
    type: PropertyType.APARTMENT,
    rentCycle: RentCycle.MONTHLY,
    images: [
      'https://picsum.photos/seed/apt2/800/600',
      'https://picsum.photos/seed/apt2b/800/600'
    ],
    amenities: ['WiFi', 'Backup Power', 'Security', 'Parking', 'Kitchen'],
    bedrooms: 1,
    ownerName: 'Sarah Ahmed',
    ownerPhone: '+92 321 7654321',
    ownerPhoto: 'https://picsum.photos/seed/user2/100/100',
    ownerRating: 4.9,
    ownerUpi: 'sarah.rentals@pay',
    paymentPhone: '03217654321',
    createdAt: '2023-10-05',
    isPremium: true
  },
  {
    id: '3',
    title: 'Safe Hostel for Girls',
    description: 'Safe and secure hostel environment with 24/7 security, mess facility, and shared study areas.',
    price: 8000,
    location: 'I-8 Sector, Islamabad',
    type: PropertyType.HOSTEL,
    rentCycle: RentCycle.MONTHLY,
    images: [
      'https://picsum.photos/seed/hostel3/800/600'
    ],
    amenities: ['Mess', 'Security', 'Laundry', 'Shared Kitchen'],
    bedrooms: 1,
    ownerName: 'Mrs. Fatima',
    ownerPhone: '+92 312 9998887',
    ownerPhoto: 'https://picsum.photos/seed/user3/100/100',
    ownerRating: 4.2,
    paymentPhone: '03129998887',
    createdAt: '2023-10-10'
  }
];

export const APP_THEME = {
  primary: 'indigo-600',
  primaryDark: 'indigo-700',
  secondary: 'emerald-500',
  bg: 'slate-50'
};
