import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import JournalForm from './components/JournalForm';
import JournalList from './components/JournalList';
import CalendarView from './components/CalendarView';
import Statistics from './components/Statistics';
import { JournalEntry, ViewMode } from './types';
import { loadEntries, saveEntries } from './utils/storage';

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load entries on mount
  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const handleSave = useCallback((entry: JournalEntry) => {
    const currentEntries = loadEntries();
    const existingIndex = currentEntries.findIndex(e => e.id === entry.id);

    if (existingIndex !== -1) {
      // Update existing
      currentEntries[existingIndex] = entry;
    } else {
      // Add new
      currentEntries.unshift(entry);
    }

    saveEntries(currentEntries);
    setEntries([...currentEntries]);
    setShowForm(false);
    setEditingEntry(null);
  }, []);

  const handleEdit = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirm(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm) {
      const updated = loadEntries().filter(e => e.id !== deleteConfirm);
      saveEntries(updated);
      setEntries(updated);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm]);

  const handleNewEntry = useCallback(() => {
    setEditingEntry(null);
    setShowForm(true);
  }, []);

  const handleSelectEntry = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onNewEntry={handleNewEntry}
        entryCount={entries.length}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === 'list' && (
          <JournalList
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {viewMode === 'calendar' && (
          <CalendarView entries={entries} onSelectEntry={handleSelectEntry} />
        )}
        {viewMode === 'stats' && <Statistics entries={entries} />}
      </main>

      {/* Journal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <JournalForm
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingEntry(null); }}
            editEntry={editingEntry}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Jurnal?</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Jurnal yang dihapus tidak dapat dikembalikan.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleNewEntry}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export default App;
