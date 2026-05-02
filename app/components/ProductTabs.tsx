import {useState} from 'react';
import {FileText, Truck, RefreshCw} from 'lucide-react';

const tabs = [
  {key: 'description', label: 'Descrizione', icon: <FileText size={18} />},
  {key: 'shipping', label: 'Spedizioni', icon: <Truck size={18} />},
  {key: 'returns', label: 'Resi e Rimborsi', icon: <RefreshCw size={18} />},
];

export default function ProductTabs({descriptionHtml}: {descriptionHtml?: string}) {
  const [active, setActive] = useState('description');

  return (
    <div className="rounded-3xl border border-gray-100 overflow-hidden bg-white">
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all shrink-0 border-b-2 ${
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
      <div className="p-6 lg:p-8">
        {active === 'description' && descriptionHtml ? (
          <div className="text-gray-500 leading-relaxed text-base lg:text-lg font-medium" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        ) : null}
        {active === 'shipping' && (
          <div className="text-gray-500 leading-relaxed text-sm">
            <p className="mb-3">Le spedizioni vengono effettuate entro 24/48 ore lavorative dal pagamento. La consegna avviene in 2-5 giorni lavorativi tramite corriere espresso.</p>
            <p><strong>Gratuita</strong> per ordini superiori a 39 &euro;.</p>
          </div>
        )}
        {active === 'returns' && (
          <div className="text-gray-500 leading-relaxed text-sm">
            <p className="mb-3">Hai diritto di recesso entro 14 giorni dalla ricezione del prodotto. I prodotti devono essere restituiti integri e non aperti.</p>
            <p>Per richiedere un reso, contatta il nostro servizio clienti all&apos;indirizzo email <strong>info@proseed.it</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
