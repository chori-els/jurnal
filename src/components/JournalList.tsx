import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Tag, SortDesc } from 'lucide-react';
import { JournalEntry, Mood } from '../types';
import JournalCard from './JournalCard';
import { moodData, moodList } from '../utils/moods';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function JournalList({ entries, onEdit, onDelete }: JournalListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | ''>('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Get all unique tags
  const allTags = Array.from(new Set(entries.flatMap(e => e.tags))).sort();

  // Filter and sort entries
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch =
        !searchQuery ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesMood = !selectedMood || entry.mood === selectedMood;
      const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
      return matchesSearch && matchesMood && matchesTag;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMood('');
    setSelectedTag('');
  };

  const hasActiveFilters = searchQuery || selectedMood || selectedTag;

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari jurnal..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            title={sortBy === 'newest' ? 'Terbaru' : 'Terlama'}
          >
            <SortDesc size={18} className={sortBy === 'oldest' ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                {/* Mood filter */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Filter Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMood('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !selectedMood
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Semua
                    </button>
                    {moodList.map(m => (
                      <button
                        key={m}
                        onClick={() => setSelectedMood(selectedMood === m ? '' : m)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedMood === m
                            ? `${moodData[m].bgColor} ${moodData[m].color}`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {moodData[m].emoji} {moodData[m].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag filter */}
                {allTags.length > 0 && (
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      <Tag size={12} />
                      Filter Tag
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedTag('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          !selectedTag
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Semua
                      </button>
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedTag === tag
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    ✕ Hapus semua filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p className="text-sm text-gray-500 px-1">
          Menampilkan {filteredEntries.length} dari {entries.length} entri
        </p>
      )}

      {/* Entries */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">
            {entries.length === 0 ? '📔' : '🔍'}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {entries.length === 0 ? 'Belum ada jurnal' : 'Tidak ditemukan'}
          </h3>
          <p className="text-gray-500 text-sm">
            {entries.length === 0
              ? 'Mulai tulis jurnal pertamamu!'
              : 'Coba ubah kata kunci atau filter pencarian'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
