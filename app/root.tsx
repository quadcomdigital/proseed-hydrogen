import {Analytics, getShopAnalytics, getSeoMeta, useNonce} from '@shopify/hydrogen';
import {
  Link,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useNavigation,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {getLocaleFromRequest, DEFAULT_LOCALE} from '~/lib/locale';
import {t} from '~/lib/translations';
import type {Lang} from '~/lib/translations';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export const meta = ({data, location, matches}: {data?: unknown; location: {pathname: string}; matches: {data?: unknown}[]}) => {
  if (!data) return [];
  const rootData = data as {publicStoreDomain?: string; seo?: {title?: string; description?: string}};
  const path = location.pathname.replace(/^\/en/, '') || '/';
  const baseUrl = `https://${rootData.publicStoreDomain || 'proseed-1785.myshopify.com'}`;
  const itUrl = `${baseUrl}${path}`;
  const enUrl = `${baseUrl}/en${path}`;

  return [
    ...(getSeoMeta(...matches.map((m) => ((m as {data?: unknown}).data as {seo?: {title?: string; description?: string}} | undefined)?.seo)) || []),
    {tagName: 'link', rel: 'alternate', hrefLang: 'it', href: itUrl},
    {tagName: 'link', rel: 'alternate', hrefLang: 'en', href: enUrl},
    {tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: itUrl},
    {rel: 'canonical', href: path.startsWith('/en') ? enUrl : itUrl},
  ];
};

export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'preload', href: '/fonts/GeistVF.woff', as: 'font', type: 'font/woff', crossOrigin: 'anonymous'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;
  const locale = getLocaleFromRequest(args.request);

  const shopName = criticalData?.header?.shop?.name || 'Proseed';

  return {
    ...deferredData,
    ...criticalData,
    locale,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: locale.country,
      language: locale.language,
    },
    seo: {
      title: shopName,
      description: t('footer.brand_desc', locale.language.toLowerCase() as Lang).replace(/<[^>]*>/g, ''),
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheShort(),
    variables: {
      headerMenuHandle: 'main-menu',
    },
  });

  if (!header?.shop?.brand?.logo?.image?.url) {
    const fresh = await storefront.query(HEADER_QUERY, {
      cache: storefront.CacheNone(),
      variables: {headerMenuHandle: 'main-menu'},
    });
    return {header: fresh};
  }

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

function getClientLang(): string {
  if (typeof window !== 'undefined' && /^\/en($|\/)/.test(window.location.pathname)) return 'en';
  return 'it';
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const nav = useNavigation();
  const isLoading = nav.state === 'loading';
  const lang = data?.locale?.language?.toLowerCase() || getClientLang();

  return (
    <html lang={lang} className="font-geist">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#78c13b" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="color-scheme" content="light" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        <div id="loading-bar" className="fixed top-0 left-0 right-0 z-[9999] h-0.5 pointer-events-none">
          <div className="h-full bg-[#78c13b] transition-all duration-300 ease-out" style={{width: isLoading ? '60%' : '0%', opacity: isLoading ? 1 : 0}} />
        </div>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<typeof loader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const lang: Lang = getClientLang() as Lang;
  let errorMessage = t('error.unknown', lang);
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (errorStatus === 404) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <h1 className="text-6xl font-black text-[#2d4a13] lg:text-8xl">404</h1>
        <h2 className="mt-4 text-2xl font-black text-[#78c13b]">{t('error.page_not_found', lang)}</h2>
        <p className="mt-3 text-base text-[#2d4a13]/70">
          {t('error.not_found_desc', lang)}
        </p>
        <Link
          to="/"
          className="mt-8 rounded-2xl bg-[#78c13b] px-7 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#68a632]"
        >
          {t('error.back_home', lang)}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <h1 className="text-6xl font-black text-[#2d4a13] lg:text-8xl">{errorStatus}</h1>
      <h2 className="mt-4 text-2xl font-black text-red-600">{t('error.server_error', lang)}</h2>
      <p className="mt-3 text-base text-[#2d4a13]/70">
        {t('error.server_error_desc', lang)}
      </p>
      <Link
        to="/"
        className="mt-8 rounded-2xl bg-[#78c13b] px-7 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#68a632]"
      >
        {t('error.back_home', lang)}
      </Link>
    </div>
  );
}
