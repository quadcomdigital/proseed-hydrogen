import {Award, ShieldCheck, Sprout, Truck} from 'lucide-react';
import {Link} from 'react-router';
import type {Route} from './+types/_index';
import Hero from '~/components/Hero';
import Categories from '~/components/Categories';
import ProductCard from '~/components/ProductCard';
import SeoContent from '~/components/SeoContent';
import {BlogSection} from '~/components/BlogCard';

const HOMEPAGE_QUERY = `#graphql
  query HomePage(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
          }
        }
      }
    }
  }
`;

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const data = await storefront.query(HOMEPAGE_QUERY, {
    cache: storefront.CacheShort(),
    variables: {first: 8},
  });

  return {products: data.products.nodes};
}

export default function Home({loaderData}: Route.ComponentProps) {
  const {products} = loaderData;

  return (
    <div>
      <Hero />

      <section id="features" className="hidden px-4 py-10 lg:block">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#78c13b]">
            Spedizione gratuita per ordini superiori a 39 euro
          </p>
          <div className="grid grid-cols-4 gap-6">
            {[
              {icon: <Award size={26} />, title: '1# per vendita semi online', desc: 'Semi selezionati e di qualit\u00e0 direttamente a casa tua.'},
              {icon: <Sprout size={26} />, title: 'Germinabilit\u00e0 top', desc: 'Variet\u00e0 testate con alte percentuali di successo.'},
              {icon: <Truck size={26} />, title: 'Spedizione veloce', desc: 'Consegna rapida in pochi giorni lavorativi.'},
              {icon: <ShieldCheck size={26} />, title: 'Semi certificati', desc: 'Qualit\u00e0 controllata e variet\u00e0 garantite.'},
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(120,193,59,0.15)]"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-gray-50 p-3 text-gray-600 group-hover:bg-[#78c13b] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-[#2d4a13]">{feature.title}</h3>
                <p className="mt-2 text-sm font-medium text-gray-500">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Categories />

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-14">
        <div className="mb-8 flex items-center justify-between">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-[#78c13b]" />
            <div className="pl-6">
              <p className="text-[11px] font-black text-[#78c13b] uppercase tracking-[0.3em] mb-1">Collezione 2024</p>
              <h2 className="text-2xl font-black text-[#2d4a13] lg:text-4xl italic">
                I Nostri <span className="text-[#78c13b] not-italic">Bestsellers</span>
              </h2>
            </div>
          </div>
          <Link to="/collections" className="text-sm font-black uppercase tracking-[0.18em] text-[#78c13b] py-3 px-6 rounded-xl shadow-lg shadow-[#78c13b]/20 bg-[#78c13b] text-white transition-all hover:bg-[#68a632]">
            Vedi tutto il catalogo
          </Link>
        </div>
        <div className="flex lg:hidden overflow-x-auto space-x-4 pb-4 snap-x">
          {products.map((product: any) => (
            <div key={product.id} className="min-w-[75vw] snap-start">
              <ProductCard
                product={{
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  price: Number(product.priceRange.minVariantPrice.amount),
                  currencyCode: product.priceRange.minVariantPrice.currencyCode,
                  image: product.featuredImage ? {url: product.featuredImage.url, altText: product.featuredImage.altText} : undefined,
                  variantId: product.variants?.nodes?.[0]?.id,
                }}
              />
            </div>
          ))}
        </div>
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: Number(product.priceRange.minVariantPrice.amount),
                currencyCode: product.priceRange.minVariantPrice.currencyCode,
                image: product.featuredImage ? {url: product.featuredImage.url, altText: product.featuredImage.altText} : undefined,
                variantId: product.variants?.nodes?.[0]?.id,
              }}
            />
          ))}
        </div>
      </section>

      <section className="px-4 py-8 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-[56px] bg-[#2d4a13] p-8 lg:p-20 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#78c13b] opacity-20 blur-[150px] animate-pulse" />
          <span className="inline-block rounded-full bg-[#78c13b] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Innovation Hub
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-black leading-tight text-white lg:text-6xl">
                Calcolatore <span className="text-[#78c13b]">semina</span>
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-white/75 lg:text-lg">
                Pianifica il tuo orto con dati reali e consigli personalizzati per stagione.
              </p>
              <Link
                to="/smart-garden"
                className="mt-8 inline-flex rounded-2xl bg-[#78c13b] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#68a632] hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#78c13b]/30"
              >
                Inizia ora gratis
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop"
                alt="Smart Garden"
                className="w-full rounded-3xl border border-white/15 object-cover shadow-2xl hover:rotate-1 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      <BlogSection />
      <SeoContent />
    </div>
  );
}
