import {useParams} from 'react-router';
import type {LanguageCode, CountryCode} from '@shopify/hydrogen/storefront-api-types';
import type {Lang} from '~/lib/translations';

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  prefix: string;
};

export const LOCALES: Record<string, Locale> = {
  'it-it': {language: 'IT', country: 'IT', label: 'Italiano', prefix: ''},
  'en-it': {language: 'EN', country: 'IT', label: 'English', prefix: '/en'},
};

export const DEFAULT_LOCALE = LOCALES['it-it'];

export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/en/') || path === '/en') {
    return LOCALES['en-it'];
  }

  return DEFAULT_LOCALE;
}

export function useLocale(): Lang {
  const params = useParams();
  return (params as {locale?: string}).locale === 'en' ? 'en' : 'it';
}

export function localeToUrl(locale: Locale, path: string): string {
  if (locale.prefix && !path.startsWith(locale.prefix)) {
    return `${locale.prefix}${path}`;
  }
  return path;
}

export function localeDateString(date: string | Date, locale: Locale): string {
  const lang = locale.language.toLowerCase();
  const country = locale.country;
  return new Date(date).toLocaleDateString(`${lang}-${country}`, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
