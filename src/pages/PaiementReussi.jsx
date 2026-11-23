import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileText, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

export default function PaiementReussi() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    document.title = 'Paiement confirmé | Js-Innov.IA';
    if (!sessionId) { setState({ status: 'error', data: null }); return; }
    fetch(`/api/shop/session?id=${encodeURIComponent(sessionId)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setState({ status: 'ok', data }))
      .catch(() => setState({ status: 'error', data: null }));
  }, [sessionId]);

  const data = state.data;
  const paid = data && (data.paymentStatus === 'paid' || data.paymentStatus === 'no_payment_required');

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center text-white">
      {state.status === 'loading' && <Loader2 className="mx-auto h-10 w-10 animate-spin" style={{ color: GOLD }} />}
      {state.status !== 'loading' && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14" style={{ color: paid ? '#34D399' : GOLD }} />
          <h1 className="mt-6 text-3xl font-black">{paid ? 'Merci, votre commande est confirmée !' : 'Commande reçue'}</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {data?.offerName ? <>Offre : <strong className="text-white">{data.offerName}</strong>. </> : null}
            {data?.email ? <>La facture est envoyée à <strong className="text-white">{data.email}</strong>. </> : 'Votre facture vous est envoyée par e-mail. '}
            Julien vous recontacte pour la mise en route.
          </p>
          {data?.amountTotal != null && <p className="mt-4 text-2xl font-black">{new Intl.NumberFormat('fr-BE', { style: 'currency', currency: (data.currency || 'eur').toUpperCase() }).format(data.amountTotal / 100)} <span className="text-sm text-white/40">TVAC</span></p>}
          {data?.invoiceUrl && <a href={data.invoiceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-black" style={{ borderColor: `${GOLD}55`, color: GOLD }}><FileText className="h-4 w-4" /> Voir ma facture</a>}
          {state.status === 'error' && <p className="mt-4 text-xs text-white/40">Le détail n’a pas pu être affiché, mais si Stripe a confirmé le paiement, votre facture arrive par e-mail.</p>}
          <div className="mt-10"><Link to="/" className="text-sm font-bold underline" style={{ color: GOLD }}>Retour à l’accueil</Link></div>
        </>
      )}
    </div>
  );
}
