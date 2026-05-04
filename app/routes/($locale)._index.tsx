import {Award, ShieldCheck, Sprout, Truck} from 'lucide-react';
import {Link} from 'react-router';
import type {Route} from './+types/($locale)._index';
import Hero from '~/components/Hero';
import Categories from '~/components/Categories';
import ProductCard from '~/components/ProductCard';
import SeoContent from '~/components/SeoContent';
import {BlogSection} from '~/components/BlogCard';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import type {ShopifyProduct} from '~/lib/types';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const HOMEPAGE_QUERY = `#graphql
  query HomePage(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    heroSlides: metaobjects(type: "hero_slide", first: 10) {
      nodes {
        image: field(key: "image") { reference { ... on MediaImage { image { url altText } } } }
        title: field(key: "title") { value }
        subtitle: field(key: "subtitle") { value }
        tag: field(key: "tag") { value }
      }
    }
    blog(handle: "journal") {
      articles(first: 3) {
        nodes {
          id title handle excerpt publishedAt
          image { url altText }
        }
      }
    }
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const data: {products: {nodes: ShopifyProduct[]}; blog?: {articles: {nodes: {handle: string; title: string; excerpt?: string; image?: {url: string}; publishedAt: string}[]}}; heroSlides?: {nodes: {image?: {reference?: {image?: {url: string}}}; title?: {value?: string}; subtitle?: {value?: string}; tag?: {value?: string}}[]}} = await storefront.query(HOMEPAGE_QUERY, {
    cache: storefront.CacheShort(),
    variables: {first: 8},
  });

  const articles = data?.blog?.articles?.nodes || [];
  const heroSlides = (data?.heroSlides?.nodes || []).map((node) => ({
    title: node.title?.value || '',
    subtitle: node.subtitle?.value || '',
    img: node.image?.reference?.image?.url || '',
    tag: node.tag?.value || '',
  }));
  return {products: data.products.nodes, articles, heroSlides};
}

export default function Home({loaderData}: Route.ComponentProps) {
  const {products, articles, heroSlides} = loaderData;
  const lang = useLocale();

  return (
    <div>
      <Hero slides={heroSlides} />

      <section id="features" className="px-4 py-6 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 lg:mb-8 text-center text-xs lg:text-sm font-bold uppercase tracking-[0.2em] text-[#78c13b]">
            {t('home.free_shipping', lang)}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {[
              {icon: <Award size={22} />, title: t('home.feature_1_title', lang), desc: t('home.feature_1_desc', lang)},
              {icon: <Sprout size={22} />, title: t('home.feature_2_title', lang), desc: t('home.feature_2_desc', lang)},
              {icon: <Truck size={22} />, title: t('home.feature_3_title', lang), desc: t('home.feature_3_desc', lang)},
              {icon: <ShieldCheck size={22} />, title: t('home.feature_4_title', lang), desc: t('home.feature_4_desc', lang)},
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl lg:rounded-[32px] border border-gray-100 bg-white p-4 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#78c13b1a]"
              >
                <div className="w-10 h-10 lg:w-16 lg:h-16 inline-flex rounded-xl lg:rounded-2xl bg-[#78c13b1a] text-[#78c13b] p-2.5 lg:p-3 group-hover:bg-[#78c13b] group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-gray-800 mt-3 lg:mt-4 lg:mb-3">{feature.title}</h3>
                <p className="text-xs lg:text-base font-medium text-gray-500 leading-relaxed mt-1 lg:mt-2 line-clamp-2">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Categories />

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-14">
        <div className="mb-6 lg:mb-8 flex items-center justify-between">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-[#78c13b]" />
            <div className="pl-6">
              <p className="text-[10px] lg:text-[11px] font-black text-[#78c13b] uppercase tracking-[0.3em] mb-1">{t('home.collection_year', lang)}</p>
              <h2 className="text-xl lg:text-4xl font-black text-[#2d4a13] italic">
                {(() => {const p = t('home.bestsellers', lang).split(' '); return <>{p.slice(0, -1).join(' ')} <span className="text-[#78c13b] not-italic">{p[p.length-1]}</span></>;})()}
              </h2>
            </div>
          </div>
          <Link to="/collections" className="text-[10px] lg:text-sm font-black uppercase tracking-[0.18em] text-white py-2 px-4 lg:py-3 lg:px-6 rounded-xl bg-[#78c13b] hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 whitespace-nowrap">
            {t('home.see_all', lang)}
          </Link>
        </div>
        <div className="flex lg:hidden overflow-x-auto space-x-3 pb-4 snap-x">
          {products.map((product: ShopifyProduct) => (
            <div key={product.id} className="min-w-[50vw] snap-start">
              <ProductCard
                product={{
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  price: Number(product.priceRange!.minVariantPrice.amount),
                  currencyCode: product.priceRange!.minVariantPrice.currencyCode,
                  image: product.featuredImage ? {url: product.featuredImage.url, altText: product.featuredImage.altText} : undefined,
                  variantId: product.variants?.nodes?.[0]?.id,
                  availableForSale: product.variants?.nodes?.[0]?.availableForSale,
                  secondImage: product.images?.nodes?.[1],
                }}
              />
            </div>
          ))}
        </div>
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {products.map((product: ShopifyProduct) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: Number(product.priceRange!.minVariantPrice.amount),
                currencyCode: product.priceRange!.minVariantPrice.currencyCode,
                image: product.featuredImage ? {url: product.featuredImage.url, altText: product.featuredImage.altText} : undefined,
                variantId: product.variants?.nodes?.[0]?.id,
                availableForSale: product.variants?.nodes?.[0]?.availableForSale,
                secondImage: product.images?.nodes?.[1],
              }}
            />
          ))}
        </div>
      </section>

      <section className="px-4 py-8 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-3xl lg:rounded-[56px] bg-[#2d4a13] p-6 lg:p-20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#78c13b] opacity-20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#78c13b] opacity-20 blur-[150px] rounded-full" />
          <span className="inline-block rounded-full bg-[#78c13b] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 lg:mb-8">
            {t('home.innovation_tag', lang)}
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl lg:text-7xl font-black leading-[1.1] tracking-tighter italic text-white">
                {(() => {const p = t('home.innovation_title', lang).split(' '); return <>{p.slice(0, -1).join(' ')} <span className="text-[#78c13b]">{p[p.length-1]}</span></>;})()}
              </h2>
              <p className="mt-5 text-base lg:text-lg font-medium leading-relaxed text-white/60">
                {t('home.innovation_subtitle', lang)}
              </p>
              <Link
                to="/smart-garden"
                className="mt-8 inline-flex rounded-2xl bg-[#78c13b] px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-[#78c13b] hover:scale-105 active:scale-95 shadow-2xl shadow-[#78c13b44]"
              >
                {t('home.innovation_cta', lang)}
              </Link>
            </div>
            <div className="mt-8 lg:mt-0 relative">
              <img
                src="/images/innovation-preview.jpg"
                alt="Smart Garden"
                className="w-full rounded-3xl border-4 border-white/10 object-cover shadow-2xl hover:rotate-1 hover:scale-105 transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      <BlogSection posts={articles.map((a: {handle: string; title: string; excerpt?: string; image?: {url: string}; publishedAt: string}) => ({
        slug: a.handle,
        title: a.title,
        excerpt: a.excerpt || '',
        image: a.image?.url || '/images/placeholder.svg',
        date: new Date(a.publishedAt).toLocaleDateString('it-IT', {day: 'numeric', month: 'long', year: 'numeric'}),
        category: 'Blog',
        readTime: '5 min',
      }))} />
      <SeoContent />
    </div>
  );
}
