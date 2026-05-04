import {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Heart, ShoppingCart, Check} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

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
  try { const raw = localStorage.getItem(WISHLIST_KEY); return raw ? (JSON.parse(raw) as string[]) : []; }
  catch { return []; }
}

function toggleWishlistId(id: string): boolean {
  const ids = getWishlistIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) { ids.splice(idx, 1); localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); return false; }
  else { ids.push(id); localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); return true; }
}

export default function ProductCard({product}: {product: ProductCardData}) {
  const [isSaved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const canAdd = Boolean(product.variantId && product.availableForSale !== false);
  const lang = useLocale();

  useEffect(() => { setSaved(getWishlistIds().includes(product.handle)); }, [product.handle]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const now = toggleWishlistId(product.handle);
    setSaved(now);
  }, [product.handle]);

  const handleAddClick = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group relative">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-[3/4] lg:aspect-[4/5] bg-white rounded-[24px] lg:rounded-[40px] overflow-hidden mb-4 lg:mb-5 relative shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(120,193,59,0.15)] transition-all duration-700">
          {product.badge && (
            <span className="absolute top-6 left-6 z-10 bg-[#2d4a13] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
              {product.badge}
            </span>
          )}
          <div className="relative h-full w-full">
            <img src={product.image?.url || '/images/placeholder.svg'} alt={product.image?.altText || product.title}
              width="400" height="500"
              className={`h-full w-full object-cover transition-all duration-700 ease-out ${product.secondImage ? 'group-hover:opacity-0' : ''}`} loading="lazy" />
            {product.secondImage?.url && (
              <img src={product.secondImage.url} alt={product.secondImage.altText || product.title}
                width="400" height="500"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100" loading="lazy" />
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
            <button onClick={handleWishlist}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
              <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} /><span>{t('product_card.save', lang)}</span>
            </button>
            {canAdd ? (
              <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: product.variantId!, quantity: 1}]}}>
                <button type="submit" onClick={handleAddClick}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${added ? 'bg-green-600 text-white scale-105' : 'bg-[#78c13b] text-white hover:bg-[#68a632]'}`}>
                  {added ? <Check size={14} className="animate-bounce" /> : <ShoppingCart size={14} />}
                  <span>{added ? t('product_card.added', lang) : t('product_card.cart', lang)}</span>
                </button>
              </CartForm>
            ) : (
              <button className="w-full py-2.5 bg-gray-100 text-gray-300 rounded-xl text-xs font-bold cursor-not-allowed flex items-center justify-center space-x-1.5">
                <ShoppingCart size={14} /><span>{t('product_card.unavailable', lang)}</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
