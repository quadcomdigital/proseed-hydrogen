import {Form} from 'react-router';

export default function AccountLogin() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 lg:py-14">
      <h1 className="text-3xl font-black text-emerald-900">Login account</h1>
      <p className="mt-3 text-sm text-emerald-900/75">
        Placeholder temporaneo: integriamo il Customer Account flow completo nel prossimo step.
      </p>

      <Form className="mt-6 grid gap-3 rounded-2xl border border-emerald-100 bg-white p-5">
        <input type="email" placeholder="Email" className="rounded-xl border border-emerald-200 px-4 py-3" />
        <button
          type="button"
          className="rounded-xl bg-lime-600 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          Continua
        </button>
      </Form>
    </div>
  );
}
