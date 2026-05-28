import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Rocket, Building2, Sparkles, Crown, ChevronRight, ChevronLeft,
  User, Mail, Phone, MapPin, MessageSquare, Upload, Check, Loader2,
  Scissors, UtensilsCrossed, Wrench, Calendar, Users, Globe
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';

const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Rocket,
    color: CYAN,
    priceFrom: 149,
    priceTo: 249,
    tagline: 'Votre vitrine clé en main',
    features: ['Site vitrine moderne', 'Formulaire de contact', 'Google Business', 'SEO de base', 'Hébergement inclus'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: Building2,
    color: GOLD,
    priceFrom: 349,
    priceTo: 599,
    tagline: 'Croissance & automatisation',
    popular: true,
    features: ['Site complet multi-pages', 'CRM intégré', 'Automatisations IA', 'Dashboard admin', '6 publications/mois'],
  },
  {
    id: 'premium',
    name: 'InnovIA Premium',
    icon: Crown,
    color: PURPLE,
    priceFrom: 890,
    priceTo: 2500,
    tagline: 'Solution IA sur-mesure',
    features: ['Tout Business +', 'Chatbot IA personnalisé', 'Automatisations avancées', 'Accompagnement complet', 'Priorité absolue'],
  },
];

const METIERS = [
  { id: 'Coiffeur', label: 'Coiffeur / Esthéticienne', icon: Scissors, color: '#EC4899' },
  { id: 'Horeca', label: 'Horeca / Restaurant', icon: UtensilsCrossed, color: '#F59E0B' },
  { id: 'Artisan', label: 'Artisan / Commerce', icon: Wrench, color: '#10B981' },
  { id: 'Evenement', label: 'Événement / Festival', icon: Calendar, color: GOLD },
  { id: 'ASBL', label: 'ASBL / Association', icon: Users, color: CYAN },
  { id: 'Site-Vitrine', label: 'Autre / Site vitrine', icon: Globe, color: PURPLE },
];

