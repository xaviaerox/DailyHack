import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Compass, Wind, Skull, Anchor, Ship } from 'lucide-react';
import { Entry, Chapter } from '../../types';
import { groupEntriesIntoChapters } from '../utils';
import { MilestoneNode } from './MilestoneNode';

export const PirateMap = ({ entries, onSelectEntry }: { entries: Entry[]; onSelectEntry: (e: Entry) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  
  // Create chapters from entries
  const chapters: Chapter[] = useMemo(() => groupEntriesIntoChapters(entries), [entries]);
  
  // Notice we use the window/ancestor scroll for Lenis integration now
  // We'll pass the wrapper container if we had it, but Lenis intercepts window/container.
  // Actually, we'll use a local ref for scroll tracking relative to this map.
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"] 
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotate, { stiffness: 10, damping: 20 });
  const shipProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const containerHeight = useMemo(() => {
    const maxY = Math.max(...chapters.map((_, i) => i * 20), 40);
    return (maxY * 15) + 1200; 
  }, [chapters]);

  // Generate path definition once
  const pathData = useMemo(() => {
    if (chapters.length < 1) return "";
    let d = `M ${chapters[0].coordinates!.x} ${chapters[0].coordinates!.y * 15 + 400}`;
    for (let i = 1; i < chapters.length; i++) {
      const prev = chapters[i-1].coordinates!;
      const curr = chapters[i].coordinates!;
      const py = prev.y * 15 + 400;
      const cx = curr.x;
      const cy = curr.y * 15 + 400;
      d += ` C ${prev.x} ${py + (cy - py) / 2}, ${cx} ${py + (cy - py) / 2}, ${cx} ${cy}`;
    }
    if (chapters.length > 0) {
      const last = chapters[chapters.length-1].coordinates!;
      d += ` L ${last.x} ${containerHeight - 200}`;
    }
    return d;
  }, [chapters, containerHeight]);

  useEffect(() => {
    if (svgRef.current) {
      const path = svgRef.current.querySelector('path');
      if (path) {
        setPathLength(path.getTotalLength());
      }
    }
  }, [pathData]);

  // Calculate ship position
  const [shipPos, setShipPos] = useState({ x: 50, y: 0 });
  
  useEffect(() => {
    const unsub = shipProgress.on("change", (val) => {
      if (svgRef.current && pathLength > 0) {
        const path = svgRef.current.querySelector('path');
        if (path) {
          // Clamp val between 0 and 1
          const clamped = Math.max(0, Math.min(1, val));
          const point = path.getPointAtLength(clamped * pathLength);
          setShipPos({ x: point.x, y: point.y });
        }
      }
    });
    return () => unsub();
  }, [shipProgress, pathLength]);

  return (
    <main 
      ref={containerRef}
      className="relative w-full bg-[#f4ead5] parchment-texture"
      style={{ height: `${containerHeight}px`, minWidth: window.innerWidth < 768 ? '100%' : '1200px' }}
    >
      <style>{`
        .parchment-texture {
          background-color: #e8dcc4;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%),
            url('https://www.transparenttextures.com/patterns/handmade-paper.png');
          box-shadow: inset 0 0 100px rgba(139, 94, 52, 0.2);
        }
        .nautical-grid {
          background-image: 
            linear-gradient(rgba(139, 94, 52, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 94, 52, 0.08) 1px, transparent 1px);
          background-size: 100px 100px;
          background-position: center center;
        }
      `}</style>
      
      <div className="absolute inset-0 nautical-grid pointer-events-none opacity-50" />
      
      {/* Parallax Background Decorations */}
      <motion.div style={{ rotate: smoothRotate }} className="fixed top-32 right-12 opacity-[0.08] text-[#5d4037] pointer-events-none z-0">
        <Compass size={450} strokeWidth={0.5} />
      </motion.div>
      
      <Wind className="absolute top-[10%] left-[5%] opacity-[0.05] text-[#5d4037] -rotate-45 pointer-events-none" size={300} />
      <Wind className="absolute top-[40%] right-[8%] opacity-[0.05] text-[#5d4037] rotate-180 pointer-events-none" size={200} />
      <Skull className="absolute top-[70%] left-[10%] opacity-[0.04] text-[#5d4037] rotate-12 pointer-events-none" size={250} />

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
          className="text-7xl md:text-[9rem] font-display text-[#5d4037] italic mb-8 text-center leading-[0.85] tracking-tighter drop-shadow-sm"
        >
          Bitácora<br/><span className="text-[#8b5e34] not-italic text-[0.8em] font-serif uppercase tracking-[0.2em]">de Travesía</span>
        </motion.h1>
        <div className="flex items-center gap-4 opacity-50 mb-8">
          <div className="w-16 h-px bg-[#8b5e34]" />
          <Skull size={16} className="text-[#8b5e34]" />
          <div className="w-16 h-px bg-[#8b5e34]" />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl md:text-3xl text-[#5d4037]/60 leading-relaxed italic text-center max-w-2xl px-6 font-serif"
        >
          "El conocimiento es un mar vasto, y nosotros somos los navíos trazando la historia en pergamino."
        </motion.p>
      </section>

      {/* Route Path (SVG) */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        viewBox={`0 0 100 ${containerHeight}`} 
        preserveAspectRatio="none"
      >
        {/* Background track */}
        <path 
          d={pathData}
          className="stroke-[#8b5e34] stroke-[0.15] fill-none opacity-20"
          strokeDasharray="1 2"
        />
        {/* Active track */}
        <motion.path 
          d={pathData}
          style={{ pathLength: shipProgress }}
          className="stroke-[#b22222] stroke-[0.3] fill-none drop-shadow-md"
          strokeDasharray="2 3"
        />
      </svg>

      {/* The Ship Tracker */}
      <motion.div 
        className="absolute z-40 text-[#b22222] drop-shadow-xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ 
          left: `${shipPos.x}%`, 
          top: `${shipPos.y}px`,
        }}
      >
        <Ship size={40} className="fill-[#f4ead5] rotate-[-45deg]" strokeWidth={1.5} />
      </motion.div>

      {/* Milestone Nodes (Islands) */}
      {chapters.map((chapter, i) => (
        <MilestoneNode 
          key={chapter.id} 
          chapter={chapter} 
          index={i} 
          onSelectDay={onSelectEntry} 
        />
      ))}

      {/* Foot Marker */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center py-80 opacity-30">
        <div className="relative">
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
            <Compass size={200} className="text-[#5d4037]" strokeWidth={0.5} />
          </motion.div>
        </div>
        <p className="mt-12 text-3xl font-display italic tracking-[1.5em] text-[#5d4037] uppercase text-center w-full">Hic Sunt Dracones</p>
      </div>
    </main>
  );
};
