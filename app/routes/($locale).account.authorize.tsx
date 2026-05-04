import {redirect} from 'react-router';
import type {Route} from './+types/($locale).account.authorize';

export async function loader({context}: Route.LoaderArgs) {
  const response = await context.customerAccount.authorize();
  return response || redirect('/account');
}

export default function AccountAuthorize() {
  return null;
}
