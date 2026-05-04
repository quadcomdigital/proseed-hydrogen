import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingCart} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const className = `cart-main ${layout === 'aside' ? '' : ''}`;
  const lang = useLocale();
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details" style={{display: linesCount ? 'block' : 'none'}}>
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({hidden = false, layout}: {hidden: boolean; layout?: CartLayout}) {
  const {close} = useAside();
  const lang = useLocale();
  if (hidden) return null;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <ShoppingCart size={32} className="text-gray-400" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{t('cart_main.empty', lang)}</p>
        <p className="text-sm text-gray-500 mt-1">{t('cart_main.empty_hint', lang)}</p>
      </div>
      <Link to="/collections" onClick={close} className="text-[#78c13b] font-bold hover:underline">
        {t('cart_main.continue_shopping', lang)}
      </Link>
    </div>
  );
}
