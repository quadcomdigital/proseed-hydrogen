import {Link} from 'react-router';
import {Crown, Sparkles} from 'lucide-react';
import {t} from '~/lib/translations';
import type {Lang} from '~/lib/translations';
import {useLocale} from '~/lib/locale';
import {getSeoMeta} from '@shopify/hydrogen';

export async function loader({request}: {request: Request}) {
  const lang = new URL(request.url).pathname.startsWith('/en') ? 'en' : 'it';
  return {
    seo: {
      title: 'Seed Club - Proseed',
      description: t('seed_club.title', lang),
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function SeedClub() {
  const lang = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:py-24 text-center">
      <div className="mx-auto w-20 h-20 bg-[#78c13b]/10 rounded-full flex items-center justify-center mb-6">
        <Crown size={40} className="text-[#78c13b]" />
      </div>
      <h1 className="text-4xl font-black text-[#2d4a13] mb-4">Seed Club</h1>
      <p className="text-gray-500 max-w-xl mx-auto mb-8">
        {t('seed_club.title', lang)}
      </p>
      <Link to="/collections" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
        <Sparkles size={18} />
        <span>{t('seed_club.browse', lang)}</span>
      </Link>
    </div>
  );
}
