import { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Compass, Wind, Skull, Anchor, Sparkles, Navigation2 } from 'lucide-react';
import { Entry } from '../types';
import { cn } from './utils';

export const MapView = ({ entries, onSelectEntry, onAddAtLocation }: { entries: Entry[]; onSelectEntry: (e: Entry) => void; onAddAtLocation: (coords: { x: number, y: number }) => void }) => {
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
              
              let d = \`M \${sorted[0].coordinates!.x} \${sorted[0].coordinates!.y * 15 + 600}\`;
              for (let i = 1; i < sorted.length; i++) {
                const prev = sorted[i-1].coordinates!;
                const curr = sorted[i].coordinates!;
                const py = prev.y * 15 + 600;
                const cx = curr.x;
                const cy = curr.y * 15 + 600;
                
                // Curve calculation
                d += \` C \${prev.x} \${py + (cy - py) / 2}, \${cx} \${py + (cy - py) / 2}, \${cx} \${cy}\`;
              }
              // Extend to bottom with a slight wobble
              const last = sorted[sorted.length-1].coordinates!;
              d += \` L \${last.x} \${containerHeight}\`;
              return d;
            }, [entries, containerHeight])}
            className="stroke-[#8b5e34] stroke-[0.4] fill-none opacity-30"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Entries */}
        {[...entries].sort((a,b) => a.timestamp - b.timestamp).map((entry, idx) => {
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
              style={{ top: \`\${y}px\`, left: \`\${x}%\` }}
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
