import {Link, Outlet, useLocation} from 'react-router';
import {AppSession} from '~/lib/session';
import {LayoutDashboard, ShoppingBag, MapPin, LogOut, ChevronRight, User} from 'lucide-react';
import type {Route} from './+types/account';

const CUSTOMER_QUERY = `#graphql
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      displayName
      orders(first: 5) {
        nodes {
          id
          name
          processedAt
          totalPrice { amount currencyCode }
          fulfillmentStatus
        }
      }
      defaultAddress { id address1 address2 city province zip country phone }
      addresses(first: 10) {
        nodes { id address1 address2 city province zip country phone }
      }
    }
  }
`;

export async function loader({context}: Route.LoaderArgs) {
  const session = context.session as AppSession;
  const customerAccessToken = session.get('customerAccessToken');

  if (!customerAccessToken) {
    return {isLoggedIn: false, customer: null, addresses: []};
  }

  try {
    const data: any = await context.storefront.query(CUSTOMER_QUERY, {
      variables: {customerAccessToken},
    });
    return {isLoggedIn: true, customer: data?.customer, addresses: data?.customer?.addresses?.nodes || []};
  } catch {
    return {isLoggedIn: false, customer: null, addresses: []};
  }
}

const navItems = [
  {label: 'Dashboard', href: '/account', icon: <LayoutDashboard size={18} />},
  {label: 'Ordini', href: '/account/orders', icon: <ShoppingBag size={18} />},
  {label: 'Indirizzi', href: '/account/addresses', icon: <MapPin size={18} />},
  {label: 'Logout', href: '/account/logout', icon: <LogOut size={18} />},
];

export default function AccountLayout({loaderData}: Route.ComponentProps) {
  const {isLoggedIn} = loaderData;
  const location = useLocation();

  if (!isLoggedIn) {
    if (location.pathname === '/account/login' || location.pathname === '/account/logout' || location.pathname === '/account/register' || location.pathname === '/account/addresses') {
      return <Outlet />;
    }
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 lg:py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={32} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-black text-[#2d4a13] mb-4">Account</h1>
        <p className="text-gray-500 mb-8">Accedi per visualizzare i tuoi ordini e gestire il tuo profilo.</p>
        <Link to="/account/login" className="inline-flex items-center space-x-2 bg-[#78c13b] text-white font-black py-4 px-8 rounded-xl hover:bg-[#68a632] transition-all shadow-lg">
          <span>Accedi ora</span>
          <ChevronRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-[#2d4a13] mb-8">Il mio account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
        <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto pb-2 lg:pb-0">
          {navItems.map((item) => {
            const isActive = item.href === '/account'
              ? location.pathname === '/account'
              : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#78c13b] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#2d4a13]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
