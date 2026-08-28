import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { platform } from '@/api/platformClient';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

const PACK_LOGIC = (data) => {
  const n = data.need || '';
  const g = data.goal || '';
  const b = data.budget || '';
  if (n.includes('agent IA') || n.includes('dashboard') || b === 'Projet complet') return 'Pack IA Premium';
  if (n.includes('automatiser') || g.includes('Gagner du temps') || g.includes('Automatiser')) return 'Pack Automation';
  if (n.includes('Attirer') || g.includes('plus de clients') || n.includes('leads')) return 'Pack Business';
  return 'Pack Starter';
};

const STEPS = [
  {
    id: 'profil', title: 'Votre profil', question: 'Vous êtes :',
    type: 'choice',
    choices: ['Indépendant', 'Entreprise', 'ASBL', 'Commerce', 'Autre'],
    field: 'typeClient'
  },
  {
    id: 'need', title: 'Votre besoin', question: 'Quel est votre besoin principal ?',
    type: 'choice',
    choices: ['Créer un site web', 'Automatiser mon activité', 'Attirer plus de clients', 'Créer du contenu', 'Développer une application mobile', 'Mettre en place un agent IA', 'Autre'],
    field: 'need'
  },
  {
    id: 'problem', title: 'Votre situation', question: 'Expliquez votre problème en quelques mots.',
    type: 'textarea', field: 'problem', placeholder: 'Décrivez votre situation actuelle...'
  },
  {
    id: 'setup', title: 'Ce que vous avez', question: 'Avez-vous déjà quelque chose en place ?',
    type: 'choice',
    choices: ['Rien', 'Site existant', 'Réseaux sociaux uniquement', 'CRM / outil existant', 'Automatisations existantes'],
    field: 'currentSetup'
  },
  {
    id: 'goal', title: 'Votre objectif', question: 'Quel est votre objectif principal ?',
    type: 'choice',
    choices: ['Gagner du temps', 'Avoir plus de clients', 'Améliorer mon image', 'Automatiser des tâches', 'Créer du contenu régulier', 'Centraliser mon activité'],
    field: 'goal'
  },
  {
    id: 'deadline', title: 'Votre délai', question: 'Quel est votre délai ?',
    type: 'choice',
    choices: ['Urgent', 'Moins de 30 jours', '1 à 3 mois', 'Plus tard'],
    field: 'deadline'
  },
  {
    id: 'budget', title: 'Votre budget', question: 'Budget approximatif :',
    type: 'choice',
    choices: ['Petit budget', 'Budget moyen', 'Projet complet', 'Je ne sais pas'],
    field: 'budget'
  },
  {
    id: 'contact', title: 'Vos coordonnées', question: 'Pour recevoir votre analyse personnalisée :',
    type: 'contact'
  },
  {
    id: 'consent', title: 'Consentement', question: 'Consentement RGPD',
    type: 'consent'
  },
];

const PACK_COLORS = {
  'Pack Starter': CYAN,
  'Pack Business': GOLD,
  'Pack Automation': PURPLE,
  'Pack IA Premium': '#EC4899',
};

