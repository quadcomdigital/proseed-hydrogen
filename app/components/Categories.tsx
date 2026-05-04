import {Link} from 'react-router';
import {Sprout, Leaf, Flower2, Sun, Droplets, Wind} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

function getCategories(lang: 'it' | 'en') {
  return [
    {label: t('categories.field', lang), slug: 'frontpage', icon: <Sprout size={32} />},
    {label: t('categories.flowers', lang), slug: 'fiori', icon: <Flower2 size={32} />},
    {label: t('categories.balcony', lang), slug: 'balcone', icon: <Sun size={32} />},
    {label: t('categories.garden', lang), slug: 'giardino', icon: <Leaf size={32} />},
    {label: t('categories.hydroponics', lang), slug: 'idroponica', icon: <Droplets size={32} />},
    {label: t('categories.indoor', lang), slug: 'indoor', icon: <Wind size={32} />},
  ];
}

export default function Categories() {
  const lang = useLocale();
  const categories = getCategories(lang);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:py-24">
      <div className="text-center mb-6 lg:mb-16">
        <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-2">{t('categories.section_title', lang)}</h2>
        <p className="text-gray-500 font-medium text-sm lg:text-base">{t('categories.section_subtitle', lang)}</p>
      </div>

      <div className="flex lg:hidden overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/collections/${cat.slug}`}
            className="flex flex-col items-center space-y-2 min-w-[80px] snap-start"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-700">
              <div className="scale-75">{cat.icon}</div>
            </div>
            <span className="text-xs font-bold text-gray-800 text-center leading-tight">{cat.label}</span>
          </Link>
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/collections/${cat.slug}`}
            className="flex flex-col items-center justify-center p-4 lg:p-8 bg-white border border-gray-100 rounded-xl hover:border-[#78c13b] hover:shadow-lg hover:shadow-[#78c13b11] transition-all group"
          >
            <div className="text-gray-700 group-hover:text-[#78c13b] transition-colors mb-2 lg:mb-4 scale-75 lg:scale-100">
              {cat.icon}
            </div>
            <span className="text-sm font-bold text-gray-800 text-center">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
