import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Library, PenLine, Search, History, Trash2, Navigation2, Compass, Plus, MoveLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ViewType, Entry } from './types.ts';
import { SAMPLE_ENTRIES } from './constants.ts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ currentView, setView }: { currentView: ViewType; setView: (v: ViewType) => void }) => (
  <header className="bg-parchment/90 backdrop-blur-sm border-b border-shadow/30 sticky top-0 z-50 w-full">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-12">
        <a href="#" className="text-2xl font-display font-bold italic text-leather">La Crónica Atemporal</a>
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
            className="bg-transparent border-none focus:ring-0 text-sm italic w-48 focus:w-64 transition-all duration-500 placeholder:text-ink/40 border-b border-transparent focus:border-leather/30 pb-1"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/60 group-hover:text-leather w-4 h-4" />
        </div>
        <button 
          onClick={() => setView('editor')}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            currentView === 'editor' ? "bg-leather text-parchment" : "text-ink/70 hover:bg-shadow/20 hover:text-leather"
          )}
        >
          <PenLine size={20} />
        </button>
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

const MapView = ({ entries }: { entries: Entry[] }) => {
  return (
    <main className="relative min-h-[1200px] w-full parchment-texture p-8 md:p-20 overflow-visible background-grid">
      <style>{`
        .background-grid {
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(128, 85, 51, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(128, 85, 51, 0.03) 0%, transparent 50%),
            linear-gradient(rgba(225, 218, 198, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(225, 218, 198, 0.2) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 100px 100px, 100px 100px;
        }
      `}</style>
      
      {/* Decorative Compass Roses */}
      <div className="absolute top-[10%] left-[5%] rotate-12 opacity-10 pointer-events-none">
        <Compass size={300} strokeWidth={0.5} className="text-leather" />
      </div>
      <div className="absolute bottom-[10%] right-[10%] -rotate-12 scale-75 opacity-10 pointer-events-none">
        <Navigation2 size={300} strokeWidth={0.5} className="text-leather" />
      </div>

      <section className="max-w-2xl mb-32 relative z-40">
        <h1 className="font-display text-5xl md:text-7xl text-leather tracking-tight leading-tight mb-4">Carta Náutica del Saber</h1>
        <p className="text-lg md:text-xl text-ink/80 leading-relaxed italic">
          Una travesía visual a través de los fragmentos de conocimiento recolectados. Cada nodo marca un hito en la expansión de nuestras fronteras intelectuales.
        </p>
      </section>

      {/* SVG Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M 100 400 C 300 400, 400 100, 600 200 S 800 600, 1000 450 S 1300 150, 1500 300 S 1700 800, 1400 1000 S 800 900, 500 1100"
          className="stroke-leather stroke-[1.5] fill-none"
          strokeDasharray="8 8"
        />
      </svg>

      {/* Map Nodes */}
      {entries.filter(e => e.coordinates).map((entry, idx) => (
        <motion.div 
          key={entry.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.3 + 1 }}
          className="absolute"
          style={{ left: `${entry.coordinates?.x}%`, top: `${entry.coordinates?.y}%` }}
        >
          <div className="w-4 h-4 bg-leather rounded-full border-4 border-parchment ring-2 ring-leather/20 shadow-lg relative z-20 group cursor-pointer" />
          
          <div className={cn(
            "absolute z-30 transition-all duration-500 w-[280px] md:w-[320px]",
            idx % 2 === 0 ? "left-6 -top-12" : "-left-[320px] top-6"
          )}>
            <time className="italic text-sm text-leather/70 uppercase tracking-[0.2em] block mb-2">
              {entry.date} {idx === 0 ? '— Inicio' : ''}
            </time>
            <div className={cn(
               "p-6 rounded-sm shadow-xl border border-shadow/20 glass-tonal parchment-texture",
               idx === 2 ? "border-l-4 border-l-leather" : ""
            )}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-display text-2xl text-leather leading-tight">{entry.title}</h2>
                {idx === 1 && <PenLine size={16} className="text-leather/40" />}
                {idx === 2 && (
                  <div className="flex gap-2">
                    <History size={16} className="text-ink/40" />
                    <Trash2 size={16} className="text-ink/40" />
                  </div>
                )}
              </div>
              {idx === 2 && <div className="text-[10px] text-leather/60 mb-2 tracking-wider uppercase">Arquitectura · Sistemas</div>}
              <p className="text-sm leading-relaxed text-ink/80 italic">
                {entry.quote || entry.content.substring(0, 150) + '...'}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Terra Incognita Node */}
      <div className="absolute left-[85%] top-[25%]">
        <div className="w-6 h-6 bg-leather/30 rounded-full animate-pulse ring-4 ring-leather/10 relative z-20" />
        <div className="absolute left-10 -top-4 w-[240px]">
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-full border border-dashed border-leather/30 text-center">
            <Compass size={24} className="mx-auto text-leather mb-1 opacity-50" />
            <p className="italic text-[0.6rem] text-leather tracking-widest uppercase">Terra Incognita</p>
          </div>
        </div>
      </div>

      <div className="absolute left-[20%] top-[20%] rotate-[-20deg] opacity-20 pointer-events-none select-none">
        <span className="font-display text-6xl text-leather/40 font-bold">OCTUBRE</span>
      </div>
      <div className="absolute right-[15%] top-[50%] rotate-[15deg] opacity-20 pointer-events-none select-none">
        <span className="font-display text-6xl text-leather/40 font-bold">NOVIEMBRE</span>
      </div>

      <div className="absolute right-20 top-[40%] font-serif italic text-lg text-ink/30 rotate-90 tracking-[1em] select-none">
        40° 41' 21" N / 74° 02' 40" W
      </div>
    </main>
  );
};

const ArchiveView = ({ entries }: { entries: Entry[] }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-parchment parchment-texture">
      <aside className="w-full lg:w-96 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-shadow/20 bg-shadow/5">
        <div className="sticky top-32">
          <h1 className="font-display text-6xl leading-[0.9] tracking-tighter text-ink mb-6">Archivo<br/><span className="italic text-leather">Seleccionado</span></h1>
          <p className="text-base leading-relaxed text-ink/70 italic mb-12 border-l-2 border-leather/20 pl-6">Un recorrido visual a través de las memorias fragmentadas de un siglo en penumbra.</p>
          
          <div className="space-y-12">
            <div className="group">
              <label className="block text-[0.7rem] uppercase tracking-widest text-ink/50 mb-3">Filtrar por Concepto</label>
              <input 
                type="text" 
                placeholder="Escriba aquí..." 
                className="w-full bg-transparent border-0 border-b-2 border-ink/10 py-4 text-xl focus:ring-0 focus:outline-none focus:border-leather transition-colors text-ink placeholder:text-ink/20 placeholder:italic"
              />
            </div>

            <div>
              <h3 className="text-[0.7rem] uppercase tracking-widest text-ink/50 mb-6">Cronología</h3>
              <div className="space-y-4">
                {['Todos los Siglos', 'Era de Vapor', 'La Gran Quietud'].map((c, i) => (
                  <label key={c} className="flex items-center justify-between cursor-pointer group">
                    <span className={cn("text-lg transition-colors", i === 0 ? "text-ink font-medium" : "text-ink/60 group-hover:text-leather")}>{c}</span>
                    <span className="text-xs italic text-ink/30">{[342, 84, 12][i]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['#melancolía', '#alquimia', '#viajes'].map((tag, i) => (
                <button key={tag} className={cn(
                  "px-4 py-2 border border-shadow/30 text-ink/70 text-sm italic hover:border-leather hover:text-leather transition-all",
                  i === 2 && "bg-leather/5 border-leather text-leather"
                )}>
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
            <h2 className="font-display text-3xl text-ink font-light">Folios del Siglo XX</h2>
            <div className="h-1 w-24 bg-leather mt-2"></div>
          </div>
          <div className="text-sm italic text-ink/40">Exhibiendo 12 fragmentos de la memoria colectiva.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          {entries.map((entry, idx) => (
            <motion.article 
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
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
                  {entry.content.substring(1)}
                </p>
                {entry.quote && (
                  <blockquote className="border-l-4 border-leather/30 pl-4 italic text-xl text-ink/80 font-serif leading-snug mt-auto pt-4">
                    "{entry.quote}"
                  </blockquote>
                )}
              </div>
            </motion.article>
          ))}
          
          {/* Alquimia Special Card */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 xl:col-span-1 group cursor-pointer"
          >
            <div className="bg-white p-12 border-2 border-double border-shadow/20 relative shadow-2xl h-full flex flex-col items-center text-center">
              <span className="block text-[0.7rem] tracking-[0.4em] text-leather mb-8 uppercase font-bold">La Gran Obra</span>
              <div className="mx-auto mb-10 w-24 h-24 opacity-20">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <path d="M50,10 L90,90 L10,90 Z" />
                  <circle cx="50" cy="60" r="15" />
                </svg>
              </div>
              <h3 className="font-display text-4xl leading-none mb-10">La alquimia del tiempo</h3>
              <p className="text-lg leading-relaxed text-ink/80 mb-12">
                <span className="text-5xl font-display font-bold float-left mr-3 mt-1 leading-none text-leather">T</span>
                ranstornar el plomo en oro es un juego de niños comparado con el intento de detener un solo segundo de felicidad pura.
              </p>
              <blockquote className="italic text-2xl text-leather px-4 mt-auto">
                "El tiempo no corre, se evapora en el alambique de nuestra propia memoria."
              </blockquote>
            </div>
          </motion.article>
        </div>

        <div className="mt-24 pt-12 border-t border-shadow/20 flex flex-col items-center">
          <p className="text-base italic text-ink/40 mb-8">El archivo continúa en los sótanos...</p>
          <button className="px-16 py-5 bg-transparent border-2 border-leather text-leather font-display text-2xl italic hover:bg-leather hover:text-parchment transition-all duration-500 shadow-sm">
            Pasar a la siguiente estancia
          </button>
        </div>
      </section>
    </div>
  );
};

const EditorView = ({ onSave, onCancel }: { onSave: (e: Partial<Entry>) => void, onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

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
                placeholder="Ej. Alquimia, Botánica..." 
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
              placeholder="El conocimiento se desvanece si no se plasma en papel. Inicia tu relato aquí..."
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
        <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={() => onSave({ title, category, content })}
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

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewType>('map');
  const [entries, setEntries] = useState<Entry[]>(SAMPLE_ENTRIES);

  const handleSave = (entry: Partial<Entry>) => {
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      title: entry.title || 'Sin Título',
      content: entry.content || '',
      category: entry.category || 'General',
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    };
    setEntries(prev => [...prev, newEntry]);
    setView('archive');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-leather/20 selection:text-leather">
      <Navbar currentView={view} setView={setView} />
      
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
            {view === 'map' && <MapView entries={entries} />}
            {view === 'archive' && <ArchiveView entries={entries} />}
            {view === 'editor' && <EditorView onSave={handleSave} onCancel={() => setView('map')} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {view !== 'editor' && <Footbar currentView={view} setView={setView} />}

      {/* Floating Action Buttons for Map View */}
      {view === 'map' && (
        <div className="fixed bottom-24 right-8 flex flex-col gap-4 z-40">
          <button 
            onClick={() => setView('editor')}
            className="bg-leather text-parchment w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-leather/90 transition-all group border-4 border-parchment/50"
          >
            <PenLine size={28} className="transition-transform group-hover:rotate-12" />
          </button>
          <button className="bg-shadow text-leather w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-parchment border border-shadow/30 transition-all">
            <Plus size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
