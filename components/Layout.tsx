import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Search, Menu, X, Terminal, PenTool } from 'lucide-react';
import { ArticleCategory } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-dark-700 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center p-2 rounded bg-dark-800 border border-dark-700 group-hover:border-cyber-500 transition-colors">
              <Shield className="h-5 w-5 text-cyber-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 font-mono">
              CYBER<span className="text-cyber-600">SEC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to={`/?category=${ArticleCategory.CYBERSECURITY}`} 
              className="text-sm font-medium text-gray-600 hover:text-cyber-600 transition-colors"
            >
              {ArticleCategory.CYBERSECURITY}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-cyber-600" />
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                className="h-9 w-64 rounded-full border border-dark-700 bg-dark-800 pl-10 pr-4 text-sm text-gray-800 focus:border-cyber-500 focus:outline-none focus:ring-1 focus:ring-cyber-500 transition-all placeholder:text-gray-500"
              />
            </div>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 rounded-lg border border-dark-700 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
            >
              <PenTool size={14} />
              <span>Escrever</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-700 bg-white px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to={`/?category=${ArticleCategory.CYBERSECURITY}`} 
                className="text-base font-medium text-gray-600" 
                onClick={() => setIsMenuOpen(false)}
              >
                {ArticleCategory.CYBERSECURITY}
              </Link>
              <hr className="border-dark-700" />
              <Link to="/admin" className="text-base font-medium text-cyber-600" onClick={() => setIsMenuOpen(false)}>Painel Admin</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 bg-dark-950 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-cyber-600" />
                <span className="text-xl font-bold tracking-tight text-gray-900 font-mono">
                  CYBER<span className="text-cyber-600">SEC</span>
                </span>
              </Link>
              <p className="max-w-xs text-sm text-gray-500">
                Uma plataforma de última geração para profissionais de segurança cibernética, desenvolvedores e entusiastas de tecnologia.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Categorias</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {Object.values(ArticleCategory).slice(1, 5).map(c => (
                  <li key={c}><Link to={`/?category=${c}`} className="hover:text-cyber-600">{c}</Link></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-cyber-600">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-cyber-600">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-cyber-600">Política de Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-dark-700 pt-8 text-center text-xs text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} CyberSec Blog. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;