import {Link} from 'react-router';
import {ChevronRight, BookOpen, Search, Mail, ArrowRight} from 'lucide-react';
import type {Route} from './+types/($locale).blog._index';
import BlogCard from '~/components/BlogCard';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

const BLOG_INDEX_QUERY = `#graphql
  query BlogIndex(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
      title
      articles(first: 12) {
        nodes {
          id
          title
          handle
          excerpt
          contentHtml
          publishedAt
          image { url altText }
        }
      }
    }
  }
`;

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;
  const data = await storefront.query(BLOG_INDEX_QUERY, {
    cache: storefront.CacheShort(),
  });

  const articles = data?.blog?.articles?.nodes || [];
  return {articles};
}

export default function BlogPage({loaderData}: Route.ComponentProps) {
  const {articles} = loaderData;
  const lang = useLocale();
  const heroTitle = t('blog.hero_title', lang);
  const heroParts = heroTitle.split(' ');
  const heroLast = heroParts.pop();
  interface Article {id: string; handle: string; title: string; excerpt?: string; image?: {url: string}; publishedAt: string; tags?: string[]}
  const posts = (articles as Article[]).map((post) => ({
    id: post.id,
    slug: post.handle,
    title: post.title,
    excerpt: post.excerpt || '',
    image: post.image?.url || '/images/placeholder.svg',
    date: new Date(post.publishedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {day: 'numeric', month: 'long', year: 'numeric'}),
    category: post.tags?.[0] || t('blog.blog_section_title', lang),
    readTime: t('blog.read_time', lang),
  }));

  const categories = [t('blog.all', lang), ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-[#1a2d0a] pt-8 pb-16 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#78c13b] rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#2d4a13] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#78c13b] rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-bold mb-6 lg:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#78c13b] animate-pulse" />
            <span>{t('blog.new_articles', lang)}</span>
          </div>

          <h1 className="text-3xl lg:text-7xl font-black text-white mb-4 lg:mb-6 tracking-tight">
            {heroParts.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#78c13b] to-[#a3e635]">{heroLast}</span>
          </h1>

          <p className="text-gray-300 text-base lg:text-xl max-w-2xl mx-auto mb-8 lg:mb-10 leading-relaxed">
            {t('blog.hero_desc', lang)}
          </p>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-[#78c13b] rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl">
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t('blog.search_placeholder', lang)}
                className="w-full px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
              <button className="bg-[#2d4a13] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#78c13b] transition-colors">
                {t('blog.search_button', lang)}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[60px] lg:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-2 py-3 lg:py-4 min-w-max">
            {categories.map((cat: string, i: number) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  i === 0
                    ? 'bg-[#2d4a13] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#78c13b]/10 hover:text-[#2d4a13]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        {posts.length > 0 ? (
          <>
            {posts[0] && (
              <div className="mb-10 lg:mb-20">
                <Link to={`/blog/${posts[0].slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-7 relative aspect-[16/10] rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                      src={posts[0].image}
                      alt={posts[0].title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 70vw"
                    />
                  </div>
                  <div className="lg:col-span-5 lg:pl-8">
                    <div className="flex items-center space-x-3 mb-4 lg:mb-6">
                      <span className="px-3 py-1 bg-[#78c13b] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#78c13b]/20">
                        {t('blog.featured', lang)}
                      </span>
                      <span className="text-gray-400 text-sm font-medium">{posts[0].date}</span>
                    </div>
                    <h2 className="text-2xl lg:text-5xl font-black text-[#2d4a13] mb-4 lg:mb-6 leading-tight group-hover:text-[#78c13b] transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 line-clamp-3">
                      {posts[0].excerpt}
                    </p>
                    <div className="flex items-center space-x-3 text-[#2d4a13] font-black text-sm uppercase tracking-widest group/btn">
                      <span className="border-b-2 border-[#78c13b] pb-1">{t('blog.read_article', lang)}</span>
                      <div className="w-8 h-8 rounded-full bg-[#78c13b]/10 flex items-center justify-center group-hover/btn:bg-[#78c13b] group-hover/btn:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="my-10 lg:my-20 bg-[#2d4a13] rounded-[24px] lg:rounded-[32px] p-6 lg:p-16 relative overflow-hidden text-center lg:text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#78c13b] rounded-full blur-[80px] opacity-20" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#78c13b] font-bold mb-4">
                    <Mail size={20} />
                    <span className="uppercase tracking-widest text-xs">{t('blog.newsletter', lang)}</span>
                  </div>
                  <h3 className="text-2xl lg:text-4xl font-black text-white mb-4">
                    {t('blog.newsletter_desc', lang)}
                  </h3>
                  <p className="text-gray-300 text-base lg:text-lg">
                    {t('blog.newsletter_subtitle', lang)}
                  </p>
                </div>
                <div className="bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder={t('blog.newsletter_email', lang)}
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:bg-white/20 transition-colors"
                    />
                    <button className="bg-[#78c13b] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#65a332] transition-colors shadow-lg shadow-[#78c13b]/20">
                      {t('blog.newsletter_cta', lang)}
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-3 text-center sm:text-left pl-2">
                    {t('blog.newsletter_nospam', lang)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 lg:mb-10">
              <h3 className="text-xl lg:text-2xl font-black text-[#2d4a13]">{t('blog.latest', lang)}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 lg:gap-y-12">
              {posts.slice(1).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length > 12 && (
              <div className="text-center mt-20">
                <button className="group px-8 py-4 bg-white border-2 border-[#2d4a13] text-[#2d4a13] rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#2d4a13] hover:text-white transition-all shadow-lg hover:shadow-xl">
                  <span className="flex items-center space-x-2">
                    <span>{t('blog.load_more', lang)}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[32px] shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-400 mb-2">{t('blog.no_articles', lang)}</h2>
            <p className="text-gray-400 max-w-md mx-auto">{t('blog.no_articles_desc', lang)}</p>
          </div>
        )}
      </section>
    </div>
  );
}