export default function SaasAnalyse() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState('');

  const currentStep = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const handleChoice = (field, value) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    if (step < STEPS.length - 1) setTimeout(() => setStep(s => s + 1), 200);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!data.consentRgpd) return alert('Le consentement RGPD est obligatoire.');
    setLoading(true);
    const recommended = PACK_LOGIC(data);
    setPack(recommended);
    await platform.entities.Lead.create({
      ...data,
      recommendedPack: recommended,
      source: 'formulaire',
      status: 'nouveau',
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    const packColor = PACK_COLORS[pack] || GOLD;
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: `${packColor}12`, border: `2px solid ${packColor}40`, boxShadow: `0 0 60px ${packColor}20` }}>
            <Sparkles className="w-14 h-14" style={{ color: packColor }} />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Analyse terminée !</h2>
          <p className="text-base mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>Votre demande a été analysée. Le pack recommandé est :</p>
          <div className="inline-block px-8 py-4 rounded-2xl text-xl font-black mb-6"
            style={{ background: `${packColor}15`, color: packColor, border: `1px solid ${packColor}40` }}>
            {pack}
          </div>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Julien peut vous recontacter avec une proposition personnalisée.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm"
                style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>
                <MessageCircle className="w-4 h-4" /> Continuer sur WhatsApp
              </motion.button>
            </a>
            <Link to="/saas-packs">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Recevoir une offre <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-16 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Analyse de projet gratuite
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Analysons votre projet</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>
            {STEPS.length} étapes · Réponse sous 24h · RGPD
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: GOLD }}>Étape {step + 1} / {STEPS.length}</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{currentStep.title}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
              style={{ background: `linear-gradient(90deg, ${GOLD}, ${PURPLE})` }} />
          </div>
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="p-7 rounded-3xl relative overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />

            <h2 className="text-xl font-black text-white mb-6">{currentStep.question}</h2>

            {currentStep.type === 'choice' && (
              <div className="space-y-2.5">
                {currentStep.choices.map(choice => (
                  <motion.button key={choice} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(currentStep.field, choice)}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-semibold text-left transition-all"
                    style={data[currentStep.field] === choice
                      ? { background: `rgba(212,175,55,0.12)`, color: GOLD, border: `1px solid rgba(212,175,55,0.4)` }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>{choice}</span>
                    {data[currentStep.field] === choice && <Check className="w-4 h-4" style={{ color: GOLD }} />}
                  </motion.button>
                ))}
              </div>
            )}

            {currentStep.type === 'textarea' && (
              <div>
                <textarea value={data[currentStep.field] || ''} rows={4}
                  onChange={e => setData({ ...data, [currentStep.field]: e.target.value })}
                  placeholder={currentStep.placeholder}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white' }} />
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={handleNext} disabled={!data[currentStep.field]}
                  className="mt-4 w-full py-3.5 rounded-2xl font-black text-black text-sm disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  Continuer →
                </motion.button>
              </div>
            )}

            {currentStep.type === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'Prénom', key: 'firstName' }, { label: 'Nom', key: 'lastName' }].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}</label>
                      <input value={data[f.key] || ''} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white' }}
                        placeholder={f.label} />
                    </div>
                  ))}
                </div>
                {[
                  { label: 'Activité / Entreprise', key: 'company' },
                  { label: 'Téléphone', key: 'phone', type: 'tel' },
                  { label: 'Email *', key: 'email', type: 'email', required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.label}</label>
                    <input required={f.required} type={f.type || 'text'} value={data[f.key] || ''}
                      onChange={e => setData({ ...data, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white' }}
                      placeholder={f.label} />
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={handleNext} disabled={!data.email}
                  className="w-full py-3.5 rounded-2xl font-black text-black text-sm disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  Continuer →
                </motion.button>
              </div>
            )}

            {currentStep.type === 'consent' && (
              <div>
                <div className="p-5 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Vos données sont utilisées uniquement pour répondre à votre demande et vous recontacter dans le cadre de votre projet. Conformément au RGPD, vous pouvez exercer vos droits à tout moment en contactant info@jsinnovia.store.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <div onClick={() => setData({ ...data, consentRgpd: !data.consentRgpd })}
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer transition-all"
                    style={data.consentRgpd
                      ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
                    {data.consentRgpd && <Check className="w-4 h-4 text-black" />}
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    J'accepte que mes données soient utilisées pour être recontacté dans le cadre de ma demande. <span style={{ color: GOLD }}>*</span>
                  </span>
                </label>
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit} disabled={!data.consentRgpd || loading}
                  className="w-full py-4 rounded-2xl font-black text-black text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
                  {loading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-5 h-5" /></motion.div> Analyse en cours...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Envoyer mon analyse</>
                  )}
                </motion.button>
                <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.22)' }}>RGPD · Données confidentielles · Réponse sous 24h</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step > 0 && currentStep.type !== 'consent' && (
          <button onClick={() => setStep(s => s - 1)} className="mt-4 text-xs px-4 py-2 rounded-xl transition-all"
            style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)' }}>
            ← Retour
          </button>
        )}
      </div>
    </div>
  );
}
