export type Role = 'customer' | 'admin';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Service = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
};

export type Barber = {
  id: number;
  name: string;
  phone?: string | null;
};

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Booking = {
  id: number;
  bookingDate: string;
  status: BookingStatus;
  customerNote?: string | null;
  user?: User;
  service: Service;
  barber: Barber;
};

export type ApiError = {
  message?: string;
  errors?: string[];
};
