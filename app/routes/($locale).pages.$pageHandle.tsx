import {getSeoMeta} from '@shopify/hydrogen';
import type {Route} from './+types/($locale).pages.$pageHandle';

const PAGE_QUERY = `#graphql
  query PageByHandle(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo { title description }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  if (!params.pageHandle) {
    throw new Response('Not found', {status: 404});
  }

  const data = await context.storefront.query(PAGE_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {handle: params.pageHandle},
  });

  if (!data.page) {
    throw new Response('Not found', {status: 404});
  }

  const page = data.page;

  return {
    page,
    seo: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.body?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function CmsPage({loaderData}: Route.ComponentProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-[#2d4a13] lg:text-5xl">{loaderData.page.title}</h1>
      <div className="prose prose-green mt-6 max-w-none" dangerouslySetInnerHTML={{__html: loaderData.page.body}} />
    </article>
  );
}
