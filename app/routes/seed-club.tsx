import {Link} from 'react-router';
import {Crown, Sparkles} from 'lucide-react';

export default function SeedClub() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:py-24 text-center">
      <div className="mx-auto w-20 h-20 bg-[#78c13b]/10 rounded-full flex items-center justify-center mb-6">
        <Crown size={40} className="text-[#78c13b]" />
      </div>
      <h1 className="text-4xl font-black text-[#2d4a13] mb-4">Seed Club</h1>
      <p className="text-gray-500 max-w-xl mx-auto mb-8">
        L&apos;abbonamento ai semi: ricevi ogni mese le variet&agrave; migliori. Presto disponibile.
      </p>
      <Link to="/collections" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#78c13b] text-white font-bold rounded-2xl hover:bg-[#68a632] transition-all shadow-lg">
        <Sparkles size={18} />
        <span>Esplora il catalogo</span>
      </Link>
    </div>
  );
}
