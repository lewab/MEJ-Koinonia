import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  category: string;
  imageUrl: string;
  downloaded?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  location?: string;
}

export interface Parish {
  id: string;
  name: string;
  address: string;
  hours: string;
  isOpen: boolean;
  coordinates: { x: number; y: number };
}

export enum UserRole {
  ADMIN = 'Admin',
  MEMBER = 'Membre Actif',
  GUEST = 'Invité'
}

export interface MediaItem {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  type: 'video' | 'audio';
  date: string;
  description: string;
  image: string;
  size: string;
}

export interface User {
  name: string;
  role: UserRole | string;
  parish: string;
  avatar: string;
}