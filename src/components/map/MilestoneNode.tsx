import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Chapter, Entry } from '../../types';
import { cn } from '../utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const dayVariants = {
  hidden: { opacity: 0, scale: 0, y: 20 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 20 } 
  }
};

interface MilestoneNodeProps {
  chapter: Chapter;
  index: number;
  onSelectDay: (entry: Entry) => void;
  isLocked?: boolean;
}

export const MilestoneNode = ({ chapter, index, onSelectDay, isLocked = false }: MilestoneNodeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "center center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(smoothProgress, [0, 1], [0.8, 1.1]);
  const filter = useTransform(smoothProgress, [0, 0.8], ["grayscale(100%) blur(2px)", "grayscale(0%) blur(0px)"]);
  const glowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.6]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, filter: isLocked ? "grayscale(100%) blur(2px)" : filter }}
      className={cn(
        "absolute z-20 flex flex-col items-center",
        isLocked ? "pointer-events-none opacity-50" : ""
      )}
      style={{ left: `${chapter.coordinates?.x || 50}%`, top: `${(chapter.coordinates?.y || index * 20) * 15 + 400}px` }}
    >
      {/* Glow effect */}
      <motion.div 
        style={{ opacity: isLocked ? 0 : glowOpacity }}
        className="absolute w-32 h-32 bg-[#8b5e34]/30 rounded-full blur-2xl -z-10"
      />

      {/* Main Marker */}
      <div className="w-20 h-20 bg-[#8b5e34] rounded-full shadow-[0_10px_30px_rgba(139,94,52,0.6)] flex items-center justify-center border-4 border-[#f4ead5] z-30 relative group hover:scale-110 transition-transform">
        <span className="text-[#f4ead5] font-display text-3xl italic">{index + 1}</span>
      </div>
      
      {/* Chapter Title */}
      <h2 className="mt-6 text-3xl font-display text-[#5d4037] italic text-center w-max bg-[#f4ead5]/80 px-4 py-2 rounded-full border border-[#8b5e34]/10 shadow-sm backdrop-blur-sm">
        {chapter.title}
      </h2>

      {/* Expanded Days */}
      {!isLocked && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {chapter.days.map((day, i) => {
            const angle = (i / Math.max(chapter.days.length - 1, 1)) * Math.PI - Math.PI; 
            const radius = 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius - 20; // Offset slightly up

            return (
              <motion.button
                key={day.id}
                variants={dayVariants}
                onClick={() => onSelectDay(day)}
                className="absolute w-12 h-12 bg-[#fffdf9] rounded-full shadow-xl border-2 border-[#8b5e34]/40 pointer-events-auto hover:scale-125 transition-transform flex items-center justify-center text-[#5d4037] font-bold text-sm z-40 group"
                style={{ x, y, left: '50%', top: '50%', marginLeft: -24, marginTop: -24 }}
                title={day.title}
              >
                {i + 1}
                <div className="absolute top-full mt-2 w-max bg-[#5d4037] text-[#f4ead5] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {day.date}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};
