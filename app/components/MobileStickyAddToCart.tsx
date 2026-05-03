import {useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {Check, ShoppingCart} from 'lucide-react';

interface MobileStickyProps {
  variantId: string;
  price: number;
  currencyCode: string;
  enabled: boolean;
}

export default function MobileStickyAddToCart({variantId, price, currencyCode, enabled}: MobileStickyProps) {
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');

  const handleClick = () => {
    setCartState('added');
    setTimeout(() => setCartState('idle'), 2000);
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
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}
          >
            <button
              type="submit"
              onClick={handleClick}
              className={`font-black py-3 px-8 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-lg ${
                cartState === 'added'
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-[#78c13b] text-white hover:bg-[#68a632] shadow-[#78c13b]/20'
              }`}
            >
              {cartState === 'added' ? (
                <Check size={18} className="animate-bounce" />
              ) : (
                <ShoppingCart size={18} />
              )}
              <span>{cartState === 'added' ? 'Aggiunto!' : 'Aggiungi'}</span>
            </button>
          </CartForm>
        </div>
      </div>
    </div>
  );
}
