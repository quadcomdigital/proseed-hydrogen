import {Link, useParams} from 'react-router';
import type {LinkProps} from 'react-router';
import {localeToUrl, DEFAULT_LOCALE} from '~/lib/locale';

export function LocaleLink(props: LinkProps) {
  const params = useParams();
  const locale = (params as {locale?: string}).locale;
  const prefix = locale ? `/${locale}` : DEFAULT_LOCALE.prefix;

  if (typeof props.to === 'string' && prefix && props.to.startsWith('/')) {
    const newTo = `${prefix}${props.to}`;
    return <Link {...props} to={newTo} />;
  }

  return <Link {...props} />;
}
