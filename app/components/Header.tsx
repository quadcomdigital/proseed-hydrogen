import {Suspense, useMemo, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchBar} from '~/components/SearchBar';
import {
  Sprout, Leaf, Flower2, Sun, Hammer, Package, BookOpen,
  Crown, User, Heart, ShoppingCart, ChevronDown, Menu, X, Truck,
  Percent,
} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: React.ReactElement;
  children?: {label: string; href: string}[];
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {menu} = header;
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromoA, setShowPromoA] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY;
      setIsScrolled(s > 80);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setShowPromoA((p) => !p), 5000);
    return () => clearInterval(t);
  }, []);

  const rawItems = useMemo(
    () => (menu || FALLBACK_HEADER_MENU).items.filter((i) => Boolean(i.url)),
    [menu],
  );

  const navItems: NavItem[] = useMemo(
    () =>
      rawItems.map((item) => {
        const rawUrl = item.url!;
        const url =
          rawUrl.includes('myshopify.com') ||
          rawUrl.includes(publicStoreDomain) ||
          rawUrl.includes(header.shop.primaryDomain.url)
            ? new URL(rawUrl).pathname
            : rawUrl;
        return {id: item.id, title: item.title, url, icon: getIcon(item.title)};
      }),
    [rawItems, publicStoreDomain, header.shop.primaryDomain.url],
  );

  const {toggleCart} = useCartToggle();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm">
      <div
        className={`hidden lg:block bg-[#78c13b] text-white py-2 text-[11px] font-bold text-center transition-all duration-300 ${
          isScrolled ? 'h-0 py-0 opacity-0' : 'h-auto opacity-100'
        }`}
      >
        <span className="mx-auto text-[11px] font-black uppercase tracking-[0.2em]">
          {showPromoA ? (
            <><Truck size={14} className="inline animate-pulse" /> Spedizione <span className="text-[#2d4a13]">GRATUITA</span> sopra i 39&euro;</>
          ) : (
            <>Entra nel <span className="bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer font-black">SEED CLUB</span>, ricevi i tuoi semi in abbonamento</>
          )}
        </span>
      </div>

      <div
        className={`bg-white transition-all duration-300 border-b border-gray-100 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 lg:gap-8">
          <NavLink prefetch="intent" to="/" end className="shrink-0">
            {header.shop.brand?.logo?.image?.url ? (
              <img
                src={header.shop.brand.logo.image.url}
                alt={header.shop.name}
                className={`transition-all duration-300 w-auto ${isScrolled ? 'h-8' : 'h-10 lg:h-12'}`}
              />
            ) : (
              <img
                src="/images/proseed-logo.png"
                alt="Proseed"
                className={`transition-all duration-300 w-auto ${isScrolled ? 'h-8' : 'h-10 lg:h-12'}`}
              />
            )}
          </NavLink>

          <SearchBar />

          <div className="flex items-center gap-2 lg:gap-4">
            <NavLink
              to="/preferiti"
              className="hidden sm:block p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Preferiti"
            >
              <Heart size={22} />
            </NavLink>

            <NavLink
              to="/account"
              className="hidden lg:block p-2.5 text-gray-500 hover:text-[#78c13b] hover:bg-[#78c13b0a] rounded-full transition-all"
              title="Account"
            >
              <User size={22} />
            </NavLink>

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            <Suspense fallback={<CartBadge count={null} />}>
              <Await resolve={cart}>
                {(c) => <CartDesktop cart={c} />}
              </Await>
            </Suspense>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Apri menu"
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="hidden lg:flex items-center justify-center px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-bold text-sm"
            >
              <span className="mr-2">Menu</span>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`bg-white border-b border-gray-100 hidden lg:block transition-all duration-300 ${
          isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-11 opacity-100'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <nav className="h-full">
            <ul className="flex h-full items-center">
              {navItems.slice(0, 6).map((item) => (
                <li
                  key={item.id}
                  className="group relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink
                    prefetch="intent"
                    to={item.url}
                    className={({isActive}) =>
                      `flex items-center space-x-2 px-4 text-xs font-bold transition-colors py-2 ${
                        item.title === 'Seed Club'
                          ? 'bg-gradient-to-r from-slate-600 via-slate-300 to-slate-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer'
                          : isActive
                          ? 'text-[#78c13b]'
                          : 'text-gray-600 hover:text-[#78c13b]'
                      }`
                    }
                  >
                    <span
                      className={
                        item.title === 'Seed Club' ? 'text-slate-500' : 'text-[#78c13b]'
                      }
                    >
                      {item.icon}
                    </span>
                    <span
                      className={
                        item.title === 'Seed Club'
                          ? 'uppercase tracking-wider font-black'
                          : ''
                      }
                    >
                      {item.title}
                    </span>
                    <ChevronDown size={12} className="group-hover:rotate-180 transition-transform text-gray-400" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <NavLink
              to="/smart-garden"
              className="bg-[#78c13b] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#68a632] transition-colors shadow-lg shadow-[#78c13b]/20 flex items-center space-x-2"
            >
              <Sprout size={14} />
              <span>Calcolatore Semina</span>
            </NavLink>
            <NavLink
              to="/collections"
              className="bg-orange-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              Sementi di Stagione
            </NavLink>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 transition-transform duration-300 ease-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-xl text-[#2d4a13]">Menu</span>
              <button onClick={() => setIsMobileOpen(false)} aria-label="Chiudi menu">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.url}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-[#78c13b]">{item.icon}</span>
                  <span className="font-bold text-gray-700">{item.title}</span>
                </NavLink>
              ))}
              <hr className="border-gray-100" />
              <NavLink
                to="/account"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <User size={18} className="text-[#78c13b]" />
                <span className="font-bold text-gray-700">Account</span>
              </NavLink>

            </nav>
          </div>
        </div>
      )}
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
        <>
          <NavLink end onClick={close} prefetch="intent" style={activeLinkStyle} to="/">
            Home
          </NavLink>
           <NavLink end onClick={close} prefetch="intent" style={activeLinkStyle} to="/collections">
            Catalogo
          </NavLink>
        </>
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
      <NavLink prefetch="intent" to="/account" className="hidden text-sm font-bold text-emerald-900 hover:text-lime-700 lg:block">
        <Suspense fallback="Accedi">
          <Await resolve={isLoggedIn} errorElement="Accedi">
            {(loggedIn) => (loggedIn ? 'Account' : 'Accedi')}
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
    <button className="hidden rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-900" onClick={() => open('mobile')}>
      <h3>Menu</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="rounded-xl border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-50" onClick={() => open('search')}>
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
        publish('cart_viewed', {cart, prevCart, shop, url: window.location.href || ''} as CartViewPayload);
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

function CartDesktop({cart}: {cart: CartApiQueryFragment | null}) {
  const optCart = useOptimisticCart(cart);
  const {open} = useAside();
  const {publish, shop, prevCart} = useAnalytics();
  const total = optCart?.cost?.subtotalAmount?.amount;
  const count = optCart?.totalQuantity ?? 0;

  return (
    <button
      onClick={() => {
        open('cart');
        publish('cart_viewed', {cart: optCart, prevCart, shop, url: window.location.href || ''} as CartViewPayload);
      }}
      className="hidden lg:flex items-center space-x-3 p-1.5 lg:p-2 hover:bg-gray-50 rounded-full transition-all"
    >
      <div className="flex flex-col items-end leading-none mr-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase">Carrello</span>
        <span className="text-sm font-black text-[#2d4a13]">
          &euro;{total ? Number(total).toFixed(2) : '0.00'}
        </span>
      </div>
      <div className="relative">
        <ShoppingCart size={28} className="text-gray-800" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#78c13b] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black">
          {count}
        </span>
      </div>
    </button>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null, tags: [], title: 'Semi Orto', type: 'HTTP' as const,
      url: '/collections/orto', items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null, tags: [], title: 'Erbe Aromatiche', type: 'HTTP' as const,
      url: '/collections/erbe-aromatiche', items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null, tags: [], title: 'Fiori', type: 'HTTP' as const,
      url: '/collections/fiori', items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: null, tags: [], title: 'Seed Box', type: 'HTTP' as const,
      url: '/seed-box', items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609632800',
      resourceId: null, tags: [], title: 'Seed Club', type: 'HTTP' as const,
      url: '/seed-club', items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609665568',
      resourceId: null, tags: [], title: 'Blog', type: 'HTTP' as const,
      url: '/blog', items: [],
    },
  ],
};

function getIcon(label: string) {
  const l = label.toLowerCase();
  const s = 18;
  if (l.includes('orto')) return <Sprout size={s} />;
  if (l.includes('erbe') || l.includes('aromatic')) return <Leaf size={s} />;
  if (l.includes('fiori')) return <Flower2 size={s} />;
  if (l.includes('succulent')) return <Sun size={s} />;
  if (l.includes('attrezz')) return <Hammer size={s} />;
  if (l.includes('seed box') || l.includes('bio')) return <Package size={s} />;
  if (l.includes('blog')) return <BookOpen size={s} />;
  if (l.includes('offert') || l.includes('promo')) return <Percent size={s} />;
  if (l.includes('seed club') || l.includes('club')) return <Crown size={s} />;
  return <Sprout size={s} />;
}

function activeLinkStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
  return {fontWeight: isActive ? 'bold' : undefined, color: isPending ? '#6b7280' : '#14532d'};
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

function useCartToggle() {
  const {open} = useAside();
  return {toggleCart: () => open('cart')};
}
