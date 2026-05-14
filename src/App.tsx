import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { 
  Map as MapIcon, 
  Library, 
  PenLine, 
  Search, 
  History, 
  Trash2, 
  Navigation2, 
  Compass, 
  Plus, 
  MoveLeft, 
  X, 
  Sparkles, 
  Lock, 
  Unlock, 
  LogOut, 
  Info,
  Anchor,
  Wind,
  Skull,
  Scroll as ScrollIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ViewType, Entry } from './types';
import { SAMPLE_ENTRIES } from './constants';
import DIARY_DATA from './data/entries.json';
import { analyzeEntry } from './gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ currentView, setView, searchQuery, setSearchQuery, setSelectedCategory, isAdmin, onLogout, onLoginOpen }: { currentView: ViewType; setView: (v: ViewType) => void; searchQuery: string; setSearchQuery: (q: string) => void, setSelectedCategory: (c: string) => void, isAdmin: boolean, onLogout: () => void, onLoginOpen: () => void }) => (
  <header className="bg-[#f4ead5]/90 backdrop-blur-md border-b border-[#8b5e34]/30 sticky top-0 z-50 w-full shadow-sm">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-12">
        <button 
          onClick={() => { setView('map'); setSearchQuery(''); setSelectedCategory('Todos'); }}
          className="text-3xl font-display font-bold italic text-[#5d4037] hover:opacity-80 transition-opacity flex items-center gap-3"
        >
          <Anchor className="text-[#8b5e34]" size={28} />
          La Crónica Atemporal
        </button>
        <nav className="hidden md:flex gap-10 items-center mt-1">
          <button 
            onClick={() => setView('map')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-display italic tracking-wide",
              currentView === 'map' ? "text-[#8b5e34] border-b-2 border-[#8b5e34]" : "text-[#5d4037]/60 hover:text-[#8b5e34]"
            )}
          >
            Mapa de Indagaciones
          </button>
          <button 
            onClick={() => setView('archive')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-display italic tracking-wide",
              currentView === 'archive' ? "text-[#8b5e34] border-b-2 border-[#8b5e34]" : "text-[#5d4037]/60 hover:text-[#8b5e34]"
            )}
          >
            Archivos Centrales
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-8">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Navegar por tinta..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-lg font-serif italic w-48 focus:w-72 transition-all duration-500 placeholder:text-[#5d4037]/30 border-b border-transparent focus:border-[#8b5e34]/30 pb-1"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5d4037]/40 group-hover:text-[#8b5e34] w-5 h-5" />
        </div>
        
        {isAdmin ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('editor')}
              className={cn(
                "p-2.5 rounded-full transition-all duration-300 border border-transparent",
                currentView === 'editor' ? "bg-[#8b5e34] text-[#f4ead5] shadow-lg" : "text-[#5d4037]/70 hover:bg-[#8b5e34]/10 hover:text-[#8b5e34]"
              )}
            >
              <PenLine size={20} />
            </button>
            <button onClick={onLogout} className="p-2 text-[#5d4037]/40 hover:text-[#8b5e34] transition-colors" title="Cerrar Sesión">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onLoginOpen} className="p-2 text-[#5d4037]/40 hover:text-[#8b5e34] transition-colors" title="Acceso Propietario">
            <Lock size={18} />
          </button>
        )}
      </div>
    </div>
  </header>
);

