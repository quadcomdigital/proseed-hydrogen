import {Link} from 'react-router';
import type {Route} from './+types/collections.$collectionHandle';

const COLLECTION_QUERY = `#graphql
  query CollectionByHandle(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first) {
        nodes {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          images(first: 2) {
            nodes {
              url
              altText
            }
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
              availableForSale
            }
          }
        }
      }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  if (!params.collectionHandle) {
    throw new Response('Not found', {status: 404});
  }

  const data = await context.storefront.query(COLLECTION_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {handle: params.collectionHandle, first: 48},
  });

  if (!data.collection) {
    throw new Response('Not found', {status: 404});
  }

  return {collection: data.collection};
}

export default function CollectionPage({loaderData}: Route.ComponentProps) {
  const {collection} = loaderData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-emerald-900 lg:text-5xl">{collection.title}</h1>
      {collection.description ? (
        <p className="mt-4 max-w-3xl text-base text-emerald-900/75">{collection.description}</p>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collection.products.nodes.map((product: any) => (
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
