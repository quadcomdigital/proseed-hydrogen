import {Form, useActionData} from 'react-router';
import type {Route} from './+types/account.login';

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.login();
}

export default function AccountLogin() {
  const error = useActionData() as any;

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-20 text-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">Accedi al tuo account</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Utilizza il tuo account Shopify per accedere, visualizzare i tuoi ordini e gestire i tuoi dati.
        </p>

        {error?.error && (
          <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl">{error.error}</p>
        )}

        <Form method="post">
          <button
            type="submit"
            className="w-full bg-[#78c13b] text-white font-black py-4 rounded-xl hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 text-sm uppercase tracking-widest"
          >
            Accedi con Shopify
          </button>
        </Form>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          Non hai un account? Verrai reindirizzato alla registrazione Shopify.
        </p>
      </div>
    </div>
  );
}
