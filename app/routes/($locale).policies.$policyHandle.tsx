import {getSeoMeta} from '@shopify/hydrogen';
import type {Route} from './+types/($locale).policies.$policyHandle';

const POLICIES_QUERY = `#graphql
  query PoliciesIndex($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        handle
        title
        body
      }
      refundPolicy {
        handle
        title
        body
      }
      shippingPolicy {
        handle
        title
        body
      }
      termsOfService {
        handle
        title
        body
      }
      subscriptionPolicy {
        handle
        title
        body
      }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  if (!params.policyHandle) {
    throw new Response('Not found', {status: 404});
  }

  const data = await context.storefront.query(POLICIES_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const candidates = [
    data.shop.privacyPolicy,
    data.shop.refundPolicy,
    data.shop.shippingPolicy,
    data.shop.termsOfService,
    data.shop.subscriptionPolicy,
  ].filter(Boolean);

  const policy = candidates.find((item: any) => item.handle === params.policyHandle);

  if (!policy) {
    throw new Response('Not found', {status: 404});
  }

  return {
    policy,
    seo: {
      title: policy.title,
      description: policy.body?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function PolicyPage({loaderData}: Route.ComponentProps) {
  const {policy} = loaderData;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-[#2d4a13] lg:text-5xl">{policy.title}</h1>
      <div className="prose prose-green mt-6 max-w-none" dangerouslySetInnerHTML={{__html: policy.body}} />
    </article>
  );
}
