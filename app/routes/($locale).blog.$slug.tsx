import {Link, useLocation} from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';
import {ChevronRight, Clock, ArrowLeft} from 'lucide-react';
import type {Route} from './+types/($locale).blog.$slug';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const BLOG_DETAIL_QUERY = `#graphql
  query BlogDetail(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
      articleByHandle(handle: $handle) {
        id
        title
        handle
        excerpt
        contentHtml
        publishedAt
        seo { title description }
        image { url altText }
        tags
      }
    }
  }
`;

export async function loader({context, params}: Route.LoaderArgs) {
  const handle = params.slug;
  if (!handle) throw new Response('Not found', {status: 404});

  const data = await context.storefront.query(BLOG_DETAIL_QUERY, {
    cache: context.storefront.CacheShort(),
    variables: {handle},
  });

  const article = data?.blog?.articleByHandle;
  if (!article) throw new Response('Not found', {status: 404});

  return {
    article,
    seo: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt?.slice(0, 160) || '',
      image: article.image?.url,
    },
  };
}

export const meta = ({data}: {data?: {seo?: {title?: string; description?: string}}}) => {
  if (!data?.seo) return [];
  return getSeoMeta(data.seo);
};

export default function PostPage({loaderData}: Route.ComponentProps) {
  const {article} = loaderData;
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState('');
  const lang = useLocale();
  const featuredImage = article.image?.url || '/images/placeholder.svg';
  const category = article.tags?.[0] || t('blog.blog_section_title', lang);
  const date = new Date(article.publishedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {day: 'numeric', month: 'long', year: 'numeric'});

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [location]);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt?.slice(0, 200) || '',
    image: article.image?.url,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: 'Proseed' },
  };

  return (
    <article className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(blogSchema)}} />
      <section className="relative pt-6 pb-8 lg:pt-8 lg:pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#78c13b] transition-colors uppercase">HOME</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-[#78c13b] transition-colors uppercase">BLOG</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 uppercase truncate max-w-[200px]">{article.title}</span>
          </div>

          <Link
            to={`/blog?category=${category}`}
            className="inline-block px-4 py-1.5 bg-[#78c13b]/10 text-[#78c13b] rounded-full text-xs font-black uppercase tracking-widest mb-4 lg:mb-6 hover:bg-[#78c13b]/20 transition-colors"
          >
            {category}
          </Link>

          <h1 className="text-3xl lg:text-5xl font-black text-[#2d4a13] leading-tight mb-6 lg:mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-gray-500 mb-0 lg:mb-8">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-[#78c13b]" />
              <span>{t('blog.read_time', lang)}</span>
            </div>
            <span>{date}</span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mb-8 lg:mb-16">
        <div className="aspect-[16/9] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl relative">
          <img
            src={featuredImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8 lg:gap-12">
          <div
            className="prose lg:prose-lg prose-green max-w-none text-black
              prose-headings:font-black prose-headings:text-[#2d4a13]
              prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-8 lg:prose-h2:mt-12 prose-h2:mb-4 lg:prose-h2:mb-6
              prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-6 lg:prose-h3:mt-8 prose-h3:mb-3 lg:prose-h3:mb-4
              prose-p:text-black prose-p:leading-relaxed
              prose-a:text-[#78c13b] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#2d4a13]
              prose-ul:my-6 prose-li:text-black
              prose-img:rounded-2xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{__html: article.contentHtml}}
          />

          <aside className="space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('blog.share', lang)}</h4>
              <div className="flex flex-col space-y-3">
                {currentUrl ? [
                  {label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, color: '#1877F2'},
                  {label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`, color: '#000'},
                  {label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, color: '#0A66C2'},
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-all flex items-center justify-between"
                  >
                    <span>{s.label}</span>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: s.color}}>
                      <span className="text-white text-[10px] font-black">{s.label[0]}</span>
                    </span>
                  </a>
                )) : null}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 pt-16 border-t border-gray-100">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-[#78c13b] font-black text-sm uppercase tracking-widest hover:text-[#2d4a13] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t('blog.back', lang)}</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