const STEPS = [
  { id: 1, label: 'Pack' },
  { id: 2, label: 'Métier' },
  { id: 3, label: 'Infos' },
  { id: 4, label: 'Projet' },
  { id: 5, label: 'Paiement' },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
              style={current >= s.id
                ? { background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {current > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: current >= s.id ? GOLD : 'rgba(255,255,255,0.25)' }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-8 sm:w-14 h-px mx-1 transition-all duration-500"
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

export default function Commande() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    pack: '',
    metier: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    ville: '',
    description: '',
    couleurs: '',
    logo: null,
  });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return !!form.pack;
    if (step === 2) return !!form.metier;
    if (step === 3) return form.prenom && form.email && form.telephone && form.entreprise;
    if (step === 4) return !!form.description;
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
          pack: form.pack,
          metier: form.metier,
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          entreprise: form.entreprise,
          ville: form.ville,
          description: form.description,
          success_url: `${window.location.origin}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/Commande`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Une erreur est survenue.');
        setLoading(false);
      }
    } catch (e) {
      setError('Connexion impossible. Réessayez.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4" style={{ color: '#fff' }}>
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.22)', color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Démarrer mon projet
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 font-cinzel"
            style={{ background: `linear-gradient(135deg,#fff,${GOLD_L},${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Commander mon site
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            5 minutes · Paiement sécurisé · Onboarding sous 24h
          </p>
        </motion.div>

        <StepBar current={step} />

        <AnimatePresence mode="wait">

          {/* ── ÉTAPE 1 : PACK ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Quel pack vous correspond ?</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Vous pourrez toujours évoluer vers un pack supérieur.</p>
                <div className="flex flex-col gap-4">
                  {PACKS.map((pack) => {
                    const Icon = pack.icon;
                    const sel = form.pack === pack.id;
                    return (
                      <motion.button key={pack.id} whileTap={{ scale: 0.98 }} onClick={() => setField('pack', pack.id)}
                        className="relative text-left p-5 rounded-2xl transition-all"
                        style={{
                          background: sel ? `${pack.color}0e` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${sel ? pack.color + '55' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: sel ? `0 0 30px ${pack.color}22` : 'none',
                        }}>
                        {pack.popular && (
                          <span className="absolute top-3 right-3 text-xs px-2.5 py-0.5 rounded-full font-bold"
                            style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}>
                            ⭐ Populaire
                          </span>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl" style={{ background: `${pack.color}15` }}>
                            <Icon className="w-5 h-5" style={{ color: pack.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="font-black text-white text-base">{pack.name}</span>
                              <span className="text-xs font-semibold" style={{ color: pack.color }}>
                                à partir de {pack.priceFrom}€/mois
                              </span>
                            </div>
                            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.38)' }}>{pack.tagline}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {pack.features.map(f => (
                                <span key={f} className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ background: `${pack.color}0a`, color: 'rgba(255,255,255,0.5)', border: `1px solid ${pack.color}18` }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                            style={{ borderColor: sel ? pack.color : 'rgba(255,255,255,0.2)', background: sel ? pack.color : 'transparent' }}>
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
                        style={{
                          background: sel ? `${m.color}0e` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${sel ? m.color + '55' : 'rgba(255,255,255,0.07)'}`,
                        }}>
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
                      <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
                      Décrivez votre projet *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setField('description', e.target.value)}
                      placeholder="Ex : Je suis coiffeur à Dour, j'ai besoin d'un site pour montrer mes réalisations et permettre la prise de RDV en ligne..."
                      rows={4}
                      className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <Field icon={Sparkles} placeholder="Couleurs souhaitées (ex: bleu, or, blanc...)" value={form.couleurs} onChange={v => setField('couleurs', v)} />
                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                      Logo ou visuel (optionnel)
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px dashed rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.03)' }}
                      onDragOver={e => e.preventDefault()}>
                      <Upload className="w-5 h-5" style={{ color: 'rgba(212,175,55,0.5)' }} />
                      <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {form.logo ? `✅ ${form.logo.name}` : 'Glissez votre logo ici ou cliquez pour parcourir'}
                      </span>
                      <input type="file" className="hidden" accept="image/*,.pdf,.svg"
                        onChange={e => setField('logo', e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── ÉTAPE 5 : RÉCAP + PAIEMENT ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <Card>
                <h2 className="text-lg font-black text-white mb-1">Récapitulatif de commande</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Vérifiez avant de procéder au paiement sécurisé.</p>

                {/* Récap pack */}
                {(() => {
                  const pack = PACKS.find(p => p.id === form.pack);
                  const metier = METIERS.find(m => m.id === form.metier);
                  const Icon = pack?.icon || Sparkles;
                  return (
                    <div className="rounded-2xl p-4 mb-5"
                      style={{ background: `${pack?.color || GOLD}08`, border: `1px solid ${pack?.color || GOLD}22` }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl" style={{ background: `${pack?.color || GOLD}15` }}>
                          <Icon className="w-5 h-5" style={{ color: pack?.color || GOLD }} />
                        </div>
                        <div>
                          <p className="font-black text-white">Pack {pack?.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>À partir de {pack?.priceFrom}€/mois</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-lg font-black" style={{ color: pack?.color || GOLD }}>{pack?.priceFrom}€</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>premier mois</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span>🏢 {form.entreprise}</span>
                        <span>👤 {form.prenom} {form.nom}</span>
                        <span>📧 {form.email}</span>
                        <span>📞 {form.telephone}</span>
                        {form.ville && <span>📍 {form.ville}</span>}
                        {metier && <span>🏷️ {metier.label}</span>}
                      </div>
                    </div>
                  );
                })()}

                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    {error}
                  </div>
                )}

                {/* Garanties */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {['🔒 Paiement sécurisé Stripe', '✅ Confirmation sous 2h', '🚀 Onboarding sous 24h'].map(g => (
                    <span key={g} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {g}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all"
                  style={{ background: loading ? 'rgba(212,175,55,0.3)' : `linear-gradient(135deg,#B8960C,${GOLD})`, color: '#000' }}>
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Redirection vers Stripe…</>
                  ) : (
                    <>💳 Payer et démarrer mon projet <ChevronRight className="w-4 h-4" /></>
                  )}
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

          {step < 5 && (
            <motion.button whileTap={{ scale: 0.97 }} onClick={next} disabled={!canNext()}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-black transition-all ml-auto"
              style={{
                background: canNext() ? `linear-gradient(135deg,#B8960C,${GOLD})` : 'rgba(255,255,255,0.06)',
                color: canNext() ? '#000' : 'rgba(255,255,255,0.2)',
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}>
              Continuer <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = 'text' }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: focus ? GOLD : 'rgba(255,255,255,0.25)' }} />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${focus ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: '#fff',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
