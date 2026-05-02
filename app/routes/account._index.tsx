import {Link} from 'react-router';

export default function AccountIndex() {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6">
      <p className="text-sm font-medium text-emerald-900/75">
        Dashboard account pronta. Nel prossimo step colleghiamo ordini, indirizzi e profilo cliente.
      </p>
      <div className="mt-5 flex gap-3">
        <Link
          to="/account/orders/demo"
          className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-900"
        >
          Vedi esempio ordine
        </Link>
      </div>
    </div>
  );
}
