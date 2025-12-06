import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getArticles } from '../services/data';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { Terminal, Loader, Database, Copy, Check } from 'lucide-react';

const SETUP_SQL = `-- Copie e execute este SQL no Editor SQL do Supabase
-- Cria a tabela de artigos
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT DEFAULT 'Admin',
    date TIMESTAMPTZ DEFAULT now(),
    image_url TEXT,
    category TEXT,
    read_time TEXT,
    featured BOOLEAN DEFAULT false
);

-- Cria o bucket de imagens (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Habilita Row Level Security (Segurança)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública
CREATE POLICY "Artigos são públicos" 
ON public.articles FOR SELECT 
USING (true);

-- Política de Escrita (Simplificada para este projeto)
CREATE POLICY "Permitir inserts" 
ON public.articles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir updates" 
ON public.articles FOR UPDATE 
USING (true);

CREATE POLICY "Permitir deletes" 
ON public.articles FOR DELETE 
USING (true);

-- Políticas de Storage
CREATE POLICY "Imagens públicas"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );`;

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let allArticles = await getArticles();
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');

        if (category) {
          allArticles = allArticles.filter(a => a.category === category);
        }
        setArticles(allArticles);
      } catch (err: any) {
        console.error('Failed to load articles', err);
        setError(err.message || 'Falha ao conectar com o banco de dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [location.search]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <Loader className="h-12 w-12 animate-spin text-cyber-500" />
        <p className="mt-4 text-gray-500">Carregando transmissões seguras...</p>
      </div>
    );
  }

  if (error) {
    const isTableMissing = error.includes('Could not find the table') || error.includes('relation "public.articles" does not exist');

    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center max-w-3xl">
        <div className="mb-6 rounded-full bg-red-100 p-4">
          <Database className="h-10 w-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração Necessária</h2>
        
        {isTableMissing ? (
          <div className="w-full text-left">
            <p className="mb-6 text-center text-gray-600">
              O banco de dados do Supabase está conectado, mas a tabela <strong>articles</strong> ainda não foi criada.
            </p>
            
            <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-500">SQL de Instalação</span>
                <button 
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-xs font-medium text-cyber-600 hover:text-cyber-700"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>
              <pre className="max-h-64 overflow-auto rounded bg-white p-4 text-xs font-mono text-gray-700 border border-gray-200">
                {SETUP_SQL}
              </pre>
            </div>
            
            <div className="mt-6 text-center">
              <p className="mb-4 text-sm text-gray-500">
                Execute este código no <a href="https://jnhrmrdidvqazyimjvts.supabase.co/project/sql" target="_blank" rel="noreferrer" className="text-cyber-600 underline">Editor SQL do Supabase</a> e depois recarregue esta página.
              </p>
              <button onClick={() => window.location.reload()} className="rounded bg-cyber-600 px-6 py-2 text-sm font-bold text-white hover:bg-cyber-700 transition-colors">
                Recarregar Página
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 max-w-lg rounded bg-red-50 p-4 text-left text-sm text-red-700 border border-red-200 overflow-auto font-mono mx-auto">
              {error}
            </div>
            <button onClick={() => window.location.reload()} className="mt-6 text-cyber-600 hover:underline font-bold">
              Tentar Novamente
            </button>
          </>
        )}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <Terminal className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900">Nenhuma transmissão encontrada</h2>
        <p className="text-gray-600 mb-6">O banco de dados está vazio. Crie seu primeiro artigo.</p>
        <a href="/#/admin/create" className="rounded-lg bg-cyber-600 px-6 py-2 font-medium text-white hover:bg-cyber-700 transition-colors">
          Escrever Primeiro Artigo
        </a>
      </div>
    );
  }

  // --- REPEATING 1-3-2 LOGIC ---
  const chunks = [];
  for (let i = 0; i < articles.length; i += 6) {
    chunks.push(articles.slice(i, i + 6));
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      
      {/* Banner Request: "CYBERSECURITY" with borders */}
      <div className="mb-12 border-y border-gray-200 py-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 uppercase font-sans">
          CYBERSECURITY
        </h1>
      </div>

      {chunks.map((chunk, index) => {
        // Slice the current chunk into the 1-3-2 components
        const heroPost = chunk[0];
        const threeRowPosts = chunk.slice(1, 4);
        const twoRowPosts = chunk.slice(4, 6);

        return (
          <div key={index} className="mb-16 border-b border-gray-100 pb-16 last:border-0 last:mb-0 last:pb-0">
            {/* 1. The HERO (1) */}
            {heroPost && (
              <section className="mb-8 md:mb-12 animate-fade-in-up">
                <ArticleCard article={heroPost} variant="hero" />
              </section>
            )}

            {/* 2. The ROW OF 3 */}
            {threeRowPosts.length > 0 && (
              <section className="mb-8 md:mb-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {threeRowPosts.map((post) => (
                    <ArticleCard key={post.id} article={post} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. The ROW OF 2 */}
            {twoRowPosts.length > 0 && (
              <section>
                <div className="grid gap-6 md:grid-cols-2">
                  {twoRowPosts.map((post) => (
                    <ArticleCard key={post.id} article={post} variant="horizontal" className="h-full" />
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Home;