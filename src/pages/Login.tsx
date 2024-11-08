import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">DeltAPP</h1>
            <h2 className="text-3xl font-bold text-gray-900">Se connecter</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                  placeholder="E-mail"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                  placeholder="Mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">Comptes de démonstration</h3>
                <div className="mt-2 space-y-1 text-sm text-blue-800">
                  <p>Admin: admin@deltapp.fr</p>
                  <p>Dispatcher: dispatcher@deltapp.fr</p>
                  <p>Technicien: tech@deltapp.fr</p>
                  <p>Sous-traitant: subcontractor@deltapp.fr</p>
                  <p className="mt-2 text-blue-600">Mot de passe: demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-blue-600 text-white p-12 items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Bienvenue sur DeltAPP</h2>
          <p className="mb-8 text-blue-100">
            Gérez vos interventions et votre équipe technique en toute simplicité.
          </p>
        </div>
      </div>
    </div>
  );
}