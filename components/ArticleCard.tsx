import React from 'react';
import { Article } from '../types';
import { Clock, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'compact' | 'hero' | 'horizontal';
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard', className = '' }) => {
  const isHero = variant === 'hero';
  const isHorizontal = variant === 'horizontal';
  
  // --- HERO VARIANT ---
  if (isHero) {
    return (
      <Link to={`/article/${article.id}`} className={`group relative block w-full h-[500px] overflow-hidden rounded-xl border border-dark-700 bg-dark-card ${className}`}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <span className="mb-4 inline-block rounded bg-cyber-500/90 px-3 py-1 text-xs font-mono font-medium text-white border border-cyber-500/20 backdrop-blur-md">
            {article.category}
          </span>
          <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white tracking-tight group-hover:text-cyber-300 transition-colors">
            {article.title}
          </h1>
          <p className="mb-6 max-w-2xl text-lg text-gray-200 line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-300 font-mono">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{article.readTime}</span>
            </div>
            <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </Link>
    );
  }

  // --- HORIZONTAL VARIANT (Optimized for 2-column rows) ---
  if (isHorizontal) {
    return (
      <Link to={`/article/${article.id}`} className={`group flex flex-col md:flex-row overflow-hidden rounded-xl border border-dark-700 bg-white transition-all hover:border-cyber-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] h-full ${className}`}>
        {/* Image Side - Fixed width on desktop */}
        <div className="relative h-48 md:h-full md:w-2/5 overflow-hidden shrink-0">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </div>

        {/* Content Side */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            {/* Top Meta: Category & Date */}
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-mono font-bold text-cyber-600 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                <Calendar size={12} />
                {new Date(article.date).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <h3 className="mb-2 text-lg md:text-xl font-bold text-gray-900 leading-snug group-hover:text-cyber-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          </div>

          {/* Bottom Meta: Author & Read Time */}
          <div className="mt-auto flex items-center justify-between pt-2">
             <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold border border-gray-200 uppercase">
                  {article.author.charAt(0)}
               </div>
               <span className="truncate max-w-[100px]">{article.author}</span>
             </div>
             <span className="flex items-center gap-1 text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
               <Clock size={12} />
               {article.readTime}
             </span>
          </div>
        </div>
      </Link>
    );
  }

  // --- STANDARD VARIANT (Vertical Card) ---
  return (
    <Link to={`/article/${article.id}`} className={`group flex flex-col overflow-hidden rounded-xl border border-dark-700 bg-white transition-all hover:border-cyber-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] h-full ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-cyber-600">
            {article.category}
          </span>
          <span className="text-xs text-gray-500 font-mono">{article.readTime}</span>
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-gray-900 leading-tight group-hover:text-cyber-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-dark-700 pt-4 text-xs text-gray-500 font-mono">
          <span className="flex items-center gap-2">
            <User size={12} />
            {article.author}
          </span>
          <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;