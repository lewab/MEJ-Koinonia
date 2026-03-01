import { Event, MediaItem } from './context/types';

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Grand Culte Dominical',
    date: 'DIM 24',
    time: '08:30 - 10:30',
    description: "Célébration majeure de la semaine. Louange, adoration et message de transformation. Paroisse Centrale.",
    imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80',
    location: 'Paroisse Centrale'
  },
  {
    id: '2',
    title: "Culte d'Enseignement",
    date: 'MAR 26',
    time: '17:00 - 19:00',
    description: "Approfondissement de la Parole de Dieu. Session spéciale sur l'école des disciples.",
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
  }
];

export const RECENT_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: "L'Importance de la Formation",
    type: 'video',
    duration: '45:20',
    speaker: 'Aumônier National',
    date: '24 Nov 2024',
    description: "Pourquoi chaque chrétien doit passer par l'école des disciples pour porter du fruit durable.",
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    size: '120 Mo'
  },
  {
    id: 'm2',
    title: "Vivre en Disciple au Quotidien",
    type: 'audio',
    duration: '1:02:15',
    speaker: 'Sr. Marie-Claire',
    date: '18 Nov 2024',
    description: "Comment appliquer les principes de l'école des disciples dans son milieu professionnel.",
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
    size: '15 Mo'
  },
  {
    id: 'm3',
    title: "La Puissance de l'Adoration",
    type: 'video',
    duration: '28:10',
    speaker: 'Fr. Jean-Paul',
    date: '10 Nov 2024',
    description: "Retour sur le grand culte de louange du mois dernier.",
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    size: '85 Mo'
  }
];

export const ARCHIVES: MediaItem[] = [
  {
    id: 'a1',
    title: "Les fruits de l'Esprit",
    type: 'audio',
    duration: '45 min',
    speaker: 'Pasteur Jean',
    date: '05 Oct 2024',
    description: "Une étude sur les caractéristiques du chrétien guidé par l'Esprit.",
    image: '',
    size: ''
  },
  {
    id: 'a2',
    title: 'Culte de Sainte Cène',
    type: 'video',
    duration: '1h 30min',
    speaker: 'Collégiale',
    date: '01 Oct 2024',
    description: "Célébration communautaire du repas du Seigneur.",
    image: '',
    size: ''
  },
  {
    id: 'a3',
    title: 'La Foi qui déplace les montagnes',
    type: 'audio',
    duration: '52 min',
    speaker: 'Maman Cécile',
    date: '28 Sep 2024',
    description: "Comment cultiver une foi inébranlable face aux défis.",
    image: '',
    size: ''
  }
];