const fs = require('fs');
const path = require('path');

const srcFile = path.resolve('c:/Users/hrmadm/Documents/GitHub/DailyHack/src/App.tsx');
const componentsDir = path.resolve('c:/Users/hrmadm/Documents/GitHub/DailyHack/src/components');

const content = fs.readFileSync(srcFile, 'utf8');

// We will split the file by regex or simple text search
const navbarStart = content.indexOf('const Navbar =');
const footbarStart = content.indexOf('const Footbar =');
const mapViewStart = content.indexOf('const MapView =');
const archiveViewStart = content.indexOf('const ArchiveView =');
const editorViewStart = content.indexOf('const EditorView =');
const detailViewStart = content.indexOf('const DetailView =');
const appStart = content.indexOf('export default function App()');

function extract(startIdx, endIdx) {
    return content.substring(startIdx, endIdx);
}

const imports = content.substring(0, content.indexOf('// --- Components ---'));

// Some helpers
const cnHelper = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
fs.writeFileSync(path.join(componentsDir, 'utils.ts'), cnHelper);

// Navigation
const navContent = `import { Map as MapIcon, Library, PenLine, Search, Anchor, LogOut, Lock } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from './utils';

` + extract(navbarStart, mapViewStart).replace('const Navbar', 'export const Navbar').replace('const Footbar', 'export const Footbar');
fs.writeFileSync(path.join(componentsDir, 'Navigation.tsx'), navContent);

// MapView
const mapViewContent = `import { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Compass, Wind, Skull, Anchor, Sparkles, Navigation2 } from 'lucide-react';
import { Entry } from '../types';
import { cn } from './utils';

` + extract(mapViewStart, archiveViewStart).replace('const MapView', 'export const MapView');
fs.writeFileSync(path.join(componentsDir, 'MapView.tsx'), mapViewContent);

// ArchiveView
const archiveViewContent = `import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Navigation2, Compass, Scroll as ScrollIcon } from 'lucide-react';
import { Entry } from '../types';
import { cn } from './utils';

` + extract(archiveViewStart, editorViewStart).replace('const ArchiveView', 'export const ArchiveView');
fs.writeFileSync(path.join(componentsDir, 'ArchiveView.tsx'), archiveViewContent);

// EditorView
const editorViewContent = `import { useState } from 'react';
import { Wind, Anchor, PenLine, Sparkles, Skull, MoveLeft } from 'lucide-react';
import { Entry } from '../types';
import { analyzeEntry } from '../gemini';
import { cn } from './utils';

` + extract(editorViewStart, detailViewStart).replace('const EditorView', 'export const EditorView');
fs.writeFileSync(path.join(componentsDir, 'EditorView.tsx'), editorViewContent);

// DetailView
const detailViewContent = `import { motion } from 'motion/react';
import { Anchor, Trash2, X, Wind, Skull } from 'lucide-react';
import { Entry } from '../types';

` + extract(detailViewStart, content.indexOf('// --- Main App ---')).replace('const DetailView', 'export const DetailView');
fs.writeFileSync(path.join(componentsDir, 'DetailView.tsx'), detailViewContent);

// App.tsx
const appContent = `import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Skull, Lock, Wind } from 'lucide-react';
import { ViewType, Entry } from './types';
import { SAMPLE_ENTRIES } from './constants';
import DIARY_DATA from './data/entries.json';

import { Navbar, Footbar } from './components/Navigation';
import { MapView } from './components/MapView';
import { ArchiveView } from './components/ArchiveView';
import { EditorView } from './components/EditorView';
import { DetailView } from './components/DetailView';
import { cn } from './components/utils';

` + extract(appStart, content.length);
fs.writeFileSync(srcFile, appContent);

console.log("Refactoring complete");
