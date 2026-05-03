import {Suspense, useState} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {MapPin, Phone, Mail, ChevronDown} from 'lucide-react';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

function FooterSection({title, children}: {title: string; children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="border-b border-gray-100 lg:border-none last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 lg:py-0 lg:hidden group"
      >
        <h4 className="text-[11px] font-black text-[#2d4a13] uppercase tracking-[0.3em]">{title}</h4>
        <ChevronDown size={16} className={`text-[#78c13b] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <h4 className="hidden lg:block text-[11px] font-black text-[#2d4a13] uppercase tracking-[0.3em] mb-8">{title}</h4>
      <div className={`${isOpen ? 'block pb-6' : 'hidden'} lg:block`}>{children}</div>
    </section>
  );
}

export function Footer({footer: footerPromise, header, publicStoreDomain}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-white border-t border-gray-100 pt-12 lg:pt-24 pb-12 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 pb-12 lg:pb-16 border-b border-gray-100">
                <div className="lg:col-span-2 space-y-8 mb-8 lg:mb-0">
                  <NavLink prefetch="intent" to="/" end>
                    {header.shop.brand?.logo?.image?.url ? (
                      <img
                        src={header.shop.brand.logo.image.url}
                        alt={header.shop.name}
                        className="h-10 lg:h-12 w-auto"
                      />
                    ) : (
                      <img
                        src="/images/proseed-logo.png"
                        alt="Proseed"
                        className="h-10 lg:h-12 w-auto"
                      />
                    )}
                  </NavLink>
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                      Proseed &egrave; leader nella selezione e distribuzione di sementi professionali
                      ad alta germinabilit&agrave;. Dal 1998, portiamo l&apos;eccellenza agricola
                      direttamente nel vostro orto, giardino e balcone.
                    </p>
                    <div className="flex items-center space-x-4 pt-4">
                      <a href="https://www.instagram.com/proseed_it" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-400 hover:text-[#78c13b] hover:bg-[#78c13b0a] rounded-xl transition-all" aria-label="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                      </a>
                      <a href="https://www.facebook.com/proseed" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-400 hover:text-[#78c13b] hover:bg-[#78c13b0a] rounded-xl transition-all" aria-label="Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/></svg>
                      </a>
                      <a href="https://www.linkedin.com/company/proseed" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-400 hover:text-[#78c13b] hover:bg-[#78c13b0a] rounded-xl transition-all" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                    </div>
                  </div>
                </div>

                <FooterSection title="Esplora">
                  <nav>
                    <ul className="space-y-4">
                      {[
                        {label: 'Catalogo Completo', href: '/collections'},
                        {label: 'Seed Box', href: '/seed-box'},
                        {label: 'Smart Garden', href: '/smart-garden'},
                        {label: 'Seed Club', href: '/seed-club'},
                        {label: 'Blog & Guide', href: '/blog'},
                      ].map((item) => (
                        <li key={item.label}>
                          <NavLink prefetch="intent" to={item.href} className="text-sm font-bold text-gray-400 hover:text-[#78c13b] transition-colors">
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </FooterSection>

                <FooterSection title="Assistenza">
                  <nav>
                    <ul className="space-y-4">
                      {[
                        {label: "Centro Aiuto & FAQ", href: '/faq'},
                        {label: "Stato dell'Ordine", href: '/stato-ordine'},
                        {label: 'Metodi di Pagamento', href: '/metodi-pagamento'},
                        {label: 'Termini e Condizioni', href: '/termini-e-condizioni'},
                        {label: 'Privacy Policy', href: '/privacy-policy'},
                      ].map((item) => (
                        <li key={item.label}>
                          <NavLink prefetch="intent" to={item.href} className="text-sm font-bold text-gray-400 hover:text-[#78c13b] transition-colors">
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </FooterSection>

                <FooterSection title="Contatti">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-sm text-gray-400 font-bold leading-tight">
                      <MapPin size={18} className="text-[#78c13b] shrink-0" />
                      <span>Via della Natura, 42<br />70123 Bari (BA) - Italy</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-400 font-bold">
                      <Phone size={18} className="text-[#78c13b] shrink-0" />
                      <span>+39 080 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-400 font-bold">
                      <Mail size={18} className="text-[#78c13b] shrink-0" />
                      <span>info@proseed.it</span>
                    </div>
                  </div>
                </FooterSection>
              </div>

              <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start">
                    <img src="/images/payment-badges.svg" alt="Metodi di pagamento" className="h-8 w-auto opacity-80" />
                  </div>
                <div className="flex items-center justify-center">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">PROSEED SRL</div>
                </div>
                <div className="flex items-center justify-center lg:justify-end space-x-4">
                  <NavLink prefetch="intent" to="/privacy-policy" className="text-[10px] font-black text-gray-500 hover:text-[#78c13b] transition-colors uppercase tracking-widest">Privacy</NavLink>
                  <NavLink prefetch="intent" to="/cookie-policy" className="text-[10px] font-black text-gray-500 hover:text-[#78c13b] transition-colors uppercase tracking-widest">Cookies</NavLink>
                  <NavLink prefetch="intent" to="/termini-e-condizioni" className="text-[10px] font-black text-gray-500 hover:text-[#78c13b] transition-colors uppercase tracking-widest">Termini</NavLink>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | null | undefined;
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="grid gap-2 text-sm font-bold text-emerald-900" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className="hover:text-lime-700">{item.title}</a>
        ) : (
          <NavLink end key={item.id} prefetch="intent"
            className={({isActive}) => `transition hover:text-lime-700 ${isActive ? 'text-lime-700' : ''}`}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {id: 'gid://shopify/MenuItem/461633060920', resourceId: 'gid://shopify/ShopPolicy/23358046264', tags: [], title: 'Privacy', type: 'SHOP_POLICY' as const, url: '/policies/privacy-policy', items: []},
    {id: 'gid://shopify/MenuItem/461633093688', resourceId: 'gid://shopify/ShopPolicy/23358013496', tags: [], title: 'Resi e rimborsi', type: 'SHOP_POLICY' as const, url: '/policies/refund-policy', items: []},
    {id: 'gid://shopify/MenuItem/461633126456', resourceId: 'gid://shopify/ShopPolicy/23358111800', tags: [], title: 'Spedizione', type: 'SHOP_POLICY' as const, url: '/policies/shipping-policy', items: []},
    {id: 'gid://shopify/MenuItem/461633159224', resourceId: 'gid://shopify/ShopPolicy/23358079032', tags: [], title: 'Termini e condizioni', type: 'SHOP_POLICY' as const, url: '/policies/terms-of-service', items: []},
  ],
};
