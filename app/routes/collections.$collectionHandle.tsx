import {Link} from 'react-router';
import type {Route} from './+types/collections.$collectionHandle';
import ProductCard from '~/components/ProductCard';

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
    <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
      <h1 className="text-2xl lg:text-4xl font-black text-[#2d4a13]">{collection.title}</h1>
      {collection.description ? (
        <p className="mt-3 max-w-3xl text-sm text-gray-500">{collection.description}</p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collection.products.nodes.map((product: any) => (
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
              availableForSale: product.variants?.nodes?.[0]?.availableForSale,
              secondImage: product.images?.nodes?.[1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
