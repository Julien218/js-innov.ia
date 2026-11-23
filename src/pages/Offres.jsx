import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, CreditCard, FileText, Loader2, Lock, MessageCircle, Sparkles, X } from 'lucide-react';
import {
  BILLING_LABELS, BRAND, OFFER_FAMILIES, OFFERS, SIGNELYA_PLAYER, SIGNELYA_SETUP,
  firstPaymentAmount, formatPrice, isPayableOnline,
} from '@/config/offers';

const GOLD = '#D4AF37';

const quoteLink = (offer) => `${BRAND.whatsapp}?text=${encodeURIComponent(`Bonjour Julien, je souhaite un devis pour « ${offer.name} » (${OFFER_FAMILIES.find((f) => f.id === offer.family)?.label}).`)}`;

function PriceBlock({ offer, billing }) {
  if (offer.oneTime) return <p className="text-3xl font-black text-white">{formatPrice(offer.oneTime)}<span className="ml-1 text-sm font-semibold text-white/40">HTVA / unité</span></p>;
  if (offer.prices) {
    const value = offer.prices[billing] ?? offer.prices.monthly;
    const period = offer.prices[billing] && billing === 'yearly' ? '/an' : '/mois';
    return <p className="text-3xl font-black text-white">{formatPrice(value)}<span className="ml-1 text-sm font-semibold text-white/40">HTVA {period}</span></p>;
  }
  if (offer.fromPrice) return <p className="text-3xl font-black text-white"><span className="mr-1 text-sm font-semibold text-white/40">dès</span>{formatPrice(offer.fromPrice)}<span className="ml-1 text-sm font-semibold text-white/40">HTVA</span></p>;
  return <p className="text-2xl font-black text-white">{offer.priceLabel}</p>;
}

