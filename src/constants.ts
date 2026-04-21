import { Entry } from './types';

export const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 'entry-0',
    title: 'Bienvenida y Presentación (Día 0)',
    content: 'Recepción inicial, conocimiento del entorno hospitalario y definición de funciones en el Hospital Rafael Méndez.',
    date: '07 ABR, 2026',
    timestamp: new Date('2026-04-07').getTime(),
    category: 'Orientación',
    coordinates: { x: 15, y: 5 },
    quote: 'Sesión de bienvenida y orientación profesional.',
    tags: ['Hospital', 'FEM2', 'Inicio']
  },
  {
    id: 'entry-1',
    title: 'Fase 0: Configuración y Fundamentos',
    content: 'Establecimiento del entorno de desarrollo, configuración de Git y desarrollo de utilidades base como TodoApp y DashboardEditorial.',
    date: '08 ABR, 2026',
    timestamp: new Date('2026-04-08').getTime(),
    category: 'Sistemas',
    coordinates: { x: 75, y: 15 },
    quote: 'Configuración del entorno de prácticas y desarrollo de utilidades base.',
    tags: ['Git', 'ASIR', 'Workspace']
  },
  {
    id: 'entry-2',
    title: 'Fase 0.5: Inmersión Técnica',
    content: 'Consolidación de lógica de programación en JavaScript y gestión de reglas de gobernanza (REGLAS.md y AGENTS.md).',
    date: '09 ABR, 2026',
    timestamp: new Date('2026-04-09').getTime(),
    category: 'Desarrollo',
    coordinates: { x: 25, y: 30 },
    quote: 'Laboratorios intensivos de lógica aplicada y definición de gobernanza.',
    tags: ['JavaScript', 'Gobernanza', 'Labs']
  },
  {
    id: 'entry-3',
    title: 'Inicio de Proyecto Final: Queryclin',
    content: 'Conceptualización del Buscador Clínico Inteligente y análisis de requerimientos para Historias Clínicas Electrónicas (HCE).',
    date: '13 ABR, 2026',
    timestamp: new Date('2026-04-13').getTime(),
    category: 'Proyecto Final',
    coordinates: { x: 85, y: 45 },
    quote: 'Definición del alcance del proyecto final y análisis HCE.',
    tags: ['Queryclin', 'HCE', 'Análisis']
  },
  {
    id: 'entry-4',
    title: 'Fase de Auditoría y Portabilidad',
    content: 'Auditoría técnica del sistema para integración con Node.js portable debido a restricciones de entorno.',
    date: '15 ABR, 2026',
    timestamp: new Date('2026-04-15').getTime(),
    category: 'Seguridad',
    coordinates: { x: 20, y: 65 },
    quote: 'Auditoría de portabilidad de sistemas y cumplimiento de privacidad.',
    tags: ['NodeJS', 'Portable', 'Auditoría']
  },
  {
    id: 'entry-5',
    title: 'Fase 1: Arquitectura Local-First',
    content: 'Implementación de búsqueda semántica local y configuración de IndexedDB para persistencia de 100k registros médicos.',
    date: '16 ABR, 2026',
    timestamp: new Date('2026-04-16').getTime(),
    category: 'Arquitectura',
    coordinates: { x: 80, y: 85 },
    quote: 'Diseño y fundamentación de la arquitectura Local-First.',
    tags: ['IndexedDB', 'BigData', 'Privacy']
  },
  {
    id: 'entry-6',
    title: 'Fase 2: Optimización y Versionado',
    content: 'Adaptación del parser CSV para delimitadores pipeline y automatización de despliegue con GitHub Actions.',
    date: '17 ABR, 2026',
    timestamp: new Date('2026-04-17').getTime(),
    category: 'DevOps',
    coordinates: { x: 30, y: 110 },
    quote: 'Optimización de ingesta de datos y automatización de despliegue.',
    tags: ['CI/CD', 'CSV', 'Automation']
  },
  {
    id: 'entry-7',
    title: 'Fase 3: Ultra-Escalabilidad (V2.2)',
    content: 'Implementación de fragmentación de metadatos (Sharding Local) para superar límites de memoria del navegador.',
    date: '20 ABR, 2026',
    timestamp: new Date('2026-04-20').getTime(),
    category: 'Ingeniería',
    coordinates: { x: 70, y: 140 },
    quote: 'Optimización de escalabilidad Big Data y precisión clínica.',
    tags: ['Sharding', 'Performance', 'Scalability']
  },
  {
    id: 'entry-8',
    title: 'Sesión 2: Calidad y QA (V2.3)',
    content: 'Configuración de Vitest y Playwright para pruebas industriales y diseño del Centro de Ayuda.',
    date: '20 ABR, 2026',
    timestamp: new Date('2026-04-20').valueOf() + 1,
    category: 'Calidad',
    coordinates: { x: 25, y: 170 },
    quote: 'Calidad de software y plataforma de documentación clínica.',
    tags: ['QA', 'Testing', 'UX']
  },
  {
    id: 'entry-9',
    title: 'Machine Learning A-Z',
    content: 'Inicio de formación especializada en ML para pre-procesamiento de datos clínicos en Python y R.',
    date: '20 ABR, 2026',
    timestamp: new Date('2026-04-20').valueOf() + 2,
    category: 'IA',
    coordinates: { x: 85, y: 200 },
    quote: 'Bases de aprendizaje automático para extracción de conocimiento.',
    tags: ['ML', 'Python', 'R']
  }
];
