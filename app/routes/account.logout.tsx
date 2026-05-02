import {LogOut} from 'lucide-react';
import {redirect, useFetcher} from 'react-router';
import {AppSession} from '~/lib/session';
import type {Route} from './+types/account.logout';

export async function action({context}: Route.ActionArgs) {
  const session = context.session as AppSession;
  session.unset('customerAccessToken');
  const cookie = await session.commit();
  return redirect('/', {headers: {'Set-Cookie': cookie}});
}

export default function AccountLogout() {
  const fetcher = useFetcher();

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogOut size={28} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-black text-[#2d4a13] mb-2">Uscire dall&apos;account?</h2>
      <p className="text-gray-500 text-sm mb-6">Verrai disconnesso e reindirizzato alla home.</p>
      <fetcher.Form method="post">
        <button
          type="submit"
          className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-all"
        >
          Esci
        </button>
      </fetcher.Form>
    </div>
  );
}
