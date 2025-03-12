export interface Pitch {
  _id: string;
  name: string;
  description: string;
  address: string;
  images: string[];
  averageRating: number;
  rating: number;
  comments: Comment[];
  reviews: Comment[];
  ownerId: string;
  price: string;
  size: string;
}

export interface Comment {
  id: number;
  comment: string;
  user: User;
  rating: number;
}
export interface Booking {
  _id: string;
  playgroundId: {
    _id: string;
    name: string;
    address: string;
    size: string;
    price: number;
    description: string;
    images: string[];
    ownerId: {
      _id: string;
      name: string;
    };
    reviews: any[];
    suspended: boolean;
    availableDays: {
      date: string;
      times: string[];
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  date: string;
  time: string;
  userId: string;
  price: number;
  status: string;
  profit?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  id: number;
  name: string;
  bookings?: Booking[];
}

export interface PitchDetails {
  name: string;
  description: string;
  address: string;
  images: any;
  availableDays: { date: string; times: string[] }[];
  timesAvailable: any;
  size: string;
  price: string;
}
