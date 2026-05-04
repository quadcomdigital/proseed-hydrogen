import {useEffect, useState, useCallback} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {X, ShoppingCart, Eye} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

interface QuickViewProduct {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image?: {url: string; altText?: string};
  description?: string;
  productType?: string;
  variantId?: string;
  availableForSale?: boolean;
  compareAtPrice?: number;
  badge?: string;
}

export default function QuickViewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<QuickViewProduct | null>(null);
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';
  const canAdd = Boolean(product?.variantId && product?.availableForSale !== false);
  const lang = useLocale();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setProduct(e.detail);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };
    window.addEventListener('open-quickview', handler as EventListener);
    return () => {
      window.removeEventListener('open-quickview', handler as EventListener);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-md"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 relative bg-gray-50 h-64 md:h-auto min-h-[250px]">
          {product.image?.url ? (
            <img
              src={product.image.url}
              alt={product.image.altText || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <Eye size={48} strokeWidth={1} />
            </div>
          )}
          {product.badge && (
            <span className="absolute top-6 left-6 bg-[#2d4a13] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
              {product.badge}
            </span>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto flex flex-col">
          <div className="mb-6">
            {product.productType && (
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{product.productType}</span>
              </div>
            )}

            <h2 className="text-3xl font-black text-[#2d4a13] mb-4 leading-tight">{product.title}</h2>

            <div className="flex items-center space-x-4 mb-6">
              <p className="text-3xl font-black text-[#78c13b]">
                &euro;{product.price.toFixed(2)}
              </p>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-xl text-gray-400 line-through font-bold">
                  &euro;{product.compareAtPrice.toFixed(2)}
                </p>
              )}
            </div>

            {product.description && (
              <div className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-4">
                {product.description}
              </div>
            )}

            {canAdd ? (
              <fetcher.Form method="post" action="/cart">
                <input type="hidden" name="cartFormInput" value={JSON.stringify({
                  action: CartForm.ACTIONS.LinesAdd,
                  inputs: {lines: [{merchandiseId: product.variantId, quantity: 1}]},
                })} />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full py-4 bg-[#78c13b] text-white font-black rounded-xl hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 text-sm uppercase tracking-widest flex items-center justify-center space-x-3 disabled:opacity-60"
                >
                  {isAdding ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      <span>{t('quick_view.add_to_cart', lang)}</span>
                    </>
                  )}
                </button>
              </fetcher.Form>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-gray-200 text-gray-400 font-black rounded-xl text-sm uppercase tracking-widest flex items-center justify-center space-x-3 cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                <span>{t('quick_view.unavailable', lang)}</span>
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to={`/products/${product.handle}`}
                onClick={handleClose}
                className="text-sm font-bold text-[#2d4a13] hover:text-[#78c13b] transition-colors flex items-center justify-center"
              >
                {t('quick_view.view_details', lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
