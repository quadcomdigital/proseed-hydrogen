import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {ChevronLeft, ChevronRight, ArrowRight} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

export interface HeroSlide {
  title: string;
  subtitle: string;
  img: string;
  tag: string;
}

function getFallbackSlides(lang: 'it' | 'en'): HeroSlide[] {
  return [
    {title: t('hero.slide_1_title', lang), subtitle: t('hero.slide_1_desc', lang), img: 'https://cdn.shopify.com/s/files/1/0993/8583/5904/files/photo-1523348837708-15d4a09cfac2.avif', tag: t('hero.slide_1_tag', lang)},
    {title: t('hero.slide_2_title', lang), subtitle: t('hero.slide_2_desc', lang), img: '/images/hero-stagione.jpg', tag: t('hero.slide_2_tag', lang)},
  ];
}

export default function Hero({slides}: {slides?: HeroSlide[]}) {
  const lang = useLocale();
  const items = slides && slides.length > 0 ? slides : getFallbackSlides(lang);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  const prev = () => setActive((p) => (p - 1 + items.length) % items.length);
  const next = () => setActive((p) => (p + 1) % items.length);

  return (
    <section className="relative h-[60vh] lg:h-[80vh] min-h-[400px] lg:min-h-[600px] w-full mt-0 px-2 lg:px-4">
      <div className="mx-auto max-w-7xl h-full relative overflow-hidden rounded-[24px] lg:rounded-[40px] shadow-2xl shadow-[#78c13b1a]">
        {items.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${active === i ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src={slide.img}
              alt={slide.title}
              width="1440"
              height="900"
              className="h-full w-full object-cover scale-105 hover:scale-110 transition-transform duration-[10s] ease-linear"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </div>
        ))}

        <div className="relative z-20 h-full flex items-center px-6 lg:px-24">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-3 lg:px-4 py-1 bg-[#78c13b] rounded-full text-[10px] lg:text-xs font-bold tracking-widest mb-4 lg:mb-6 animate-bounce">
              {items[active].tag}
            </span>
            <h1 className="text-3xl lg:text-7xl font-extrabold leading-tight mb-4 lg:mb-6 drop-shadow-lg">
              {items[active].title}
            </h1>
            <p className="text-base lg:text-2xl text-white/90 mb-6 lg:mb-10 max-w-lg font-light">
              {items[active].subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/collections"
                className="px-6 py-3 lg:px-8 lg:py-4 bg-[#78c13b] hover:bg-[#68a632] text-white font-bold rounded-2xl flex items-center space-x-2 transition-all hover:translate-x-1 group text-sm lg:text-base"
              >
                <span>{t('hero.cta_shop', lang)}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}
                className="px-6 py-3 lg:px-8 lg:py-4 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/40 text-white font-bold rounded-2xl transition-all text-sm lg:text-base"
              >
                {t('hero.cta_discover', lang)}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 flex items-center space-x-3">
          <button onClick={prev} aria-label={lang === 'en' ? 'Previous slide' : 'Slide precedente'} className="w-10 h-10 lg:w-12 lg:h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-[#78c13b] transition-colors text-sm">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button onClick={next} aria-label={lang === 'en' ? 'Next slide' : 'Slide successiva'} className="w-10 h-10 lg:w-12 lg:h-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-[#78c13b] transition-colors text-sm">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2 lg:space-x-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 transition-all rounded-full ${active === i ? 'w-12 bg-[#78c13b]' : 'w-3 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
