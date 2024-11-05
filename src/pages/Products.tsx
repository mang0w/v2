import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const FLAVORS = [
  'Vanille',
  'Chocolat',
  'Fraise',
  'Café',
  'Pistache',
  'Caramel',
  'Citron',
  'Framboise',
  'Mangue',
  'Noix de coco',
  'Menthe chocolat',
  'Praliné'
];

const PRODUCTS = [
  {
    name: 'Bac',
    size: '0.5L',
    price: 8,
    maxFlavors: 2,
  },
  {
    name: 'Bac',
    size: '1L',
    price: 15,
    maxFlavors: 3,
  },
  {
    name: 'Bac',
    size: '1.5L',
    price: 20,
    maxFlavors: 4,
  }
];

export default function Products() {
  const { cartCount } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Nos Produits</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.size}
            name={product.name}
            size={product.size}
            price={product.price}
            maxFlavors={product.maxFlavors}
            image={`/ice-cream-${product.size}.jpg`}
            availableFlavors={FLAVORS}
          />
        ))}
      </div>
    </div>
  );
}