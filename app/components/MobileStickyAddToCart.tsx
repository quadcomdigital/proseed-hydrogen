import {CartForm, useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

interface MobileStickyProps {
  variantId: string;
  price: number;
  currencyCode: string;
  enabled: boolean;
}

export default function MobileStickyAddToCart({variantId, price, currencyCode, enabled}: MobileStickyProps) {
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
              className="bg-[#78c13b] text-white font-black py-3 px-8 rounded-xl text-sm hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 flex items-center space-x-2"
            >
              <ShoppingCartIcon />
              <span>Aggiungi</span>
            </button>
          </CartForm>
        </div>
      </div>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
