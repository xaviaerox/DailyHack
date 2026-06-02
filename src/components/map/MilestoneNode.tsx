import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin } from 'lucide-react';
import { Chapter, Entry } from '../../types';
import { cn } from '../utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const dayVariants = {
  hidden: { opacity: 0, scale: 0, y: 10, rotate: -20 },
  visible: { 
    opacity: 1, scale: 1, y: 0, rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 } 
  }
};

interface MilestoneNodeProps {
  chapter: Chapter;
  index: number;
  onSelectDay: (entry: Entry) => void;
}

export const MilestoneNode = ({ chapter, index, onSelectDay }: MilestoneNodeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "center 0.4"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1.05]);
  const filter = useTransform(smoothProgress, [0, 0.7], ["grayscale(80%) sepia(30%) blur(1px)", "grayscale(0%) sepia(0%) blur(0px)"]);
  const glowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.5]);
  
  // Create a pseudo-random island shape based on the index
  const islandPaths = [
    "M20,50 Q40,10 70,20 T110,40 T90,90 T40,110 T10,80 Z",
    "M30,30 Q60,0 90,30 T120,70 T80,120 T20,100 T10,60 Z",
    "M10,40 Q30,10 80,20 T110,60 T70,110 T20,90 Z"
  ];
  const islandShape = islandPaths[index % islandPaths.length];

  return (
    <motion.div 
      ref={ref}
      style={{ scale, filter }}
      className="absolute z-20 flex flex-col items-center"
      style={{ left: `${chapter.coordinates?.x || 50}%`, top: `${(chapter.coordinates?.y || index * 20) * 15 + 400}px` }}
    >
      {/* Glow effect */}
      <motion.div 
        style={{ opacity: glowOpacity }}
        className="absolute w-48 h-48 bg-[#b22222]/20 rounded-full blur-3xl -z-20 pointer-events-none"
      />

      {/* SVG Island Base */}
      <svg className="absolute w-32 h-32 -z-10 text-[#8b5e34]/10 fill-current drop-shadow-sm pointer-events-none" viewBox="0 0 130 130">
        <path d={islandShape} />
        {/* Topographic lines */}
        <path d={islandShape} transform="scale(0.8) translate(15, 15)" className="stroke-[#8b5e34]/20 fill-transparent stroke-[1]" />
        <path d={islandShape} transform="scale(0.6) translate(40, 40)" className="stroke-[#8b5e34]/20 fill-transparent stroke-[1]" />
      </svg>

      {/* Main Marker / Island Capital */}
      <div className="w-16 h-16 bg-[#fffdf9] rounded-full shadow-[0_15px_35px_rgba(93,64,55,0.4)] flex flex-col items-center justify-center border-4 border-[#8b5e34] z-30 relative group transition-transform hover:scale-105 cursor-default mt-4">
        <span className="text-[#8b5e34] text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Isla</span>
        <span className="text-[#5d4037] font-display text-2xl italic leading-none">{index + 1}</span>
      </div>
      
      {/* Chapter Title */}
      <h2 className="mt-3 text-2xl font-display text-[#5d4037] italic text-center w-max bg-[#f4ead5]/90 px-4 py-1.5 rounded-sm border border-[#8b5e34]/20 shadow-md backdrop-blur-md">
        {chapter.title}
      </h2>

      {/* Expanded Days (Treasures) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.6, once: false }}
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        {chapter.days.map((day, i) => {
          // Semi-circle above the island
          const angle = (i / Math.max(chapter.days.length - 1, 1)) * Math.PI - Math.PI; 
          const radius = 110;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius - 10; 

          return (
            <motion.button
              key={day.id}
              variants={dayVariants}
              onClick={() => onSelectDay(day)}
              className="absolute w-10 h-10 bg-[#b22222] rounded-full shadow-xl border-2 border-[#f4ead5] pointer-events-auto hover:scale-125 transition-transform flex items-center justify-center text-[#f4ead5] font-bold text-sm z-40 group ring-4 ring-[#8b5e34]/10 hover:ring-[#b22222]/30"
              style={{ x, y, left: '50%', top: '50%', marginLeft: -20, marginTop: -20 }}
            >
              <MapPin size={16} fill="currentColor" className="opacity-80" />
              
              <div className="absolute bottom-full mb-3 w-48 bg-[#fffdf9] text-[#5d4037] p-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-[#8b5e34]/20 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#b22222] font-bold mb-1">{day.date}</span>
                <span className="font-display italic leading-tight text-center">{day.title}</span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#fffdf9]" />
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
