import type {Route} from './+types/($locale).sitemap[.]xml';

const SITEMAP_QUERY = `#graphql
  query SitemapData($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    products(first: 250) {
      nodes { handle }
    }
    collections(first: 250) {
      nodes { handle }
    }
    pages(first: 250) {
      nodes { handle }
    }
  }
`;

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;

  const data = await context.storefront.query(SITEMAP_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const staticUrls = ['/', '/collections', '/search'];  
  const productUrls = data.products.nodes.map((node: any) => `/products/${node.handle}`);
  const collectionUrls = data.collections.nodes.map((node: any) => `/collections/${node.handle}`);
  const pageUrls = data.pages.nodes.map((node: any) => `/pages/${node.handle}`);

  const all = [...staticUrls, ...productUrls, ...collectionUrls, ...pageUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
    .map((path) => `  <url><loc>${base}${path}</loc></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export default function SitemapXml() {
  return null;
}
