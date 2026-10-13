export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export type Mood = 'amazing' | 'happy' | 'neutral' | 'sad' | 'terrible';

export interface MoodInfo {
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

export type ViewMode = 'list' | 'calendar' | 'stats';
