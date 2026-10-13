import { Mood, MoodInfo } from '../types';

export const moodData: Record<Mood, MoodInfo> = {
  amazing: {
    emoji: '🤩',
    label: 'Luar Biasa',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  happy: {
    emoji: '😊',
    label: 'Senang',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  neutral: {
    emoji: '😐',
    label: 'Biasa Saja',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  sad: {
    emoji: '😢',
    label: 'Sedih',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  terrible: {
    emoji: '😫',
    label: 'Buruk',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export const moodList: Mood[] = ['amazing', 'happy', 'neutral', 'sad', 'terrible'];
