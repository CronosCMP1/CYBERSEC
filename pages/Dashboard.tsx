import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, deleteArticle } from '../services/data';
import { Article } from '../types';
import { Plus, Edit2, Trash2, Eye, Loader, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err: any) {
      setError('Erro ao carregar artigos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este protocolo permanentemente?')) return;
    
    try {
      await deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      alert('Erro ao excluir artigo.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-cyber-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="text-gray-500">Gerenciamento de conteúdo e protocolos de segurança.</p>
        </div>
        <Link 
          to="/admin/create" 
          className="flex items-center gap-2 rounded-lg bg-cyber-600 px-6 py-2.5 font-bold text-white hover:bg-cyber-700 transition-colors shadow-lg shadow-cyber-500/20"
        >
          <Plus size={18} />
          Nova Transmissão
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-600 flex items-center gap-2">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded bg-gray-200">
                        <img src={article.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="line-clamp-1">{article.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(article.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Publicado
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/article/${article.id}`} 
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/edit/${article.id}`} 
                        className="rounded p-1.5 text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhum artigo encontrado no banco de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;