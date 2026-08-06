import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Rocket, Building2, Sparkles, Crown, ChevronRight, ChevronLeft,
  User, Mail, Phone, MapPin, MessageSquare, Upload, Check, Loader2,
  Scissors, UtensilsCrossed, Wrench, Calendar, Users, Globe,
  Gift, Star, TrendingUp, Zap, Share2, Trophy, Clock
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';
const GREEN = '#10B981';

// ── PACKS ──────────────────────────────────────────────────────────────
const PACKS = [
  {
    id: 'starter', name: 'Starter', icon: Rocket, color: CYAN,
    priceFrom: 149, priceTo: 249, tagline: 'Votre vitrine clé en main',
    features: ['Site vitrine moderne', 'Formulaire de contact', 'Google Business', 'SEO de base', 'Hébergement inclus'],
    loyaltyPoints: 150,
    seoIncluded: false,
  },
  {
    id: 'business', name: 'Business', icon: Building2, color: GOLD,
    priceFrom: 349, priceTo: 599, tagline: 'Croissance & automatisation',
    popular: true,
    features: ['Site complet multi-pages', 'CRM intégré', 'Automatisations IA', 'Dashboard admin', '6 publications/mois'],
    loyaltyPoints: 500,
    seoIncluded: true,
  },
  {
    id: 'premium', name: 'InnovIA Premium', icon: Crown, color: PURPLE,
    priceFrom: 890, priceTo: 2500, tagline: 'Solution IA sur-mesure',
    features: ['Tout Business +', 'Chatbot IA personnalisé', 'Automatisations avancées', 'Accompagnement complet', 'Priorité absolue'],
    loyaltyPoints: 1200,
    seoIncluded: true,
  },
];

// ── MÉTIERS ─────────────────────────────────────────────────────────────
const METIERS = [
  { id: 'Coiffeur', label: 'Coiffeur / Esthéticienne', icon: Scissors, color: '#EC4899' },
  { id: 'Horeca', label: 'Horeca / Restaurant', icon: UtensilsCrossed, color: '#F59E0B' },
  { id: 'Artisan', label: 'Artisan / Commerce', icon: Wrench, color: '#10B981' },
  { id: 'Evenement', label: 'Événement / Festival', icon: Calendar, color: GOLD },
  { id: 'ASBL', label: 'ASBL / Association', icon: Users, color: CYAN },
  { id: 'Site-Vitrine', label: 'Autre / Site vitrine', icon: Globe, color: PURPLE },
];

// ── PALIERS FIDÉLITÉ ─────────────────────────────────────────────────────
const LOYALTY_TIERS = [
  { id: 'bronze', label: 'Bronze', min: 0, max: 499, color: '#CD7F32', icon: '🥉', perks: ['5% sur votre prochain pack', 'Support prioritaire'] },
  { id: 'silver', label: 'Silver', min: 500, max: 1199, color: '#C0C0C0', icon: '🥈', perks: ['10% sur votre prochain pack', 'Audit SEO gratuit', '1 publication bonus/mois'] },
  { id: 'gold', label: 'Gold', min: 1200, max: 9999, color: GOLD, icon: '🥇', perks: ['15% sur votre prochain pack', 'Chatbot IA offert', 'Support dédié 7j/7', 'Rapport mensuel IA'] },
];

// ── RÉCOMPENSES DÉBLOQUABLES ─────────────────────────────────────────────
const REWARDS = [
  { id: 'audit_seo', label: 'Audit SEO complet', points: 200, icon: TrendingUp, color: CYAN },
  { id: 'post_bonus', label: '1 mois de posts offert', points: 300, icon: Zap, color: PURPLE },
  { id: 'chatbot', label: 'Chatbot IA basique', points: 600, icon: Sparkles, color: GOLD },
  { id: 'reduction_10', label: 'Réduction 10% prochain pack', points: 800, icon: Gift, color: GREEN },
  { id: 'video_promo', label: 'Vidéo promo 30s offerte', points: 1000, icon: Star, color: '#EC4899' },
];

const STEPS = [
  { id: 1, label: 'Pack' },
  { id: 2, label: 'Métier' },
  { id: 3, label: 'Infos' },
  { id: 4, label: 'Projet' },
  { id: 5, label: 'Fidélité' },
  { id: 6, label: 'Paiement' },
];

