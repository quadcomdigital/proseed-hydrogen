import {Link} from 'react-router';

export function loader() {
  throw new Response('Not found', {status: 404});
}

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <h1 className="text-6xl font-black text-emerald-900 lg:text-8xl">404</h1>
      <h2 className="mt-4 text-2xl font-black text-lime-700">Pagina non trovata</h2>
      <p className="mt-3 text-base text-emerald-950/70">
        La pagina che stai cercando non esiste o &egrave; stata spostata.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-2xl bg-lime-600 px-7 py-4 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-lime-700"
      >
        Torna alla home
      </Link>
    </div>
  );
}
