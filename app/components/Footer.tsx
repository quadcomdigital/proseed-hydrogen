import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="mt-16 border-t border-emerald-100 bg-white pt-12 lg:pt-16">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-10 lg:grid-cols-4">
              <section className="lg:col-span-2">
                <img
                  src="https://proseed.it/wp-content/uploads/2021/08/proseed_logo.png"
                  alt="Proseed"
                  className="h-10 w-auto"
                />
                <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-emerald-950/75">
                  Proseed seleziona sementi professionali ad alta germinabilita per orto, giardino e balcone.
                </p>
              </section>

              <section>
                <h4 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-emerald-900">Esplora</h4>
                <nav className="grid gap-2 text-sm font-bold text-emerald-900">
                  <NavLink prefetch="intent" to="/catalogo">Catalogo</NavLink>
                  <NavLink prefetch="intent" to="/blog">Blog</NavLink>
                  <NavLink prefetch="intent" to="/account">Account</NavLink>
                </nav>
              </section>

              <section>
                <h4 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-emerald-900">Policy</h4>
                {header.shop.primaryDomain?.url && (
                  <FooterMenu
                    menu={footer?.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                )}
              </section>
            </div>

            <div className="border-t border-emerald-100 py-4">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800/80">
                <span>Proseed</span>
                <span>{new Date().getFullYear()}</span>
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
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className="hover:text-lime-700">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className={({isActive}) =>
              `transition hover:text-lime-700 ${isActive ? 'text-lime-700' : ''}`
            }
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
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Resi e rimborsi',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Spedizione',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Termini e condizioni',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
