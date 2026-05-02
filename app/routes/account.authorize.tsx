import {redirect} from 'react-router';
import type {Route} from './+types/account.authorize';

export async function loader({request, context}: Route.LoaderArgs) {
  const response = await context.customerAccount.authorize();
  return response || redirect('/account');
}

export async function action({context}: Route.ActionArgs) {
  const response = await context.customerAccount.login();
  return response || redirect('/account');
}

export default function AccountAuthorize() {
  return null;
}
