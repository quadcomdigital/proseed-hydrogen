import {redirect} from 'react-router';
import type {Route} from './+types/products.$productHandle';

export async function loader({params}: Route.LoaderArgs) {
  if (!params.productHandle) {
    throw new Response('Not found', {status: 404});
  }

  return redirect(`/prodotto/${params.productHandle}`, {status: 302});
}

export default function ProductsHandleRedirect() {
  return null;
}
