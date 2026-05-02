import {Link} from 'react-router';
import {AppSession} from '~/lib/session';
import {ShoppingBag, ArrowRight, Package} from 'lucide-react';
import type {Route} from './+types/account.orders';

const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 50) {
        nodes {
          id
          name
          processedAt
          totalPrice { amount currencyCode }
          fulfillmentStatus
        }
      }
    }
  }
`;

export async function loader({context}: Route.LoaderArgs) {
  const session = context.session as AppSession;
  const customerAccessToken = session.get('customerAccessToken');
  if (!customerAccessToken) {
    throw new Response('Not found', {status: 404});
  }

  const data: any = await context.storefront.query(CUSTOMER_ORDERS_QUERY, {
    variables: {customerAccessToken},
  });

  return {orders: data?.customer?.orders?.nodes || []};
}

export default function AccountOrders({loaderData}: Route.ComponentProps) {
  const {orders} = loaderData as any;

  if (!orders.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-200 mb-3" />
        <h3 className="text-xl font-black text-[#2d4a13] mb-2">Nessun ordine</h3>
        <p className="text-gray-500 text-sm mb-6">Non hai ancora effettuato ordini.</p>
        <Link to="/collections" className="inline-flex items-center space-x-2 bg-[#78c13b] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#68a632] transition-all">
          <span>Inizia a fare acquisti</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingBag size={20} className="text-[#78c13b]" />
        <h2 className="text-xl font-black text-[#2d4a13]">I miei ordini ({orders.length})</h2>
      </div>
      {orders.map((order: any) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id.split('/').pop()}`}
          className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#78c13b]/30 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <Package size={22} className="text-[#78c13b]" />
            </div>
            <div>
              <p className="font-bold text-[#2d4a13]">{order.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(order.processedAt).toLocaleDateString('it-IT', {day: 'numeric', month: 'long', year: 'numeric'})}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-black text-[#78c13b]">
                &euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{order.fulfillmentStatus === 'FULFILLED' ? 'Completato' : 'In elaborazione'}</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-[#78c13b]" />
          </div>
        </Link>
      ))}
    </div>
  );
}
