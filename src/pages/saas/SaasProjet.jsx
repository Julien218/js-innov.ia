import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Globe, Palette, Zap,
  QrCode, Instagram, FileText, Loader2, CheckCircle
} from 'lucide-react';
import { platform } from '@/api/platformClient';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#22c55e';

const BESOINS = [
  { id: 'site_web', label: 'Site web', icon: Globe, color: CYAN },
  { id: 'carte_visite', label: 'Carte de visite', icon: FileText, color: GOLD },
  { id: 'affiches', label: 'Affiches / Bâches', icon: Palette, color: PURPLE },
  { id: 'reseaux_sociaux', label: 'Réseaux sociaux', icon: Instagram, color: '#EC4899' },
  { id: 'automatisation', label: 'Automatisation business', icon: Zap, color: '#F59E0B' },
  { id: 'billetterie', label: 'Billetterie & QR Code', icon: QrCode, color: GREEN },
];

const STYLES = [
  { id: 'moderne', label: 'Moderne', desc: 'Épuré, tech, tendance', color: CYAN },
  { id: 'luxe', label: 'Luxe', desc: 'Premium, or, raffiné', color: GOLD },
  { id: 'fun', label: 'Fun', desc: 'Coloré, dynamique, créatif', color: '#EC4899' },
  { id: 'corporate', label: 'Corporate', desc: 'Pro, sérieux, institutionnel', color: PURPLE },
];

const BUDGETS = ['Moins de 500€', '500€ – 1 000€', '1 000€ – 2 000€', '2 000€ – 5 000€', 'Plus de 5 000€', 'Je ne sais pas encore'];

const STEPS = ['Activité', 'Besoins', 'Style', 'Budget & Contact'];

