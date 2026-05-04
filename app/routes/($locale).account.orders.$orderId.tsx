import {Link} from 'react-router';
import {AppSession} from '~/lib/session';
import {ArrowLeft, Package} from 'lucide-react';
import type {Route} from './+types/($locale).account.orders.$orderId';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const CUSTOMER_ORDERS_ID_QUERY = `#graphql
  query CustomerOrdersDetail($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 50) {
        nodes {
          id
          name
          processedAt
          totalPrice { amount currencyCode }
          fulfillmentStatus
          lineItems(first: 20) {
            nodes {
              title
              quantity
              originalTotalPrice { amount currencyCode }
              variant { image { url } }
            }
          }
        }
      }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  const session = context.session as AppSession;
  const customerAccessToken = session.get('customerAccessToken');
  if (!customerAccessToken) throw new Response('Not found', {status: 404});

  const data: any = await context.storefront.query(CUSTOMER_ORDERS_ID_QUERY, {
    variables: {customerAccessToken},
  });

  const orders = data?.customer?.orders?.nodes || [];
  const orderId = params.orderId;
  const order = orders.find((o: any) => o.id?.includes(orderId));
  if (!order) throw new Response('Not found', {status: 404});

  return {order};
}

export default function AccountOrderDetails({loaderData}: Route.ComponentProps) {
  const {order} = loaderData as any;
  const items = order.lineItems?.nodes || [];
  const lang = useLocale();

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center space-x-2 text-sm font-bold text-[#78c13b] hover:underline">
        <ArrowLeft size={16} />
        <span>{t('orders.back_to_orders', lang)}</span>
      </Link>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#2d4a13]">{order.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.processedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {day: 'numeric', month: 'long', year: 'numeric'})}
            </p>
          </div>
          <span className="inline-block px-3 py-1 bg-[#78c13b]/10 text-[#78c13b] text-xs font-bold rounded-full">
            {order.fulfillmentStatus === 'FULFILLED' ? t('orders.fulfilled', lang) : t('orders.in_progress', lang)}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                {item.variant?.image?.url ? (
                  <img src={item.variant.image.url} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center"><Package size={20} className="text-gray-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2d4a13] text-sm truncate">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('orders.qty', lang)}: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-[#78c13b]">&euro;{Number(item.originalTotalPrice?.amount || 0).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-gray-500 text-sm">{t('orders.total', lang)}</span>
          <span className="text-2xl font-black text-[#78c13b]">
            &euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
