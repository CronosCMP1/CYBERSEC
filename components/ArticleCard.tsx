import React from 'react';
import { Article } from '../types';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'compact' | 'hero';
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard', className = '' }) => {
  const isHero = variant === 'hero';
  
  if (isHero) {
    // Hero card text stays white because it overlays an image
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

  // Standard cards need text updates for white theme
  return (
    <Link to={`/article/${article.id}`} className={`group flex flex-col overflow-hidden rounded-xl border border-dark-700 bg-white transition-all hover:border-cyber-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] ${className}`}>
      <div className="relative h-48 w-full overflow-hidden">
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
        
        <h3 className="mb-3 text-xl font-bold text-gray-900 leading-tight group-hover:text-cyber-600 transition-colors">
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