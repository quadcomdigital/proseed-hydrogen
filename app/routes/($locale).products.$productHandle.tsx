import {Suspense, useMemo, useState} from 'react';
import {Await, Link, useNavigation} from 'react-router';
import {CartForm, Image, Money, getSeoMeta} from '@shopify/hydrogen';
import {Check, Leaf, ShoppingCart} from 'lucide-react';
import type {Route} from './+types/($locale).products.$productHandle';
import ProductGallery from '~/components/ProductGallery';
import ProductTabs from '~/components/ProductTabs';
import SocialShare from '~/components/SocialShare';
import MobileStickyAddToCart from '~/components/MobileStickyAddToCart';
import ProductCard from '~/components/ProductCard';
import SowingCalendar, {SpecsGrid} from '~/components/SowingCalendar';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const PRODUCT_QUERY = `#graphql
  query ProductByHandle(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      productType
      seo { title description }
      featuredImage { url altText width height }
      images(first: 6) { nodes { url altText width height } }
      options { name values }
      semina_semenzaio: metafield(namespace: "custom", key: "semina_semenzaio") { value }
      semina_aperto: metafield(namespace: "custom", key: "semina_aperto") { value }
      semina_raccolta: metafield(namespace: "custom", key: "semina_raccolta") { value }
      difficolta: metafield(namespace: "custom", key: "difficolta") { value }
      tempo_raccolto: metafield(namespace: "custom", key: "tempo_raccolto") { value }
      germinazione: metafield(namespace: "custom", key: "germinazione") { value }
      esposizione: metafield(namespace: "custom", key: "esposizione") { value }
      tipologia: metafield(namespace: "custom", key: "tipologia") { value }
      consiglio_esperto: metafield(namespace: "custom", key: "consiglio_esperto") { value }
      codice: metafield(namespace: "custom", key: "codice") { value }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          quantityAvailable
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
    }
  }
`;

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productHandle: $handle) {
      id
      handle
      title
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 1) { nodes { id } }
    }
  }
