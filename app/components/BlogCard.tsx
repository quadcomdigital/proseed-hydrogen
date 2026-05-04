import {Link} from 'react-router';
import {Calendar, Clock, ChevronRight} from 'lucide-react';
import {useLocale} from '~/lib/locale';
import {t} from '~/lib/translations';

interface BlogPostCard {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

export default function BlogCard({post}: {post: BlogPostCard}) {
  const lang = useLocale();
  return (
    <article className="group cursor-pointer">
      <Link to={`/blog/${post.slug}`}>
        <div className="aspect-[16/10] overflow-hidden rounded-[32px] mb-8 relative">
          <img
            src={post.image}
            alt={post.title}
            width="600"
            height="375"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur text-[10px] font-black text-[#78c13b] uppercase tracking-widest rounded-full shadow-lg">
            {post.category}
          </div>
        </div>
        <div className="px-2 space-y-4">
          <div className="flex items-center space-x-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{post.date}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            {post.readTime && (
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{post.readTime}</span>
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-[#2d4a13] group-hover:text-[#78c13b] transition-colors leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-500 line-clamp-2 font-medium leading-relaxed">{post.excerpt}</p>
          <span className="flex items-center space-x-2 text-[#78c13b] font-black text-xs uppercase tracking-[0.2em] pt-2">
            <span>{t('blog.read_more', lang)}</span>
            <ChevronRight size={14} />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function BlogSection({posts = []}: {posts?: BlogPostCard[]}) {
  const lang = useLocale();
  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#2d4a13] lg:text-4xl">
          {t('blog.blog_section_title', lang)}
        </h2>
        <Link to="/blog" className="text-sm font-black uppercase tracking-[0.18em] text-[#78c13b]">
          {t('blog.read_all', lang)}
        </Link>
      </div>
      <div className="flex lg:hidden overflow-x-auto space-x-6 pb-4 -mx-4 px-4 snap-x">
        {posts.map((post) => (
          <div key={post.slug} className="min-w-[85vw] snap-start">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
      <div className="hidden lg:grid grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
