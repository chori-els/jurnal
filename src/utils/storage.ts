import { JournalEntry } from '../types';

const STORAGE_KEY = 'daily-journal-entries';

export function loadEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: JournalEntry): JournalEntry[] {
  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);
  return entries;
}

export function updateEntry(updated: JournalEntry): JournalEntry[] {
  const entries = loadEntries();
  const index = entries.findIndex(e => e.id === updated.id);
  if (index !== -1) {
    entries[index] = updated;
  }
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string): JournalEntry[] {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
  return entries;
}
