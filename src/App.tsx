import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Library, PenLine, Search, History, Trash2, Navigation2, Compass, Plus, MoveLeft, X, Sparkles, Lock, Unlock, LogOut, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ViewType, Entry } from './types';
import { REAL_ENTRIES, SAMPLE_ENTRIES } from './constants';
import { analyzeEntry } from './gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ currentView, setView, searchQuery, setSearchQuery, setSelectedCategory, isAdmin, onLogout, onLoginOpen }: { currentView: ViewType; setView: (v: ViewType) => void; searchQuery: string; setSearchQuery: (q: string) => void, setSelectedCategory: (c: string) => void, isAdmin: boolean, onLogout: () => void, onLoginOpen: () => void }) => (
  <header className="bg-parchment/90 backdrop-blur-sm border-b border-shadow/30 sticky top-0 z-50 w-full">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-12">
        <button 
          onClick={() => { setView('map'); setSearchQuery(''); setSelectedCategory('Todos'); }}
          className="text-2xl font-display font-bold italic text-leather hover:opacity-80 transition-opacity"
        >
          La Crónica Atemporal
        </button>
        <nav className="hidden md:flex gap-8 items-center mt-1">
          <button 
            onClick={() => setView('map')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-medium",
              currentView === 'map' ? "text-leather border-b-2 border-leather" : "text-ink/70 hover:text-leather"
            )}
          >
            Mapa de Indagaciones
          </button>
          <button 
            onClick={() => setView('archive')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-medium",
              currentView === 'archive' ? "text-leather border-b-2 border-leather" : "text-ink/70 hover:text-leather"
            )}
          >
            Archivos Centrales
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Navegar por tinta..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm italic w-48 focus:w-64 transition-all duration-500 placeholder:text-ink/40 border-b border-transparent focus:border-leather/30 pb-1"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/60 group-hover:text-leather w-4 h-4" />
        </div>
        
        {isAdmin ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('editor')}
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                currentView === 'editor' ? "bg-leather text-parchment" : "text-ink/70 hover:bg-shadow/20 hover:text-leather"
              )}
            >
              <PenLine size={20} />
            </button>
            <button onClick={onLogout} className="p-2 text-ink/40 hover:text-leather transition-colors" title="Cerrar Sesión">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onLoginOpen} className="p-2 text-ink/40 hover:text-leather transition-colors" title="Acceso Propietario">
            <Lock size={18} />
          </button>
        )}
      </div>
    </div>
  </header>
);

const Footbar = ({ currentView, setView }: { currentView: ViewType; setView: (v: ViewType) => void }) => (
  <nav className="md:hidden bg-parchment border-t border-shadow/50 fixed bottom-0 w-full z-50 flex justify-around items-center h-16 shadow-[0_-5px_20px_rgba(81,68,60,0.1)]">
    <button onClick={() => setView('map')} className={cn("flex flex-col items-center justify-center", currentView === 'map' ? "text-leather" : "text-ink/50")}>
      <MapIcon size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter">Mapa</span>
    </button>
    <button onClick={() => setView('archive')} className={cn("flex flex-col items-center justify-center", currentView === 'archive' ? "text-leather" : "text-ink/50")}>
      <Library size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter">Archivos</span>
    </button>
    <button onClick={() => setView('editor')} className={cn("flex flex-col items-center justify-center", currentView === 'editor' ? "text-leather" : "text-ink/50")}>
      <PenLine size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter">Crónica</span>
    </button>
  </nav>
);

// --- Views ---

