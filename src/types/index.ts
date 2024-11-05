export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  birthday: string;
  profilePicture: string | null;
  tier: 'Bronze' | 'Argent' | 'Or' | 'Platine' | 'Diamant';
  progress: number;
  nextReward: number;
  visits: Visit[];
}

export interface Visit {
  date: string;
  points: number;
}

export interface CartItem {
  name: string;
  price: number;
  flavor: string;
  quantity: number;
}