const Footbar = ({ currentView, setView }: { currentView: ViewType; setView: (v: ViewType) => void }) => (
  <nav className="md:hidden bg-[#f4ead5] border-t border-[#8b5e34]/20 fixed bottom-0 w-full z-50 flex justify-around items-center h-16 shadow-[0_-5px_20px_rgba(139,94,52,0.15)]">
    <button onClick={() => setView('map')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'map' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <MapIcon size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Mapa</span>
    </button>
    <button onClick={() => setView('archive')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'archive' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <Library size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Archivos</span>
    </button>
    <button onClick={() => setView('editor')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'editor' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <PenLine size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Crónica</span>
    </button>
  </nav>
);

// --- Views ---

const MapView = ({ entries, onSelectEntry, onAddAtLocation }: { entries: Entry[]; onSelectEntry: (e: Entry) => void; onAddAtLocation: (coords: { x: number, y: number }) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotate, { stiffness: 10, damping: 20 });

  const containerHeight = useMemo(() => {
    const maxY = Math.max(...entries.map(e => e.coordinates?.y || 0), 100);
    return (maxY * 15) + 1200; 
  }, [entries]);

  return (
    <main 
      ref={containerRef}
      className="relative w-full bg-[#f4ead5] parchment-texture overflow-y-auto overflow-x-hidden custom-scrollbar"
      style={{ height: 'calc(100vh - 72px)' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains('background-grid')) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onAddAtLocation({ x, y: (y / (containerHeight / rect.height)) * 100 });
        }
      }}
    >
      <div 
        className="relative w-full background-grid px-4 md:px-8" 
        style={{ height: `${containerHeight}px`, minWidth: window.innerWidth < 768 ? '100%' : '1200px' }}
      >
        <style>{`
          .parchment-texture {
            background-color: #f4ead5;
            background-image: url('https://www.transparenttextures.com/patterns/handmade-paper.png');
          }
          .background-grid {
            background-image: 
              linear-gradient(rgba(139, 94, 52, 0.05) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(139, 94, 52, 0.05) 1.5px, transparent 1.5px);
            background-size: 80px 80px;
          }
          .deckle-edge-bottom {
             box-shadow: 0 10px 30px rgba(0,0,0,0.1);
             clip-path: polygon(0% 0%, 100% 0%, 100% 98%, 95% 99%, 90% 98%, 85% 99%, 80% 98%, 75% 99%, 70% 98%, 65% 99%, 60% 98%, 55% 99%, 50% 98%, 45% 99%, 40% 98%, 35% 99%, 30% 98%, 25% 99%, 20% 98%, 15% 99%, 10% 98%, 5% 99%, 0% 98%);
          }
        `}</style>
        
        {/* Background Decorative Elements */}
        <motion.div style={{ rotate: smoothRotate }} className="fixed top-32 right-12 opacity-[0.05] text-[#5d4037] pointer-events-none z-0">
          <Compass size={400} strokeWidth={0.5} />
        </motion.div>
        
        <Wind className="absolute top-[20%] left-[5%] opacity-[0.03] text-[#5d4037] -rotate-45 pointer-events-none" size={300} />
        <Skull className="absolute top-[60%] right-[2%] opacity-[0.02] text-[#5d4037] rotate-12 pointer-events-none" size={200} />

        {/* Header decoration */}
        <section className="relative z-10 pointer-events-none w-full flex flex-col items-center pt-64 pb-80">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-12"
          >
            <Anchor size={80} className="text-[#8b5e34] opacity-40 mb-6 mx-auto" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[11rem] font-display text-[#5d4037] italic mb-10 text-center leading-[0.8] tracking-tighter"
          >
            Topología del<br/><span className="text-[#8b5e34] not-italic drop-shadow-sm">Conocimiento</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl md:text-4xl text-[#5d4037]/40 leading-relaxed italic text-center max-w-3xl px-6 font-serif"
          >
            "Navegando entre los mares de bits y bytes,<br/>dejando rastro en el pergamino del tiempo."
          </motion.p>
          <div className="mt-20 w-1 h-32 bg-gradient-to-b from-[#8b5e34]/30 to-transparent" />
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
            transition={{ duration: 5, ease: "linear" }}
            d={useMemo(() => {
              const sorted = entries
                .filter(e => e.coordinates)
                .sort((a, b) => a.timestamp - b.timestamp);
              
              if (sorted.length < 1) return "";
              
              let d = `M ${sorted[0].coordinates!.x} ${sorted[0].coordinates!.y * 15 + 600}`;
              for (let i = 1; i < sorted.length; i++) {
                const prev = sorted[i-1].coordinates!;
                const curr = sorted[i].coordinates!;
                const py = prev.y * 15 + 600;
                const cx = curr.x;
                const cy = curr.y * 15 + 600;
                
                // Curve calculation
                d += ` C ${prev.x} ${py + (cy - py) / 2}, ${cx} ${py + (cy - py) / 2}, ${cx} ${cy}`;
              }
              // Extend to bottom with a slight wobble
              const last = sorted[sorted.length-1].coordinates!;
              d += ` L ${last.x} ${containerHeight}`;
              return d;
            }, [entries, containerHeight])}
            className="stroke-[#8b5e34] stroke-[0.4] fill-none opacity-30"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Entries */}
        {entries.sort((a,b) => a.timestamp - b.timestamp).map((entry, idx) => {
          const x = entry.coordinates?.x || 50;
          const y = (entry.coordinates?.y || 0) * 15 + 600;
          const isAtRight = x > 50;
          const isLast = idx === entries.length - 1;
          
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
                 {/* Point Mark */}
                 <div className={cn(
                   "w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl ring-4 ring-[#f4ead5] relative z-30 flex items-center justify-center transition-all duration-500 group-hover:scale-125",
                   isLast ? "bg-[#b22222] animate-pulse" : "bg-[#8b5e34]"
                 )}>
                    {isLast ? <Sparkles size={16} className="text-white" /> : <div className="w-2 h-2 bg-white/40 rounded-full" />}
                 </div>
                 
                 {/* Metadata */}
                 <div className="absolute top-[-3.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap opacity-50 text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-bold text-[#5d4037] pointer-events-none bg-[#f4ead5]/80 px-4 py-1 rounded-full border border-[#8b5e34]/10">
                   {entry.date} <span className="opacity-20 mx-3">|</span> {entry.category}
                 </div>

                 {/* Card */}
                 <motion.div
                   whileHover={{ y: -10, scale: 1.03, rotate: isAtRight ? -1 : 1 }}
                   onClick={(e) => { e.stopPropagation(); onSelectEntry(entry); }}
                   className={cn(
                     "absolute w-[85vw] sm:w-[480px] p-8 sm:p-12 bg-[#fffdf9] shadow-[0_20px_50px_rgba(93,64,55,0.15)] border border-[#8b5e34]/10 cursor-pointer transition-all duration-700 z-50 rounded-sm",
                     isAtRight 
                       ? "right-4 sm:right-16 -translate-y-1/2 origin-right" 
                       : "left-4 sm:left-16 -translate-y-1/2 origin-left"
                   )}
                 >
                   <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#8b5e34]/10 group-hover:bg-[#8b5e34] transition-all duration-500" />
                   {isLast && (
                     <div className="absolute top-4 right-4 flex items-center gap-2 text-[#b22222] text-[10px] font-bold uppercase tracking-widest">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b22222] opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b22222]"></span>
                       </span>
                       Última Recalada
                     </div>
                   )}
                   <h3 className="font-display text-3xl md:text-4xl text-[#5d4037] italic mb-6 leading-tight group-hover:text-[#8b5e34] transition-colors">{entry.title}</h3>
                   <p className="text-xl md:text-2xl text-[#5d4037]/70 font-serif italic line-clamp-3 leading-relaxed">"{entry.quote || entry.content}"</p>
                   
                   <div className="mt-8 pt-6 border-t border-[#8b5e34]/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <span className="text-[10px] uppercase tracking-widest text-[#8b5e34] font-bold">Explorar Bitácora</span>
                     <Navigation2 size={16} className={cn("text-[#8b5e34]", isAtRight ? "rotate-90" : "-rotate-90")} />
                   </div>
                 </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* End Mark */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center py-80 opacity-20">
          <div className="relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              <Compass size={200} className="text-[#5d4037]" strokeWidth={0.5} />
            </motion.div>
            <Skull size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#b22222] opacity-50" />
          </div>
          <p className="mt-12 text-3xl font-display italic tracking-[1.5em] text-[#5d4037] uppercase">Hic Sunt Dracones</p>
          <div className="mt-8 text-[10px] uppercase tracking-[0.5em] text-[#5d4037]/40">Fin de la Tierra Conocida</div>
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f4ead5] parchment-texture">
      <aside className="w-full lg:w-[450px] p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-[#8b5e34]/20 bg-[#5d4037]/5">
        <div className="sticky top-40">
          <h1 className="font-display text-7xl leading-[0.8] tracking-tighter text-[#5d4037] mb-8 italic">Archivos<br/><span className="text-[#8b5e34] not-italic">Centrales</span></h1>
          <p className="text-xl leading-relaxed text-[#5d4037]/70 italic mb-16 border-l-3 border-[#8b5e34]/30 pl-8 font-serif">Un inventario exhaustivo de las crónicas fragmentadas durante la travesía técnica.</p>
          
          <div className="space-y-16">
            <div className="group">
              <label className="block text-[0.75rem] uppercase tracking-[0.3em] text-[#5d4037]/50 mb-4 font-bold">Inquirir por Concepto</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Inicia la búsqueda..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-[#5d4037]/10 py-5 text-2xl focus:ring-0 focus:outline-none focus:border-[#8b5e34] transition-all text-[#5d4037] placeholder:text-[#5d4037]/20 placeholder:italic font-serif"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5d4037]/20" size={24} />
              </div>
            </div>

            <div>
              <h3 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#5d4037]/50 mb-8 font-bold">Cronología de Saberes</h3>
              <div className="space-y-6">
                {categories.map((c) => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedCategory(c)}
                    className="flex items-center justify-between w-full cursor-pointer group transition-all"
                  >
                    <span className={cn(
                      "text-xl transition-all duration-300 font-display italic", 
                      selectedCategory === c ? "text-[#8b5e34] translate-x-2 scale-105" : "text-[#5d4037]/60 group-hover:text-[#8b5e34] group-hover:translate-x-1"
                    )}>{c}</span>
                    <span className="text-xs font-bold text-[#5d4037]/30 bg-[#5d4037]/5 px-2 py-1 rounded-sm">{c === 'Todos' ? entries.length : entries.filter(e => e.category === c).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-[#8b5e34]/10">
              <div className="flex flex-wrap gap-3">
                {['#sistemas', '#IA', '#arquitectura', '#react', '#seguridad'].map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => setSearchQuery(tag.substring(1))}
                    className={cn(
                      "px-5 py-2.5 border border-[#8b5e34]/20 text-[#5d4037]/70 text-xs font-bold uppercase tracking-widest hover:border-[#8b5e34] hover:text-[#8b5e34] transition-all rounded-full",
                      searchQuery === tag.substring(1) && "bg-[#8b5e34] border-[#8b5e34] text-[#f4ead5] shadow-md"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex-1 p-12 lg:p-24 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-8">
          <div>
            <h2 className="font-display text-5xl text-[#5d4037] italic">Códices Registrados</h2>
            <div className="h-1.5 w-32 bg-[#8b5e34] mt-4 rounded-full"></div>
          </div>
          <div className="text-lg italic text-[#5d4037]/40 font-serif">Exhibiendo {entries.length} fragmentos de la bitácora oficial.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-12 items-start">
          {entries.map((entry, idx) => (
            <motion.article 
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.6 }}
              onClick={() => onSelectEntry(entry)}
              className="group cursor-pointer"
            >
              <div className={cn(
                "p-12 border border-[#8b5e34]/10 shadow-[0_10px_40px_rgba(93,64,55,0.05)] group-hover:shadow-[0_30px_70px_rgba(93,64,55,0.12)] transition-all duration-700 relative overflow-hidden h-full flex flex-col rounded-sm",
                idx % 2 === 0 ? "bg-white" : "bg-[#5d4037]/5 group-hover:bg-white"
              )}>
                {/* Decorative Elements */}
                <div className="absolute -right-6 -top-6 w-48 h-48 opacity-[0.05] grayscale pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  <Compass size={192} strokeWidth={0.5} className="text-[#8b5e34]" />
                </div>

                <div className="flex justify-between items-start mb-10">
                  <span className="block text-[0.75rem] tracking-[0.4em] text-[#8b5e34] uppercase font-bold">{entry.date}</span>
                  <ScrollIcon size={18} className="text-[#8b5e34]/20 group-hover:text-[#8b5e34] transition-colors" />
                </div>
                
                <h3 className="font-display text-4xl leading-tight mb-8 group-hover:text-[#8b5e34] transition-colors italic">{entry.title}</h3>
                
                <div className="relative mb-10 flex-grow">
                  <div className="text-7xl font-display font-bold float-left mr-4 mt-2 leading-none text-[#8b5e34] drop-shadow-sm">{entry.content[0]}</div>
                  <p className="text-xl leading-relaxed text-[#5d4037]/80 font-serif">
                    {entry.content.substring(1, 180)}{entry.content.length > 180 ? '...' : ''}
                  </p>
                </div>

                {entry.quote && (
                  <blockquote className="border-l-4 border-[#8b5e34]/30 pl-6 italic text-2xl text-[#5d4037]/90 font-serif leading-snug mt-auto pt-6 border-t border-[#8b5e34]/5">
                    "{entry.quote}"
                  </blockquote>
                )}
                
                <div className="mt-8 flex gap-2 overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
                  {entry.tags?.map(t => (
                    <span key={t} className="text-[9px] uppercase tracking-widest text-[#8b5e34] bg-[#8b5e34]/5 px-2 py-0.5 rounded-sm">#{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-40 pt-20 border-t border-[#8b5e34]/10 flex flex-col items-center">
          <p className="text-xl italic text-[#5d4037]/40 mb-12 font-serif">Las crónicas continúan en la vastedad de los servidores...</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-20 py-6 bg-transparent border-2 border-[#8b5e34] text-[#8b5e34] font-display text-3xl italic hover:bg-[#8b5e34] hover:text-[#f4ead5] transition-all duration-700 shadow-xl group"
          >
            Regresar a la Proa
            <Navigation2 size={24} className="inline-block ml-4 -rotate-90 group-hover:-translate-y-2 transition-transform" />
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
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-[#1a120b] relative overflow-hidden">
      <div className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }} />
      <Wind className="absolute top-10 left-10 text-white/5 animate-pulse" size={400} />
      
      <div className="relative w-full max-w-7xl aspect-[1.6/1] flex shadow-[0_60px_120px_rgba(0,0,0,0.9)] rounded-lg overflow-visible scale-90 md:scale-100 group">
        <div className="relative flex-1 bg-[#f4ead5] parchment-texture border-r border-black/20 flex flex-col p-16 md:p-24 items-center justify-center text-center shadow-inner">
          <div className="absolute top-10 left-10 w-40 h-40 opacity-10 pointer-events-none text-[#8b5e34]">
            <Anchor size={140} strokeWidth={1} />
          </div>
          
          <header className="mb-20">
            <div className="font-display italic text-4xl text-[#8b5e34]/70 mb-4">Libro de Crónicas</div>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#8b5e34]/30 to-transparent mx-auto"></div>
          </header>

          <div className="w-full space-y-14 relative z-10">
            <div className="flex flex-col gap-4">
              <label className="italic text-[11px] text-[#8b5e34]/60 uppercase tracking-[0.4em] font-bold">Título del Hallazgo</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nombra tu descubrimiento..." 
                className="bg-transparent border-0 border-b border-[#8b5e34]/20 focus:border-[#8b5e34]/60 focus:ring-0 font-display text-5xl text-[#5d4037] placeholder:text-[#5d4037]/10 transition-all text-center pb-4 italic" 
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="italic text-[11px] text-[#8b5e34]/60 uppercase tracking-[0.4em] font-bold">Categoría del Saber</label>
              <input 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ej. Redes, Alquimia de Código..." 
                className="bg-transparent border-0 border-b border-[#8b5e34]/20 focus:border-[#8b5e34]/60 focus:ring-0 font-serif italic text-3xl text-[#8b5e34] placeholder:text-[#8b5e34]/20 transition-all text-center" 
              />
            </div>
            <div className="pt-16">
              <div className="text-[#8b5e34]/40 text-[11px] tracking-[0.5em] uppercase font-bold">
                A.D. {new Date().getFullYear()} • TRAVESÍA ASIR
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-[#f4ead5] parchment-texture flex flex-col p-16 md:p-24 shadow-inner">
          <div className="flex-grow">
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="La tinta se seca rápido, capitán. Inicia el registro de la jornada aquí..."
              className="w-full h-full bg-transparent border-0 focus:ring-0 p-0 text-2xl text-[#5d4037]/90 resize-none leading-[2.5rem] placeholder:text-[#5d4037]/15 scrollbar-hide font-serif italic"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2.5rem, rgba(139,94,52,0.08) 2.5rem, rgba(139,94,52,0.08) 2.55rem)', backgroundSize: '100% 2.55rem' }}
            />
          </div>
          <div className="absolute bottom-12 right-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000">
            <PenLine size={120} className="text-[#8b5e34]" />
          </div>
        </div>

        {/* Binding Shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none z-10"></div>

        {/* Wax Seal Button */}
        <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 z-50 flex gap-12 items-center scale-110">
          <button 
            onClick={handleAI}
            disabled={isAnalyzing}
            className="w-20 h-20 rounded-full bg-[#f4ead5] border-2 border-[#8b5e34]/30 flex items-center justify-center text-[#8b5e34] hover:bg-[#8b5e34] hover:text-[#f4ead5] transition-all duration-700 group relative shadow-2xl overflow-hidden disabled:opacity-50"
          >
            <div className={cn("absolute inset-0 bg-[#8b5e34] transition-transform duration-1000 translate-y-full group-hover:translate-y-0")}></div>
            <Sparkles size={28} className={cn("relative z-10 transition-transform group-hover:rotate-45", isAnalyzing && "animate-pulse")} />
          </button>

          <button 
            onClick={() => onSave({ title, category, content, coordinates: initialCoords })}
            className="group relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.7)]" style={{ background: 'radial-gradient(circle at 35% 35%, #d32f2f, #b71c1c 65%, #7f0000)' }}>
              <div className="w-32 h-32 rounded-full border-4 border-black/10 flex flex-col items-center justify-center text-[#f4ead5] text-center p-4">
                <Skull size={44} className="mb-2 opacity-80" />
                <span className="font-display font-bold text-sm uppercase tracking-[0.2em] leading-none">Estampar</span>
              </div>
            </div>
            {/* Wax Drips */}
            <div className="absolute -top-1 -right-3 w-10 h-10 rounded-full bg-[#7f0000] blur-[2px] opacity-90 group-hover:scale-110 transition-transform"></div>
            <div className="absolute -bottom-3 -left-2 w-12 h-8 rounded-full bg-[#7f0000] blur-[2px] opacity-90 group-hover:scale-110 transition-transform"></div>
          </button>
        </div>
      </div>

      <div className="fixed top-12 left-12 z-50">
        <button onClick={onCancel} className="flex items-center gap-4 text-[#f4ead5]/40 hover:text-[#f4ead5] transition-all group font-display text-2xl italic tracking-wide">
          <MoveLeft size={32} className="transition-transform group-hover:-translate-x-2" />
          <span>Cerrar la Bitácora</span>
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-6xl bg-[#f4ead5] parchment-texture shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col md:flex-row max-h-[90vh] rounded-sm border border-[#8b5e34]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-[35%] bg-[#5d4037]/10 p-12 md:p-20 border-b md:border-b-0 md:border-r border-[#8b5e34]/15 flex flex-col justify-between">
          <div>
            <span className="block text-[0.8rem] tracking-[0.5em] text-[#8b5e34] mb-12 uppercase font-bold">{entry.date}</span>
            <div className="text-[#8b5e34]/40 text-[11px] tracking-[0.4em] uppercase font-bold mb-4">Clasificación Arcaica</div>
            <div className="font-display text-5xl text-[#5d4037] italic leading-tight mb-12">{entry.category}</div>
            
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-16">
                {entry.tags.map(t => (
                  <span key={t} className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5d4037]/50 border border-[#8b5e34]/20 px-3 py-1.5 italic rounded-sm bg-[#f4ead5]/40">#{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 text-[#5d4037]/30">
               <Anchor size={40} strokeWidth={1} />
               <div className="h-0.5 flex-grow bg-[#8b5e34]/10" />
            </div>
            {isAdmin && (
              <button 
                onClick={() => { if(confirm('¿Deseas purgar este registro de la historia?')) { onDelete(entry.id); onClose(); } }}
                className="flex items-center gap-3 text-[#5d4037]/40 hover:text-[#b22222] transition-colors text-xs uppercase tracking-[0.3em] font-bold"
              >
                <Trash2 size={16} /> Purgar Registro
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-12 md:p-24 overflow-y-auto custom-scrollbar relative">
          <button 
            onClick={onClose}
            className="absolute top-12 right-12 text-[#8b5e34]/40 hover:text-[#8b5e34] transition-all hover:scale-110"
          >
            <X size={32} />
          </button>

          <h2 className="font-display text-6xl md:text-8xl text-[#5d4037] leading-[0.9] mb-16 italic tracking-tighter">{entry.title}</h2>
          
          <div className="mb-20">
            <div className="text-[10rem] font-display font-bold float-left mr-8 mt-4 leading-[0.7] text-[#8b5e34] drop-shadow-md select-none">{entry.content[0]}</div>
            <p className="text-2xl md:text-3xl leading-[2.8rem] text-[#5d4037]/90 whitespace-pre-wrap font-serif italic">
              {entry.content.substring(1)}
            </p>
          </div>

          {entry.quote && (
            <div className="relative pt-12">
               <Wind className="absolute -top-4 -left-4 text-[#8b5e34]/10" size={80} />
               <blockquote className="border-l-8 border-[#8b5e34]/20 pl-10 italic text-3xl md:text-4xl text-[#8b5e34] font-serif leading-snug py-8 bg-[#8b5e34]/5 shadow-inner relative z-10">
                 "{entry.quote}"
               </blockquote>
            </div>
          )}
          
          <div className="mt-32 pt-12 border-t border-[#8b5e34]/10 text-center">
             <Skull size={32} className="mx-auto text-[#5d4037]/10 mb-4" />
             <div className="text-[10px] uppercase tracking-[0.8em] text-[#5d4037]/20">Fin de la Transcripción</div>
          </div>
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
    const saved = localStorage.getItem('dailyhack_entries_v5');
    if (localStorage.getItem('dailyhack_initialized') === 'true') {
      return saved ? JSON.parse(saved) : SAMPLE_ENTRIES;
    }
    // Convert coordinate format if necessary (v5 expects it from the script)
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
