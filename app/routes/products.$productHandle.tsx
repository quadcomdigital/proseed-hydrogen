import {Money, CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/products.$productHandle';

const PRODUCT_QUERY = `#graphql
  query ProductByHandle(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      description
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  const handle = params.productHandle;
  if (!handle) {
    throw new Response('Not found', {status: 404});
  }

  const data = await context.storefront.query(PRODUCT_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {handle},
  });

  if (!data.product) {
    throw new Response('Not found', {status: 404});
  }

  return {product: data.product};
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const variantId = formData.get('variantId');

  if (typeof variantId !== 'string' || !variantId) {
    return Response.json({ok: false, message: 'Variant missing'}, {status: 400});
  }

  const cart = await context.cart.get();
  if (!cart?.id) {
    await context.cart.create({lines: [{merchandiseId: variantId, quantity: 1}]});
    return Response.json({ok: true});
  }

  await context.cart.addLines([{merchandiseId: variantId, quantity: 1}]);
  return Response.json({ok: true});
}

export default function ProductPage({loaderData}: Route.ComponentProps) {
  const product = loaderData.product;
  const firstVariant = product.variants.nodes[0];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-2 lg:py-14">
      <div className="overflow-hidden rounded-3xl bg-emerald-50">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center text-emerald-800">
            No image
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-black text-emerald-900 lg:text-5xl">{product.title}</h1>
        {firstVariant?.price ? (
          <p className="mt-4 text-2xl font-black text-lime-700">
            <Money data={firstVariant.price} />
          </p>
        ) : null}

        {product.description ? (
          <p className="mt-6 text-base leading-relaxed text-emerald-950/80">{product.description}</p>
        ) : null}

        {firstVariant ? (
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{lines: [{merchandiseId: firstVariant.id, quantity: 1}]}}
          >
            <button
              type="submit"
              className="rounded-full bg-lime-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-lime-700"
            >
              Aggiungi al carrello
            </button>
          </CartForm>
        ) : null}
      </div>
    </div>
  );
}
