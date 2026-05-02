import {useState, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';


interface ProductGalleryProps {
  images: Array<{url: string; altText?: string; width?: number; height?: number}>;
  title: string;
  hasDiscount?: boolean;
}

export default function ProductGallery({images, title, hasDiscount}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
      setCurrentIndex(Math.min(idx, images.length - 1));
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="lg:hidden relative">
        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {images.map((img, i) => (
            <div key={i} className="w-[85vw] aspect-[4/5] shrink-0 snap-start rounded-[32px] overflow-hidden relative mr-3">
              {hasDiscount && i === 0 && (
                <span className="absolute top-4 left-4 z-10 bg-[#ff5a24] text-white px-3 py-1 text-[10px] font-black rounded-full">
                  Promo
                </span>
              )}
              <Image
                data={img}
                alt={img.altText || title}
                className="h-full w-full object-cover"
                sizes="85vw"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="aspect-[4/5] rounded-[32px] overflow-hidden relative bg-gray-50">
          {hasDiscount && (
            <span className="absolute top-4 left-4 z-10 bg-[#ff5a24] text-white px-3 py-1 text-[10px] font-black rounded-full">
              Promo
            </span>
          )}
          <Image
            data={images[0]}
            alt={images[0].altText || title}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="eager"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-[#78c13b]' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <Image
                  data={img}
                  alt={img.altText || `${title} ${i + 1}`}
                  className="h-full w-full object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
