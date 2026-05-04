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
  const requestUrl = new URL(request.url);
  const base = `${requestUrl.protocol}//${requestUrl.host}`;

  const data = await context.storefront.query(SITEMAP_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const staticPaths = ['/', '/collections', '/search'];
  const productPaths = data.products.nodes.map((node: any) => `/products/${node.handle}`);
  const collectionPaths = data.collections.nodes.map((node: any) => `/collections/${node.handle}`);
  const pagePaths = data.pages.nodes.map((node: any) => `/pages/${node.handle}`);

  const allPaths = [...staticPaths, ...productPaths, ...collectionPaths, ...pagePaths];

  const urlTag = (path: string) => {
    const itUrl = `${base}${path}`;
    const enUrl = `${base}/en${path}`;
    return `<url>
  <loc>${itUrl}</loc>
  <xhtml:link rel="alternate" hreflang="it" href="${itUrl}" />
  <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
  <xhtml:link rel="alternate" hreflang="x-default" href="${itUrl}" />
</url>`;
  };

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPaths.map((p) => urlTag(p)).join('\n')}
</urlset>`;

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
