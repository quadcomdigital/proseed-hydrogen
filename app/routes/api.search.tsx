import type {Route} from './+types/api.search';

const SEARCH_QUERY = `query SearchProducts($query: String!, $first: Int!) {
  search(query: $query, first: $first, types: [PRODUCT]) {
    nodes {
      ... on Product {
        id
        handle
        title
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
}`;

export async function action({request, context}: Route.ActionArgs) {
  const body: any = await request.json();
  const q = String(body?.search || '').trim();

  if (!q || q.length < 2) {
    return Response.json({products: []}, {status: 400});
  }

  const data: any = await context.storefront.query(SEARCH_QUERY, {
    variables: {query: q, first: 12},
  });

  return Response.json({products: data.search.nodes});
}
