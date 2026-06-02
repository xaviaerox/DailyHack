import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Navigation2, Compass, Scroll as ScrollIcon } from 'lucide-react';
import { Entry } from '../types';
import { cn } from './utils';

export const ArchiveView = ({ entries, onSelectEntry, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: { entries: Entry[]; onSelectEntry: (e: Entry) => void; searchQuery: string; setSearchQuery: (q: string) => void; selectedCategory: string; setSelectedCategory: (c: string) => void }) => {
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

