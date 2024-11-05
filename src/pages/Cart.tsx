import { useStore } from '../store';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const STORES = [
  { 
    id: 1, 
    name: 'Angelo Gelato Montpellier', 
    address: '58, Grand Rue jean Moulin, Montpellier',
    closedDays: [1, 2], // Lundi et Mardi
    closedMonths: [0], // Janvier
  },
  { 
    id: 2, 
    name: 'Angelo Gelato Carnon', 
    address: '218, Avenue du mistral, Carnon',
    openMonths: [4, 5, 6, 7, 8, 9], // Mai à Octobre
  }
];

const HOURS = Array.from({ length: 13 }, (_, i) => {
  const hour = Math.floor(i / 2) + 13;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
});

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupStore, setPickupStore] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fonction pour vérifier si une date est valide pour un magasin
  const isStoreAvailable = (storeId: number, date: string) => {
    const selectedDate = new Date(date);
    const store = STORES.find(s => s.id === storeId);
    
    if (!store) return false;

    const month = selectedDate.getMonth();
    const day = selectedDate.getDay();

    // Magasin de Carnon
    if (store.id === 2) {
      return store.openMonths.includes(month);
    }
    
    // Magasin de Montpellier
    if (store.closedMonths.includes(month) || store.closedDays.includes(day)) {
      return false;
    }

    return true;
  };

  // Obtenir la date minimale (lendemain)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Obtenir la date maximale (14 jours)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    return maxDate.toISOString().split('T')[0];
  };

  const isFormComplete = pickupDate && pickupTime && pickupStore && 
    isStoreAvailable(parseInt(pickupStore), pickupDate);

  const handleOrder = () => {
    if (!isFormComplete) return;
    
    const selectedStore = STORES.find(store => store.id === parseInt(pickupStore));
    const orderCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    alert(
      `Commande ${orderCode} confirmée !\n` +
      `À récupérer le ${new Date(pickupDate).toLocaleDateString('fr-FR')} à ${pickupTime}\n` +
      `chez ${selectedStore?.name}\n\n` +
      `Montrez ce code lors du retrait pour gagner vos points fidélité !`
    );
    
    clearCart();
    navigate('/');
  };

  const getStoreAvailabilityMessage = (store: typeof STORES[0]) => {
    if (store.id === 2) {
      return "Ouvert de mai à octobre";
    }
    return "Fermé les lundis et mardis, et en janvier";
  };

  // Gérer le changement de magasin
  const handleStoreChange = (storeId: string) => {
    setPickupStore(storeId);
    // Réinitialiser la date si elle n'est pas valide pour le nouveau magasin
    if (pickupDate && !isStoreAvailable(parseInt(storeId), pickupDate)) {
      setPickupDate('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Mon Panier</h2>
      </div>

      {cart.length === 0 ? (
        <div className="ice-cream-card text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">Votre panier est vide</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors"
          >
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="ice-cream-card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.flavor}</p>
                <p className="text-primary font-medium">{item.price}€ x {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="ice-cream-card space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Options de retrait</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lieu de retrait
              </label>
              <div className="space-y-2">
                {STORES.map(store => (
                  <div key={store.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`store-${store.id}`}
                        name="store"
                        value={store.id}
                        checked={pickupStore === store.id.toString()}
                        onChange={(e) => handleStoreChange(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor={`store-${store.id}`} className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-white">{store.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{store.address}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getStoreAvailabilityMessage(store)}
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {pickupStore && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de retrait
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    (Commande possible jusqu'à la veille)
                  </span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                  required
                />
                {pickupDate && !isStoreAvailable(parseInt(pickupStore), pickupDate) && (
                  <p className="text-red-500 text-sm mt-1">
                    Le magasin est fermé à cette date. Veuillez choisir une autre date.
                  </p>
                )}
              </div>
            )}

            {pickupStore && pickupDate && isStoreAvailable(parseInt(pickupStore), pickupDate) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure de retrait
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                  required
                >
                  <option value="">Sélectionner une heure</option>
                  {HOURS.map(hour => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-300">Total</span>
                <span className="text-xl font-bold text-primary">{total}€</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={!isFormComplete}
                className={`w-full py-3 rounded-full transition-colors ${
                  isFormComplete
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isFormComplete ? 'Commander' : 'Veuillez remplir tous les champs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}