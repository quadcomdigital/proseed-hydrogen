import {Link} from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import type {Route} from './+types/($locale).collections.$collectionHandle';
import ProductCard from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import type {ShopifyProduct} from '~/lib/types';
import {useLocale} from '~/lib/locale';

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
      seo { title description }
      image { url }
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
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

  const collection = data.collection;

  return {
    collection,
    seo: {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description?.slice(0, 160) || '',
      image: collection.image?.url,
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function CollectionPage({loaderData}: Route.ComponentProps) {
  const {collection} = loaderData;
  const lang = useLocale();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://proseed.it${lang === 'en' ? '/en' : ''}/` },
      { '@type': 'ListItem', position: 2, name: 'Collezioni', item: `https://proseed.it${lang === 'en' ? '/en' : ''}/collections` },
      { '@type': 'ListItem', position: 3, name: collection.title },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description?.slice(0, 200) || '',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collection.products?.nodes?.slice(0, 10).map((p: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Product', name: p.title, url: `https://proseed.it/products/${p.handle}` },
      })) || [],
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(collectionSchema)}} />
      <h1 className="text-2xl lg:text-4xl font-black text-[#2d4a13]">{collection.title}</h1>
      {collection.description ? (
        <p className="mt-3 max-w-3xl text-sm text-gray-500">{collection.description}</p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collection.products.nodes.map((product: ShopifyProduct) => (
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
    </div>
  );
}
