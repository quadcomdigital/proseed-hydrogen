import {useEffect, useState} from 'react';
import {Link, useFetcher, useLoaderData} from 'react-router';
import {Heart, ShoppingCart, ArrowRight, LogIn, Trash2} from 'lucide-react';
import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/preferiti';
import {
  CUSTOMER_METAFIELD_QUERY,
  CUSTOMER_METAFIELDS_SET_MUTATION,
} from '~/graphql/customer-account/wishlist';

const WISHLIST_KEY = 'proseed_wishlist';
const WISHLIST_NS = 'proseed';
const WISHLIST_KEY_NAME = 'wishlist';

function getLocalWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

const PRODUCT_FRAGMENT = `fragment WishlistProduct on Product {
  id
  handle
  title
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 1) { nodes { id } }
}`;

function buildProductsQuery(handles: string[]): string {
  const aliases = handles.map((h, i) => `p${i}: product(handle: "${h}") { ...WishlistProduct }`).join('\n');
  return `#graphql\nquery WishlistProducts {\n${aliases}\n}\n${PRODUCT_FRAGMENT}`;
}

export async function loader({context}: Route.LoaderArgs) {
  const {storefront, customerAccount} = context;
  const isLoggedIn = await customerAccount.isLoggedIn();
  let serverHandles: string[] = [];

  if (isLoggedIn) {
    try {
      const data: any = await customerAccount.query(CUSTOMER_METAFIELD_QUERY);
      const raw = data?.customer?.metafield?.value;
      if (raw) serverHandles = JSON.parse(raw) as string[];
    } catch {}
  }

  return {isLoggedIn, serverHandles};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;
  const formData = await request.formData();
  const idsRaw = formData.get('ids');
  if (typeof idsRaw !== 'string') {
    return Response.json({ok: false}, {status: 400});
  }

  try {
    await customerAccount.mutate(CUSTOMER_METAFIELDS_SET_MUTATION, {
      variables: {
        metafields: [{
          namespace: WISHLIST_NS,
          key: WISHLIST_KEY_NAME,
          type: 'json',
          value: idsRaw,
          ownerId: '',
        }],
      },
    });
    return Response.json({ok: true});
  } catch {
    return Response.json({ok: false}, {status: 500});
  }
}

export default function Preferiti() {
  const {isLoggedIn, serverHandles} = useLoaderData() as any;
  const [localHandles, setLocalHandles] = useState<string[]>([]);
  const [products, setProducts] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fetcher = useFetcher();

  useEffect(() => {
    const stored = getLocalWishlistIds();
    setLocalHandles(isLoggedIn ? [...new Set([...serverHandles, ...stored])] : stored);
  }, [isLoggedIn, serverHandles]);

  useEffect(() => {
    if (!localHandles.length) { setLoading(false); setProducts([]); return; }

    const query = buildProductsQuery(localHandles);
    const storefrontToken = '915c445077ac88666cd9bbd235dff058';

    fetch('https://proseed-1785.myshopify.com/api/2025-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({query}),
    })
      .then((r) => r.json())
      .then((data: any) => {
        const items: WishlistItem[] = [];
        localHandles.forEach((h, i) => {
          const node = data?.data?.[`p${i}`] as any;
          if (!node) return;
          items.push({
            id: node.id,
            handle: node.handle,
            title: node.title,
            price: Number(node.priceRange?.minVariantPrice?.amount || 0),
            currencyCode: node.priceRange?.minVariantPrice?.currencyCode || 'EUR',
            image: node.featuredImage?.url || '/images/placeholder.svg',
            variantId: node.variants?.nodes?.[0]?.id,
          });
        });
        setProducts(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [localHandles]);

  const removeItem = (handle: string) => {
    const updated = localHandles.filter((h) => h !== handle);
    setLocalHandles(updated);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    if (isLoggedIn) {
      const fd = new FormData();
      fd.set('ids', JSON.stringify(updated));
      fetcher.submit(fd, {method: 'post', action: '/preferiti'});
    }
  };

  if (!isLoggedIn && !localHandles.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">Accedi per usare la wishlist</h1>
        <p className="text-gray-500 mb-8">Salva i tuoi prodotti preferiti e sincronizzali tra tutti i tuoi dispositivi.</p>
        <Link to="/account/login" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <LogIn size={18} />
          <span>Accedi</span>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-8">I miei preferiti</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-3xl aspect-[4/5]" />
          ))}
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
        <h1 className="text-3xl font-black text-[#2d4a13] mb-2">Wishlist vuota</h1>
        <p className="text-gray-500 mb-8">Non hai ancora aggiunto prodotti ai preferiti.</p>
        <Link to="/collections" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <span>Esplora il catalogo</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2d4a13]">I miei preferiti</h1>
          <p className="text-gray-500">{products.length} prodotti salvati</p>
        </div>
        {isLoggedIn && (
          <p className="text-[10px] font-black text-[#78c13b] uppercase tracking-widest bg-[#78c13b]/5 px-3 py-1.5 rounded-full">
            Synced &check;
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.handle} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
            <Link to={`/products/${product.handle}`} className="block">
              <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                <img src={product.image} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${product.handle}`}>
                <h3 className="font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors line-clamp-1">{product.title}</h3>
              </Link>
              <p className="text-[#78c13b] font-black text-lg mt-1">&euro;{product.price.toFixed(2)}</p>
              <div className="mt-3 flex items-center space-x-2">
                {product.variantId ? (
                  <CartForm
                    route="/cart"
                    action={CartForm.ACTIONS.LinesAdd}
                    inputs={{lines: [{merchandiseId: product.variantId, quantity: 1}]}}
                  >
                    <button type="submit" className="flex-1 py-3 bg-[#78c13b] text-white text-xs font-bold rounded-xl hover:bg-[#68a632] transition-all flex items-center justify-center space-x-2">
                      <ShoppingCart size={16} />
                      <span>Carrello</span>
                    </button>
                  </CartForm>
                ) : null}
                <button
                  onClick={() => removeItem(product.handle)}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
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

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image: string;
  variantId?: string;
}
