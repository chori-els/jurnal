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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Distribusi Mood</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.moodCounts.filter(m => m.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.moodCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} entri`, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats.moodCounts.filter(m => m.value > 0).map(m => (
              <span key={m.name} className="flex items-center gap-1 text-xs text-gray-600">
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
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.last7Days}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  formatter={(value: number) => [`${value} entri`, 'Jurnal']}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.last30Days}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                formatter={(value: number) => [`${value} entri`, 'Jurnal']}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
            <div className="space-y-2">
              {stats.topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">#{tag}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(count / stats.totalEntries) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{count}</span>
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
