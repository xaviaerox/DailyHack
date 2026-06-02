import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Skull, Lock, Wind } from 'lucide-react';
import { ViewType, Entry } from './types';
import { SAMPLE_ENTRIES } from './constants';
import DIARY_DATA from './data/entries.json';

import { Navbar, Footbar } from './components/Navigation';
import { PirateMap } from './components/map/PirateMap';
import { ScrollContainer } from './components/layout/ScrollContainer';
import { ArchiveView } from './components/ArchiveView';
import { EditorView } from './components/EditorView';
import { DetailView } from './components/DetailView';
import { cn } from './components/utils';

export default function App() {
  const [view, setView] = useState<ViewType>('map');
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('dailyhack_admin') === 'true');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  
  const [isInitialized, setIsInitialized] = useState(() => localStorage.getItem('dailyhack_initialized') === 'true');

  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem('dailyhack_entries_v5');
    if (localStorage.getItem('dailyhack_initialized') === 'true') {
      return saved ? JSON.parse(saved) : SAMPLE_ENTRIES;
    }
    return DIARY_DATA as Entry[];
  });
  
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [pendingCoords, setPendingCoords] = useState<{ x: number, y: number } | undefined>(undefined);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dailyhack_entries_v5', JSON.stringify(entries));
    }
  }, [entries, isInitialized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'asir2026') {
      setIsAdmin(true);
      sessionStorage.setItem('dailyhack_admin', 'true');
      setIsLoginOpen(false);
      setPassword('');
    } else {
      alert('Llave incorrecta. Solo el cronista oficial tiene acceso.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('dailyhack_admin');
  };

  const startMyDiary = () => {
    if (confirm('¿Deseas vaciar las crónicas de ejemplo y empezar tu propia bitácora personal?')) {
      setIsInitialized(true);
      localStorage.setItem('dailyhack_initialized', 'true');
      setEntries(SAMPLE_ENTRIES);
      setView('editor');
    }
  };

  const filteredEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.timestamp - a.timestamp).filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [entries, searchQuery, selectedCategory]);

  const handleSave = (entry: Partial<Entry>) => {
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      title: entry.title || 'Sin Título',
      content: entry.content || '',
      category: entry.category || 'General',
      quote: entry.quote,
      tags: entry.tags,
      timestamp: Date.now(),
      coordinates: entry.coordinates || pendingCoords || { x: 20 + Math.random() * 60, y: (entries.length * 30) + 5 },
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    };
    setEntries(prev => [...prev, newEntry]);
    setPendingCoords(undefined);
    setView('map');
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddAtLocation = (coords: { x: number, y: number }) => {
    setPendingCoords(coords);
    setView('editor');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#8b5e34]/30 selection:text-[#5d4037] font-serif">
      <Navbar 
        currentView={view} 
        setView={setView} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLoginOpen={() => setIsLoginOpen(true)}
      />
      
      {!isInitialized && !isAdmin && (
        <div className="bg-[#8b5e34] text-[#f4ead5] py-2.5 px-10 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-bold shadow-md z-40">
          <div className="flex items-center gap-3">
            <Info size={14} />
            <span>Bitácora de Demostración (Modo Portfolio)</span>
          </div>
          <button 
            onClick={startMyDiary}
            className="hover:text-white transition-all underline decoration-[#f4ead5]/30 underline-offset-4"
          >
            Iniciar Bitácora Propia
          </button>
        </div>
      )}
      
      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {view === 'map' && (
              <ScrollContainer>
                <PirateMap 
                  entries={entries} 
                  onSelectEntry={setSelectedEntry} 
                />
              </ScrollContainer>
            )}
            {view === 'archive' && (
              <ArchiveView 
                entries={filteredEntries} 
                onSelectEntry={setSelectedEntry}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            {view === 'editor' && (
              <EditorView 
                onSave={handleSave} 
                onCancel={() => { setView('map'); setPendingCoords(undefined); }} 
                initialCoords={pendingCoords}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <DetailView 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#f4ead5] parchment-texture p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-[#8b5e34]/30 max-w-lg w-full text-center relative rounded-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 opacity-5 pointer-events-none">
                <Skull size={100} />
              </div>
              <div className="flex justify-center mb-12">
                <div className="w-24 h-24 rounded-full bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] shadow-inner">
                  <Lock size={48} />
                </div>
              </div>
              <h2 className="font-display text-5xl text-[#5d4037] italic mb-6 tracking-tight">Acceso al Cronista</h2>
              <p className="text-[#5d4037]/60 italic mb-12 font-serif text-lg">Solo aquel que posea la llave oficial podrá inscribir nuevos fragmentos en la historia.</p>
              
              <form onSubmit={handleLogin} className="space-y-10">
                <input 
                  type="password"
                  placeholder="Introduce la llave sagrada..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-0 border-b-2 border-[#8b5e34]/20 focus:border-[#8b5e34] focus:ring-0 text-center text-3xl font-serif py-4 transition-all placeholder:text-[#5d4037]/10"
                />
                <button 
                  type="submit"
                  className="w-full bg-[#8b5e34] text-[#f4ead5] py-6 font-display text-2xl italic hover:bg-[#5d4037] transition-all shadow-2xl group flex items-center justify-center gap-4"
                >
                  Girar la Llave
                  <Wind size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {view !== 'editor' && <Footbar currentView={view} setView={setView} />}
    </div>
  );
}
