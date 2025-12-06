import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/auth';
import { Shield, Lock, Mail, Loader, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }

      if (user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyber-50 text-cyber-600 border border-cyber-100">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acesso Restrito</h1>
          <p className="mt-2 text-sm text-gray-500">Identifique-se para acessar o console.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-900 focus:border-cyber-500 focus:outline-none focus:ring-1 focus:ring-cyber-500 transition-all"
                placeholder="admin@cybersec.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Chave de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-900 focus:border-cyber-500 focus:outline-none focus:ring-1 focus:ring-cyber-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-bold text-white hover:bg-cyber-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Autenticar'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Acesso monitorado e logado. Tentativas não autorizadas serão reportadas.
        </div>
      </div>
    </div>
  );
};

export default Login;