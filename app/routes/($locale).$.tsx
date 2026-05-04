import {Link, useParams} from 'react-router';
import {t} from '~/lib/translations';
import type {Lang} from '~/lib/translations';
import {DEFAULT_LOCALE} from '~/lib/locale';

export default function NotFound() {
  const params = useParams();
  const lang: Lang = ((params as {locale?: string}).locale === 'en' ? 'en' : 'it') as Lang;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <h1 className="text-6xl font-black text-[#2d4a13] lg:text-8xl">404</h1>
      <h2 className="mt-4 text-2xl font-black text-[#78c13b]">{t('error.page_not_found', lang)}</h2>
      <p className="mt-3 text-base text-[#2d4a13]/70">{t('error.not_found_desc', lang)}</p>
      <Link
        to={lang === 'en' ? '/en' : '/'}
        className="mt-8 rounded-2xl bg-[#78c13b] px-7 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#68a632]"
      >
        {t('error.back_home', lang)}
      </Link>
    </div>
  );
}
