import { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Compass, Wind, Skull, Anchor } from 'lucide-react';
import { Entry, Chapter } from '../../types';
import { groupEntriesIntoChapters } from '../utils';
import { MilestoneNode } from './MilestoneNode';

export const PirateMap = ({ entries, onSelectEntry }: { entries: Entry[]; onSelectEntry: (e: Entry) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create chapters from entries
  const chapters: Chapter[] = useMemo(() => groupEntriesIntoChapters(entries), [entries]);
  
  const { scrollYProgress } = useScroll({ container: containerRef });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotate, { stiffness: 10, damping: 20 });

  const containerHeight = useMemo(() => {
    const maxY = Math.max(...chapters.map((_, i) => i * 20), 40);
    return (maxY * 15) + 1200; 
  }, [chapters]);

  return (
    <main 
      ref={containerRef}
      className="relative w-full bg-[#f4ead5] parchment-texture overflow-y-auto overflow-x-hidden custom-scrollbar"
      style={{ height: 'calc(100vh - 72px)' }}
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
        `}</style>
        
        {/* Parallax Background Decorations */}
        <motion.div style={{ rotate: smoothRotate }} className="fixed top-32 right-12 opacity-[0.05] text-[#5d4037] pointer-events-none z-0">
          <Compass size={400} strokeWidth={0.5} />
        </motion.div>
        
        <Wind className="absolute top-[20%] left-[5%] opacity-[0.03] text-[#5d4037] -rotate-45 pointer-events-none" size={300} />
        <Skull className="absolute top-[60%] right-[2%] opacity-[0.02] text-[#5d4037] rotate-12 pointer-events-none" size={200} />

        {/* Hero Header */}
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
            className="text-8xl md:text-[11rem] font-display text-[#5d4037] italic mb-10 text-center leading-[0.8] tracking-tighter drop-shadow-xl"
          >
            Bitácora<br/><span className="text-[#8b5e34] not-italic text-[0.8em]">Pirata</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl md:text-4xl text-[#5d4037]/50 leading-relaxed italic text-center max-w-3xl px-6 font-serif"
          >
            "El conocimiento es un mar vasto, y nosotros somos los navíos trazando la historia en pergamino."
          </motion.p>
          <div className="mt-20 w-1 h-32 bg-gradient-to-b from-[#8b5e34]/30 to-transparent" />
        </section>

        {/* Route Path (SVG) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
          viewBox={`0 0 100 ${containerHeight}`} 
          preserveAspectRatio="none"
        >
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false, amount: 0.01 }}
            transition={{ duration: 5, ease: "linear" }}
            d={useMemo(() => {
              if (chapters.length < 1) return "";
              
              let d = `M ${chapters[0].coordinates!.x} ${chapters[0].coordinates!.y * 15 + 400}`;
              for (let i = 1; i < chapters.length; i++) {
                const prev = chapters[i-1].coordinates!;
                const curr = chapters[i].coordinates!;
                const py = prev.y * 15 + 400;
                const cx = curr.x;
                const cy = curr.y * 15 + 400;
                
                // Spline curve
                d += ` C ${prev.x} ${py + (cy - py) / 2}, ${cx} ${py + (cy - py) / 2}, ${cx} ${cy}`;
              }
              // Extend to bottom with slight curve
              if (chapters.length > 0) {
                const last = chapters[chapters.length-1].coordinates!;
                d += ` L ${last.x} ${containerHeight - 200}`;
              }
              return d;
            }, [chapters, containerHeight])}
            className="stroke-[#8b5e34] stroke-[0.4] fill-none opacity-40"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Milestone Nodes */}
        {chapters.map((chapter, i) => (
          <MilestoneNode 
            key={chapter.id} 
            chapter={chapter} 
            index={i} 
            onSelectDay={onSelectEntry} 
          />
        ))}

        {/* Foot Marker */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center py-80 opacity-20">
          <div className="relative">
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              <Compass size={200} className="text-[#5d4037]" strokeWidth={0.5} />
            </motion.div>
          </div>
          <p className="mt-12 text-3xl font-display italic tracking-[1.5em] text-[#5d4037] uppercase text-center w-full">Hic Sunt Dracones</p>
        </div>
      </div>
    </main>
  );
};
