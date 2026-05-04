import {useState} from 'react';
import {Form, useRouteLoaderData, useFetcher, Link} from 'react-router';
import {AppSession} from '~/lib/session';
import {ShoppingBag, Package, ArrowRight, User, MapPin, Check, X} from 'lucide-react';
import type {Route} from './+types/($locale).account._index';
import type {Customer, ShopifyOrder} from '~/lib/types';
import {useLocale} from '~/lib/locale';
import {t, type Lang} from '~/lib/translations';

const CUSTOMER_UPDATE = `#graphql
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id firstName lastName email }
      customerUserErrors { code field message }
    }
  }
`;

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const session = context.session as AppSession;
  const customerAccessToken = session.get('customerAccessToken');
  const url = new URL(request.url);
  const lang: Lang = url.pathname.startsWith('/en') ? 'en' : 'it';
  if (!customerAccessToken) return {errors: [{message: 'Non autenticato'}]};

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  const data: any = await context.storefront.mutate(CUSTOMER_UPDATE, {
    variables: {customerAccessToken, customer: {firstName, lastName}},
  });

  const errors = data?.customerUpdate?.customerUserErrors || [];
  if (errors.length > 0) return {errors};
  return {success: true};
}

export default function AccountIndex() {
  const data = useRouteLoaderData('routes/($locale).account') as {customer?: Customer} | undefined;
  const customer = data?.customer;
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);
  const lang = useLocale();

  if (!customer) {
    return <div className="animate-pulse h-40 bg-gray-50 rounded-3xl" />;
  }

  const name = customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Cliente';
  const orders = customer.orders?.nodes || [];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#2d4a13] flex items-center space-x-2">
            <User size={20} className="text-[#78c13b]" />
            <span>{t('profile.my_profile', lang)}</span>
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline"
          >
            {editing ? t('profile.cancel', lang) : t('profile.edit', lang)}
          </button>
        </div>

        {editing ? (
          <fetcher.Form method="post" className="space-y-4 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{t('profile.name', lang)}</label>
                <input
                  type="text" name="firstName" id="firstName" defaultValue={customer.firstName || ''}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{t('profile.surname', lang)}</label>
                <input
                  type="text" name="lastName" id="lastName" defaultValue={customer.lastName || ''}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-[#78c13b] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#68a632] transition-all"
            >
              <Check size={16} />
              <span>{t('profile.save_changes', lang)}</span>
            </button>
            {fetcher.data?.success && <p className="text-green-600 text-sm font-medium">{t('profile.profile_updated', lang)}</p>}
            {fetcher.data?.errors?.map((e: {message: string}, i: number) => <p key={i} className="text-red-500 text-sm">{e.message}</p>)}
          </fetcher.Form>
        ) : (
          <div>
            <p className="text-lg font-bold text-[#2d4a13]">{name}</p>
            {customer.email && <p className="text-sm text-gray-500 mt-1">{customer.email}</p>}
          </div>
        )}
      </div>

      {/* Orders Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={20} className="text-[#78c13b]" />
            <h3 className="text-lg font-black text-[#2d4a13]">{t('orders.recent', lang)}</h3>
          </div>
          {orders.length > 0 && (
            <Link to="/account/orders" className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline">
              {t('orders.see_all', lang)}
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">{t('orders.no_orders', lang)}</p>
            <Link to="/collections" className="inline-block mt-4 text-[#78c13b] font-bold text-sm hover:underline">
              {t('orders.start_shopping', lang)}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: ShopifyOrder) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id.split('/').pop()}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-bold text-[#2d4a13] text-sm">{order.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.processedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {day: 'numeric', month: 'long', year: 'numeric'})}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-[#78c13b]">&euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}</p>
                    <p className="text-[10px] font-bold uppercase text-gray-400">{trns(order.fulfillmentStatus, lang)}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#78c13b]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function trns(status: string | undefined, lang: Lang): string {
  const labels: Record<string, string> = {
    FULFILLED: t('orders.fulfilled', lang),
    IN_PROGRESS: t('orders.in_progress', lang),
    ON_HOLD: t('orders.on_hold', lang),
    PARTIALLY_FULFILLED: t('orders.partially_fulfilled', lang),
    PENDING_FULFILLMENT: t('orders.pending_fulfillment', lang),
    UNFULFILLED: t('orders.unfulfilled', lang),
  };
  return labels[status || ''] || status || '';
}
