import {Link, Outlet} from 'react-router';
import type {Route} from './+types/account';

export async function loader({context}: Route.LoaderArgs) {
  const isLoggedIn = await context.customerAccount.isLoggedIn();
  return {isLoggedIn};
}

export default function AccountLayout({loaderData}: Route.ComponentProps) {
  if (!loaderData.isLoggedIn) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
        <h1 className="text-3xl font-black text-emerald-900 lg:text-5xl">Account</h1>
        <p className="mt-4 text-base text-emerald-900/75">Per visualizzare il tuo account devi accedere.</p>
        <Link
          to="/account/login"
          className="mt-6 inline-flex rounded-xl bg-lime-600 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
      <h1 className="mb-6 text-3xl font-black text-emerald-900 lg:text-5xl">Il mio account</h1>
      <Outlet />
    </div>
  );
}