function CheckoutDialog({ offer, billing, onClose }) {
  const [quantity, setQuantity] = useState(offer.quantity?.min ?? 1);
  const [email, setEmail] = useState('');
  const [accept, setAccept] = useState(false);
  const [state, setState] = useState({ status: 'idle', error: '' });
  const total = firstPaymentAmount(offer.id, billing, quantity);
  const recurring = offer.prices?.[billing];
  const setup = offer.setup || (offer.family === 'signelya' && !offer.oneTime ? SIGNELYA_SETUP[billing] : null);
  const player = offer.family === 'signelya' && !offer.setup && !offer.oneTime && billing === 'monthly' ? SIGNELYA_PLAYER : null;

  const pay = async (event) => {
    event.preventDefault();
    if (!accept || state.status === 'loading') return;
    setState({ status: 'loading', error: '' });
    try {
      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, billing, quantity, email, acceptTerms: true }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || 'Paiement indisponible.');
      window.location.assign(data.url);
    } catch (error) {
      setState({ status: 'error', error: error.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={onClose}>
      <form onSubmit={pay} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0d14] p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: GOLD }}>Commande sécurisée</p>
            <h2 id="checkout-title" className="mt-1 text-xl font-black">{offer.family === 'signelya' ? `Signelya ${offer.name}` : offer.name}</h2>
            {!offer.oneTime && <p className="mt-1 text-xs text-white/45">{BILLING_LABELS[billing]}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="rounded-full p-1 text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <dl className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm">
          {recurring != null && <div className="flex justify-between"><dt className="text-white/55">Abonnement</dt><dd>{formatPrice(recurring)} {billing === 'yearly' ? '/an' : '/mois'}</dd></div>}
          {setup && <div className="flex justify-between"><dt className="text-white/55">{setup.label}</dt><dd>{formatPrice(setup.amount)}</dd></div>}
          {player && <div className="flex justify-between"><dt className="text-white/55">{player.label}</dt><dd>{formatPrice(player.amount)}</dd></div>}
          {billing === 'yearly' && offer.family === 'signelya' && !offer.setup && !offer.oneTime && <div className="flex justify-between"><dt className="text-white/55">Player Signelya</dt><dd className="text-emerald-300">offert</dd></div>}
          {offer.oneTime && (
            <div className="flex items-center justify-between">
              <dt className="text-white/55"><label htmlFor="qty">Quantité</label></dt>
              <dd><input id="qty" type="number" min={offer.quantity?.min ?? 1} max={offer.quantity?.max ?? 1} value={quantity} onChange={(event) => setQuantity(Math.max(offer.quantity?.min ?? 1, Math.min(offer.quantity?.max ?? 1, Number(event.target.value) || 1)))} className="w-20 rounded-lg border border-white/15 bg-black px-2 py-1 text-right" /></dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/8 pt-2 font-black"><dt>Premier paiement</dt><dd>{total != null ? formatPrice(total) : '—'} HTVA</dd></div>
          <p className="text-[11px] text-white/40">TVA calculée au paiement selon votre adresse et votre numéro de TVA.</p>
        </dl>

        <label className="mt-4 block text-xs font-semibold text-white/60">E-mail de facturation (facultatif, modifiable chez Stripe)
          <input type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-white/12 bg-black px-3 py-2 text-sm text-white" />
        </label>
        <label className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/60">
          <input type="checkbox" checked={accept} onChange={(event) => setAccept(event.target.checked)} className="mt-0.5" required />
          <span>J’accepte les <Link to="/saas-cgv" target="_blank" className="underline" style={{ color: GOLD }}>conditions générales de vente</Link> et la <Link to="/saas-confidentialite" target="_blank" className="underline" style={{ color: GOLD }}>politique de confidentialité</Link>.</span>
        </label>

        {state.status === 'error' && <p role="alert" className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{state.error}</p>}

        <button type="submit" disabled={!accept || state.status === 'loading'} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black transition disabled:opacity-40" style={{ background: `linear-gradient(135deg, ${GOLD}, #F5D77A)` }}>
          {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Payer avec Stripe
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/35"><FileText className="h-3.5 w-3.5" /> Facture envoyée automatiquement par e-mail</p>
      </form>
    </div>
  );
}

function OfferCard({ offer, family, billing, onBuy, index }) {
  const payable = isPayableOnline(offer);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}
      className="relative flex flex-col rounded-3xl border bg-white/[0.025] p-6"
      style={{ borderColor: offer.popular ? `${family.color}66` : 'rgba(255,255,255,0.08)' }}
    >
      {offer.popular && <span className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black" style={{ background: family.color }}>Le plus choisi</span>}
      <h3 className="text-lg font-black text-white">{offer.name}</h3>
      <p className="mt-1 min-h-[2.5rem] text-sm text-white/50">{offer.tagline}</p>
      <div className="mt-4"><PriceBlock offer={offer} billing={billing} /></div>
      {offer.recurringLabel && <p className="mt-1 text-xs text-white/40">{offer.recurringLabel}</p>}
      {offer.setup && <p className="mt-1 text-xs text-white/40">+ {offer.setup.label.toLowerCase()} : {formatPrice(offer.setup.amount)}</p>}
      <ul className="mt-5 flex-1 space-y-2">
        {offer.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-white/70"><Check className="mt-0.5 h-4 w-4 flex-none" style={{ color: family.color }} />{feature}</li>)}
      </ul>
      <div className="mt-6">
        {payable && <button type="button" onClick={() => onBuy(offer)} className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black" style={{ background: family.color }}><CreditCard className="h-4 w-4" /> Commander et payer</button>}
        {!payable && offer.externalUrl && <a href={offer.externalUrl} className="flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-black" style={{ borderColor: `${family.color}55`, color: family.color }}>Démarrer sur l’application <ArrowUpRight className="h-4 w-4" /></a>}
        {!payable && offer.linkFamily && <a href={`#${offer.linkFamily}`} className="flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-black" style={{ borderColor: `${family.color}55`, color: family.color }}>Voir les Packs Créa</a>}
        {!payable && !offer.externalUrl && !offer.linkFamily && <a href={quoteLink(offer)} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-black" style={{ borderColor: `${family.color}55`, color: family.color }}><MessageCircle className="h-4 w-4" /> Demander un devis</a>}
      </div>
    </motion.article>
  );
}

export default function Offres() {
  const [billing, setBilling] = useState('yearly');
  const [selected, setSelected] = useState(null);
  const [params] = useSearchParams();
  const cancelled = params.get('annule');

  useEffect(() => {
    document.title = 'Offres & tarifs | Js-Innov.IA';
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, []);

  const grouped = useMemo(() => OFFER_FAMILIES.map((family) => ({ family, offers: OFFERS.filter((offer) => offer.family === family.id) })), []);

  return (
    <div className="px-5 pb-24 pt-16 text-white">
      <header className="mx-auto max-w-4xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em]" style={{ borderColor: `${GOLD}40`, color: GOLD }}><Sparkles className="h-3.5 w-3.5" /> Offres & tarifs</p>
        <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Choisissez, payez, <span className="text-gold-gradient">c’est lancé.</span></h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55">Toutes les solutions {BRAND.name}, avec leurs prix. Les abonnements se paient en ligne par Stripe, la facture arrive par e-mail et notre équipe démarre aussitôt.</p>
      </header>

      {cancelled && <p role="status" className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-white/60">Paiement annulé : rien n’a été débité. Vous pouvez reprendre quand vous voulez.</p>}

      <nav aria-label="Familles d’offres" className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
        {OFFER_FAMILIES.map((family) => <a key={family.id} href={`#${family.id}`} className="rounded-full border px-4 py-2 text-xs font-bold" style={{ borderColor: `${family.color}40`, color: family.color }}>{family.label}</a>)}
      </nav>

      {grouped.map(({ family, offers }) => (
        <section key={family.id} id={family.id} className="mx-auto mt-24 max-w-6xl scroll-mt-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: family.color }}>{family.kicker}</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">{family.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{family.description}</p>
              {family.url && <a href={family.url} className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: family.color }}>Découvrir l’application <ArrowUpRight className="h-4 w-4" /></a>}
            </div>
            {family.id === 'signelya' && (
              <div role="group" aria-label="Formule de paiement" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-bold">
                {['yearly', 'monthly'].map((value) => (
                  <button key={value} type="button" aria-pressed={billing === value} onClick={() => setBilling(value)} className="rounded-full px-4 py-2 transition" style={billing === value ? { background: family.color, color: '#000' } : { color: 'rgba(255,255,255,0.6)' }}>
                    {value === 'yearly' ? 'Annuel · Player offert' : 'Mensuel sans engagement'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {family.steps && (
            <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {family.steps.map((step, index) => <li key={step} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm font-semibold text-white/75"><span className="mr-2 font-black" style={{ color: family.color }}>0{index + 1}</span>{step}</li>)}
            </ol>
          )}

          {family.id === 'signelya' && (
            <p className="mt-6 text-xs text-white/45">Mise en service : {formatPrice(SIGNELYA_SETUP.yearly.amount)} en annuel, {formatPrice(SIGNELYA_SETUP.monthly.amount)} en mensuel (+ Player {formatPrice(SIGNELYA_PLAYER.amount)}). Fixation des écrans par notre installateur partenaire, convenue directement avec vous.</p>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => <OfferCard key={offer.id} offer={offer} family={family} billing={billing} onBuy={setSelected} index={index} />)}
          </div>
        </section>
      ))}

      <section className="mx-auto mt-24 max-w-3xl rounded-3xl border p-8 text-center" style={{ borderColor: `${GOLD}30`, background: 'rgba(212,175,55,0.04)' }}>
        <h2 className="text-2xl font-black">Un besoin qui sort des cases ?</h2>
        <p className="mt-3 text-sm text-white/55">Parlez-en directement avec Julien : nous partons de votre problème pour construire la solution.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black" style={{ background: '#25D366' }}><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          <Link to="/saas-contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white">Formulaire de contact</Link>
        </div>
      </section>

      {selected && <CheckoutDialog offer={selected} billing={selected.oneTime ? 'one_time' : billing} onClose={() => setSelected(null)} />}
    </div>
  );
}
