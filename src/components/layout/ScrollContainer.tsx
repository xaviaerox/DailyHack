import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const ScrollContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current.firstElementChild as HTMLElement,
      lerp: 0.1,
      smoothWheel: true,
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
    <div ref={containerRef} className={`w-full h-full overflow-hidden ${className || ''}`}>
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
};
