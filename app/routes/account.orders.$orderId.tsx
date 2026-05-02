import {Link} from 'react-router';
import {ArrowLeft, Package} from 'lucide-react';
import type {Route} from './+types/account.orders.$orderId';

const ORDERS_QUERY = `#graphql
  query CustomerOrders {
    customer {
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

export async function loader({context, params}: Route.LoaderArgs) {
  const orderId = params.orderId;
  if (!orderId) throw new Response('Not found', {status: 404});

  try {
    const data: any = await context.customerAccount.query(ORDERS_QUERY);
    const orders = data?.customer?.orders?.nodes || [];
    const order = orders.find((o: any) => o.id?.includes(orderId));
    if (!order) throw new Response('Not found', {status: 404});
    return {order};
  } catch (e) {
    throw new Response('Not found', {status: 404});
  }
}

export default function AccountOrderDetails({loaderData}: Route.ComponentProps) {
  const {order} = loaderData as any;

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center space-x-2 text-sm font-bold text-[#78c13b] hover:underline">
        <ArrowLeft size={16} />
        <span>Torna agli ordini</span>
      </Link>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#2d4a13]">{order.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.processedAt).toLocaleDateString('it-IT', {day: 'numeric', month: 'long', year: 'numeric'})}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-[#78c13b]/10 text-[#78c13b] text-xs font-bold rounded-full">
              {order.fulfillmentStatus === 'FULFILLED' ? 'Completato' : 'In elaborazione'}
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">Dettaglio ordine completo disponibile a breve.</p>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-gray-500 text-sm">Totale</span>
          <span className="text-2xl font-black text-[#78c13b]">
            &euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
