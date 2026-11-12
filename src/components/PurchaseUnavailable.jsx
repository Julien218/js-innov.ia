import { Link } from 'react-router-dom';

export default function PurchaseUnavailable() {
  return (
    <main className="min-h-screen px-6 py-24 text-white">
      <section className="mx-auto max-w-xl space-y-6" aria-labelledby="purchase-status">
        <p>JS-Innov.IA · L'IA amplifiée par l'humain</p>
        <h1 id="purchase-status" className="text-3xl font-bold">Paiement en ligne indisponible</h1>
        <p>Aucun paiement ni aucune commande ne sont confirmés sur cette page. Contactez le studio pour vérifier votre demande.</p>
        <p>Ne communiquez pas vos coordonnées bancaires dans un formulaire ou par e-mail.</p>
        <Link className="inline-block rounded border border-white/40 px-5 py-3" to="/saas-contact">Contacter le studio</Link>
      </section>
    </main>
  );
}
