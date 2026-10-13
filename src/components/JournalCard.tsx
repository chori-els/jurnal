import { motion } from 'framer-motion';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { JournalEntry } from '../types';
import { moodData } from '../utils/moods';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function JournalCard({ entry, onEdit, onDelete }: JournalCardProps) {
  const mood = moodData[entry.mood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-2xl p-2 rounded-xl ${mood.bgColor}`}>
              {mood.emoji}
            </span>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">{entry.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  {format(new Date(entry.date), 'EEEE, d MMMM yyyy', { locale: id })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(entry)}
              className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-3">
          {entry.content}
        </p>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Mood label */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className={`text-xs font-medium ${mood.color}`}>
            {mood.emoji} {mood.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
