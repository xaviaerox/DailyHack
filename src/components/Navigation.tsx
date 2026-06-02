import { Map as MapIcon, Library, PenLine, Search, Anchor, LogOut, Lock } from 'lucide-react';
import { ViewType } from '../types';
import { cn } from './utils';

export const Navbar = ({ currentView, setView, searchQuery, setSearchQuery, setSelectedCategory, isAdmin, onLogout, onLoginOpen }: { currentView: ViewType; setView: (v: ViewType) => void; searchQuery: string; setSearchQuery: (q: string) => void, setSelectedCategory: (c: string) => void, isAdmin: boolean, onLogout: () => void, onLoginOpen: () => void }) => (
  <header className="bg-[#f4ead5]/90 backdrop-blur-md border-b border-[#8b5e34]/30 sticky top-0 z-50 w-full shadow-sm">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-12">
        <button 
          onClick={() => { setView('map'); setSearchQuery(''); setSelectedCategory('Todos'); }}
          className="text-3xl font-display font-bold italic text-[#5d4037] hover:opacity-80 transition-opacity flex items-center gap-3"
        >
          <Anchor className="text-[#8b5e34]" size={28} />
          La Crónica Atemporal
        </button>
        <nav className="hidden md:flex gap-10 items-center mt-1">
          <button 
            onClick={() => setView('map')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-display italic tracking-wide",
              currentView === 'map' ? "text-[#8b5e34] border-b-2 border-[#8b5e34]" : "text-[#5d4037]/60 hover:text-[#8b5e34]"
            )}
          >
            Mapa de Indagaciones
          </button>
          <button 
            onClick={() => setView('archive')}
            className={cn(
              "text-[0.95rem] transition-all duration-300 pb-1 font-display italic tracking-wide",
              currentView === 'archive' ? "text-[#8b5e34] border-b-2 border-[#8b5e34]" : "text-[#5d4037]/60 hover:text-[#8b5e34]"
            )}
          >
            Archivos Centrales
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-8">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Navegar por tinta..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-lg font-serif italic w-48 focus:w-72 transition-all duration-500 placeholder:text-[#5d4037]/30 border-b border-transparent focus:border-[#8b5e34]/30 pb-1"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5d4037]/40 group-hover:text-[#8b5e34] w-5 h-5" />
        </div>
        
        {isAdmin ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('editor')}
              className={cn(
                "p-2.5 rounded-full transition-all duration-300 border border-transparent",
                currentView === 'editor' ? "bg-[#8b5e34] text-[#f4ead5] shadow-lg" : "text-[#5d4037]/70 hover:bg-[#8b5e34]/10 hover:text-[#8b5e34]"
              )}
            >
              <PenLine size={20} />
            </button>
            <button onClick={onLogout} className="p-2 text-[#5d4037]/40 hover:text-[#8b5e34] transition-colors" title="Cerrar Sesión">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onLoginOpen} className="p-2 text-[#5d4037]/40 hover:text-[#8b5e34] transition-colors" title="Acceso Propietario">
            <Lock size={18} />
          </button>
        )}
      </div>
    </div>
  </header>
);

export const Footbar = ({ currentView, setView }: { currentView: ViewType; setView: (v: ViewType) => void }) => (
  <nav className="md:hidden bg-[#f4ead5] border-t border-[#8b5e34]/20 fixed bottom-0 w-full z-50 flex justify-around items-center h-16 shadow-[0_-5px_20px_rgba(139,94,52,0.15)]">
    <button onClick={() => setView('map')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'map' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <MapIcon size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Mapa</span>
    </button>
    <button onClick={() => setView('archive')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'archive' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <Library size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Archivos</span>
    </button>
    <button onClick={() => setView('editor')} className={cn("flex flex-col items-center justify-center transition-colors", currentView === 'editor' ? "text-[#8b5e34]" : "text-[#5d4037]/40")}>
      <PenLine size={24} />
      <span className="text-[0.7rem] uppercase tracking-tighter font-bold">Crónica</span>
    </button>
  </nav>
);

// --- Views ---

