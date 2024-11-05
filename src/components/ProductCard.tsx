import { useState } from 'react';
import { useStore } from '../store';

const images = {
  '0.5L': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
  '1L': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&h=600&fit=crop',
  '1.5L': 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&h=600&fit=crop',
} as const;

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  maxFlavors: number;
  size: keyof typeof images;
  availableFlavors: string[];
}

export default function ProductCard({ name, price, size, maxFlavors, availableFlavors }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showFlavors, setShowFlavors] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const { addToCart } = useStore();

  const handleFlavorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    if (selected.length <= maxFlavors) {
      setSelectedFlavors(selected);
    }
  };

  const handleAddToCart = () => {
    if (selectedFlavors.length === 0) {
      alert('Veuillez sélectionner au moins un parfum');
      return;
    }

    addToCart({
      name: `${name} (${size})`,
      price,
      flavor: selectedFlavors.join(', '),
      quantity
    });
    setShowFlavors(false);
    setSelectedFlavors([]);
    setQuantity(1);
  };

  return (
    <div className="ice-cream-card">
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={images[size]} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-white/90">{size}</p>
        </div>
      </div>
      
      <p className="text-primary font-bold text-xl mb-4">{price}€</p>
      
      {!showFlavors ? (
        <button
          onClick={() => setShowFlavors(true)}
          className="w-full bg-primary text-white py-3 rounded-full text-sm hover:bg-secondary transition-colors"
        >
          Choisir les parfums ({maxFlavors} maximum)
        </button>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Sélectionnez jusqu'à {maxFlavors} parfum{maxFlavors > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedFlavors.length} / {maxFlavors} parfum{maxFlavors > 1 ? 's' : ''} sélectionné{selectedFlavors.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <select
            multiple
            value={selectedFlavors}
            onChange={handleFlavorChange}
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm h-32 cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary-light"
          >
            {availableFlavors.map(flavor => (
              <option 
                key={flavor} 
                value={flavor}
                className="p-2 cursor-pointer hover:bg-primary-light dark:hover:bg-gray-600"
                disabled={selectedFlavors.length >= maxFlavors && !selectedFlavors.includes(flavor)}
              >
                {flavor} {selectedFlavors.includes(flavor) ? '✓' : ''}
              </option>
            ))}
          </select>

          {selectedFlavors.length > 0 && (
            <div className="p-2 bg-primary-light dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Parfums sélectionnés :</p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                {selectedFlavors.map(flavor => (
                  <li key={flavor}>{flavor}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              -
            </button>
            <span className="font-medium dark:text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              +
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowFlavors(false);
                setSelectedFlavors([]);
                setQuantity(1);
              }}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-3 rounded-full text-sm hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedFlavors.length === 0}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}