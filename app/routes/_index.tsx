import {Award, ShieldCheck, Sprout, Truck} from 'lucide-react';
import {Link} from 'react-router';
import type {Route} from './+types/_index';

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
      <section className="relative px-4 pt-4 lg:pt-6">
        <div className="mx-auto flex max-w-7xl items-center overflow-hidden rounded-[28px] bg-emerald-900 lg:min-h-[580px] lg:rounded-[40px]">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop"
            alt="Sementi Bio"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 max-w-2xl px-8 py-16 text-white lg:px-16 lg:py-24">
            <p className="mb-6 inline-block rounded-full bg-lime-500 px-4 py-1 text-xs font-black uppercase tracking-[0.3em] text-white">
              100% Organico
            </p>
            <h1 className="text-4xl font-black leading-tight lg:text-7xl">
              Sementi Bio e Naturali
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/90 lg:text-xl">
              Il piacere della natura direttamente a casa tua.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/collections"
                className="rounded-2xl bg-lime-600 px-7 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-lime-700"
              >
                Vai al catalogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden px-4 py-10 lg:block">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-lime-700">
            Spedizione gratuita per ordini superiori a 39 euro
          </p>
          <div className="grid grid-cols-4 gap-6">
            {[
              {icon: <Award size={26} />, title: '1# per vendita semi online', desc: 'Semi selezionati e di qualita direttamente a casa tua.'},
              {icon: <Sprout size={26} />, title: 'Germinabilita top', desc: 'Varieta testate con alte percentuali di successo.'},
              {icon: <Truck size={26} />, title: 'Spedizione veloce', desc: 'Consegna rapida in pochi giorni lavorativi.'},
              {icon: <ShieldCheck size={26} />, title: 'Semi certificati', desc: 'Qualita controllata e varieta garantite.'},
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-emerald-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-lime-100 p-3 text-lime-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-emerald-900">{feature.title}</h3>
                <p className="mt-2 text-sm font-medium text-emerald-900/70">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-emerald-900 lg:text-4xl">
            I Nostri <span className="text-lime-700">Bestsellers</span>
          </h2>
          <Link to="/collections" className="text-sm font-black uppercase tracking-[0.18em] text-lime-700">
            Vedi tutto
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <Link
              to={`/products/${product.handle}`}
              key={product.id}
              className="group overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(132,204,22,0.2)]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-emerald-50">
                {product.featuredImage ? (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-emerald-700">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <h3 className="line-clamp-1 text-base font-black text-emerald-900">{product.title}</h3>
                <p className="mt-2 text-xl font-black text-lime-700">
                  {Number(product.priceRange.minVariantPrice.amount).toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-emerald-900 p-8 lg:rounded-[56px] lg:p-20">
          <span className="inline-block rounded-full bg-lime-600 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Innovation Hub
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-black leading-tight text-white lg:text-6xl">
                Calcolatore <span className="text-lime-400">semina</span>
              </h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-white/75 lg:text-lg">
                Pianifica il tuo orto con dati reali e consigli personalizzati per stagione.
              </p>
              <Link
                to="/smart-garden"
                className="mt-8 inline-flex rounded-2xl bg-lime-600 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-lime-700"
              >
                Inizia ora gratis
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop"
                alt="Smart Garden"
                className="w-full rounded-3xl border border-white/15 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
