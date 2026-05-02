import {useState, useEffect} from 'react';
import {Share2} from 'lucide-react';

export default function SocialShare({productName}: {productName: string}) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedName = encodeURIComponent(productName);
  const shareLinks = [
    {name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:text-[#1877F2]'},
    {name: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodedName}&url=${encodedUrl}`, color: 'hover:text-black'},
    {name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:text-[#0A66C2]'},
    {name: 'Email', href: `mailto:?subject=${encodedName}&body=${encodedUrl}`, color: 'hover:text-gray-600'},
  ];

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="flex items-center space-x-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
        <Share2 size={16} />
        <span>Condividi:</span>
      </div>
      <div className="flex items-center space-x-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 text-xs font-black ${link.color} transition-all hover:scale-110`}
            title={link.name}
          >
            {link.name[0]}
          </a>
        ))}
      </div>
    </div>
  );
}
