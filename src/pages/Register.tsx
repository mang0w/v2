import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register } = useStore();

  // Calculer la date minimum (13 ans avant aujourd'hui)
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date.toISOString().split('T')[0];
  };

  // Calculer la date maximum (aujourd'hui)
  const getMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100); // Limite raisonnable de 100 ans
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(firstName, lastName, email, password, birthday);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inscription</h2>
      </div>

      <div className="ice-cream-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de naissance
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Vous devez avoir au moins 13 ans)
              </span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-secondary transition-colors mt-6"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}