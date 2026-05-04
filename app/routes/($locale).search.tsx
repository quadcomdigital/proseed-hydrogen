import {Form, Link} from 'react-router';
import type {Route} from './+types/($locale).search';
import {SEARCH_PRODUCT_FRAGMENT} from '~/lib/fragments';
import type {ShopifyProduct} from '~/lib/types';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const SEARCH_QUERY = `#graphql
  query SearchResults(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          ...SearchProduct
        }
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
`;

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';

  const lang = new URL(request.url).pathname.startsWith('/en') ? 'en' : 'it';

  if (!q) {
    return {q: '', products: [], seo: {title: t('search.title', lang), description: ''}};
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {query: q, first: 24},
  });

  return {
    q,
    products: data.search.nodes,
    seo: {
      title: `${t('search.results_for', lang)} ${q} - Proseed`,
      description: '',
    },
  };
}

export default function SearchPage({loaderData}: Route.ComponentProps) {
  const {q, products} = loaderData;
  const lang = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <h1 className="mb-6 text-3xl font-black text-[#2d4a13] lg:text-5xl">{t('search.title', lang)}</h1>

      <Form method="get" className="mb-8 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t('search.placeholder', lang)}
          className="w-full rounded-xl border border-[#78c13b]/20 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#78c13b] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          {t('search.button', lang)}
        </button>
      </Form>

      {q ? (
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-[#2d4a13]/70">
          {t('search.results_for', lang)} {q}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: ShopifyProduct) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="group overflow-hidden rounded-3xl border border-[#78c13b]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/5] bg-[#78c13b]/5">
                {product.featuredImage && product.priceRange ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="p-4">
              <h2 className="line-clamp-1 text-base font-black text-[#2d4a13]">{product.title}</h2>
                {product.priceRange ? (
                <p className="mt-2 text-lg font-black text-[#78c13b]">
                  {Number(product.priceRange.minVariantPrice.amount).toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
                </p>
                ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