const MapView = ({ entries, onSelectEntry, onAddAtLocation }: { entries: Entry[]; onSelectEntry: (e: Entry) => void; onAddAtLocation: (coords: { x: number, y: number }) => void }) => {
  // Find the max Y to set container height
  const containerHeight = useMemo(() => {
    const maxY = Math.max(...entries.map(e => e.coordinates?.y || 0), 100);
    return (maxY * 15) + 600; // Transform units to pixels for stability
  }, [entries]);

  return (
    <main 
      className="relative w-full bg-parchment parchment-texture grid-nautical overflow-y-auto overflow-x-hidden custom-scrollbar background-grid"
      style={{ height: 'calc(100vh - 72px)' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains('background-grid')) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onAddAtLocation({ x, y: (y / (containerHeight / rect.height)) * 100 }); // Approximate for pixel-based y
        }
      }}
    >
      <div 
        className="relative w-full background-grid px-4 md:px-8" 
        style={{ height: `${containerHeight}px`, minWidth: window.innerWidth < 768 ? '100%' : '1200px' }}
      >
        <style>{`
          .background-grid {
            background-image: 
              linear-gradient(rgba(128, 85, 51, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128, 85, 51, 0.03) 1px, transparent 1px);
            background-size: 100px 100px;
          }
        `}</style>
        
        {/* Background Decorative Elements */}
        <Compass size={600} className="absolute top-[5%] right-[5%] opacity-[0.02] text-leather rotate-12 pointer-events-none" />
        <Navigation2 size={400} className="absolute top-[40%] left-[2%] opacity-[0.02] text-leather -rotate-12 pointer-events-none" />

        {/* Header decoration */}
        <section className="relative z-10 pointer-events-none w-full flex flex-col items-center pt-48 pb-64">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-display text-leather italic mb-8 text-center"
          >
            Topología de Aprendizaje
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl md:text-3xl text-ink/40 leading-relaxed italic text-center max-w-2xl px-6"
          >
            "El conocimiento es un flujo de datos constante,<br/>cada nota es un nodo en la red de aprendizaje."
          </motion.p>
        </section>

        {/* SVG Path */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox={`0 0 100 ${containerHeight}`} 
          preserveAspectRatio="none"
        >
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false, amount: 0.01 }}
            transition={{ duration: 4, ease: "linear" }}
            d={useMemo(() => {
              const sorted = entries
                .filter(e => e.coordinates)
                .sort((a, b) => a.timestamp - b.timestamp);
              
              if (sorted.length < 1) return "";
              
              let d = `M ${sorted[0].coordinates!.x} ${sorted[0].coordinates!.y * 15 + 400}`;
              for (let i = 1; i < sorted.length; i++) {
                const prev = sorted[i-1].coordinates!;
                const curr = sorted[i].coordinates!;
                const py = prev.y * 15 + 400;
                const cx = curr.x;
                const cy = curr.y * 15 + 400;
                
                d += ` C ${prev.x} ${py + (cy - py) / 2}, ${cx} ${py + (cy - py) / 2}, ${cx} ${cy}`;
              }
              // Extend to bottom
              const last = sorted[sorted.length-1].coordinates!;
              d += ` L ${last.x} ${containerHeight}`;
              return d;
            }, [entries, containerHeight])}
            className="stroke-leather stroke-[0.3] fill-none opacity-40"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Entries */}
        {entries.sort((a,b) => a.timestamp - b.timestamp).map((entry, idx) => {
          const x = entry.coordinates?.x || 50;
          const y = (entry.coordinates?.y || 0) * 15 + 400;
          const isAtRight = x > 50;
          
          return (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              className="absolute group z-20"
              style={{ top: `${y}px`, left: `${x}%` }}
            >
              <div className="relative">
                 <div className="w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leather shadow-xl ring-4 ring-parchment relative z-30" />
                 
                 {/* Metadata */}
                 <div className="absolute top-[-3rem] left-1/2 -translate-x-1/2 whitespace-nowrap opacity-60 text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-leather pointer-events-none bg-parchment/80 px-2 rounded-full">
                   {entry.date} <span className="opacity-20 mx-2">|</span> {entry.category}
                 </div>

                 {/* Card */}
                 <motion.div
                   whileHover={{ y: -10, scale: 1.02 }}
                   onClick={(e) => { e.stopPropagation(); onSelectEntry(entry); }}
                   className={cn(
                     "absolute w-[80vw] sm:w-[450px] p-6 sm:p-10 bg-[#fffdf9] shadow-2xl border border-leather/10 cursor-pointer transition-all duration-500 z-50",
                     isAtRight 
                       ? "right-2 sm:right-12 -translate-y-1/2 origin-right" 
                       : "left-2 sm:left-12 -translate-y-1/2 origin-left"
                   )}
                 >
                   <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-leather/20 group-hover:bg-leather transition-colors" />
                   <h3 className="font-display text-2xl md:text-4xl text-leather italic mb-4 leading-tight">{entry.title}</h3>
                   <p className="text-lg md:text-xl text-ink/70 italic line-clamp-3 leading-relaxed">"{entry.quote || entry.content}"</p>
                 </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* End Mark */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center py-64 opacity-10">
          <Compass size={150} className="animate-[spin_20s_linear_infinite]" />
          <p className="mt-8 text-2xl uppercase tracking-[1em]">Fin del Archivo</p>
        </div>
      </div>
    </main>
  );
};

const ArchiveView = ({ entries, onSelectEntry, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: { entries: Entry[]; onSelectEntry: (e: Entry) => void; searchQuery: string; setSearchQuery: (q: string) => void; selectedCategory: string; setSelectedCategory: (c: string) => void }) => {
  const categories = useMemo(() => {
    const cats = entries.map(e => e.category);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [entries]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-parchment parchment-texture">
      <aside className="w-full lg:w-96 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-shadow/20 bg-shadow/5">
        <div className="sticky top-32">
          <h1 className="font-display text-6xl leading-[0.9] tracking-tighter text-ink mb-6">Archivo<br/><span className="italic text-leather">Seleccionado</span></h1>
          <p className="text-base leading-relaxed text-ink/70 italic mb-12 border-l-2 border-leather/20 pl-6">Un recorrido visual a través de los registros y logs fragmentados de una infraestructura en evolución.</p>
          
          <div className="space-y-12">
            <div className="group">
              <label className="block text-[0.7rem] uppercase tracking-widest text-ink/50 mb-3">Filtrar por Concepto</label>
              <input 
                type="text" 
                placeholder="Escriba aquí..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-ink/10 py-4 text-xl focus:ring-0 focus:outline-none focus:border-leather transition-colors text-ink placeholder:text-ink/20 placeholder:italic"
              />
            </div>

            <div>
              <h3 className="text-[0.7rem] uppercase tracking-widest text-ink/50 mb-6">Cronología</h3>
              <div className="space-y-4">
                {categories.map((c) => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedCategory(c)}
                    className="flex items-center justify-between w-full cursor-pointer group"
                  >
                    <span className={cn("text-lg transition-colors", selectedCategory === c ? "text-leather font-medium scale-105" : "text-ink/60 group-hover:text-leather")}>{c}</span>
                    <span className="text-xs italic text-ink/30">{c === 'Todos' ? entries.length : entries.filter(e => e.category === c).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['#sistemas', '#redes', '#ciberseguridad'].map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => setSearchQuery(tag)}
                  className={cn(
                    "px-4 py-2 border border-shadow/30 text-ink/70 text-sm italic hover:border-leather hover:text-leather transition-all",
                    searchQuery === tag && "bg-leather/5 border-leather text-leather"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="flex-1 p-8 lg:p-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-display text-3xl text-ink font-light">Registros de Sistemas</h2>
            <div className="h-1 w-24 bg-leather mt-2"></div>
          </div>
          <div className="text-sm italic text-ink/40">Exhibiendo {entries.length} fragmentos de infraestructura técnica.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          {entries.map((entry, idx) => (
            <motion.article 
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectEntry(entry)}
              className="group cursor-pointer"
            >
              <div className={cn(
                "p-10 border border-shadow/10 shadow-sm group-hover:shadow-xl transition-all duration-700 relative overflow-hidden h-full flex flex-col",
                idx % 2 === 0 ? "bg-white" : "bg-shadow/5 group-hover:bg-white"
              )}>
                {/* Decorative Canvas Sketch */}
                <div className="absolute -right-4 -top-4 w-40 h-40 opacity-[0.03] grayscale pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
                    <path d="M10,50 L90,50 M50,10 L50,90" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>

                <span className="block text-[0.7rem] tracking-[0.3em] text-leather/60 mb-6 uppercase">{entry.date}</span>
                <h3 className="font-display text-3xl leading-tight mb-6 group-hover:text-leather transition-colors">{entry.title}</h3>
                <p className="text-lg leading-relaxed text-ink/80 mb-8 flex-grow">
                  <span className="text-5xl font-display font-bold float-left mr-3 mt-1 leading-none text-leather">{entry.content[0]}</span>
                  {entry.content.substring(1, 200)}{entry.content.length > 200 ? '...' : ''}
                </p>
                {entry.quote && (
                  <blockquote className="border-l-4 border-leather/30 pl-4 italic text-xl text-ink/80 font-serif leading-snug mt-auto pt-4">
                    "{entry.quote}"
                  </blockquote>
                )}
              </div>
            </motion.article>
          ))}
          
        </div>

        <div className="mt-24 pt-12 border-t border-shadow/20 flex flex-col items-center">
          <p className="text-base italic text-ink/40 mb-8">Los logs continúan en el servidor central...</p>
          <button className="px-16 py-5 bg-transparent border-2 border-leather text-leather font-display text-2xl italic hover:bg-leather hover:text-parchment transition-all duration-500 shadow-sm">
            Pasar al siguiente nodo
          </button>
        </div>
      </section>
    </div>
  );
};

const EditorView = ({ onSave, onCancel, initialCoords }: { onSave: (e: Partial<Entry>) => void, onCancel: () => void, initialCoords?: { x: number, y: number } }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAI = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeEntry(content);
      setTitle(analysis.title || title);
      setCategory(analysis.category || category);
      // We'll save with the quote included
      onSave({ 
        title: analysis.title || title, 
        category: analysis.category || category, 
        content, 
        quote: analysis.quote, 
        tags: analysis.tags,
        coordinates: initialCoords 
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#1a120b] relative overflow-hidden">
      {/* Leather texture background */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }} />
      
      <div className="relative w-full max-w-6xl aspect-[1.4/1] flex shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-lg overflow-visible scale-90 md:scale-100">
        <div className="relative flex-1 bg-parchment parchment-texture deckle-edge border-r border-black/10 flex flex-col p-12 md:p-16 items-center justify-center text-center">
          <div className="absolute top-4 left-4 w-32 h-32 opacity-10 pointer-events-none text-leather">
            <Library size={120} strokeWidth={1} />
          </div>
          
          <header className="mb-12">
            <div className="font-display italic text-3xl text-leather/70 mb-2">Libro de Crónicas</div>
            <div className="w-24 h-px bg-leather/20 mx-auto"></div>
          </header>

          <div className="w-full space-y-10 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="italic text-[10px] text-leather/60 uppercase tracking-widest">Título de la Entrada</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Escribe aquí..." 
                className="bg-transparent border-0 border-b border-leather/20 focus:border-leather/60 focus:ring-0 font-display text-4xl text-ink placeholder:text-ink/10 transition-all text-center pb-2" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="italic text-[10px] text-leather/60 uppercase tracking-widest">Categoría del Saber</label>
              <input 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ej. Redes, Ciberseguridad..." 
                className="bg-transparent border-0 border-b border-leather/20 focus:border-leather/60 focus:ring-0 font-serif italic text-3xl text-leather placeholder:text-leather/20 transition-all text-center" 
              />
            </div>
            <div className="pt-12">
              <div className="text-leather/40 text-[10px] tracking-widest uppercase">
                Anno Domini MMXXIV
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-parchment parchment-texture flex flex-col p-12 md:p-16">
          <div className="flex-grow">
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="La información se pierde si no se registra en caliente. Inicia el log aquí..."
              className="w-full h-full bg-transparent border-0 focus:ring-0 p-0 text-xl text-ink/90 resize-none leading-[2.2rem] placeholder:text-ink/10 scrollbar-hide"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2.2rem, rgba(0,0,0,0.05) 2.2rem, rgba(0,0,0,0.05) 2.25rem)', backgroundSize: '100% 2.25rem' }}
            />
          </div>
          <div className="absolute bottom-8 left-8 opacity-10 pointer-events-none">
            <PenLine size={80} className="text-leather" />
          </div>
        </div>

        {/* Binding Shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>

        {/* Wax Seal Button */}
        <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 z-50 flex gap-8 items-center">
          <button 
            onClick={handleAI}
            disabled={isAnalyzing}
            className="w-16 h-16 rounded-full bg-leather/10 border border-leather/30 flex items-center justify-center text-leather hover:bg-leather hover:text-parchment transition-all duration-500 group relative shadow-lg overflow-hidden disabled:opacity-50"
          >
            <div className={cn("absolute inset-0 bg-leather transition-transform duration-700 translate-y-full group-hover:translate-y-0")}></div>
            <Sparkles size={24} className={cn("relative z-10 transition-transform group-hover:rotate-12", isAnalyzing && "animate-pulse")} />
          </button>

          <button 
            onClick={() => onSave({ title, category, content, coordinates: initialCoords })}
            className="group relative flex items-center justify-center scale-75 md:scale-100"
          >
            <div className="w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ background: 'radial-gradient(circle at 30% 30%, #b22222, #8b0000 60%, #5a0000)' }}>
              <div className="w-24 h-24 rounded-full border-2 border-black/10 flex flex-col items-center justify-center text-white text-center p-2">
                <PenLine size={32} className="mb-1" />
                <span className="font-display font-bold text-xs uppercase tracking-tighter">Estampar</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-2 w-8 h-8 rounded-full bg-[#5a0000] blur-[1px] opacity-80"></div>
            <div className="absolute -bottom-2 -left-1 w-10 h-6 rounded-full bg-[#5a0000] blur-[1px] opacity-80"></div>
          </button>
        </div>
      </div>

      <div className="fixed top-12 left-12 z-50">
        <button onClick={onCancel} className="flex items-center gap-2 text-parchment/50 hover:text-parchment transition-colors group">
          <MoveLeft size={24} className="transition-transform group-hover:-translate-x-1" />
          <span className="italic text-lg">Cerrar Libro</span>
        </button>
      </div>
    </main>
  );
};

const DetailView = ({ entry, onClose, onDelete, isAdmin }: { entry: Entry; onClose: () => void; onDelete: (id: string) => void, isAdmin: boolean }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-parchment parchment-texture shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/3 bg-shadow/20 p-8 md:p-12 border-b md:border-b-0 md:border-r border-leather/10 flex flex-col justify-between">
          <div>
            <span className="block text-[0.7rem] tracking-[0.3em] text-leather/60 mb-8 uppercase">{entry.date}</span>
            <div className="text-leather/40 text-[10px] tracking-widest uppercase mb-2">Clasificación</div>
            <div className="font-display text-4xl text-leather italic leading-tight mb-8">{entry.category}</div>
            
            {entry.tags && (
              <div className="flex flex-wrap gap-2 mb-12">
                {entry.tags.map(t => (
                  <span key={t} className="text-[10px] uppercase tracking-wider text-ink/40 border border-ink/10 px-2 py-1 italic">#{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {isAdmin && (
              <button 
                onClick={() => { onDelete(entry.id); onClose(); }}
                className="flex items-center gap-2 text-ink/40 hover:text-red-700 transition-colors text-xs uppercase tracking-widest"
              >
                <Trash2 size={14} /> Eliminar Registro
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-leather/40 hover:text-leather transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-12">{entry.title}</h2>
          
          <div className="mb-12">
            <div className="text-6xl font-display font-bold float-left mr-4 mt-2 leading-none text-leather">{entry.content[0]}</div>
            <p className="text-xl leading-[2.2rem] text-ink/90 whitespace-pre-wrap">
              {entry.content.substring(1)}
            </p>
          </div>

          {entry.quote && (
            <blockquote className="border-l-8 border-leather/10 pl-8 italic text-2xl text-leather/80 font-serif leading-snug py-4 bg-leather/5">
              "{entry.quote}"
            </blockquote>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewType>('map');
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('dailyhack_admin') === 'true');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  
  const [isInitialized, setIsInitialized] = useState(() => localStorage.getItem('dailyhack_initialized') === 'true');

  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem('dailyhack_entries_v4');
    if (localStorage.getItem('dailyhack_initialized') === 'true') {
      return saved ? JSON.parse(saved) : SAMPLE_ENTRIES;
    }
    return REAL_ENTRIES;
  });
  
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [pendingCoords, setPendingCoords] = useState<{ x: number, y: number } | undefined>(undefined);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('dailyhack_entries_v4', JSON.stringify(entries));
    }
  }, [entries, isInitialized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple obfuscated key check. For a portfolio, this prevents casual editing.
    // In a real app, this would be a hash or .env check.
    if (password === 'asir2026') {
      setIsAdmin(true);
      sessionStorage.setItem('dailyhack_admin', 'true');
      setIsLoginOpen(false);
      setPassword('');
      // If logging in as admin, we usually want to be in the "Master/Portfolio" mode 
      // but let's allow them to edit their local diary too.
    } else {
      alert('Llave incorrecta. Solo el cronista oficial tiene acceso.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('dailyhack_admin');
  };

  const startMyDiary = () => {
    if (confirm('¿Deseas vaciar las crónicas de ejemplo y empezar tu propia bitácora personal? (Tus datos se guardarán localmente en este navegador).')) {
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
                            e.category.toLowerCase().includes(searchQuery.toLowerCase());
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
      coordinates: entry.coordinates || pendingCoords || { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
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
    <div className="min-h-screen flex flex-col selection:bg-leather/20 selection:text-leather">
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
        <div className="bg-leather text-parchment py-2 px-8 flex justify-between items-center text-xs uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Info size={14} />
            <span>Estás viendo la bitácora de demostración (Modo Portfolio)</span>
          </div>
          <button 
            onClick={startMyDiary}
            className="hover:underline font-bold transition-all"
          >
            Empezar MI propio diario
          </button>
        </div>
      )}
      
      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {view === 'map' && (
              <MapView 
                entries={entries} 
                onSelectEntry={setSelectedEntry} 
                onAddAtLocation={handleAddAtLocation}
              />
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-parchment parchment-texture p-12 shadow-2xl border border-leather/30 max-w-md w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-leather/10 flex items-center justify-center text-leather">
                  <Lock size={40} />
                </div>
              </div>
              <h2 className="font-display text-4xl text-ink italic mb-4">Acceso al Cronista</h2>
              <p className="text-ink/60 italic mb-8">Solo el administrador oficial puede registrar nuevos datos en el sistema.</p>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <input 
                  type="password"
                  placeholder="Introduce la llave..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-0 border-b-2 border-leather/20 focus:border-leather focus:ring-0 text-center text-2xl font-serif py-2 transition-all"
                />
                <button 
                  type="submit"
                  className="w-full bg-leather text-parchment py-4 font-display text-xl italic hover:bg-leather/90 transition-all shadow-lg"
                >
                  Girar la Llave
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
