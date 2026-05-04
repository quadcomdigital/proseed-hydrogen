import {Sprout, Calendar, Sun, ThermometerSun, Droplets, Info} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

interface SowingCalendarProps {
  semenzaio?: string | null;
  aperto?: string | null;
  raccolta?: string | null;
}

function parseMonths(val?: string | null): number[] {
  if (!val) return [];
  return String(val).split(',').map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 12);
}

const MONTHS = ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'];

export default function SowingCalendar({semenzaio, aperto, raccolta}: SowingCalendarProps) {
  const lang = useLocale();
  const semenzaioMonths = parseMonths(semenzaio);
  const apertoMonths = parseMonths(aperto);
  const raccoltaMonths = parseMonths(raccolta);

  if (!semenzaioMonths.length && !apertoMonths.length && !raccoltaMonths.length) return null;

  function Row({label, activeMonths, color}: {label: string; activeMonths: number[]; color: string}) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="w-24 shrink-0 text-[10px] font-black uppercase text-gray-400 tracking-wider">{label}</div>
        <div className="flex-1 grid grid-cols-12 gap-1 min-w-[280px]">
          {MONTHS.map((m, i) => {
            const isActive = activeMonths.includes(i + 1);
            return (
              <div
                key={i}
                className={`h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                  isActive ? `${color} text-white shadow-lg scale-105 z-10` : 'bg-gray-100 text-gray-300'
                }`}
              >
                {m}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 lg:p-8 rounded-2xl lg:rounded-[32px] border border-gray-100 shadow-sm space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base lg:text-xl font-black text-[#2d4a13]">{t('sowing_calendar.title', lang)}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#78c13b]" />
          <span className="text-[10px] font-bold uppercase text-gray-400">{t('sowing_calendar.optimal', lang)}</span>
        </div>
      </div>
      <div className="space-y-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[280px] space-y-2">
          <Row label={t('sowing_calendar.indoors', lang)} activeMonths={semenzaioMonths} color="bg-blue-400" />
          <Row label={t('sowing_calendar.outdoors', lang)} activeMonths={apertoMonths} color="bg-[#78c13b]" />
          <Row label={t('sowing_calendar.harvest', lang)} activeMonths={raccoltaMonths} color="bg-orange-400" />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[9px] font-black uppercase text-gray-400">{t('sowing_calendar.legend_indoor', lang)}</span></div>
        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-[#78c13b]" /><span className="text-[9px] font-black uppercase text-gray-400">{t('sowing_calendar.legend_outdoor', lang)}</span></div>
        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-[9px] font-black uppercase text-gray-400">{t('sowing_calendar.legend_harvest', lang)}</span></div>
      </div>
    </div>
  );
}

export function SpecsGrid({product}: {product: any}) {
  const lang = useLocale();
  const mf = (alias: string, fallbackKey: string) => {
    const v = product[alias]?.value;
    return v || t(`sowing_calendar.${fallbackKey}`, lang);
  };

  const specs = [
    {label: t('sowing_calendar.difficulty', lang), value: mf('difficolta', 'difficulty_medium'), icon: <Droplets size={16} />},
    {label: t('sowing_calendar.harvest_time', lang), value: mf('tempo_raccolto', 'harvest_60_90'), icon: <Calendar size={16} />},
    {label: t('sowing_calendar.germination', lang), value: mf('germinazione', 'germination_90'), icon: <Sun size={16} />},
    {label: t('sowing_calendar.exposure', lang), value: mf('esposizione', 'full_sun'), icon: <ThermometerSun size={16} />},
    {label: t('sowing_calendar.type', lang), value: mf('tipologia', 'annual_herbaceous'), icon: <Sprout size={16} />},
    {label: t('sowing_calendar.code', lang), value: product.codice?.value || product.id?.split('/')?.pop() || '-', icon: <Info size={16} />},
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {specs.map((spec, i) => (
        <div key={i} className="flex items-center space-x-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#78c13b] shadow-sm shrink-0">
            {spec.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-gray-400 uppercase">{spec.label}</p>
            <p className="text-[11px] font-bold text-[#2d4a13]">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