// ── COMPOSANTS ──────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
              style={current >= s.id
                ? { background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {current > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: current >= s.id ? GOLD : 'rgba(255,255,255,0.25)' }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-6 sm:w-10 h-px mx-1 transition-all duration-500"
              style={{ background: current > s.id ? `linear-gradient(90deg,${GOLD},${GOLD_L})` : 'rgba(255,255,255,0.07)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl p-6 sm:p-8 ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.97), rgba(11,11,15,0.99))',
        border: '1px solid rgba(212,175,55,0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
      {children}
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = 'text' }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: focus ? GOLD : 'rgba(255,255,255,0.25)' }} />
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${focus ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: '#fff', fontFamily: 'inherit',
        }} />
    </div>
  );
}

// ── ÉTAPE FIDÉLITÉ ───────────────────────────────────────────────────────
function LoyaltyStep({ form, setField, selectedPack }) {
  const pack = PACKS.find(p => p.id === selectedPack);
  const points = pack?.loyaltyPoints || 0;
  const tier = LOYALTY_TIERS.find(t => points >= t.min && points <= t.max) || LOYALTY_TIERS[0];
  const nextTier = LOYALTY_TIERS[LOYALTY_TIERS.findIndex(t => t.id === tier.id) + 1];
  const affordableRewards = REWARDS.filter(r => r.points <= points);

  const [copied, setCopied] = useState(false);
  const referralCode = form.referral_code_generated || `JS-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

  useEffect(() => {
    if (!form.referral_code_generated) setField('referral_code_generated', referralCode);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── POINTS GAGNÉS ── */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: `${tier.color}18` }}>
            <Trophy className="w-5 h-5" style={{ color: tier.color }} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Votre programme de fidélité</h2>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Gagnez des points à chaque commande</p>
          </div>
        </div>

        {/* Points + tier */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: `${tier.color}0a`, border: `1px solid ${tier.color}25` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Points gagnés avec ce pack</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black" style={{ color: tier.color }}>+{points}</span>
                <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>pts</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl">{tier.icon}</span>
              <p className="text-xs font-black" style={{ color: tier.color }}>{tier.label}</p>
            </div>
          </div>

          {/* Barre progression vers tier suivant */}
          {nextTier && (
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span>{points} pts</span>
                <span>{nextTier.min} pts pour {nextTier.label} {nextTier.icon}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((points / nextTier.min) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }} />
              </div>
            </div>
          )}
        </div>

        {/* Avantages du tier */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Vos avantages {tier.label} :</p>
          <div className="flex flex-col gap-1.5">
            {tier.perks.map(perk => (
              <div key={perk} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tier.color }} />
                <span className="text-xs text-white">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── RÉCOMPENSE À CHOISIR (si points suffisants) ── */}
      {affordableRewards.length > 0 && (
        <Card>
          <h3 className="text-sm font-black text-white mb-1">🎁 Choisissez votre récompense de bienvenue</h3>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Sélectionnez un bonus offert avec votre commande.</p>
          <div className="flex flex-col gap-2.5">
            {affordableRewards.map(reward => {
              const Icon = reward.icon;
              const sel = form.selected_reward === reward.id;
              return (
                <motion.button key={reward.id} whileTap={{ scale: 0.98 }}
                  onClick={() => setField('selected_reward', sel ? '' : reward.id)}
                  className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: sel ? `${reward.color}0d` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? reward.color + '44' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${reward.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: reward.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{reward.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{reward.points} pts requis</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: sel ? reward.color : 'rgba(255,255,255,0.2)', background: sel ? reward.color : 'transparent' }}>
                    {sel && <Check className="w-3 h-3 text-black" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── CODE PARRAINAGE ── */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.12)' }}>
            <Share2 className="w-5 h-5" style={{ color: CYAN }} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Parrainez et gagnez</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>+200 pts par ami parrainé · Lui offre 50€ de remise</p>
          </div>
        </div>

        <div className="rounded-xl p-3.5 mb-3 flex items-center justify-between gap-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(6,182,212,0.3)' }}>
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Votre code unique</p>
            <p className="text-lg font-black tracking-widest" style={{ color: CYAN }}>{referralCode}</p>
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={copyCode}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            style={{ background: copied ? `${GREEN}22` : 'rgba(6,182,212,0.15)', color: copied ? GREEN : CYAN, border: `1px solid ${copied ? GREEN : CYAN}33` }}>
            {copied ? <><Check className="w-3.5 h-3.5" /> Copié !</> : <><Share2 className="w-3.5 h-3.5" /> Copier</>}
          </motion.button>
        </div>

        {/* Champ code parrain reçu */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Vous avez un code parrain ?</p>
          <Field icon={Gift} placeholder="Ex: JS-ABC123 (optionnel)" value={form.referral_input || ''} onChange={v => setField('referral_input', v.toUpperCase())} />
          {form.referral_input?.length === 9 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2 flex items-center gap-1.5" style={{ color: GREEN }}>
              <Check className="w-3 h-3" /> Code appliqué — 50€ de remise sur votre 1er mois !
            </motion.p>
          )}
        </div>
      </Card>

      {/* ── SEO AUTOMATISÉ (inspiré AutoSEO) ── */}
      {pack?.seoIncluded && (
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white mb-0.5">SEO Automatisé IA — Inclus 🎁</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Votre pack inclut la génération automatique de contenu SEO chaque mois.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { v: '4', label: 'Articles/mois', icon: '📝' },
              { v: '8', label: 'Posts réseaux', icon: '📱' },
              { v: '1', label: 'Fiche Google', icon: '📍' },
            ].map(({ v, label, icon }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <div className="text-xl mb-0.5">{icon}</div>
                <div className="text-lg font-black" style={{ color: GOLD }}>{v}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="seo_optin" checked={form.seo_optin !== false}
              onChange={e => setField('seo_optin', e.target.checked)}
              className="w-4 h-4 rounded" style={{ accentColor: GOLD }} />
            <label htmlFor="seo_optin" className="text-xs cursor-pointer" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Activer le SEO automatisé IA dès le lancement de mon site
            </label>
          </div>
        </Card>
      )}

      {/* ── NEWSLETTER FIDÉLITÉ ── */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.12)' }}>
              <Clock className="w-4 h-4" style={{ color: PURPLE }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Offres exclusives membres</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Promos, nouveautés et bonus fidélité par email</p>
            </div>
          </div>
          <button onClick={() => setField('newsletter_optin', !form.newsletter_optin)}
            className="w-12 h-6 rounded-full transition-all flex-shrink-0 relative"
            style={{ background: form.newsletter_optin !== false ? PURPLE : 'rgba(255,255,255,0.1)' }}>
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
              style={{ left: form.newsletter_optin !== false ? '26px' : '2px' }} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── PAGE PRINCIPALE ──────────────────────────────────────────────────────
export default function Commande() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    pack: '', metier: '', prenom: '', nom: '', email: '', telephone: '',
    entreprise: '', ville: '', description: '', couleurs: '', logo: null,
    selected_reward: '', referral_code_generated: '', referral_input: '',
    seo_optin: true, newsletter_optin: true,
  });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return !!form.pack;
    if (step === 2) return !!form.metier;
    if (step === 3) return form.prenom && form.email && form.telephone && form.entreprise;
    if (step === 4) return !!form.description;
    if (step === 5) return true; // fidélité optionnelle
    return true;
  };

  const next = () => { if (canNext()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/functions/createCheckoutSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack: form.pack, metier: form.metier, prenom: form.prenom, nom: form.nom,
          email: form.email, telephone: form.telephone, entreprise: form.entreprise,
          ville: form.ville, description: form.description,
          selected_reward: form.selected_reward, referral_input: form.referral_input,
          referral_code: form.referral_code_generated, seo_optin: form.seo_optin,
          newsletter_optin: form.newsletter_optin,
          success_url: `${window.location.origin}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/Commande`,
        }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || 'Une erreur est survenue.'); setLoading(false); }
    } catch (e) { setError('Connexion impossible. Réessayez.'); setLoading(false); }
  };

  const pack = PACKS.find(p => p.id === form.pack);

  return (
    <div className="min-h-screen py-16 px-4" style={{ color: '#fff' }}>
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.22)', color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Démarrer mon projet
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3"
            style={{ background: `linear-gradient(135deg,#fff,${GOLD_L},${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Commander mon site
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            5 minutes · Paiement sécurisé · Onboarding sous 24h · Fidélité récompensée
          </p>
        </motion.div>

        <StepBar current={step} />

        <AnimatePresence mode="wait">

          {/* ── ÉTAPE 1 : PACK ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Quel pack vous correspond ?</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Chaque pack génère des points de fidélité.</p>
                <div className="flex flex-col gap-4">
                  {PACKS.map((p) => {
                    const Icon = p.icon;
                    const sel = form.pack === p.id;
                    return (
                      <motion.button key={p.id} whileTap={{ scale: 0.98 }} onClick={() => setField('pack', p.id)}
                        className="relative text-left p-5 rounded-2xl transition-all"
                        style={{
                          background: sel ? `${p.color}0e` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${sel ? p.color + '55' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: sel ? `0 0 30px ${p.color}22` : 'none',
                        }}>
                        {p.popular && (
                          <span className="absolute top-3 right-3 text-xs px-2.5 py-0.5 rounded-full font-bold"
                            style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}>⭐ Populaire</span>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl" style={{ background: `${p.color}15` }}>
                            <Icon className="w-5 h-5" style={{ color: p.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="font-black text-white text-base">{p.name}</span>
                              <span className="text-xs font-semibold" style={{ color: p.color }}>à partir de {p.priceFrom}€/mois</span>
                            </div>
                            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>{p.tagline}</p>
                            {/* Points fidélité */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                              style={{ background: `${p.color}0f`, border: `1px solid ${p.color}25` }}>
                              <Trophy className="w-3 h-3" style={{ color: p.color }} />
                              <span className="text-xs font-bold" style={{ color: p.color }}>+{p.loyaltyPoints} pts fidélité</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {p.features.map(f => (
                                <span key={f} className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ background: `${p.color}0a`, color: 'rgba(255,255,255,0.5)', border: `1px solid ${p.color}18` }}>{f}</span>
                              ))}
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ borderColor: sel ? p.color : 'rgba(255,255,255,0.2)', background: sel ? p.color : 'transparent' }}>
                            {sel && <Check className="w-3 h-3 text-black" />}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ÉTAPE 2 : MÉTIER ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Votre secteur d'activité ?</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>On adapte le design et le contenu à votre métier.</p>
                <div className="grid grid-cols-2 gap-3">
                  {METIERS.map((m) => {
                    const Icon = m.icon;
                    const sel = form.metier === m.id;
                    return (
                      <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setField('metier', m.id)}
                        className="p-4 rounded-2xl text-left transition-all"
                        style={{ background: sel ? `${m.color}0e` : 'rgba(255,255,255,0.03)', border: `1px solid ${sel ? m.color + '55' : 'rgba(255,255,255,0.07)'}` }}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-1.5 rounded-lg" style={{ background: `${m.color}18` }}>
                            <Icon className="w-4 h-4" style={{ color: m.color }} />
                          </div>
                          {sel && <Check className="w-3.5 h-3.5 ml-auto" style={{ color: m.color }} />}
                        </div>
                        <p className="text-xs font-semibold text-white leading-tight">{m.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ÉTAPE 3 : INFOS ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Vos coordonnées</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Pour votre dossier client et la confirmation de commande.</p>
                <div className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={User} placeholder="Prénom *" value={form.prenom} onChange={v => setField('prenom', v)} />
                    <Field icon={User} placeholder="Nom" value={form.nom} onChange={v => setField('nom', v)} />
                  </div>
                  <Field icon={Mail} placeholder="Email *" type="email" value={form.email} onChange={v => setField('email', v)} />
                  <Field icon={Phone} placeholder="Téléphone *" type="tel" value={form.telephone} onChange={v => setField('telephone', v)} />
                  <Field icon={Building2} placeholder="Nom de l'entreprise *" value={form.entreprise} onChange={v => setField('entreprise', v)} />
                  <Field icon={MapPin} placeholder="Ville" value={form.ville} onChange={v => setField('ville', v)} />
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ÉTAPE 4 : PROJET ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Parlez-nous de votre projet</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Quelques lignes suffisent — on s'occupe du reste.</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />Décrivez votre projet *
                    </label>
                    <textarea value={form.description} onChange={e => setField('description', e.target.value)}
                      placeholder="Ex : Je suis coiffeur à Dour, j'ai besoin d'un site pour montrer mes réalisations et permettre la prise de RDV en ligne..."
                      rows={4} className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                  <Field icon={Sparkles} placeholder="Couleurs souhaitées (ex: bleu, or, blanc...)" value={form.couleurs} onChange={v => setField('couleurs', v)} />
                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <Upload className="w-3.5 h-3.5 inline mr-1.5" />Logo ou visuel (optionnel)
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl cursor-pointer"
                      style={{ border: '1px dashed rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.03)' }}>
                      <Upload className="w-5 h-5" style={{ color: 'rgba(212,175,55,0.5)' }} />
                      <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {form.logo ? `✅ ${form.logo.name}` : 'Glissez votre logo ici ou cliquez pour parcourir'}
                      </span>
                      <input type="file" className="hidden" accept="image/*,.pdf,.svg" onChange={e => setField('logo', e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ÉTAPE 5 : FIDÉLITÉ ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <LoyaltyStep form={form} setField={setField} selectedPack={form.pack} />
            </motion.div>
          )}

          {/* ── ÉTAPE 6 : RÉCAP + PAIEMENT ── */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Récapitulatif de commande</h2>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Vérifiez avant de procéder au paiement sécurisé.</p>

                {(() => {
                  const p = PACKS.find(x => x.id === form.pack);
                  const m = METIERS.find(x => x.id === form.metier);
                  const reward = REWARDS.find(x => x.id === form.selected_reward);
                  const tier = LOYALTY_TIERS.find(t => (p?.loyaltyPoints || 0) >= t.min && (p?.loyaltyPoints || 0) <= t.max);
                  const Icon = p?.icon || Sparkles;
                  return (
                    <>
                      {/* Pack */}
                      <div className="rounded-2xl p-4 mb-3" style={{ background: `${p?.color || GOLD}08`, border: `1px solid ${p?.color || GOLD}22` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-xl" style={{ background: `${p?.color || GOLD}15` }}>
                            <Icon className="w-5 h-5" style={{ color: p?.color || GOLD }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-white">Pack {p?.name}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>À partir de {p?.priceFrom}€/mois</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black" style={{ color: p?.color || GOLD }}>{p?.priceFrom}€</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>premier mois</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <span>🏢 {form.entreprise}</span>
                          <span>👤 {form.prenom} {form.nom}</span>
                          <span>📧 {form.email}</span>
                          <span>📞 {form.telephone}</span>
                          {form.ville && <span>📍 {form.ville}</span>}
                          {m && <span>🏷️ {m.label}</span>}
                        </div>
                      </div>

                      {/* Fidélité récap */}
                      <div className="rounded-xl p-3.5 mb-3 flex items-center justify-between"
                        style={{ background: `${tier?.color || GOLD}08`, border: `1px solid ${tier?.color || GOLD}20` }}>
                        <div className="flex items-center gap-2.5">
                          <Trophy className="w-4 h-4" style={{ color: tier?.color || GOLD }} />
                          <div>
                            <p className="text-xs font-bold text-white">Fidélité {tier?.icon} {tier?.label}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>+{p?.loyaltyPoints} pts crédités après paiement</p>
                          </div>
                        </div>
                        {reward && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
                            🎁 {reward.label}
                          </span>
                        )}
                      </div>

                      {/* Code parrain */}
                      {form.referral_input?.length === 9 && (
                        <div className="rounded-xl p-3 mb-3 flex items-center gap-2"
                          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: GREEN }} />
                          <p className="text-xs" style={{ color: GREEN }}>Code parrain <strong>{form.referral_input}</strong> appliqué — 50€ offerts !</p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>{error}</div>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {['🔒 Stripe sécurisé', '✅ Confirmation sous 2h', '🚀 Onboarding 24h', '🏆 Points fidélité crédités'].map(g => (
                    <span key={g} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>{g}</span>
                  ))}
                </div>

                <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.35)' }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit} disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all"
                  style={{ background: loading ? 'rgba(212,175,55,0.3)' : `linear-gradient(135deg,#B8960C,${GOLD})`, color: '#000' }}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirection vers Stripe…</> : <>💳 Payer et démarrer mon projet <ChevronRight className="w-4 h-4" /></>}
                </motion.button>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>

        {/* NAV BUTTONS */}
        <div className="flex items-center justify-between mt-5 gap-3">
          {step > 1 ? (
            <motion.button whileTap={{ scale: 0.96 }} onClick={prev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <ChevronLeft className="w-4 h-4" /> Retour
            </motion.button>
          ) : <div />}

          {step < 6 && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={next} disabled={!canNext()}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-black transition-all ml-auto"
              style={{
                background: canNext() ? `linear-gradient(135deg,#B8960C,${GOLD})` : 'rgba(255,255,255,0.06)',
                color: canNext() ? '#000' : 'rgba(255,255,255,0.2)',
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}>
              {step === 4 ? '🏆 Voir mes avantages fidélité' : 'Continuer'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
