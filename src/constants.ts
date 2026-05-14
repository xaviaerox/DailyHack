import { Entry } from './types';

export const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 'sample-0',
    title: 'Mi Primera Crónica',
    content: 'Este es el inicio de mi travesía personal. Aquí registraré mis propios hallazgos...',
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    timestamp: Date.now(),
    category: 'Inicio',
    coordinates: { x: 50, y: 10 },
    quote: 'El primer paso de una larga travesía.',
    tags: ['Personal', 'Inicio']
  }
];
