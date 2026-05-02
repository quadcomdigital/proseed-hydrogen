import {Form, redirect, useActionData, Link} from 'react-router';
import {AppSession} from '~/lib/session';
import {AlertCircle, ArrowLeft} from 'lucide-react';
import type {Route} from './+types/account.register';

const CUSTOMER_CREATE = `#graphql
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id firstName lastName email }
      customerUserErrors { code field message }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE = `#graphql
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`;

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !firstName) {
    return {errors: [{message: 'Compila tutti i campi obbligatori'}]};
  }

  const createData: any = await context.storefront.mutate(CUSTOMER_CREATE, {
    variables: {input: {email, password, firstName, lastName: lastName || ''}},
  });

  const createErrors = createData?.customerCreate?.customerUserErrors || [];
  if (createErrors.length > 0) {
    return {errors: createErrors};
  }

  const loginData: any = await context.storefront.mutate(CUSTOMER_ACCESS_TOKEN_CREATE, {
    variables: {input: {email, password}},
  });

  const loginErrors = loginData?.customerAccessTokenCreate?.customerUserErrors || [];
  if (loginErrors.length > 0) {
    return {errors: loginErrors};
  }

  const token = loginData?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  if (token) {
    const session = context.session as AppSession;
    session.set('customerAccessToken', token);
    const cookie = await session.commit();
    return redirect('/account', {headers: {'Set-Cookie': cookie}});
  }

  return {errors: [{message: 'Errore durante la registrazione'}]};
}

export default function AccountRegister() {
  const actionData = useActionData() as any;
  const errors = actionData?.errors || [];

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-20">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <Link to="/account/login" className="inline-flex items-center space-x-1 text-sm text-gray-400 hover:text-[#78c13b] mb-6">
          <ArrowLeft size={16} />
          <span>Torna al login</span>
        </Link>

        <h1 className="text-3xl font-black text-[#2d4a13] mb-2">Crea account</h1>
        <p className="text-gray-500 text-sm mb-8">Registrati per accedere a tutti i vantaggi</p>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            {errors.map((err: any, i: number) => (
              <p key={i} className="text-red-600 text-sm flex items-center space-x-2">
                <AlertCircle size={14} />
                <span>{err.message}</span>
              </p>
            ))}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Nome *</label>
              <input type="text" name="firstName" required className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Cognome</label>
              <input type="text" name="lastName" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Email *</label>
            <input type="email" name="email" required placeholder="la@tuaemail.com" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Password *</label>
            <input type="password" name="password" required placeholder="Minimo 5 caratteri" minLength={5} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900" />
          </div>
          <button
            type="submit"
            className="w-full bg-[#78c13b] text-white font-black py-4 rounded-xl hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 text-sm uppercase tracking-widest"
          >
            Crea account
          </button>
        </Form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Creando un account accetti i nostri Termini e Condizioni e la Privacy Policy.
        </p>
      </div>
    </div>
  );
}
