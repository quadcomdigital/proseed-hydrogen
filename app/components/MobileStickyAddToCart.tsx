import {useState, useEffect} from 'react';
import {useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Check, ShoppingCart} from 'lucide-react';

interface MobileStickyProps {
  variantId: string;
  price: number;
  currencyCode: string;
  enabled: boolean;
}

export default function MobileStickyAddToCart({variantId, price, currencyCode, enabled}: MobileStickyProps) {
  const fetcher = useFetcher();
  const [adding, setAdding] = useState<'idle' | 'loading' | 'added'>('idle');

  useEffect(() => {
    if (fetcher.state === 'idle' && adding === 'loading') {
      setAdding('added');
      const t = setTimeout(() => setAdding('idle'), 1500);
      return () => clearTimeout(t);
    }
  }, [fetcher.state, adding]);

  const handleAdd = () => {
    if (adding !== 'idle' || !variantId) return;
    setAdding('loading');
    const fd = new FormData();
    fd.set('cartFormInput', JSON.stringify({
      action: CartForm.ACTIONS.LinesAdd,
      inputs: {lines: [{merchandiseId: variantId, quantity: 1}]},
    }));
    fetcher.submit(fd, {method: 'post', action: '/cart'});
  };

  if (!enabled || !variantId) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-40 pb-safe">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Totale</p>
          <p className="text-lg font-black text-[#2d4a13]">
            {price.toFixed(2)} {currencyCode}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAdd}
            disabled={adding !== 'idle'}
            className={`font-black py-3 px-8 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-lg ${
              adding === 'added'
                ? 'bg-green-600 text-white scale-105'
                : 'bg-[#78c13b] text-white hover:bg-[#68a632] shadow-[#78c13b]/20'
            }`}
          >
            {adding === 'loading' ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : adding === 'added' ? (
              <Check size={18} className="animate-bounce" />
            ) : (
              <ShoppingCart size={18} />
            )}
            <span>{adding === 'added' ? 'Aggiunto!' : 'Aggiungi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
