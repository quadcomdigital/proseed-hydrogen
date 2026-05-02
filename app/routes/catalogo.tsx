import {Link} from 'react-router';
import type {Route} from './+types/catalogo';

const CATALOG_QUERY = `#graphql
  query Catalog(
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
  const data = await context.storefront.query(CATALOG_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {first: 24},
  });

  return {products: data.products.nodes};
}

export default function Catalogo({loaderData}: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <h1 className="mb-8 text-3xl font-black text-emerald-900 lg:text-4xl">Catalogo</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loaderData.products.map((product: any) => (
          <Link
            key={product.id}
            to={`/prodotto/${product.handle}`}
            className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/5] overflow-hidden bg-emerald-50">
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
              <h2 className="line-clamp-1 text-base font-bold text-emerald-900">{product.title}</h2>
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
