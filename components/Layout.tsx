import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Search, Menu, X, Settings, LogOut, Linkedin, Instagram } from 'lucide-react';
import { ArticleCategory } from '../types';
import { getCurrentUser, signOut } from '../services/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-gray-900">
      {/* Navbar - Updated Color #056aa5 */}
      <header className="sticky top-0 z-50 w-full border-b border-[#045a8d] bg-[#056aa5] shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">
          
          {/* Logo - White (Text Only) */}
          <Link to="/" className="flex items-center gap-2 group z-10">
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              CYBERSEC
            </span>
          </Link>

          {/* Center Social Links (Replaces Cibersegurança text) */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a 
              href="https://www.linkedin.com/in/cybersec-blog-4859ab380/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGns07yR29SgGW83fidKoDsz-TIQ_8IaKRReDtZOy95yBYnmMPJ70zOdU_cGE0_aem_QLDMrUCOxwcTP50kNvOw5Q" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
              title="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a 
              href="https://www.instagram.com/cybersecblog/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
              title="Instagram"
            >
              <Instagram size={22} />
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#056aa5]" />
              <input 
                type="text" 
                placeholder="Buscar artigos..." 
                className="h-9 w-64 rounded-full border border-transparent bg-white pl-10 pr-4 text-sm text-gray-800 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-400"
              />
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                 <Link 
                  to="/dashboard" 
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all bg-white/10"
                  title="Painel de Controle"
                >
                  <Settings size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-red-200 transition-all bg-white/10"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-all hover:bg-white/10"
                title="Acesso Admin"
              >
                <Settings size={18} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white hover:text-white/80 z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#045a8d] bg-white px-4 py-4 shadow-lg">
            <nav className="flex flex-col gap-4">
              <div className="flex items-center gap-4 py-2">
                <a 
                  href="https://www.linkedin.com/in/cybersec-blog-4859ab380/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGns07yR29SgGW83fidKoDsz-TIQ_8IaKRReDtZOy95yBYnmMPJ70zOdU_cGE0_aem_QLDMrUCOxwcTP50kNvOw5Q" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-700 hover:text-[#056aa5]"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://www.instagram.com/cybersecblog/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-700 hover:text-[#056aa5]"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              </div>
              <hr className="border-gray-200" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-base font-medium text-[#056aa5]" onClick={() => setIsMenuOpen(false)}>Painel de Controle</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left text-base font-medium text-red-500">Sair</button>
                </>
              ) : (
                <Link to="/login" className="text-base font-medium text-gray-500" onClick={() => setIsMenuOpen(false)}>Login Admin</Link>
              )}
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
                Conteúdo educativo sobre redes e cibersegurança, explicando de maneira leve e acessível, mas sem perder a profundidade técnica necessária.
              </p>
              
              <div className="mt-6 flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/cybersec-blog-4859ab380/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGns07yR29SgGW83fidKoDsz-TIQ_8IaKRReDtZOy95yBYnmMPJ70zOdU_cGE0_aem_QLDMrUCOxwcTP50kNvOw5Q" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-cyber-600 transition-colors hover:scale-110 transform duration-200"
                  title="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/cybersecblog/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-cyber-600 transition-colors hover:scale-110 transform duration-200"
                  title="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
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