export default function SaasProjet() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    activite: '',
    description: '',
    besoins: [],
    style: '',
    couleurs: '',
    budget: '',
    nom: '',
    email: '',
    phone: '',
    consentement: false,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const toggleBesoin = (id) => {
    setForm(f => ({
      ...f,
      besoins: f.besoins.includes(id) ? f.besoins.filter(b => b !== id) : [...f.besoins, id]
    }));
  };

  const canNext = () => {
    if (step === 0) return form.activite.trim().length > 2;
    if (step === 1) return form.besoins.length > 0;
    if (step === 2) return form.style !== '';
    if (step === 3) return form.email.trim().length > 3 && form.nom.trim().length > 1 && form.budget && form.consentement;
    return true;
  };

  const handleSubmit = async () => {
    if (!canNext()) return;
    setLoading(true);
    setError('');
    const besoinsLabels = form.besoins.map(id => BESOINS.find(b => b.id === id)?.label).join(', ');
    const styleLabel = STYLES.find(s => s.id === form.style)?.label || form.style;

    await Promise.all([
      platform.entities.Lead.create({
        firstName: form.nom.split(' ')[0] || form.nom,
        lastName: form.nom.split(' ').slice(1).join(' ') || '',
        email: form.email,
        phone: form.phone,
        need: besoinsLabels,
        problem: form.description,
        goal: `Style: ${styleLabel} | Budget: ${form.budget}`,
        source: 'formulaire',
        status: 'nouveau',
        consentRgpd: form.consentement,
        message: `Activité: ${form.activite} | Besoins: ${besoinsLabels} | Style: ${styleLabel} | Couleurs: ${form.couleurs} | Budget: ${form.budget}`,
      }),
      platform.integrations.Core.SendEmail({
        to: 'contact@js-innov.ia',
        subject: `🚀 Nouveau projet — ${form.nom} (${besoinsLabels})`,
        body: `Nouveau projet soumis via le formulaire.\n\n👤 ${form.nom}\n📧 ${form.email}\n📱 ${form.phone || 'Non renseigné'}\n\n🏢 Activité: ${form.activite}\n📝 Description: ${form.description || 'Non renseignée'}\n✅ Besoins: ${besoinsLabels}\n🎨 Style: ${styleLabel}\n🎨 Couleurs: ${form.couleurs || 'Non renseignées'}\n💰 Budget: ${form.budget}\n\nConnectez-vous au dashboard pour traiter ce prospect.`,
      }),
    ]).catch(() => {});

    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-24">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid ${GREEN}35`, boxShadow: `0 0 60px ${GREEN}10` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: `${GREEN}15`, border: `2px solid ${GREEN}` }}>
            <CheckCircle className="w-10 h-10" style={{ color: GREEN }} />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Projet reçu !</h2>
          <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Julien va analyser votre projet et vous envoyer une offre personnalisée avec visuels dans les <strong style={{ color: GOLD }}>48 heures</strong>.
          </p>
          <div className="space-y-2 mb-8">
            {[
              'Analyse de votre projet',
              'Génération des premiers visuels',
              'Offre personnalisée + devis',
              'Lien paiement acompte sécurisé',
            ].map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}20` }}>
                  <span className="text-xs font-black" style={{ color: GOLD }}>{i + 1}</span>
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{s}</span>
              </motion.div>
            ))}
          </div>
          <Link to="/saas">
            <button className="px-6 py-3 rounded-2xl font-bold text-sm border" style={{ borderColor: `${GOLD}30`, color: GOLD }}>
              Retour à l'accueil
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Créer mon projet
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">Décrivez votre projet</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>3 minutes. Offre personnalisée sous 48h.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all`}
                  style={{
                    background: i < step ? GREEN : i === step ? GOLD : 'rgba(255,255,255,0.08)',
                    color: i <= step ? '#000' : 'rgba(255,255,255,0.4)',
                  }}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:block truncate"
                  style={{ color: i === step ? GOLD : 'rgba(255,255,255,0.3)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px flex-shrink-0" style={{ background: i < step ? GREEN : 'rgba(255,255,255,0.1)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="p-7 rounded-3xl"
            style={{ background: 'rgba(10,8,22,0.9)', border: '1px solid rgba(212,175,55,0.15)' }}>

            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Quelle est votre activité ? *</label>
                  <input
                    value={form.activite}
                    onChange={e => setForm(f => ({ ...f, activite: e.target.value }))}
                    placeholder="Ex: Restaurateur, Boutique de mode, Coach sportif, ASBL..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(212,175,55,${form.activite ? '0.4' : '0.15'})`, color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Décrivez votre projet (optionnel)</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Qu'est-ce que vous voulez accomplir ? Quels problèmes rencontrez-vous ?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <label className="block text-sm font-bold text-white mb-4">De quoi avez-vous besoin ? * (plusieurs choix possibles)</label>
                <div className="grid grid-cols-2 gap-3">
                  {BESOINS.map(b => (
                    <motion.button key={b.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => toggleBesoin(b.id)}
                      className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                      style={{
                        background: form.besoins.includes(b.id) ? `${b.color}12` : 'rgba(255,255,255,0.03)',
                        border: form.besoins.includes(b.id) ? `1px solid ${b.color}50` : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${b.color}15`, border: `1px solid ${b.color}25` }}>
                        <b.icon className="w-4 h-4" style={{ color: b.color }} />
                      </div>
                      <span className="text-sm font-bold text-white">{b.label}</span>
                      {form.besoins.includes(b.id) && (
                        <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: b.color }}>
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white mb-4">Quel style visuel vous correspond ? *</label>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {STYLES.map(s => (
                      <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setForm(f => ({ ...f, style: s.id }))}
                        className="p-4 rounded-2xl text-left transition-all"
                        style={{
                          background: form.style === s.id ? `${s.color}12` : 'rgba(255,255,255,0.03)',
                          border: form.style === s.id ? `1px solid ${s.color}50` : '1px solid rgba(255,255,255,0.06)',
                        }}>
                        <div className="font-black text-white text-sm mb-0.5">{s.label}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                        {form.style === s.id && (
                          <div className="mt-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: s.color }}>
                            <Check className="w-2.5 h-2.5 text-black" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Couleurs souhaitées (optionnel)</label>
                  <input
                    value={form.couleurs}
                    onChange={e => setForm(f => ({ ...f, couleurs: e.target.value }))}
                    placeholder="Ex: bleu marine et or, rouge vif, tons pastels..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Budget estimé *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGETS.map(b => (
                      <button key={b} onClick={() => setForm(f => ({ ...f, budget: b }))}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all"
                        style={{
                          background: form.budget === b ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                          border: form.budget === b ? `1px solid rgba(212,175,55,0.4)` : '1px solid rgba(255,255,255,0.06)',
                          color: form.budget === b ? GOLD : 'rgba(255,255,255,0.55)',
                        }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">Nom complet *</label>
                    <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      placeholder="Jean Dupont" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">Téléphone (optionnel)</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+32 xxx xx xx" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">Email *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="votre@email.com" type="email" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
                </div>
                <button onClick={() => setForm(f => ({ ...f, consentement: !f.consentement }))}
                  className="flex items-start gap-3 text-left w-full">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{ background: form.consentement ? GOLD : 'rgba(255,255,255,0.08)', border: `1px solid ${form.consentement ? GOLD : 'rgba(255,255,255,0.2)'}` }}>
                    {form.consentement && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    J'accepte que mes données soient utilisées pour recevoir une offre personnalisée. Conformité RGPD garantie. *
                  </span>
                </button>
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          {step < STEPS.length - 1 ? (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl font-black text-black text-sm disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
              Suivant <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!canNext() || loading}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl font-black text-black text-sm disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Envoi...' : 'Envoyer mon projet'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}