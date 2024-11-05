import { useStore } from '../store';
import { Cog6ToothIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TIERS = [
  { name: 'Bronze', points: 0, emoji: '🥉' },
  { name: 'Argent', points: 200, emoji: '🥈' },
  { name: 'Or', points: 500, emoji: '🥇' },
  { name: 'Platine', points: 1000, emoji: '💎' },
  { name: 'Diamant', points: 2500, emoji: '👑' }
];

export default function Profile() {
  const { user, logout, theme, toggleTheme, updateUserInfo, updateProfilePicture } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo(editFirstName, editLastName, editEmail);
    setShowEdit(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateProfilePicture(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const currentTier = TIERS.find(tier => tier.name === user.tier);
  const nextTier = TIERS.find(tier => tier.points > user.points);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Mon Profil</h2>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setShowContact(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <PhoneIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Cog6ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Modifier mes informations</h3>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                <input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-full hover:bg-secondary transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Paramètres</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-white">Thème sombre</span>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Contactez-nous</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Angelo Gelato Montpellier</h4>
                <p className="text-gray-600 dark:text-gray-300">58, Grand Rue jean Moulin, Montpellier</p>
                <p className="text-gray-600 dark:text-gray-300">04 67 XX XX XX</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Angelo Gelato Carnon</h4>
                <p className="text-gray-600 dark:text-gray-300">218, Avenue du mistral, Carnon</p>
                <p className="text-gray-600 dark:text-gray-300">04 67 XX XX XX</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Email</h4>
                <p className="text-gray-600 dark:text-gray-300">contact@angelogelato.fr</p>
              </div>
            </div>
            <button
              onClick={() => setShowContact(false)}
              className="w-full mt-6 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="ice-cream-card space-y-6">
        <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.firstName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl text-primary dark:text-white">
                  {user.firstName[0].toUpperCase()}
                </span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-secondary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Né(e) le {new Date(user.birthday).toLocaleDateString('fr-FR')}
          </p>
          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary/20 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
          >
            Modifier mes informations
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Niveau de fidélité</h4>
            <p className="text-lg font-semibold text-primary">
              {user.tier} {currentTier?.emoji}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Points accumulés</h4>
            <p className="text-lg font-semibold text-primary">{user.points} points</p>
            {nextTier && (
              <div className="mt-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(user.points / nextTier.points) * 100}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Plus que {nextTier.points - user.points} points pour atteindre le niveau {nextTier.name}
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Historique des visites</h4>
            <div className="space-y-2">
              {user.visits.map((visit, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-4 bg-primary-light dark:bg-primary/20 rounded-lg">
                  <span className="text-gray-800 dark:text-white">{visit.date}</span>
                  <span className="font-medium text-primary">+{visit.points} points</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}