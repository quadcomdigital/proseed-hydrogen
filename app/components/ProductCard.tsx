import {useState, useEffect, useCallback} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Heart, ShoppingCart, Eye} from 'lucide-react';

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
      <div className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden mb-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(120,193,59,0.15)] transition-all duration-700">
        <Link to={`/products/${product.handle}`} className="block h-full w-full">
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
        </Link>

        <div className="hidden lg:flex absolute inset-0 bg-[#2d4a13]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex-col items-center justify-center p-6 translate-y-10 group-hover:translate-y-0">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all scale-90 group-hover:scale-100 active:scale-75 duration-500 shadow-xl ${isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-red-500 hover:text-white'}`}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>

            {canAdd ? (
              <fetcher.Form method="post" action="/cart">
                <input type="hidden" name="cartFormInput" value={JSON.stringify({
                  action: CartForm.ACTIONS.LinesAdd,
                  inputs: {lines: [{merchandiseId: product.variantId, quantity: 1}]},
                })} />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-14 h-14 bg-[#78c13b] text-white rounded-full flex items-center justify-center hover:bg-[#2d4a13] transition-all scale-90 group-hover:scale-110 active:scale-90 duration-500 shadow-xl disabled:opacity-60"
                >
                  {isAdding ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart size={24} />
                  )}
                </button>
              </fetcher.Form>
            ) : (
              <button className="w-14 h-14 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center cursor-not-allowed">
                <ShoppingCart size={24} />
              </button>
            )}

            <button
              onClick={(e) => {
                window.dispatchEvent(new CustomEvent('open-quickview', {detail: product}));
              }}
              className="w-12 h-12 bg-white text-gray-800 rounded-full flex items-center justify-center hover:bg-[#78c13b] hover:text-white transition-all scale-90 group-hover:scale-100 active:scale-90 duration-500 shadow-xl"
            >
              <Eye size={20} />
            </button>
          </div>
          <Link
            to={`/products/${product.handle}`}
            className="w-full py-3 bg-white text-[#2d4a13] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#78c13b] hover:text-white transition-all active:scale-95 text-center"
          >
            Scopri Dettagli
          </Link>
        </div>
      </div>

      <Link to={`/products/${product.handle}`} className="block px-4 text-center">
        <h3 className="text-base font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors duration-300 line-clamp-1">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <span className="w-8 h-[1px] bg-[#78c13b]/30" />
          <p className="text-[#78c13b] font-black text-xl">{product.price.toFixed(2)}&euro;</p>
          <span className="w-8 h-[1px] bg-[#78c13b]/30" />
        </div>
      </Link>
    </article>
  );
}
