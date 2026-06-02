import { motion } from 'motion/react';
import { Anchor, Trash2, X, Wind, Skull } from 'lucide-react';
import { Entry } from '../types';

export const DetailView = ({ entry, onClose, onDelete, isAdmin }: { entry: Entry; onClose: () => void; onDelete: (id: string) => void, isAdmin: boolean }) => {
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

