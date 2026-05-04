import {useState, useEffect} from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm, getSeoMeta} from '@shopify/hydrogen';
import {ChevronLeft, ArrowRight, Calendar, ShoppingCart, Sprout, Sun, Wind, RotateCcw, Check} from 'lucide-react';
import type {Route} from './+types/($locale).smart-garden';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';
import type {Lang} from '~/lib/translations';

function getMonths(lang: Lang) {
  return [
    {id: 1, name: t('smart_garden.months.1', lang)}, {id: 2, name: t('smart_garden.months.2', lang)}, {id: 3, name: t('smart_garden.months.3', lang)},
    {id: 4, name: t('smart_garden.months.4', lang)}, {id: 5, name: t('smart_garden.months.5', lang)}, {id: 6, name: t('smart_garden.months.6', lang)},
    {id: 7, name: t('smart_garden.months.7', lang)}, {id: 8, name: t('smart_garden.months.8', lang)}, {id: 9, name: t('smart_garden.months.9', lang)},
    {id: 10, name: t('smart_garden.months.10', lang)}, {id: 11, name: t('smart_garden.months.11', lang)}, {id: 12, name: t('smart_garden.months.12', lang)},
  ];
}

function getLocations(lang: Lang) {
  return [
    {id: 'indoors', icon: <Wind size={32} />, name: t('smart_garden.locations.indoors_name', lang), description: t('smart_garden.locations.indoors_desc', lang)},
    {id: 'outdoors', icon: <Sun size={32} />, name: t('smart_garden.locations.outdoors_name', lang), description: t('smart_garden.locations.outdoors_desc', lang)},
  ];
}

function getCropFamilies(lang: Lang) {
  return [
    {id: 'none', name: t('smart_garden.crops.none', lang), avoid: []},
    {id: 'solanacee', name: t('smart_garden.crops.solanacee', lang), avoid: ['Pomodoro', 'Melanzana', 'Peperone']},
    {id: 'cucurbitacee', name: t('smart_garden.crops.cucurbitacee', lang), avoid: ['Zucchina', 'Zucca', 'Cetriolo']},
    {id: 'leguminose', name: t('smart_garden.crops.leguminose', lang), avoid: ['Fagiolo', 'Pisello', 'Fava']},
    {id: 'brassicacee', name: t('smart_garden.crops.brassicacee', lang), avoid: ['Cavolo', 'Broccolo', 'Rucola']},
  ];
}

const SMART_GARDEN_QUERY = `#graphql
  query SmartGardenProducts($country: CountryCode, $language: LanguageCode, $query: String!, $first: Int!)
  @inContext(country: $country, language: $language) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          id
          title
          handle
          description
          productType
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) { nodes { id } }
          semina_semenzaio: metafield(namespace: "custom", key: "semina_semenzaio") { value }
          semina_aperto: metafield(namespace: "custom", key: "semina_aperto") { value }
          semina_raccolta: metafield(namespace: "custom", key: "semina_raccolta") { value }
        }
      }
    }
  }
`;

function parseMonths(val?: string | null): number[] {
  if (!val) return [];
  return String(val).split(',').map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 12);
}

interface SmartProduct {
  handle: string;
  title: string;
  price: number;
  image: string;
  variantId: string;
  productType: string;
  description: string;
  seminaSemenzaio?: string;
  seminaAperto?: string;
  seminaRaccolta?: string;
}

