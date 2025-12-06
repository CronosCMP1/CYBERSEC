import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticleById, getArticles } from '../services/data';
import { Article as ArticleType } from '../types';
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, Loader } from 'lucide-react';

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleType | undefined>(undefined);
  const [related, setRelated] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const found = await getArticleById(id);
        setArticle(found);
        
        if (found) {
          const allArticles = await getArticles();
          // Find related posts excluding current
          const others = allArticles
            .filter(a => a.id !== found.id && a.category === found.category)
            .slice(0, 3);
          setRelated(others);
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-cyber-500" />
      </div>
    );
  }

  if (!article) {
    return <div className="p-12 text-center text-gray-900">Artigo não encontrado ou link quebrado.</div>;
  }

  return (
    <div className="bg-white pb-20">
      {/* Header Image */}
      <div className="relative h-[400px] w-full">
        <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
             <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-cyber-300 hover:text-white transition-colors drop-shadow-md">
              <ArrowLeft size={16} />
              Voltar ao Feed
            </Link>
            <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-100 font-mono drop-shadow-md">
              <span className="flex items-center gap-2">
                <User size={14} className="text-cyber-300" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-cyber-300" />
                {new Date(article.date).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-cyber-300" />
                {article.readTime}
              </span>
              <span className="bg-black/40 border border-white/20 px-2 py-1 rounded text-xs text-cyber-300 backdrop-blur-md">
                {article.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-[1fr_300px] md:px-6">
        
        {/* Main Content */}
        {/* Removed prose-invert for light mode compatibility */}
        <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-cyber-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 font-sans">
           <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          
          {/* Author Card */}
          <div className="rounded-xl border border-dark-700 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Sobre o Autor</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-cyber-100 flex items-center justify-center border border-cyber-200 text-cyber-700 font-bold text-xl">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{article.author}</p>
                <p className="text-xs text-gray-500">Pesquisador de Segurança</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-dark-700 bg-white p-6 shadow-sm">
             <div className="flex gap-2">
               <button className="flex-1 flex items-center justify-center gap-2 rounded bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 border border-transparent transition-colors">
                  <Share2 size={16} /> Compartilhar
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 rounded bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 border border-transparent transition-colors">
                  <Bookmark size={16} /> Salvar
               </button>
             </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
             <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Conteúdo Relacionado</h3>
              <div className="space-y-4">
                {related.map(post => (
                  <Link key={post.id} to={`/article/${post.id}`} className="block group">
                    <div className="mb-2 h-32 w-full overflow-hidden rounded-lg">
                      <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h4 className="font-medium text-gray-800 group-hover:text-cyber-600 transition-colors line-clamp-2">{post.title}</h4>
                    <span className="text-xs text-gray-500 font-mono">{post.readTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Article;