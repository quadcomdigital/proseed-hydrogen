import {useState} from 'react';
import {Form, useRouteLoaderData, useFetcher} from 'react-router';
import {AppSession} from '~/lib/session';
import {ShoppingBag, Package, ArrowRight, User, MapPin, Check, X} from 'lucide-react';
import type {Route} from './+types/account._index';
import {Link} from 'react-router';

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
  const data = useRouteLoaderData('routes/account') as any;
  const customer = data?.customer;
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);

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
            <span>Il mio Profilo</span>
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline"
          >
            {editing ? 'Annulla' : 'Modifica'}
          </button>
        </div>

        {editing ? (
          <fetcher.Form method="post" className="space-y-4 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Nome</label>
                <input
                  type="text" name="firstName" defaultValue={customer.firstName || ''}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Cognome</label>
                <input
                  type="text" name="lastName" defaultValue={customer.lastName || ''}
                  className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-[#78c13b] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#68a632] transition-all"
            >
              <Check size={16} />
              <span>Salva modifiche</span>
            </button>
            {fetcher.data?.success && <p className="text-green-600 text-sm font-medium">Profilo aggiornato!</p>}
            {fetcher.data?.errors?.map((e: any, i: number) => <p key={i} className="text-red-500 text-sm">{e.message}</p>)}
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
            <h3 className="text-lg font-black text-[#2d4a13]">Ordini recenti</h3>
          </div>
          {orders.length > 0 && (
            <Link to="/account/orders" className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline">
              Vedi tutti
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">Nessun ordine ancora effettuato.</p>
            <Link to="/collections" className="inline-block mt-4 text-[#78c13b] font-bold text-sm hover:underline">
              Inizia a fare acquisti
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id.split('/').pop()}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <p className="font-bold text-[#2d4a13] text-sm">{order.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.processedAt).toLocaleDateString('it-IT', {day: 'numeric', month: 'long', year: 'numeric'})}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-[#78c13b]">&euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}</p>
                    <p className="text-[10px] font-bold uppercase text-gray-400">{trns(order.fulfillmentStatus)}</p>
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

const FULFILLMENT_LABELS: Record<string, string> = {
  FULFILLED: 'Completato',
  IN_PROGRESS: 'In elaborazione',
  ON_HOLD: 'In attesa',
  PARTIALLY_FULFILLED: 'Parzialmente evaso',
  PENDING_FULFILLMENT: 'In attesa',
  UNFULFILLED: 'Da evadere',
};

function trns(status?: string): string {
  return FULFILLMENT_LABELS[status || ''] || status || '';
}
