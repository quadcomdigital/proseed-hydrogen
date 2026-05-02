import {Link, useRouteLoaderData} from 'react-router';
import {ShoppingBag, ArrowRight, Package } from 'lucide-react';

export default function AccountOrders() {
  const data = useRouteLoaderData('routes/account') as any;
  const customer = data?.customer;
  const orders = customer?.orders?.nodes || [];

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
