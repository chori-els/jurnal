import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JournalEntry } from '../types';
import { moodData } from '../utils/moods';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { id } from 'date-fns/locale';

interface CalendarViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export default function CalendarView({ entries, onSelectEntry }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEntriesForDate = (date: Date) => {
    return entries.filter(e => isSameDay(new Date(e.date), date));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <ChevronLeft size={20} className="text-gray-600" />
      </button>
      <h2 className="text-xl font-bold text-gray-800 capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: id })}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <ChevronRight size={20} className="text-gray-600" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEntries = getEntriesForDate(currentDay);
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isCurrentDay = isToday(currentDay);

        days.push(
          <motion.div
            key={currentDay.toISOString()}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setSelectedDate(currentDay);
              if (dayEntries.length > 0) {
                onSelectEntry(dayEntries[0]);
              }
            }}
            className={`relative min-h-[70px] md:min-h-[90px] p-1.5 border border-gray-100 rounded-xl cursor-pointer transition-all ${
              !isCurrentMonth ? 'bg-gray-50/50' : 'bg-white hover:bg-indigo-50/50'
            } ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''} ${
              isCurrentDay ? 'border-indigo-200' : ''
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isCurrentDay
                  ? 'bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                  : isCurrentMonth
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              {format(currentDay, 'd')}
            </span>
            {dayEntries.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayEntries.slice(0, 3).map(entry => (
                  <span
                    key={entry.id}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${moodData[entry.mood].bgColor}`}
                    title={entry.title}
                  >
                    {moodData[entry.mood].emoji}
                  </span>
                ))}
                {dayEntries.length > 3 && (
                  <span className="text-[10px] text-gray-500 ml-0.5">+{dayEntries.length - 3}</span>
                )}
              </div>
            )}
          </motion.div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Show entries for selected date
  const selectedEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Selected date entries */}
      {selectedDate && selectedEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-800 mb-3">
            📅 {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
          </h3>
          <div className="space-y-3">
            {selectedEntries.map(entry => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSelectEntry(entry)}
              >
                <span className="text-xl">{moodData[entry.mood].emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{entry.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{entry.content}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedDate && selectedEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
        >
          <p className="text-gray-500 text-sm">
            Tidak ada jurnal pada tanggal{' '}
            <span className="font-medium text-gray-700">
              {format(selectedDate, 'd MMMM yyyy', { locale: id })}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
