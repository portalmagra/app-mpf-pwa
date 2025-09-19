'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (currentPage) return currentPage === path;
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-greenSoft border-t border-brand-border px-4 py-2 z-50">
      <div className="max-w-sm mx-auto flex justify-around">
        {/* Início */}
        <Link 
          href="/" 
          className={`flex flex-col items-center py-1 ${isActive('/') ? 'text-brand-green' : 'text-brand-green'}`}
        >
          <span className="text-lg">🏠</span>
          <span className={`text-xs font-semibold ${isActive('/') ? 'text-brand-green' : 'text-brand-green'}`}>Início</span>
        </Link>

        {/* eBooks */}
        <Link 
          href="/ebooks" 
          className={`flex flex-col items-center py-1 ${isActive('/ebooks') ? 'text-brand-green' : 'text-brand-green'}`}
        >
          <span className="text-lg">📚</span>
          <span className={`text-xs font-semibold ${isActive('/ebooks') ? 'text-brand-green' : 'text-brand-green'}`}>eBooks</span>
        </Link>

        {/* Favoritos */}
        <Link 
          href="/minhas-receitas" 
          className={`flex flex-col items-center py-1 ${isActive('/minhas-receitas') ? 'text-brand-green' : 'text-brand-green'}`}
        >
          <span className="text-lg">❤️</span>
          <span className={`text-xs font-semibold ${isActive('/minhas-receitas') ? 'text-brand-green' : 'text-brand-green'}`}>Favoritos</span>
        </Link>

        {/* Mercado */}
        <Link 
          href="/mercado" 
          className={`flex flex-col items-center py-1 ${isActive('/mercado') ? 'text-brand-green' : 'text-brand-green'}`}
        >
          <span className="text-lg">🛒</span>
          <span className={`text-xs font-semibold ${isActive('/mercado') ? 'text-brand-green' : 'text-brand-green'}`}>Mercado</span>
        </Link>

        {/* Amazon Search - Logotipo Oficial */}
        <Link 
          href="/amazon" 
          className={`flex flex-col items-center py-1 ${isActive('/amazon') ? 'text-brand-green' : 'text-brand-green'}`}
        >
          {/* Logotipo Oficial da Amazon */}
          <div className="relative flex items-center justify-center mb-1">
            <img 
              src="/icons/amazon-logo-official.png" 
              alt="Amazon" 
              width="36" 
              height="36"
              className="object-contain"
            />
          </div>
          <span className={`text-xs font-semibold ${isActive('/amazon') ? 'text-brand-green' : 'text-brand-green'}`}>Amazon</span>
        </Link>
      </div>
    </div>
  );
}
