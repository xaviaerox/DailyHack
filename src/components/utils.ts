import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupEntriesIntoChapters(entries: any[]): any[] {
  // We'll sort by timestamp first
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const chapters = [];
  const chunkSize = 4; // e.g. 4 days per chapter
  
  for (let i = 0; i < sorted.length; i += chunkSize) {
    const chunk = sorted.slice(i, i + chunkSize);
    chapters.push({
      id: `chapter-${i}`,
      title: `Travesía ${(i/chunkSize) + 1}`,
      days: chunk,
      // Alternating distinctly left and right: 25% or 75%
      coordinates: { x: (i / chunkSize) % 2 === 0 ? 25 : 75, y: (i/chunkSize) * 25 }
    });
  }
  return chapters;
}
