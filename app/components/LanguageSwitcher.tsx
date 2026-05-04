import {useParams, useLocation} from 'react-router';
import {DEFAULT_LOCALE} from '~/lib/locale';
import {Globe} from 'lucide-react';

export function LanguageSwitcher() {
  const params = useParams();
  const location = useLocation();
  const currentLocale = (params as {locale?: string}).locale || undefined;

  const isItalian = !currentLocale || currentLocale === 'it';

  const targetPath = isItalian
    ? `/en${location.pathname === '/' ? '' : location.pathname}${location.search}`
    : location.pathname.replace(/^\/en/, '') || '/';

  return (
    <a
      href={targetPath}
      className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-[#78c13b] text-gray-600 hover:text-[#78c13b] hover:bg-[#78c13b]/5 transition-all"
      aria-label={isItalian ? 'Switch to English' : "Passa all'italiano"}
    >
      <Globe size={14} className="text-gray-400" />
      <span className={isItalian ? 'text-[#78c13b]' : 'text-gray-400'}>IT</span>
      <span className="text-gray-300">/</span>
      <span className={!isItalian ? 'text-[#78c13b]' : 'text-gray-400'}>EN</span>
    </a>
  );
}
