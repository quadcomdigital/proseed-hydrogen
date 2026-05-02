import {useState, useEffect, useCallback} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Heart, ShoppingCart} from 'lucide-react';

interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image?: {url: string; altText?: string};
  secondImage?: {url: string; altText?: string};
  badge?: string;
  variantId?: string;
  availableForSale?: boolean;
}

const WISHLIST_KEY = 'proseed_wishlist';

function getWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function toggleWishlistId(id: string): boolean {
  const ids = getWishlistIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) { ids.splice(idx, 1); localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); return false; }
  else { ids.push(id); localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); return true; }
}

export default function ProductCard({product}: {product: ProductCardData}) {
  const [isSaved, setSaved] = useState(false);
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';
  const canAdd = Boolean(product.variantId && product.availableForSale !== false);

  useEffect(() => {
    setSaved(getWishlistIds().includes(product.id));
  }, [product.id]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleWishlistId(product.id);
    setSaved(now);
  }, [product.id]);

  return (
    <article className="group relative">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden mb-5 relative shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(120,193,59,0.15)] transition-all duration-700">
          {product.badge && (
            <span className="absolute top-6 left-6 z-10 bg-[#2d4a13] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
              {product.badge}
            </span>
          )}
          <div className="relative h-full w-full">
            <img
              src={product.image?.url || '/images/placeholder.svg'}
              alt={product.image?.altText || product.title}
              className={`h-full w-full object-cover transition-all duration-700 ease-out ${product.secondImage ? 'group-hover:opacity-0' : ''}`}
              loading="lazy"
            />
            {product.secondImage?.url && (
              <img
                src={product.secondImage.url}
                alt={product.secondImage.altText || product.title}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100"
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="px-3">
          <h3 className="text-sm font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="w-6 h-[1px] bg-[#78c13b]/30" />
            <p className="text-[#78c13b] font-black text-lg">{product.price.toFixed(2)}&euro;</p>
            <span className="w-6 h-[1px] bg-[#78c13b]/30" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleWishlist}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                isSaved
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
              <span>Salva</span>
            </button>
            {canAdd ? (
              <fetcher.Form method="post" action="/cart" className="contents">
                <input type="hidden" name="cartFormInput" value={JSON.stringify({
                  action: CartForm.ACTIONS.LinesAdd,
                  inputs: {lines: [{merchandiseId: product.variantId, quantity: 1}]},
                })} />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="py-2.5 bg-[#78c13b] text-white rounded-xl text-xs font-bold hover:bg-[#68a632] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <ShoppingCart size={14} />
                  <span>{isAdding ? '...' : 'Carrello'}</span>
                </button>
              </fetcher.Form>
            ) : (
              <button className="py-2.5 bg-gray-100 text-gray-300 rounded-xl text-xs font-bold cursor-not-allowed flex items-center justify-center space-x-1.5">
                <ShoppingCart size={14} />
                <span>Non disp.</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
