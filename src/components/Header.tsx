import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, BarChart3, PenLine } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNewEntry: () => void;
  entryCount: number;
}

export default function Header({ viewMode, setViewMode, onNewEntry, entryCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'list', icon: <BookOpen size={18} />, label: 'Jurnal' },
    { mode: 'calendar', icon: <Calendar size={18} />, label: 'Kalender' },
    { mode: 'stats', icon: <BarChart3 size={18} />, label: 'Statistik' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Jurnal Harian</h1>
              <p className="text-xs text-gray-500">{entryCount} entri tersimpan</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <button
                key={item.mode}
                onClick={() => setViewMode(item.mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === item.mode
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={onNewEntry}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <PenLine size={16} />
              Tulis Jurnal
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onNewEntry}
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md"
            >
              <PenLine size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 flex flex-col gap-1 pb-2"
          >
            {navItems.map(item => (
              <button
                key={item.mode}
                onClick={() => { setViewMode(item.mode); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === item.mode
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}
