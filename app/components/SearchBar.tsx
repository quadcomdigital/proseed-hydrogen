import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {Search, X, ChevronDown} from 'lucide-react';
import {SEARCH_PRODUCT_FRAGMENT} from '~/lib/fragments';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url: string; altText?: string};
  priceRange?: {minVariantPrice: {amount: string; currencyCode: string}};
}

interface CategoryOption {
  name: string;
  handle: string;
}

const SEARCH_QUERY = `query SearchProducts($query: String!, $first: Int!) {
  search(query: $query, first: $first, types: [PRODUCT]) {
    nodes {
      ... on Product {
        ...SearchProduct
      }
    }
  }
}
${SEARCH_PRODUCT_FRAGMENT}`;

const PREDEFINED_CATEGORIES: CategoryOption[] = [
  {name: 'Tutti', handle: ''},
  {name: 'Semi Orto', handle: 'orto'},
  {name: 'Erbe Aromatiche', handle: 'erbe-aromatiche'},
  {name: 'Fiori', handle: 'fiori'},
  {name: 'Giardino', handle: 'giardino'},
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryOption>(PREDEFINED_CATEGORIES[0]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCatOpen(false);
    };
    const handleOpenMobile = () => setIsMobileOpen(true);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('open-mobile-search', handleOpenMobile);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('open-mobile-search', handleOpenMobile);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (query.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setLoading(true);
      setIsOpen(true);
      try {
        const q = selectedCat.handle
          ? `${query} AND (product_type:${selectedCat.handle})`
          : query;
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({search: q, category: selectedCat.handle}),
        });
        const data: any = await res.json();
        if (data?.products) setResults(data.products);
        else if (data?.data?.search?.nodes) setResults(data.data.search.nodes);
        else setResults([]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(performSearch, 300);
    return () => clearTimeout(t);
  }, [query, selectedCat]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
          <div className="flex items-center p-4 border-b border-gray-100 gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cerca prodotti..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#78c13b]/20"
              />
              {query.length > 0 && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 rounded-full text-gray-500">
                  <X size={12} />
                </button>
              )}
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="text-sm font-bold text-gray-500">Annulla</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="animate-spin w-8 h-8 border-2 border-[#78c13b] border-t-transparent rounded-full mb-4" />
                <p className="text-sm font-medium">Sto cercando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Risultati</h3>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    onClick={handleClose}
                    className="flex items-center space-x-4 p-2 active:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      {product.featuredImage?.url ? (
                        <img src={product.featuredImage.url} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><Search size={20} className="text-gray-300" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{product.title}</h4>
                      <p className="text-[#78c13b] font-black text-sm mt-1">
                        &euro;{product.priceRange?.minVariantPrice?.amount
                          ? Number(product.priceRange.minVariantPrice.amount).toFixed(2)
                          : '0.00'}
                      </p>
                    </div>
                    <ChevronDown size={16} className="-rotate-90 text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Nessun risultato</h3>
                <p className="text-sm text-gray-500">Prova a cercare qualcos&apos;altro</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Popolari</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Pomodori', 'Basilico', 'Zucchine', 'Attrezzi', 'Concime'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-50 rounded-full text-sm font-medium text-gray-600 active:bg-[#78c13b]/10 active:text-[#78c13b]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative hidden md:flex flex-1 max-w-2xl">
        <div className="flex items-center w-full border-2 border-[#78c13b] rounded-full focus-within:ring-4 focus-within:ring-[#78c13b1a] transition-all bg-white relative">
          <div className="relative h-full" ref={catRef}>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold border-r border-gray-200 hover:bg-gray-100 transition-colors shrink-0 h-full rounded-l-full"
            >
              <span className="max-w-[100px] truncate">{selectedCat.name}</span>
              <ChevronDown size={14} />
            </button>
            {isCatOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCat(cat); setIsCatOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCat.name === cat.name ? 'text-[#78c13b] font-bold' : 'text-gray-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Cerca sementi, attrezzi o consigli..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 2 && setIsOpen(true)}
            className="flex-1 px-5 py-2.5 text-sm outline-none ring-0 border-0 bg-white text-gray-700 placeholder:text-gray-400"
          />
          <button className="px-6 py-2.5 bg-white text-[#78c13b] hover:scale-110 transition-transform rounded-r-full" aria-label="Cerca">
            <Search size={20} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin inline-block w-5 h-5 border-2 border-[#78c13b] border-t-transparent rounded-full" />
                <p className="mt-2">Ricerca in corso...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-4 space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    onClick={handleClose}
                    className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.featuredImage?.url ? (
                        <img src={product.featuredImage.url} alt={product.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <Search size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#2d4a13] group-hover:text-[#78c13b] transition-colors line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        &euro;{product.priceRange?.minVariantPrice?.amount
                          ? Number(product.priceRange.minVariantPrice.amount).toFixed(2)
                          : '0.00'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-8 text-center text-gray-500">
                <Search size={32} className="mx-auto opacity-20 mb-2" />
                <p>Nessun prodotto trovato per &quot;{query}&quot;</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
