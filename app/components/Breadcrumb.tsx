import {Link} from 'react-router';
import {ChevronRight} from 'lucide-react';
import {useLocale} from '~/lib/locale';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({items}: {items: Crumb[]}) {
  const lang = useLocale();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 mb-4 lg:mb-6 overflow-x-auto whitespace-nowrap">
      <Link to={lang === 'en' ? '/en' : '/'} className="hover:text-[#78c13b] transition-colors uppercase">
        HOME
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center space-x-1.5">
          <ChevronRight size={12} className="shrink-0" />
          {item.href ? (
            <Link to={item.href} className="hover:text-[#78c13b] transition-colors uppercase">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 uppercase">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
