import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useStore } from '../store';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface OrderData {
  code: string;
  amount: number;
  date: string;
}

export default function Scanner() {
  const [scanResult, setScanResult] = useState<OrderData | null>(null);
  const { addPoints } = useStore();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result: string) {
      try {
        // Le QR code doit contenir un JSON avec le code de commande, le montant et la date
        const orderData: OrderData = JSON.parse(result);
        if (orderData.code && orderData.amount && orderData.date) {
          scanner.clear();
          setScanning(false);
          setScanResult(orderData);
          
          // Calcul des points : 1 point par euro dépensé
          const points = Math.floor(orderData.amount);
          addPoints(points);
        }
      } catch (e) {
        // Si le QR code n'est pas au bon format, on continue le scan
        console.warn('Format de QR code invalide');
      }
    }

    function error(err: any) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const restartScanner = () => {
    setScanResult(null);
    setScanning(true);
    window.location.reload(); // Recharge la page pour réinitialiser le scanner
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Scanner votre QR code</h2>
      </div>

      {scanResult ? (
        <div className="ice-cream-card bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-900/50 p-6">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Félicitations !</h3>
          <div className="space-y-2 text-green-600 dark:text-green-400">
            <p>Code commande : {scanResult.code}</p>
            <p>Montant : {scanResult.amount}€</p>
            <p>Points gagnés : {Math.floor(scanResult.amount)}</p>
          </div>
          <button
            onClick={restartScanner}
            className="mt-4 w-full bg-primary text-white py-2 rounded-full hover:bg-secondary transition-colors"
          >
            Scanner un autre code
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="ice-cream-card">
            <div id="reader"></div>
          </div>
          {scanning && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Placez le QR code de votre commande devant la caméra
            </p>
          )}
        </div>
      )}
    </div>
  );
}