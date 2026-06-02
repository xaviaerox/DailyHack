import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, Skull } from 'lucide-react';
import { Chapter, Entry } from '../../types';

const dayVariants = {
  hidden: { opacity: 0, scale: 0, y: 10 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 20 } 
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
  const scale = useTransform(smoothProgress, [0, 1], [0.9, 1.05]);
  const filter = useTransform(smoothProgress, [0, 0.7], ["grayscale(60%) sepia(40%) blur(1px)", "grayscale(0%) sepia(0%) blur(0px)"]);
  const glowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.4]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0, 1]);
  
  // Cartographic Island SVGs (drawn more like real hand-drawn landmasses)
  const islandData = [
    {
      path: "M40,20 Q80,-10 130,20 T180,60 T150,130 T60,140 T20,100 Z",
      width: 200, height: 160,
      points: [ {x: 60, y: 40}, {x: 120, y: 50}, {x: 140, y: 90}, {x: 80, y: 110}, {x: 40, y: 80} ]
    },
    {
      path: "M30,50 Q60,10 110,30 T170,80 T130,150 T50,140 T10,90 Z",
      width: 200, height: 180,
      points: [ {x: 50, y: 60}, {x: 100, y: 45}, {x: 140, y: 80}, {x: 110, y: 120}, {x: 60, y: 110} ]
    },
    {
      path: "M50,10 Q100,20 140,10 T180,70 T150,130 T80,150 T20,90 Z",
      width: 200, height: 170,
      points: [ {x: 70, y: 30}, {x: 130, y: 40}, {x: 150, y: 90}, {x: 90, y: 120}, {x: 40, y: 70} ]
    }
  ];

  const island = islandData[index % islandData.length];

  return (
    <motion.div 
      ref={ref}
      style={{ scale, filter }}
      className="absolute z-20 flex flex-col items-center justify-center group"
      style={{ 
        left: `${chapter.coordinates?.x || 50}%`, 
        top: `${(chapter.coordinates?.y || index * 20) * 15 + 400}px`,
        width: island.width,
        height: island.height,
        marginLeft: -(island.width / 2),
        marginTop: -(island.height / 2)
      }}
    >
      {/* Glow effect */}
      <motion.div 
        style={{ opacity: glowOpacity }}
        className="absolute w-64 h-64 bg-[#b22222]/10 rounded-full blur-3xl -z-20 pointer-events-none"
      />

      {/* Cartographic SVG Island */}
      <svg 
        className="absolute top-0 left-0 w-full h-full -z-10 drop-shadow-xl" 
        viewBox={`0 0 ${island.width} ${island.height}`}
      >
        {/* Landmass base */}
        <path 
          d={island.path} 
          className="fill-[#e1d0ab] stroke-[#8b5e34]/40 stroke-[2] transition-colors duration-500 group-hover:fill-[#e8dcc4]" 
        />
        {/* Coastal lines (topographic effect) */}
        <path d={island.path} transform="scale(0.9) translate(10, 10)" className="stroke-[#8b5e34]/20 fill-transparent stroke-[1]" />
        <path d={island.path} transform="scale(0.8) translate(20, 20)" className="stroke-[#8b5e34]/15 fill-transparent stroke-[1]" />
        <path d={island.path} transform="scale(0.7) translate(30, 30)" className="stroke-[#8b5e34]/10 fill-transparent stroke-[1]" />
        {/* Mountain/Detail markers (static decoration) */}
        <path d="M70,70 L75,60 L80,70" className="stroke-[#8b5e34]/30 fill-transparent stroke-[1]" />
        <path d="M85,75 L90,65 L95,75" className="stroke-[#8b5e34]/30 fill-transparent stroke-[1]" />
      </svg>

      {/* Hover overlay for the whole island (shows chapter info) */}
      <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
         <div className="bg-[#5d4037]/90 text-[#f4ead5] px-4 py-2 rounded-sm shadow-xl font-display italic text-lg backdrop-blur-md translate-y-8">
           Explorar {chapter.title}
         </div>
      </div>

      {/* Chapter Title floating above the island */}
      <motion.h2 
        style={{ opacity: titleOpacity }}
        className="absolute -top-12 text-3xl font-display text-[#5d4037] italic text-center w-max bg-[#f4ead5]/80 px-4 py-1 rounded-sm border border-[#8b5e34]/20 shadow-md backdrop-blur-md pointer-events-auto cursor-help"
        title={`Capítulo ${index + 1}`}
      >
        {chapter.title}
      </motion.h2>

      {/* Pins placed ON the island */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        {chapter.days.map((day, i) => {
          // Fallback to center if we run out of pre-defined points
          const pos = island.points[i] || { x: island.width/2, y: island.height/2 };
          const isLast = i === chapter.days.length - 1;

          return (
            <motion.button
              key={day.id}
              variants={dayVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.8, once: false }}
              onClick={(e) => { e.stopPropagation(); onSelectDay(day); }}
              className="absolute w-8 h-8 rounded-full pointer-events-auto hover:scale-125 transition-transform flex items-center justify-center z-40 group/pin"
              style={{ left: pos.x, top: pos.y, marginLeft: -16, marginTop: -16 }}
            >
              {isLast ? (
                // Final point of the island is an X (Treasure)
                <Skull size={20} className="text-[#b22222] drop-shadow-md" strokeWidth={2.5} />
              ) : (
                // Regular points are small pins
                <MapPin size={16} className="text-[#8b5e34] fill-[#f4ead5] drop-shadow-sm" strokeWidth={2} />
              )}
              
              {/* Tooltip for the pin */}
              <div className="absolute bottom-full mb-2 w-48 bg-[#fffdf9] text-[#5d4037] p-3 rounded-sm opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-[#8b5e34]/20 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#b22222] font-bold mb-1">{day.date}</span>
                <span className="font-display italic leading-tight text-center">{day.title}</span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#fffdf9]" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
