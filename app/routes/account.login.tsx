import {redirect} from 'react-router';
import type {Route} from './+types/account.login';

export async function loader({context}: Route.LoaderArgs) {
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  if (isLoggedIn) {
    return redirect('/account');
  }
  return context.customerAccount.login({uiLocales: 'IT'});
}

export default function AccountLogin() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-20 text-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">Reindirizzamento in corso...</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Stai per essere reindirizzato alla pagina di login sicura di Shopify.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#78c13b] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
