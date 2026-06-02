import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const ScrollContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-hidden ${className || ''}`}
      style={{ height: 'calc(100vh - 72px)' }}
    >
      <div ref={contentRef} className="min-h-full">
        {children}
      </div>
    </div>
  );
};
