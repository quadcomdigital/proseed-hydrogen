import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const lang = useLocale();

  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.addEventListener('keydown', function handler(event: KeyboardEvent) {
        if (event.key === 'Escape') close();
      }, {signal: abortController.signal});
      document.body.style.overflow = 'hidden';
    }
    return () => {
      abortController.abort();
      document.body.style.overflow = 'unset';
    };
  }, [close, expanded]);

  return (
    <div aria-modal className={`overlay ${expanded ? 'expanded' : ''}`} role="dialog">
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close} aria-label={t('aside.close', lang)}>&times;</button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  return (
    <AsideContext.Provider value={{type, open: setType, close: () => setType('closed')}}>
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) throw new Error('useAside must be used within an AsideProvider');
  return aside;
}
