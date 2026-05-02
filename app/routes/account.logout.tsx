import {redirect} from 'react-router';
import {LogOut} from 'lucide-react';
import type {Route} from './+types/account.logout';

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.logout({postLogoutRedirectUri: '/'});
}

export default function AccountLogout() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogOut size={28} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-black text-[#2d4a13] mb-2">Uscire dall&apos;account?</h2>
      <p className="text-gray-500 text-sm mb-6">Verrai disconnesso e reindirizzato alla home.</p>
      <form method="post">
        <button
          type="submit"
          className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-all"
        >
          Esci
        </button>
      </form>
    </div>
  );
}
