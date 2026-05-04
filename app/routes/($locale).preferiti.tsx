import {useEffect, useState} from 'react';
import {Link, useFetcher, useLoaderData} from 'react-router';
import {Heart, ShoppingCart, ArrowRight, LogIn, Trash2} from 'lucide-react';
import {CartForm, getSeoMeta} from '@shopify/hydrogen';
import type {Route} from './+types/($locale).preferiti';
import {
  CUSTOMER_METAFIELD_QUERY,
  CUSTOMER_METAFIELDS_SET_MUTATION,
} from '~/graphql/customer-account/wishlist';
import type {ShopifyProduct} from '~/lib/types';
import {t} from '~/lib/translations';
import type {Lang} from '~/lib/translations';
import {useLocale} from '~/lib/locale';

const WISHLIST_KEY = 'proseed_wishlist';

function getLocalWishlistIds(): string[] {
  try { const raw = localStorage.getItem(WISHLIST_KEY); return raw ? (JSON.parse(raw) as string[]) : []; }
  catch { return []; }
}

export async function loader({context, request}: Route.LoaderArgs) {
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  let serverHandles: string[] = [];
  if (isLoggedIn) {
    try {
      const data: any = await context.customerAccount.query(CUSTOMER_METAFIELD_QUERY);
      const raw = data?.customer?.metafield?.value;
      if (raw) serverHandles = JSON.parse(raw) as string[];
    } catch {}
  }
  const lang = new URL(request.url).pathname.startsWith('/en') ? 'en' : 'it';
  return {
    isLoggedIn,
    serverHandles,
    seo: {
      title: t('wishlist.title', lang),
      description: t('wishlist.empty_desc', lang),
    },
  };
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get('_action');

  // Sync wishlist to server metafield
  if (actionType === 'sync') {
    const idsRaw = formData.get('ids');
    if (typeof idsRaw === 'string') {
      try {
        await context.customerAccount.mutate(CUSTOMER_METAFIELDS_SET_MUTATION, {
          variables: {
            metafields: [{
              namespace: 'proseed', key: 'wishlist', type: 'json',
              value: idsRaw, ownerId: '',
            }],
          },
        });
        return Response.json({ok: true});
      } catch { return Response.json({ok: false}, {status: 500}); }
    }
    return Response.json({ok: false}, {status: 400});
  }

  // Fetch wishlist products from Storefront API (server-side)
  if (actionType === 'fetch') {
    const handlesRaw = formData.get('handles');
    if (typeof handlesRaw !== 'string') return Response.json({products: []});
    const handles: string[] = JSON.parse(handlesRaw) as string[];
    if (!handles.length) return Response.json({products: []});

    const aliases = handles.map((h, i) =>
      `p${i}: product(handle: "${h}") { id handle title featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } variants(first: 1) { nodes { id } } }`
    ).join('\n');
    const query = `query WishlistProducts { ${aliases} }`;
    const data: any = await context.storefront.query(query);

    const products = handles.map((h, i) => {
      const node: {id: string; handle: string; title: string; featuredImage?: {url: string; altText?: string}; priceRange?: {minVariantPrice: {amount: string; currencyCode: string}}; variants?: {nodes: {id: string}[]}} | null = data?.[`p${i}`] ?? null;
      if (!node) return null;
      return {
        id: node.id, handle: node.handle, title: node.title,
        price: Number(node.priceRange?.minVariantPrice?.amount || 0),
        currencyCode: node.priceRange?.minVariantPrice?.currencyCode || 'EUR',
        image: node.featuredImage?.url || '/images/placeholder.svg',
        variantId: node.variants?.nodes?.[0]?.id,
      };
    }).filter(Boolean);

    return Response.json({products});
  }

  return Response.json({}, {status: 400});
}

interface WishlistProduct {
  id: string; handle: string; title: string; price: number;
  currencyCode: string; image: string; variantId?: string;
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function Preferiti() {
  const lang = useLocale();
  const {isLoggedIn, serverHandles} = useLoaderData() as {isLoggedIn: boolean; serverHandles: string[]};
  const [localHandles, setLocalHandles] = useState<string[]>([]);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const fetcher = useFetcher();
  const productsData = fetcher.data?.products;
  const loading = fetcher.state !== 'idle';

  useEffect(() => {
    const stored = getLocalWishlistIds();
    const merged = isLoggedIn ? [...new Set([...serverHandles, ...stored])] : stored;
    setLocalHandles(merged);
  }, [isLoggedIn, serverHandles]);

  useEffect(() => {
    if (!localHandles.length) { setProducts([]); return; }
    const fd = new FormData();
    fd.set('_action', 'fetch');
    fd.set('handles', JSON.stringify(localHandles));
    fetcher.submit(fd, {method: 'post'});
  }, [localHandles.join(',')]);

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  const removeItem = (handle: string) => {
    const updated = localHandles.filter((h) => h !== handle);
    setLocalHandles(updated);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    if (isLoggedIn) {
      const fd = new FormData();
      fd.set('_action', 'sync');
      fd.set('ids', JSON.stringify(updated));
      fetcher.submit(fd, {method: 'post'});
    }
  };

  if (!isLoggedIn && !localHandles.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">{t('wishlist.login_title', lang)}</h1>
        <p className="text-gray-500 mb-8">{t('wishlist.login_desc', lang)}</p>
        <Link to="/account/login" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <LogIn size={18} /><span>{t('wishlist.login_cta', lang)}</span>
        </Link>
      </div>
    );
  }

  if (loading && !products.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-8">{t('wishlist.title', lang)}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => <div key={i} className="animate-pulse bg-gray-100 rounded-3xl aspect-[4/5]" />)}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-2">{t('wishlist.empty', lang)}</h1>
        <p className="text-gray-500 mb-8">{t('wishlist.empty_desc', lang)}</p>
        <Link to="/collections" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <span>{t('wishlist.browse', lang)}</span><ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2d4a13]">{t('wishlist.title', lang)}</h1>
          <p className="text-gray-500">{products.length} {t('wishlist.saved_count', lang)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: WishlistProduct) => (
          <div key={product.handle} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
            <Link to={`/products/${product.handle}`} className="block">
              <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                <img src={product.image} alt={product.title} width="400" height="500" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${product.handle}`}>
                <h3 className="font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors line-clamp-1">{product.title}</h3>
              </Link>
              <p className="text-[#78c13b] font-black text-lg mt-1">&euro;{product.price.toFixed(2)}</p>
              <div className="mt-3 flex items-center space-x-2">
                {product.variantId ? (
                  <div className="flex-1">
                    <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: product.variantId, quantity: 1}]}}>
                      <button type="submit" className="w-full py-3 bg-[#78c13b] text-white text-xs font-bold rounded-xl hover:bg-[#68a632] transition-all flex items-center justify-center space-x-2">
                        <ShoppingCart size={16} /><span>{t('wishlist.add_cart', lang)}</span>
                      </button>
                    </CartForm>
                  </div>
                ) : null}
                <button onClick={() => removeItem(product.handle)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
