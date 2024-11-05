import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, QrCodeIcon, UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';
import { useEffect } from 'react';
import logo from '../assets/logo.svg';

export default function Layout() {
  const location = useLocation();
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-primary-light dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Angelo Gelato" className="w-12 h-12 dark:invert" />
            <h1 className="text-3xl font-bold text-primary">Angelo Gelato</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 relative z-0">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link to="/" className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}>
              <HomeIcon className="h-6 w-6" />
              <span className="text-sm">Accueil</span>
            </Link>
            <Link to="/products" className={`nav-button ${location.pathname === '/products' ? 'active' : ''}`}>
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="text-sm">Produits</span>
            </Link>
            <Link to="/scanner" className={`nav-button ${location.pathname === '/scanner' ? 'active' : ''}`}>
              <QrCodeIcon className="h-6 w-6" />
              <span className="text-sm">Scanner</span>
            </Link>
            <Link to="/profile" className={`nav-button ${location.pathname === '/profile' ? 'active' : ''}`}>
              <UserIcon className="h-6 w-6" />
              <span className="text-sm">Profil</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}