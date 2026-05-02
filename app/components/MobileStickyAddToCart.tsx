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
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (fetcher.state === 'idle' && added === false && fetcher.data !== undefined) {
      setAdded(true);
      const t = setTimeout(() => setAdded(false), 1500);
      return () => clearTimeout(t);
    }
  }, [fetcher.state]);

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
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="cartFormInput" value={JSON.stringify({
              action: CartForm.ACTIONS.LinesAdd,
              inputs: {lines: [{merchandiseId: variantId, quantity: 1}]},
            })} />
            <button
              type="submit"
              disabled={fetcher.state !== 'idle'}
              className={`font-black py-3 px-8 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-lg ${
                added
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-[#78c13b] text-white hover:bg-[#68a632] shadow-[#78c13b]/20'
              }`}
            >
              {fetcher.state !== 'idle' ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : added ? (
                <Check size={18} className="animate-bounce" />
              ) : (
                <ShoppingCart size={18} />
              )}
              <span>{added ? 'Aggiunto!' : 'Aggiungi'}</span>
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
