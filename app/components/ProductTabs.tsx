import {useState} from 'react';
import {FileText, Truck, RefreshCw} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

export default function ProductTabs({descriptionHtml}: {descriptionHtml?: string}) {
  const [active, setActive] = useState('description');
  const lang = useLocale();

  const tabs = [
    {key: 'description', label: t('product_tabs.description', lang), icon: <FileText size={18} />},
    {key: 'shipping', label: t('product_tabs.shipping', lang), icon: <Truck size={18} />},
    {key: 'returns', label: t('product_tabs.returns', lang), icon: <RefreshCw size={18} />},
  ];

  return (
    <div className="rounded-3xl border border-gray-100 overflow-hidden bg-white">
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center space-x-1 lg:space-x-2 px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold transition-all shrink-0 border-b-2 ${
              active === tab.key
                ? 'border-[#78c13b] text-[#78c13b] bg-[#78c13b]/5'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 lg:p-8">
        {active === 'description' && descriptionHtml ? (
          <div className="text-gray-500 leading-relaxed text-sm lg:text-lg font-medium" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        ) : null}
        {active === 'shipping' && (
          <div className="text-gray-500 leading-relaxed text-sm">
            <p>{t('product_tabs.shipping_content', lang)}</p>
          </div>
        )}
        {active === 'returns' && (
          <div className="text-gray-500 leading-relaxed text-sm">
            <p>{t('product_tabs.returns_content', lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