`;

function getColorHex(name: string): string {
  const map: Record<string, string> = {
    rosso: '#EF4444', red: '#EF4444', cherry: '#DC2626',
    blu: '#3B82F6', blue: '#3B82F6', navy: '#1E3A5F',
    verde: '#22C55E', green: '#22C55E', oliva: '#65A30D',
    nero: '#171717', black: '#171717', scuro: '#171717',
    bianco: '#FFFFFF', white: '#FFFFFF',
    grigio: '#9CA3AF', grey: '#9CA3AF', gray: '#9CA3AF', argento: '#D1D5DB',
    giallo: '#EAB308', yellow: '#EAB308', oro: '#D97706',
    arancione: '#F97316', orange: '#F97316',
    viola: '#A855F7', purple: '#A855F7', lilla: '#C084FC',
    rosa: '#EC4899', pink: '#EC4899',
    marrone: '#92400E', brown: '#92400E',
    beige: '#F5E6D3',
  };
  return map[name.toLowerCase().trim()] || '#CBD5E1';
}

type ShopifyVariant = {
  id: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: {name: string; value: string}[];
  price: {amount: string; currencyCode: string};
  compareAtPrice?: {amount: string; currencyCode: string} | null;
  image?: {url: string; altText?: string; width?: number; height?: number};
};

export async function loader({context, params}: Route.LoaderArgs) {
  const handle = params.productHandle;
  if (!handle) throw new Response('Not found', {status: 404});

  const data = await context.storefront.query(PRODUCT_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {handle},
  });

  if (!data.product) throw new Response('Not found', {status: 404});

  const product = data.product as any;

  const recommendations = context.storefront
    .query(RECOMMENDATIONS_QUERY, {cache: context.storefront.CacheShort(), variables: {handle}})
    .catch(() => ({productRecommendations: []}));

  return {
    product,
    recommendations,
    seo: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description?.slice(0, 160) || '',
      image: product.featuredImage?.url,
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string; image?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const variantId = formData.get('variantId');

  if (typeof variantId !== 'string' || !variantId) {
    return Response.json({ok: false, message: 'Variant missing'}, {status: 400});
  }

  const cart = await context.cart.get();
  if (!cart?.id) {
    await context.cart.create({lines: [{merchandiseId: variantId, quantity: 1}]});
    return Response.json({ok: true});
  }

  await context.cart.addLines([{merchandiseId: variantId, quantity: 1}]);
  return Response.json({ok: true});
}

export default function ProductPage({loaderData}: Route.ComponentProps) {
  const lang = useLocale();
  const {product, recommendations} = loaderData;
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const variants: ShopifyVariant[] = product.variants?.nodes || [];
  const options: {name: string; values: string[]}[] = product.options || [];
  const images = product.images?.nodes || [];
  const allImages = images.length > 0 ? images : (product.featuredImage ? [product.featuredImage] : []);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variants[0]?.selectedOptions?.forEach((o: any) => { initial[o.name] = o.value; });
    return initial;
  });
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');

  const handleCartClick = () => {
    if (cartState === 'added' || !currentVariant?.availableForSale) return;
    setCartState('added');
    setTimeout(() => setCartState('idle'), 2000);
  };

  const currentVariant = useMemo(() => {
    if (!options.length || !variants.length) return variants[0];
    const sel = Object.entries(selectedOptions);
    if (!sel.length) return variants[0];
    return variants.find((v) =>
      sel.every(([name, value]) =>
        v.selectedOptions?.some((o) => o.name === name && o.value === value),
      ),
    ) || variants[0];
  }, [options, variants, selectedOptions]);

  const hasDiscount = currentVariant?.compareAtPrice?.amount
    && Number(currentVariant.compareAtPrice.amount) > Number(currentVariant.price.amount);

  const featuredImage = currentVariant?.image || product.featuredImage;
  const variantImageUrl = currentVariant?.image?.url;
  const galleryImages = currentVariant?.image && variantImageUrl
    ? [currentVariant.image, ...allImages.filter((i: any) => i.url !== variantImageUrl)]
    : allImages;

  if (isLoading) return <PdpSkeleton />;

  const schemaData = currentVariant ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description?.slice(0, 200),
    image: product.featuredImage?.url,
    offers: {
      '@type': 'Offer',
      price: currentVariant.price?.amount,
      priceCurrency: currentVariant.price?.currencyCode,
      availability: currentVariant.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  } : null;

  return (
    <>
      {schemaData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaData)}} />
      )}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-4">
        <Link to="/collections" className="text-xs font-bold text-[#78c13b] uppercase tracking-widest hover:underline">
          &larr; {t('pdp.back_to_catalog', lang)}
        </Link>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 px-4 pb-20 lg:pb-14">
        <ProductGallery images={galleryImages} title={product.title} hasDiscount={!!hasDiscount} />

        <div className="flex flex-col">
          {product.productType && (
            <span className="text-[10px] font-black text-[#78c13b] uppercase tracking-[0.3em] mb-2">{product.productType}</span>
          )}
          <h1 className="text-3xl font-black text-[#2d4a13] lg:text-5xl">{product.title}</h1>

          <div className="mt-4 flex items-center space-x-3">
            {hasDiscount ? (
              <>
                <p className="text-2xl font-black text-[#78c13b]">&euro;{Number(currentVariant.price.amount).toFixed(2)}</p>
                <p className="text-lg font-bold text-gray-400 line-through">&euro;{Number(currentVariant.compareAtPrice!.amount).toFixed(2)}</p>
                <span className="bg-[#ff5a24] text-white text-[10px] font-black px-2 py-1 rounded-full">
                  -{Math.round((1 - Number(currentVariant.price.amount) / Number(currentVariant.compareAtPrice!.amount)) * 100)}%
                </span>
              </>
            ) : (
              <p className="text-2xl font-black text-[#78c13b]">
                &euro;{currentVariant ? Number(currentVariant.price.amount).toFixed(2) : '0.00'}
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">{product.description}</p>
          )}

          {variants.length > 0 && options.some((o) => o.values.length > 1) && (
            <div className="mt-6 space-y-3">
              <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3">{t('pdp.variants_available', lang)}</p>
              {variants.map((v) => {
                const optLabel = v.selectedOptions?.filter((o: any) => o.value !== 'Default Title').map((o: any) => o.value).join(' / ') || v.id;
                const isSelected = currentVariant?.id === v.id;
                const hasDiscount = v.compareAtPrice?.amount && Number(v.compareAtPrice.amount) > Number(v.price.amount);
                const isColor = options.some((o) => /colou?r/i.test(o.name) && v.selectedOptions?.some((so: any) => so.name === o.name));
                const pricePerUnit = v.price?.amount ? Number(v.price.amount) / (v.quantityAvailable || 1) : 0;

                return (
                  <button
                    key={v.id}
                    disabled={!v.availableForSale}
                    onClick={() => {
                      const sel: Record<string, string> = {};
                      v.selectedOptions?.forEach((o: any) => { sel[o.name] = o.value; });
                      setSelectedOptions(sel);
                    }}
                    className={`w-full text-left border-2 rounded-2xl p-4 transition-all ${
                      isSelected
                        ? 'border-[#78c13b] bg-[#78c13b]/5 shadow-md'
                        : v.availableForSale
                        ? 'border-gray-100 bg-white hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isColor && (
                          <div className="w-8 h-8 rounded-full border-2 border-gray-200 shrink-0" style={{backgroundColor: getColorHex(optLabel)}} />
                        )}
                        <div>
                          <p className={`font-bold text-base ${isSelected ? 'text-[#78c13b]' : 'text-[#2d4a13]'}`}>{optLabel}</p>
                          <p className={`text-xs font-medium ${v.availableForSale ? 'text-green-600' : 'text-red-400'}`}>
                            {v.availableForSale ? (v.quantityAvailable ? `${v.quantityAvailable} ${t('pdp.pieces_available', lang)}` : t('pdp.available', lang)) : t('pdp.sold_out', lang)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {hasDiscount ? (
                            <>
                              <p className="text-lg font-black text-[#78c13b]">&euro;{Number(v.price.amount).toFixed(2)}</p>
                              <p className="text-sm font-bold text-gray-400 line-through">&euro;{Number(v.compareAtPrice!.amount).toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-lg font-black text-[#2d4a13]">&euro;{Number(v.price.amount).toFixed(2)}</p>
                          )}
                        </div>
                        {pricePerUnit > 0 && Number(v.price.amount) !== pricePerUnit && (
                          <p className="text-xs text-gray-400 mt-0.5">&euro;{pricePerUnit.toFixed(2)} / {lang === 'en' ? 'piece' : 'pezzo'}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentVariant && (
            <CartForm
              route="/cart"
              action={CartForm.ACTIONS.LinesAdd}
              inputs={{lines: [{merchandiseId: currentVariant.id, quantity: 1}]}}
            >
              <button
                type="submit"
                disabled={!currentVariant.availableForSale}
                onClick={handleCartClick}
                className={`w-full mt-6 font-black py-4 rounded-xl transition-all text-sm uppercase tracking-widest flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  cartState === 'added'
                    ? 'bg-green-600 text-white scale-[1.02] shadow-lg'
                    : 'bg-[#78c13b] text-white hover:bg-[#68a632] shadow-lg shadow-[#78c13b]/20'
                }`}
              >
                {cartState === 'added' ? (
                  <Check size={20} className="animate-bounce" />
                ) : null}
                <span>{cartState === 'added' ? t('product_card.added', lang) : currentVariant.availableForSale ? t('quick_view.add_to_cart', lang) : t('quick_view.unavailable', lang)}</span>
              </button>
            </CartForm>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
            <img src="/images/shipping-quality-badge.png" alt="" className="h-14 w-auto" />
          </div>

          <SocialShare productName={product.title} />
        </div>
      </div>

      {/* Sowing + Description two-column section */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 pb-10 items-start">
          <div>
            <ProductTabs descriptionHtml={product.descriptionHtml} />
          </div>
          <div className="space-y-6 lg:space-y-8 lg:sticky lg:top-24">
            <SowingCalendar
              semenzaio={product.semina_semenzaio?.value}
              aperto={product.semina_aperto?.value}
              raccolta={product.semina_raccolta?.value}
            />
            <div className="p-4 lg:p-6 bg-[#2d4a13] text-white rounded-2xl lg:rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 hidden lg:block">
                <Leaf size={100} />
              </div>
              <h4 className="font-black text-base lg:text-lg mb-2 relative z-10">{t('pdp.expert_advice', lang)}</h4>
              <p className="text-white/70 text-xs lg:text-sm leading-relaxed relative z-10">
                {product.consiglio_esperto?.value || t('pdp.expert_fallback', lang)}
              </p>
            </div>
            <SpecsGrid product={product} />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <Await resolve={recommendations}>
          {(recData: any) => {
            const recs = recData?.productRecommendations?.filter((r: any) => r.id !== product.id) || [];
            if (!recs.length) return null;
            return (
              <section className="mx-auto max-w-7xl px-4 py-10 border-t border-gray-100">
                <h2 className="text-2xl font-black text-[#2d4a13] mb-6">{t('pdp.you_may_like', lang)}</h2>
                <div className="flex lg:hidden overflow-x-auto space-x-4 snap-x pb-4">
                  {recs.slice(0, 4).map((rec: any) => (
                    <div key={rec.id} className="min-w-[75vw] snap-start">
                      <ProductCard
                        product={{
                          id: rec.id,
                          handle: rec.handle,
                          title: rec.title,
                          price: Number(rec.priceRange?.minVariantPrice?.amount || 0),
                          currencyCode: rec.priceRange?.minVariantPrice?.currencyCode || 'EUR',
                          image: rec.featuredImage ? {url: rec.featuredImage.url, altText: rec.featuredImage.altText} : undefined,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="hidden lg:grid grid-cols-4 gap-6">
                  {recs.slice(0, 4).map((rec: any) => (
                    <ProductCard
                      key={rec.id}
                      product={{
                        id: rec.id,
                        handle: rec.handle,
                        title: rec.title,
                        price: Number(rec.priceRange?.minVariantPrice?.amount || 0),
                        currencyCode: rec.priceRange?.minVariantPrice?.currencyCode || 'EUR',
                        image: rec.featuredImage ? {url: rec.featuredImage.url, altText: rec.featuredImage.altText} : undefined,
                      }}
                    />
                  ))}
                </div>
              </section>
            );
          }}
        </Await>
      </Suspense>

      <MobileStickyAddToCart
        variantId={currentVariant?.id}
        price={Number(currentVariant?.price?.amount || 0)}
        currencyCode={currentVariant?.price?.currencyCode || 'EUR'}
        enabled={!!currentVariant?.availableForSale}
      />
    </>
  );
}

function PdpSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-[4/5] bg-gray-100 rounded-3xl" />
        <div>
          <div className="h-6 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
          <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="h-14 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
