import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {type OptimisticCart} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import {useAside} from './Aside';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const {close} = useAside();
  const total = cart?.cost?.subtotalAmount?.amount
    ? Number(cart.cost.subtotalAmount.amount).toFixed(2)
    : '0.00';
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'EUR';
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="p-4 border-t border-gray-100 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 font-medium">Totale</span>
        <span className="text-2xl font-black text-[#2d4a13]">&euro;{total}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={close} className="px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-center">
          Continua
        </button>
        {checkoutUrl && (
          <a href={checkoutUrl} target="_self" className="px-4 py-3 rounded-xl font-bold text-white bg-[#78c13b] hover:bg-[#2d4a13] transition-colors text-center flex items-center justify-center space-x-2">
            <span>Paga ora</span>
            <ArrowRight size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
