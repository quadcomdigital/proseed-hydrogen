import {Suspense} from 'react';
import {Await, NavLink, useLocation, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {Home, Search, ShoppingCart, User} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export function BottomNav({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.startsWith('/prodotto/') || pathname === '/cart' || pathname === '/checkout') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        <NavLink
          to="/"
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#78c13b]' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>

        <button
          onClick={() => window.dispatchEvent(new Event('open-mobile-search'))}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400"
        >
          <Search size={24} />
          <span className="text-[10px] font-medium">Cerca</span>
        </button>

        <Suspense fallback={<BottomNavCartBadge count={0} />}>
          <Await resolve={cart}>
            <BottomNavCart />
          </Await>
        </Suspense>

        <NavLink
          to="/account"
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#78c13b]' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-medium">Account</span>
        </NavLink>
      </div>
    </div>
  );
}

function BottomNavCart() {
  const cart = useAsyncValue() as CartApiQueryFragment | null;
  const optCart = useOptimisticCart(cart);
  return <BottomNavCartBadge count={optCart?.totalQuantity ?? 0} />;
}

function BottomNavCartBadge({count}: {count: number}) {
  return (
    <NavLink
      to="/cart"
      className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#78c13b]' : 'text-gray-400'}`}
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#ff5a24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">Carrello</span>
    </NavLink>
  );
}
