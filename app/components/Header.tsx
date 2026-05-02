import {Suspense, useMemo, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {menu} = header;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navItems = useMemo(
    () => normalizeMenu(menu, header.shop.primaryDomain.url, publicStoreDomain),
    [menu, header.shop.primaryDomain.url, publicStoreDomain],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="hidden bg-lime-600 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white lg:block">
        Spedizione gratuita sopra 39 euro
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:py-4">
        <NavLink prefetch="intent" to="/" end className="shrink-0">
          <img
            src="https://proseed.it/wp-content/uploads/2021/08/proseed_logo.png"
            alt="Proseed"
            className="h-9 w-auto lg:h-11"
          />
        </NavLink>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.slice(0, 6).map((item) => (
            <NavLink
              key={item.id}
              to={item.url}
              prefetch="intent"
              className={({isActive}) =>
                `text-xs font-black uppercase tracking-[0.15em] transition ${isActive ? 'text-lime-700' : 'text-emerald-900 hover:text-lime-700'}`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-900 lg:hidden"
            aria-label="Apri menu"
          >
            Menu
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div className="border-t border-emerald-100 bg-white px-4 py-3 lg:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.url}
                prefetch="intent"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-50"
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const items = normalizeMenu(menu, primaryDomainUrl, publicStoreDomain);

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {items.map((item) => (
        <NavLink
          className="header-menu-item"
          end
          key={item.id}
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to={item.url}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-3" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden text-sm font-bold text-emerald-900 hover:text-lime-700 lg:block"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle hidden rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-900"
      onClick={() => open('mobile')}
    >
      <h3>Menu</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-50"
      onClick={() => open('search')}
    >
      Cerca
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="rounded-xl bg-lime-600 px-3 py-2 text-sm font-black text-white"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Carrello {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? '#6b7280' : '#14532d',
  };
}

function normalizeMenu(
  menu: HeaderQuery['menu'],
  primaryDomainUrl: string,
  publicStoreDomain: string,
) {
  return (menu || FALLBACK_HEADER_MENU).items
    .filter((item) => Boolean(item.url))
    .map((item) => {
      const rawUrl = item.url || '/';
      const url =
        rawUrl.includes('myshopify.com') ||
        rawUrl.includes(publicStoreDomain) ||
        rawUrl.includes(primaryDomainUrl)
          ? new URL(rawUrl).pathname
          : rawUrl;
      return {id: item.id, title: item.title, url};
    });
}
