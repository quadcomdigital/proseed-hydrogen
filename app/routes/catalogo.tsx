import {redirect} from 'react-router';

export async function loader() {
  return redirect('/collections', {status: 301});
}

export default function CatalogoRedirect() {
  return null;
}
