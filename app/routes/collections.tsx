import {Link} from 'react-router';
import type {Route} from './+types/collections';

const COLLECTIONS_QUERY = `#graphql
  query CollectionsIndex($country: CountryCode, $language: LanguageCode, $first: Int!)
  @inContext(country: $country, language: $language) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
      }
    }
  }
`;

export async function loader({context}: Route.LoaderArgs) {
  const data = await context.storefront.query(COLLECTIONS_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {first: 24},
  });

  return {collections: data.collections.nodes};
}

export default function CollectionsPage({loaderData}: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
      <h1 className="mb-6 text-2xl lg:text-4xl font-black text-[#2d4a13]">Collezioni</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loaderData.collections.map((collection: any) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[16/10] bg-gray-50">
              {collection.image ? (
                <img
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-black text-[#2d4a13]">{collection.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
