import {Form, redirect, useActionData} from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {Eye, EyeOff, Mail, Lock, AlertCircle} from 'lucide-react';
import {useState} from 'react';
import type {Route} from './+types/($locale).account.login';
import {useLocale} from '~/lib/locale';
import {t, type Lang} from '~/lib/translations';

export async function loader({request}: Route.LoaderArgs) {
  const lang: Lang = new URL(request.url).pathname.startsWith('/en') ? 'en' : 'it';
  return {
    seo: {
      title: t('login.title', lang),
      description: t('login.subtitle', lang),
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

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
  const url = new URL(request.url);
  const lang: Lang = url.pathname.startsWith('/en') ? 'en' : 'it';

  if (actionType === 'register') {
    const data = await context.storefront.mutate(CUSTOMER_CREATE_ACCOUNT, {
      variables: {input: {email, password}},
    });
    const errors = data?.customerCreate?.customerUserErrors || [];
    const customer = data?.customerCreate?.customer;
    if (errors.length) return {errors, success: false};
    if (customer) return redirect('/account/login');
    return {errors: [{message: t('login.registration_failed', lang)}], success: false};
  }

  if (!email || !password) {
    return {errors: [{message: t('login.fill_all', lang)}]};
  }

  const data = await context.storefront.mutate(CUSTOMER_ACCESS_TOKEN_CREATE, {
    variables: {input: {email, password}},
  });

  const result = (data as {customerAccessTokenCreate?: {customerAccessToken?: {accessToken: string}; customerUserErrors?: {code: string; field: string; message: string}[]}})?.customerAccessTokenCreate || {};
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

  return {errors: [{message: t('error.unknown', lang)}], success: false};
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
  const actionData = useActionData() as {errors?: {message: string}[]} | undefined;
  const errors = actionData?.errors || [];
  const isRegister = false;
  const lang = useLocale();

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-20">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
        <h1 className="text-3xl font-black text-[#2d4a13] mb-2 text-center">{t('login.title', lang)}</h1>
        <p className="text-gray-500 text-sm mb-8 text-center">
          {t('login.subtitle', lang)}
        </p>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            {errors.map((err: {message: string}, i: number) => (
              <p key={i} className="text-red-600 text-sm flex items-center space-x-2">
                <AlertCircle size={14} />
                <span>{err.message}</span>
              </p>
            ))}
          </div>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">{t('login.email', lang)}</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="la@tuaemail.com"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-black text-gray-600 uppercase tracking-widest mb-2">{t('login.password', lang)}</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#78c13b] transition-colors bg-white text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#78c13b] text-white font-black py-4 rounded-xl hover:bg-[#68a632] transition-all shadow-lg shadow-[#78c13b]/20 text-sm uppercase tracking-widest"
          >
            {t('login.title', lang)}
          </button>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-4">{t('login.no_account', lang)}</p>
          <a
            href="/account/register"
            className="text-[#78c13b] font-bold text-sm hover:underline"
          >
            {t('login.create_account', lang)}
          </a>
        </div>
      </div>
    </div>
  );
}
