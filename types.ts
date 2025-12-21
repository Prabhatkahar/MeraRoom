
export enum PropertyType {
  ROOM = 'Room',
  APARTMENT = 'Apartment',
  HOSTEL = 'Hostel',
  HOUSE = 'House'
}

export enum RentCycle {
  MONTHLY = 'Monthly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly'
}

export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: PropertyType;
  rentCycle: RentCycle;
  images: string[];
  amenities: string[];
  bedrooms: number;
  ownerName: string;
  ownerPhone: string;
  ownerPhoto: string;
  ownerRating: number; // Added: Numeric rating for sorting
  ownerUpi?: string; 
  paymentPhone?: string; 
  createdAt: string;
  isPremium?: boolean;
}

export interface Inquiry {
  id: string;
  roomId: string;
  roomTitle: string;
  senderName: string;
  senderPhone: string;
  message: string;
  date: string;
  status: 'pending' | 'read' | 'replied';
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  photo: string;
  savedRooms: string[];
}
