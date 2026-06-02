import { useState } from 'react';
import { Wind, Anchor, PenLine, Sparkles, Skull, MoveLeft } from 'lucide-react';
import { Entry } from '../types';
import { analyzeEntry } from '../gemini';
import { cn } from './utils';

export const EditorView = ({ onSave, onCancel, initialCoords }: { onSave: (e: Partial<Entry>) => void, onCancel: () => void, initialCoords?: { x: number, y: number } }) => {
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

