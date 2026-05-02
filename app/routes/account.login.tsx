import {Form, redirect, useActionData} from 'react-router';
import {AppSession} from '~/lib/session';
import {Eye, EyeOff, Mail, Lock, AlertCircle} from 'lucide-react';
import {useState} from 'react';
import type {Route} from './+types/account.login';

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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const actionType = formData.get('_action') as string;

  if (actionType === 'register') {
    const data = await context.storefront.mutate(CUSTOMER_CREATE_ACCOUNT, {
      variables: {input: {email, password}},
    });
    const errors = data?.customerCreate?.customerUserErrors || [];
    const customer = data?.customerCreate?.customer;
    if (errors.length) return {errors, success: false};
    if (customer) return redirect('/account/login');
    return {errors: [{message: 'Registrazione fallita'}], success: false};
  }

  if (!email || !password) {
    return {errors: [{message: 'Compila tutti i campi'}]};
  }

  const data: any = await context.storefront.mutate(CUSTOMER_ACCESS_TOKEN_CREATE, {
    variables: {input: {email, password}},
  });

  const result = data?.customerAccessTokenCreate || {};
  const errors = result.customerUserErrors || [];

  if (errors.length > 0) {
    return {errors, success: false};
  }

  const token = result.customerAccessToken?.accessToken;
  if (token) {
    const session = context.session as AppSession;
    session.set('customerAccessToken', token);
    const cookie = await session.commit();
    return redirect('/account', {headers: {'Set-Cookie': cookie}});
  }

  return {errors: [{message: 'Errore sconosciuto'}], success: false};
}

const CUSTOMER_CREATE_ACCOUNT = `#graphql
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id firstName lastName email }
      customerUserErrors { code field message }
    }
  }
`;

export default function AccountLogin() {
  const actionData = useActionData() as any;
  const errors = actionData?.errors || [];
  const isRegister = false;

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-20">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-2 text-center">Accedi</h1>
        <p className="text-gray-500 text-sm mb-8 text-center">
          Inserisci le tue credenziali per accedere al tuo account
        </p>

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
          <div>
            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="la@tuaemail.com"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#78c13b] text-white font-black py-4 rounded-xl hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 text-sm uppercase tracking-widest"
          >
            Accedi
          </button>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-4">Non hai un account?</p>
          <a
            href="/account/register"
            className="text-[#78c13b] font-bold text-sm hover:underline"
          >
            Crea un account
          </a>
        </div>
      </div>
    </div>
  );
}
