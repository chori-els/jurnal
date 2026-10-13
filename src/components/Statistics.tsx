import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry } from '../types';
import { moodData, moodList } from '../utils/moods';
import {
  format,
  subDays,
  isSameDay,
  differenceInDays,
  startOfDay,
} from 'date-fns';
import { id } from 'date-fns/locale';

interface StatisticsProps {
  entries: JournalEntry[];
}

export default function Statistics({ entries }: StatisticsProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    // Mood distribution
    const moodCounts = moodList.map(mood => ({
      name: moodData[mood].label,
      emoji: moodData[mood].emoji,
      value: entries.filter(e => e.mood === mood).length,
      color:
        mood === 'amazing'
          ? '#9333ea'
          : mood === 'happy'
          ? '#16a34a'
          : mood === 'neutral'
          ? '#ca8a04'
          : mood === 'sad'
          ? '#2563eb'
          : '#dc2626',
    }));

    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const count = entries.filter(e => isSameDay(new Date(e.date), date)).length;
      return {
        day: format(date, 'EEE', { locale: id }),
        count,
      };
    });

    // Last 30 days activity
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const count = entries.filter(e => isSameDay(new Date(e.date), date)).length;
      return {
        day: format(date, 'd'),
        count,
      };
    });

    // Writing streak
    const sortedDates = [...new Set(entries.map(e => format(new Date(e.date), 'yyyy-MM-dd')))]
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = startOfDay(new Date());
    let checkDate = today;

    for (const date of sortedDates) {
      const diff = differenceInDays(checkDate, startOfDay(date));
      if (diff === 0 || diff === 1) {
        if (diff === 1) checkDate = startOfDay(date);
        streak++;
      } else {
        break;
      }
    }

    // Most used tags
    const tagCounts: Record<string, number> = {};
    entries.forEach(e => e.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Average words per entry
    const avgWords = Math.round(
      entries.reduce((sum, e) => sum + e.content.split(/\s+/).length, 0) / entries.length
    );

    // Total words
    const totalWords = entries.reduce((sum, e) => sum + e.content.split(/\s+/).length, 0);

    // Most common mood
    const mostCommonMood = moodCounts.reduce((max, curr) =>
      curr.value > max.value ? curr : max
    );

    return {
      moodCounts,
      last7Days,
      last30Days,
      streak,
      topTags,
      avgWords,
      totalWords,
      mostCommonMood,
      totalEntries: entries.length,
      firstEntry: entries[entries.length - 1],
    };
  }, [entries]);

  if (!stats) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada data</h3>
        <p className="text-gray-500 text-sm">Mulai tulis jurnal untuk melihat statistik</p>
      </div>
    );
  }

  const maxMoodValue = Math.max(...stats.moodCounts.map(m => m.value), 1);
  const max7Day = Math.max(...stats.last7Days.map(d => d.count), 1);
  const max30Day = Math.max(...stats.last30Days.map(d => d.count), 1);
  const totalMoodValue = stats.moodCounts.reduce((sum, m) => sum + m.value, 0);

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <div className="text-2xl mb-1">📝</div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalEntries}</div>
          <div className="text-xs text-gray-500">Total Entri</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
          <div className="text-xs text-gray-500">Hari Berturut</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <div className="text-2xl mb-1">{stats.mostCommonMood.emoji}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.mostCommonMood.name}</div>
          <div className="text-xs text-gray-500">Mood Terbanyak</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <div className="text-2xl mb-1">📖</div>
          <div className="text-2xl font-bold text-gray-800">{stats.totalWords.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total Kata</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Mood Distribution - Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Distribusi Mood</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return stats.moodCounts.filter(m => m.value > 0).map((m, i) => {
                    const percent = (m.value / totalMoodValue) * 100;
                    const dashArray = `${percent} ${100 - percent}`;
                    const dashOffset = -cumulativePercent;
                    cumulativePercent += percent;
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={m.color}
                        strokeWidth="12"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-500"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">{stats.mostCommonMood.emoji}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {stats.moodCounts.filter(m => m.value > 0).map(m => (
              <span key={m.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></span>
                {m.emoji} {m.name} ({m.value})
              </span>
            ))}
          </div>
        </motion.div>

        {/* 7-Day Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Aktivitas 7 Hari Terakhir</h3>
          <div className="flex items-end gap-2 h-40 px-2">
            {stats.last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">{d.count}</span>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.count / max7Day) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg"
                  />
                </div>
                <span className="text-xs text-gray-500 capitalize">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 30-Day Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Aktivitas 30 Hari Terakhir</h3>
        <div className="flex items-end gap-0.5 h-32 px-1">
          {stats.last30Days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: d.count > 0 ? `${Math.max((d.count / max30Day) * 100, 10)}%` : '2%' }}
                  transition={{ delay: 0.4 + i * 0.02, duration: 0.3 }}
                  className={`absolute bottom-0 w-full rounded-t ${
                    d.count > 0 ? 'bg-gradient-to-t from-violet-500 to-purple-400' : 'bg-gray-200'
                  }`}
                />
              </div>
              {i % 5 === 0 && (
                <span className="text-[9px] text-gray-400 mt-1">{d.day}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tags & Info */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Tags */}
        {stats.topTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <h3 className="font-semibold text-gray-800 mb-3">🏷️ Tag Terpopuler</h3>
            <div className="space-y-3">
              {stats.topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">#{tag}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / stats.totalEntries) * 100}%` }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Writing Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-800 mb-3">📊 Statistik Menulis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Rata-rata kata per entri</span>
              <span className="text-sm font-semibold text-gray-800">{stats.avgWords}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Total kata ditulis</span>
              <span className="text-sm font-semibold text-gray-800">{stats.totalWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600">Streak menulis</span>
              <span className="text-sm font-semibold text-gray-800">{stats.streak} hari 🔥</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Entri pertama</span>
              <span className="text-sm font-semibold text-gray-800">
                {format(new Date(stats.firstEntry.date), 'd MMM yyyy', { locale: id })}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
