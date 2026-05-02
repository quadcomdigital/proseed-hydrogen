import type {Route} from './+types/account.orders.$orderId';

export async function loader({params}: Route.LoaderArgs) {
  return {orderId: params.orderId || 'unknown'};
}

export default function AccountOrderDetails({loaderData}: Route.ComponentProps) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6">
      <h2 className="text-xl font-black text-emerald-900">Dettaglio ordine</h2>
      <p className="mt-3 text-sm font-medium text-emerald-900/75">
        Placeholder ordine: {loaderData.orderId}
      </p>
    </div>
  );
}
