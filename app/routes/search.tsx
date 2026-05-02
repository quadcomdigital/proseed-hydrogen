import {Form, Link} from 'react-router';
import type {Route} from './+types/search';

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
  }
`;

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';

  if (!q) {
    return {q: '', products: []};
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {query: q, first: 24},
  });

  return {q, products: data.search.nodes};
}

export default function SearchPage({loaderData}: Route.ComponentProps) {
  const {q, products} = loaderData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <h1 className="mb-6 text-3xl font-black text-emerald-900 lg:text-5xl">Ricerca</h1>

      <Form method="get" className="mb-8 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cerca semi e prodotti"
          className="w-full rounded-xl border border-emerald-200 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-lime-600 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          Cerca
        </button>
      </Form>

      {q ? (
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-emerald-900/70">
          Risultati per: {q}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: any) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/5] bg-emerald-50">
              {product.featuredImage ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="p-4">
              <h2 className="line-clamp-1 text-base font-black text-emerald-900">{product.title}</h2>
              <p className="mt-2 text-lg font-black text-lime-700">
                {Number(product.priceRange.minVariantPrice.amount).toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
