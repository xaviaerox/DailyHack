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
      // We can assign coordinates based on index or just spread them vertically
      coordinates: { x: 50 + (i % 2 === 0 ? -20 : 20), y: (i/chunkSize) * 20 }
    });
  }
  return chapters;
}
