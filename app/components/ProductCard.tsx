import {useState} from 'react';
import {Link} from 'react-router';
import {Heart, ShoppingCart, Eye} from 'lucide-react';

interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  image?: {url: string; altText?: string};
  badge?: string;
  variantId?: string;
}

export default function ProductCard({product}: {product: ProductCardData}) {
  const [isSaved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variantId || adding) return;

    setAdding(true);
    try {
      const fd = new FormData();
      fd.set('cartFormInput', JSON.stringify({
        action: 'LINES_ADD',
        inputs: {lines: [{merchandiseId: product.variantId, quantity: 1}]},
      }));
      await fetch('/cart', {method: 'POST', body: fd});
    } catch {}
    setAdding(false);
  };

  return (
    <article className="group relative">
      <Link to={`/products/${product.handle}`}>
        <div className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden mb-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(120,193,59,0.15)] transition-all duration-700 cursor-pointer">
          {product.badge && (
            <span className="absolute top-6 left-6 z-10 bg-[#2d4a13] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
              {product.badge}
            </span>
          )}
          <img
            src={product.image?.url || '/placeholder.svg'}
            alt={product.image?.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />

          <div className="hidden lg:flex absolute inset-0 bg-[#2d4a13]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex-col items-center justify-center p-6 translate-y-10 group-hover:translate-y-0">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={(e) => {e.preventDefault(); e.stopPropagation(); setSaved(!isSaved);}}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all scale-90 group-hover:scale-100 active:scale-75 duration-500 shadow-xl ${isSaved ? 'bg-[#78c13b] text-white' : 'bg-white text-gray-800 hover:bg-[#78c13b] hover:text-white'}`}
              >
                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleAddToCart}
                className="w-14 h-14 bg-[#78c13b] text-white rounded-full flex items-center justify-center hover:bg-[#2d4a13] transition-all scale-90 group-hover:scale-110 active:scale-90 duration-500 shadow-xl"
              >
                <ShoppingCart size={24} />
              </button>
              <button
                onClick={(e) => {e.preventDefault(); e.stopPropagation();}}
                className="w-12 h-12 bg-white text-gray-800 rounded-full flex items-center justify-center hover:bg-[#78c13b] hover:text-white transition-all scale-90 group-hover:scale-100 active:scale-90 duration-500 shadow-xl"
              >
                <Eye size={20} />
              </button>
            </div>
            <span className="w-full py-3 bg-white text-[#2d4a13] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#78c13b] hover:text-white transition-all active:scale-95 text-center">
              Scopri Dettagli
            </span>
          </div>
        </div>

        <div className="px-4 text-center">
          <h3 className="text-base font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="w-8 h-[1px] bg-[#78c13b]/30" />
            <p className="text-[#78c13b] font-black text-xl">{product.price.toFixed(2)}&euro;</p>
            <span className="w-8 h-[1px] bg-[#78c13b]/30" />
          </div>
        </div>
      </Link>
    </article>
  );
}
