import {Link, useRouteLoaderData} from 'react-router';
import {ShoppingBag, Package, ArrowRight} from 'lucide-react';

export default function AccountIndex() {
  const data = useRouteLoaderData('routes/account') as any;
  const customer = data?.customer;

  if (!customer) {
    return <div className="animate-pulse h-40 bg-gray-50 rounded-3xl" />;
  }

  const name = customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Cliente';
  const orders = customer.orders?.nodes || [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-[#2d4a13] mb-1">Benvenuto, {name}</h2>
        {customer.emailAddress && (
          <p className="text-gray-500 text-sm">{customer.emailAddress}</p>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
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
                    <p className="text-sm font-black text-[#78c13b]">
                      &euro;{Number(order.totalPrice?.amount || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-400">{order.fulfillmentStatus}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#78c13b] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
