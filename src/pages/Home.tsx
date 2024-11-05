import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRef, useState } from 'react';

// Correction des icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TIERS = [
  { name: 'Bronze', points: 0, emoji: '🥉' },
  { name: 'Argent', points: 200, emoji: '🥈' },
  { name: 'Or', points: 500, emoji: '🥇' },
  { name: 'Platine', points: 1000, emoji: '💎' },
  { name: 'Diamant', points: 2500, emoji: '👑' }
];

const STORES = [
  { 
    id: 1, 
    name: 'Angelo Gelato Montpellier', 
    address: '58, Grand Rue jean Moulin, Montpellier',
    lat: 43.6107,
    lng: 3.8777
  },
  { 
    id: 2, 
    name: 'Angelo Gelato Carnon', 
    address: '218, Avenue du mistral, Carnon',
    lat: 43.5583,
    lng: 3.9722
  }
];

// Composant pour contrôler la carte
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Home() {
  const { user, cartCount } = useStore();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const [selectedStore, setSelectedStore] = useState<typeof STORES[0] | null>(null);

  const getNextTier = () => {
    if (!user) return null;
    const currentTierIndex = TIERS.findIndex(tier => tier.name === user.tier);
    return TIERS[currentTierIndex + 1];
  };

  const nextTier = getNextTier();
  const center = { lat: 43.5845, lng: 3.93 }; // Centre entre les deux magasins

  const handleStoreClick = (store: typeof STORES[0]) => {
    setSelectedStore(store);
    if (mapRef.current) {
      mapRef.current.setView([store.lat, store.lng], 15);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Bienvenue chez Angelo Gelato</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">Connectez-vous pour accéder à votre espace fidélité</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-8 py-3 rounded-full shadow-lg hover:bg-secondary transition-colors"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Inscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Bonjour {user.firstName} {TIERS.find(tier => tier.name === user.tier)?.emoji}
        </h2>
        <button
          onClick={() => navigate('/cart')}
          className="relative bg-primary text-white p-3 rounded-full hover:bg-secondary transition-colors"
        >
          <ShoppingCartIcon className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="ice-cream-card mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Votre niveau : {user.tier}</h3>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500" 
            style={{ width: `${user.progress}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-5 gap-2 text-sm">
          {TIERS.map((tier, index) => (
            <div 
              key={tier.name}
              className={`text-center p-2 rounded ${
                user.tier === tier.name 
                  ? 'bg-primary-light dark:bg-primary/20 text-primary font-bold' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="font-medium">{tier.name}</div>
              <div className="text-xs">{tier.points} pts</div>
            </div>
          ))}
        </div>
        {nextTier && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Plus que {nextTier.points - user.points} points pour atteindre le niveau {nextTier.name}
          </p>
        )}
      </div>

      <div className="ice-cream-card">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Nos magasins</h3>
        <div className="mb-4 h-[400px] rounded-lg overflow-hidden">
          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={11} 
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {STORES.map(store => (
              <Marker 
                key={store.id} 
                position={[store.lat, store.lng]}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">{store.name}</h4>
                    <p className="text-sm">{store.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedStore && (
              <MapController 
                center={[selectedStore.lat, selectedStore.lng]} 
                zoom={15}
              />
            )}
          </MapContainer>
        </div>
        <div className="space-y-2">
          {STORES.map(store => (
            <button
              key={store.id}
              onClick={() => handleStoreClick(store)}
              className={`w-full p-3 text-left transition-colors ${
                selectedStore?.id === store.id
                  ? 'bg-primary-light dark:bg-primary/20 text-primary'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              } rounded-lg`}
            >
              <h4 className="font-medium text-gray-800 dark:text-white">{store.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{store.address}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}