export async function loader({context, request}: Route.LoaderArgs) {
  const data = await context.storefront.query(SMART_GARDEN_QUERY, {
    variables: {query: '*', first: 50},
  });
  const products: SmartProduct[] = (data.search?.nodes || []).map((node: any) => ({
    handle: node.handle,
    title: node.title,
    price: Number(node.priceRange.minVariantPrice.amount),
    image: node.featuredImage?.url || '/images/placeholder.svg',
    variantId: node.variants?.nodes?.[0]?.id || '',
    productType: node.productType || '',
    description: node.description || '',
    seminaSemenzaio: node.semina_semenzaio?.value,
    seminaAperto: node.semina_aperto?.value,
    seminaRaccolta: node.semina_raccolta?.value,
  }));
  const lang = new URL(request.url).pathname.startsWith('/en') ? 'en' : 'it';
  return {
    products,
    seo: {
      title: t('smart_garden.hero_title', lang),
      description: t('smart_garden.hero_title', lang),
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function SmartGarden({loaderData}: Route.ComponentProps) {
  const {products} = loaderData;
  const lang = useLocale();
  const months = getMonths(lang);
  const locations = getLocations(lang);
  const cropFamilies = getCropFamilies(lang);
  const [step, setStep] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [previousCrop, setPreviousCrop] = useState('none');
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);
  const reset = () => { setStep(0); setSelectedMonth(new Date().getMonth() + 1); setSelectedLocation(null); setPreviousCrop('none'); };

  const getRecommendedProducts = (): SmartProduct[] => {
    if (!selectedLocation || products.length === 0) return [];
    const family = cropFamilies.find((f) => f.id === previousCrop);
    const avoidList = family ? family.avoid : [];

    return products
      .filter((p: SmartProduct) => {
        const monthsStr = selectedLocation === 'indoors' ? p.seminaSemenzaio : p.seminaAperto;
        const sowingMonths = parseMonths(monthsStr);
        const isTimeRight = sowingMonths.length === 0 || sowingMonths.includes(selectedMonth);
        const isRotationSafe = !avoidList.some((name) => p.title.includes(name));
        return isTimeRight && isRotationSafe;
      })
      .slice(0, 4);
  };

  const recommendedProducts = getRecommendedProducts();

  return (
    <section className="w-full px-4 py-10 min-h-[600px] flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        {step > 0 && (
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={prevStep} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Step {step} di 4</span>
            </div>
            <button onClick={reset} className="text-xs font-bold text-gray-400 hover:text-[#78c13b] flex items-center space-x-1">
              <RotateCcw size={14} />
              <span>{t('smart_garden.restart', lang)}</span>
            </button>
          </div>
        )}

        <div className="p-8 lg:p-16 min-h-[500px] flex flex-col">
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-[#78c13b]/10 rounded-full flex items-center justify-center mb-8">
                <Sprout size={40} className="text-[#78c13b]" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#2d4a13] mb-6 leading-tight">
                {(() => {const p = t('smart_garden.hero_title', lang).split(': '); return <>{p[0]}: <span className="text-[#78c13b]">{p[1]}</span></>;})()}
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Vi presento il calcolatore della semina. Uno strumento semplice per aiutarvi a decidere
                cosa seminare, utile anche a chi vuole fare un orto per la prima volta.
              </p>
              <button onClick={nextStep} className="px-12 py-5 bg-[#78c13b] hover:bg-[#68a632] text-white font-bold rounded-2xl text-lg shadow-xl shadow-[#78c13b33] hover:scale-105 transition-all flex items-center space-x-3">
                <span>{t('smart_garden.start', lang)}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-[#2d4a13] mb-3">{t('smart_garden.step_question_month', lang)}</h2>
                <p className="text-gray-500">{t('smart_garden.step_hint_month', lang)}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
                {months.map((month) => (
                  <button
                    key={month.id}
                    onClick={() => { setSelectedMonth(month.id); nextStep(); }}
                    className={`p-6 rounded-2xl border-2 transition-all text-center font-bold ${selectedMonth === month.id ? 'border-[#78c13b] bg-[#78c13b]/5 text-[#78c13b]' : 'border-gray-100 hover:border-[#78c13b]/50 hover:bg-gray-50 text-gray-600'}`}
                  >
                    {month.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-[#2d4a13] mb-3">{t('smart_garden.step_question_location', lang)}</h2>
                <p className="text-gray-500">{t('smart_garden.step_hint_location', lang)}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => { setSelectedLocation(loc.id); nextStep(); }}
                    className="group p-8 rounded-3xl border-2 border-gray-100 hover:border-[#78c13b] hover:bg-[#78c13b]/5 transition-all text-left flex flex-col items-center text-center md:items-start md:text-left"
                  >
                    <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#78c13b] rounded-2xl flex items-center justify-center mb-6 transition-colors text-gray-500 group-hover:text-white">
                      {loc.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#2d4a13] mb-2">{loc.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{loc.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-[#2d4a13] mb-3">{t('smart_garden.step_question_crop', lang)}</h2>
                <p className="text-gray-500">{t('smart_garden.step_hint_crop', lang)}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
                {cropFamilies.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => { setPreviousCrop(crop.id); nextStep(); }}
                    className="p-6 rounded-2xl border-2 border-gray-100 hover:border-[#78c13b] hover:bg-[#78c13b]/5 transition-all text-left flex items-center justify-between group"
                  >
                    <span className="font-bold text-gray-700 group-hover:text-[#2d4a13]">{crop.name}</span>
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-[#78c13b] transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col ">
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1 bg-[#78c13b]/10 text-[#78c13b] rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                  {t('smart_garden.results_title', lang)}
                </span>
                <h2 className="text-3xl font-black text-[#2d4a13] mb-2">{t('smart_garden.results_subtitle', lang)}</h2>
                <p className="text-gray-500">
                  A {months.find((m) => m.id === selectedMonth)?.name}, {t(selectedLocation === 'indoors' ? 'smart_garden.indoors' : 'smart_garden.outdoors', lang)}.
                </p>
              </div>

              {recommendedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {recommendedProducts.map((product) => (
                      <div key={product.handle} className="group bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-[#78c13b]/30 transition-all">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                          <img src={product.image} alt={product.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="font-bold text-[#2d4a13] mb-2">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[#78c13b] font-bold">&euro;{product.price.toFixed(2)}</span>
                          {product.variantId ? (
                            <fetcher.Form method="post" action="/cart">
                              <input type="hidden" name="cartFormInput" value={JSON.stringify({action: CartForm.ACTIONS.LinesAdd, inputs: {lines: [{merchandiseId: product.variantId, quantity: 1}]}})} />
                              <button type="submit" className="p-2 rounded-xl transition-all duration-300 bg-gray-100 hover:bg-[#78c13b] hover:text-white"><ShoppingCart size={18} /></button>
                            </fetcher.Form>
                          ) : (
                            <Link to={`/products/${product.handle}`} className="p-2 rounded-xl bg-gray-100 hover:bg-[#78c13b] hover:text-white transition-all"><ShoppingCart size={18} /></Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <fetcher.Form method="post" action="/cart">
                      <input type="hidden" name="cartFormInput" value={JSON.stringify({action: CartForm.ACTIONS.LinesAdd, inputs: {lines: recommendedProducts.filter((p) => p.variantId).map((p) => ({merchandiseId: p.variantId, quantity: 1}))}})} />
                      <button type="submit" disabled={isAdding}
                        className={`px-8 py-4 font-bold rounded-2xl flex items-center space-x-2 transition-all shadow-lg ${isAdding ? 'bg-[#78c13b] text-white scale-105' : 'bg-[#2d4a13] hover:bg-[#78c13b] text-white'}`}
                      >
                        {isAdding ? <Check size={20} className="animate-bounce" /> : <ShoppingCart size={20} />}
                        <span>{isAdding ? t('smart_garden.added_to_cart', lang) : `${t('smart_garden.add_all', lang)} (${recommendedProducts.length})`}</span>
                      </button>
                    </fetcher.Form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Calendar size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">{t('smart_garden.no_products', lang)}</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {t('smart_garden.no_products_desc', lang)}
                  </p>
                  <button onClick={reset} className="mt-6 text-[#78c13b] font-bold hover:underline">{t('smart_garden.modify_search', lang)}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
