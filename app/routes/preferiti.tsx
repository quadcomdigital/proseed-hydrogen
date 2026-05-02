import {Link, useLoaderData} from 'react-router';
import {Heart, ShoppingCart, ArrowRight, LogIn} from 'lucide-react';
import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/preferiti';
import {
  CUSTOMER_WISHLIST_QUERY,
  CUSTOMER_WISHLIST_REMOVE_MUTATION,
  CUSTOMER_WISHLIST_ADD_MUTATION,
} from '~/graphql/customer-account/wishlist';

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const isLoggedIn = await customerAccount.isLoggedIn();

  if (!isLoggedIn) {
    return {isLoggedIn: false, items: [] as any[]};
  }

  try {
    const data: any = await customerAccount.query(CUSTOMER_WISHLIST_QUERY);
    const items = data?.customer?.wishlist?.items?.nodes || [];
    return {isLoggedIn: true, items};
  } catch {
    return {isLoggedIn: true, items: []};
  }
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;
  const formData = await request.formData();
  const action = formData.get('_action');
  const productId = formData.get('productId');

  if (typeof productId !== 'string') {
    return Response.json({ok: false}, {status: 400});
  }

  try {
    if (action === 'add') {
      await customerAccount.mutate(CUSTOMER_WISHLIST_ADD_MUTATION, {
        variables: {productId},
      });
    } else if (action === 'remove') {
      await customerAccount.mutate(CUSTOMER_WISHLIST_REMOVE_MUTATION, {
        variables: {productId},
      });
    }
    return Response.json({ok: true});
  } catch {
    return Response.json({ok: false}, {status: 500});
  }
}

export default function Preferiti() {
  const {isLoggedIn, items} = useLoaderData() as any;

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">Accedi per usare la wishlist</h1>
        <p className="text-gray-500 mb-8">Salva i tuoi prodotti preferiti e sincronizzali tra tutti i tuoi dispositivi.</p>
        <Link to="/account/login" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <LogIn size={18} />
          <span>Accedi</span>
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24 text-center">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-2">Wishlist vuota</h1>
        <p className="text-gray-500 mb-8">Non hai ancora aggiunto prodotti ai preferiti.</p>
        <Link to="/collections" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
          <span>Esplora il catalogo</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-[#2d4a13] mb-2">I miei preferiti</h1>
      <p className="text-gray-500 mb-8">{items.length} prodotti salvati</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any) => {
          const product = item.product;
          const variantId = product.variants?.nodes?.[0]?.id;
          const price = Number(product.priceRange?.minVariantPrice?.amount || 0);
          const currencyCode = product.priceRange?.minVariantPrice?.currencyCode || 'EUR';
          const image = product.featuredImage?.url || '/images/placeholder.svg';

          return (
            <div key={item.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <Link to={`/products/${product.handle}`} className="block">
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  <img src={image} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.handle}`}>
                  <h3 className="font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors line-clamp-1">{product.title}</h3>
                </Link>
                <p className="text-[#78c13b] font-black text-lg mt-1">&euro;{price.toFixed(2)}</p>
                <div className="mt-3 flex items-center space-x-2">
                  {variantId ? (
                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.LinesAdd}
                      inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}
                    >
                      <button type="submit" className="flex-1 py-3 bg-[#78c13b] text-white text-xs font-bold rounded-xl hover:bg-[#68a632] transition-all flex items-center justify-center space-x-2">
                        <ShoppingCart size={16} />
                        <span>Carrello</span>
                      </button>
                    </CartForm>
                  ) : null}
                  <form method="post">
                    <input type="hidden" name="_action" value="remove" />
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit" className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
