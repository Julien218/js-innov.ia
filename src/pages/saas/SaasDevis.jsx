import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { platform } from '@/api/platformClient';
import {
  Globe, Zap, Bot, Smartphone,
  Check, ChevronRight, ChevronLeft, Sparkles,
  Users, Target, Megaphone,
  CheckCircle, MessageCircle, Send, Star, Shield
} from 'lucide-react';
import PrivacyConsentNotice from '@/components/legal/PrivacyConsentNotice';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20et%20je%20souhaite%20un%20devis.';

// ─── DATA ────────────────────────────────────────────────────────────────────

const SECTEURS = [
  { id: 'commerce', label: 'Commerce / Boutique', icon: '🛍️' },
  { id: 'resto', label: 'Restaurant / Horeca', icon: '🍽️' },
  { id: 'liberal', label: 'Profession libérale', icon: '⚕️' },
  { id: 'asbl', label: 'ASBL / Association', icon: '🤝' },
  { id: 'artisan', label: 'Artisan / Services', icon: '🔧' },
  { id: 'immobilier', label: 'Immobilier', icon: '🏠' },
  { id: 'beaute', label: 'Beauté / Bien-être', icon: '💆' },
  { id: 'event', label: 'Événementiel', icon: '🎉' },
  { id: 'tech', label: 'Tech / Digital', icon: '💻' },
  { id: 'autre', label: 'Autre', icon: '📋' },
];

const OBJECTIFS = [
  { id: 'visibilite', label: 'Être visible en ligne', icon: Globe, color: CYAN },
  { id: 'leads', label: 'Générer des prospects', icon: Target, color: GOLD },
  { id: 'automatiser', label: 'Automatiser mon travail', icon: Zap, color: PURPLE },
  { id: 'clients', label: 'Fidéliser mes clients', icon: Users, color: '#22c55e' },
  { id: 'contenu', label: 'Créer du contenu', icon: Megaphone, color: '#F59E0B' },
  { id: 'app', label: 'Avoir une application', icon: Smartphone, color: '#EC4899' },
];

const MODULES = [
  {
    id: 'site', label: 'Site web', icon: Globe, color: CYAN,
    desc: 'Site vitrine ou e-commerce professionnel',
    options: [
      { id: 'site_vitrine', label: 'Site vitrine simple (3-5 pages)', price: 490 },
      { id: 'site_avance', label: 'Site vitrine avancé (jusqu\'à 8 pages)', price: 790 },
      { id: 'site_shop', label: 'Boutique en ligne (e-commerce)', price: 1290 },
    ]
  },
  {
    id: 'ia', label: 'Intelligence Artificielle', icon: Bot, color: PURPLE,
    desc: 'Chatbots, agents métier et automatisation IA',
    options: [
      { id: 'chatbot_simple', label: 'Chatbot de qualification prospects', price: 349 },
      { id: 'chatbot_avance', label: 'Chatbot métier avancé', price: 649 },
      { id: 'agent_devis', label: 'Agent IA devis automatique', price: 499 },
      { id: 'agent_support', label: 'Agent support client IA', price: 399 },
    ]
  },
  {
    id: 'automation', label: 'Automatisation', icon: Zap, color: GOLD,
    desc: 'Workflows et automatisations métier',
    options: [
      { id: 'email_sequence', label: 'Séquence email automatique (4 étapes)', price: 299 },
      { id: 'crm', label: 'CRM + lead scoring', price: 399 },
      { id: 'workflow', label: 'Workflow complet sur mesure', price: 699 },
      { id: 'whatsapp_bot', label: 'Bot WhatsApp automatisé', price: 449 },
    ]
  },
  {
    id: 'contenu', label: 'Contenu & Marketing', icon: Megaphone, color: '#F59E0B',
    desc: 'Contenus digitaux et réseaux sociaux',
    options: [
      { id: 'posts_social', label: '12 posts/mois réseaux sociaux', price: 99, monthly: true },
      { id: 'articles_seo', label: '4 articles SEO/mois', price: 199, monthly: true },
      { id: 'visuel_carte', label: 'Carte de visite + charte visuelle', price: 149 },
      { id: 'vidéo_drone', label: 'Vidéo drone professionnelle', price: 299 },
    ]
  },
  {
    id: 'app', label: 'Application mobile', icon: Smartphone, color: '#EC4899',
    desc: 'App iOS & Android sur mesure',
    options: [
      { id: 'app_simple', label: 'App mobile simple (catalogue, infos)', price: null },
      { id: 'app_avance', label: 'App mobile avancée (commandes, espace client)', price: null },
    ]
  },
  {
    id: 'maintenance', label: 'Maintenance & Support', icon: Shield, color: '#22c55e',
    desc: 'Suivi, mises à jour et support mensuel',
    options: [
      { id: 'maintenance_base', label: 'Maintenance basique (updates, sécurité)', price: 49, monthly: true },
      { id: 'maintenance_pro', label: 'Maintenance pro + support prioritaire', price: 99, monthly: true },
      { id: 'maintenance_premium', label: 'Maintenance premium + modifs illimitées', price: 199, monthly: true },
    ]
  },
];

const BUDGETS = [
  { id: 'b1', label: 'Moins de 500€', icon: '💡' },
  { id: 'b2', label: '500€ – 1 500€', icon: '🚀' },
  { id: 'b3', label: '1 500€ – 3 000€', icon: '⚡' },
  { id: 'b4', label: '3 000€ – 6 000€', icon: '🏆' },
  { id: 'b5', label: 'Plus de 6 000€', icon: '💎' },
  { id: 'b6', label: 'Je ne sais pas encore', icon: '🤔' },
];

const DELAIS = [
  { id: 'urgent', label: 'Urgent (< 2 semaines)', color: '#ef4444' },
  { id: 'normal', label: 'Normal (1 mois)', color: GOLD },
  { id: 'flexible', label: 'Flexible (2-3 mois)', color: '#22c55e' },
];

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function StepSecteur({ value, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-black text-white mb-2">Votre secteur d'activité</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Cela nous aide à personnaliser votre devis.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SECTEURS.map(s => (
          <motion.button key={s.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => onChange(s.id)}
            className="p-4 rounded-2xl text-left transition-all"
            style={{
              background: value === s.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
              border: value === s.id ? `1px solid rgba(212,175,55,0.5)` : '1px solid rgba(255,255,255,0.07)',
              boxShadow: value === s.id ? '0 0 20px rgba(212,175,55,0.12)' : 'none',
            }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xs font-bold text-white leading-tight">{s.label}</div>
            {value === s.id && (
              <div className="mt-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: GOLD }}><Check className="w-2.5 h-2.5 text-black" /></div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepObjectifs({ value, onChange }) {
  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id]);
  };
  return (
    <div>
      <h2 className="text-xl font-black text-white mb-2">Vos objectifs principaux</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Sélectionnez un ou plusieurs objectifs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OBJECTIFS.map(o => {
          const sel = value.includes(o.id);
          return (
            <motion.button key={o.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => toggle(o.id)}
              className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
              style={{
                background: sel ? `${o.color}10` : 'rgba(255,255,255,0.04)',
                border: sel ? `1px solid ${o.color}50` : '1px solid rgba(255,255,255,0.07)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${o.color}15`, border: `1px solid ${o.color}28` }}>
                <o.icon className="w-5 h-5" style={{ color: o.color }} />
              </div>
              <span className="font-bold text-sm text-white flex-1">{o.label}</span>
              {sel && <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: o.color }}><Check className="w-3 h-3 text-black" /></div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepModules({ value, onChange }) {
  const toggleOption = (moduleId, optionId) => {
    const key = `${moduleId}__${optionId}`;
    onChange(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-black text-white mb-2">Composez votre solution</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Sélectionnez les modules et options souhaités.</p>
      <div className="space-y-4">
        {MODULES.map(mod => {
          const activeCount = mod.options.filter(o => value[`${mod.id}__${o.id}`]).length;
          return (
            <div key={mod.id} className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: activeCount > 0 ? `1px solid ${mod.color}30` : '1px solid rgba(255,255,255,0.07)' }}>
              {/* Module header */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}28` }}>
                  <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-black text-white text-sm">{mod.label}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{mod.desc}</div>
                </div>
                {activeCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${mod.color}15`, color: mod.color }}>
                    {activeCount} sél.
                  </span>
                )}
              </div>
              {/* Options */}
              <div className="px-4 pb-4 space-y-2">
                {mod.options.map(opt => {
                  const key = `${mod.id}__${opt.id}`;
                  const sel = !!value[key];
                  return (
                    <motion.div key={opt.id} whileHover={{ x: 3 }}
                      onClick={() => toggleOption(mod.id, opt.id)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: sel ? `${mod.color}08` : 'rgba(255,255,255,0.02)',
                        border: sel ? `1px solid ${mod.color}30` : '1px solid rgba(255,255,255,0.05)',
                      }}>
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={sel ? { background: mod.color } : { background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.15)` }}>
                        {sel && <Check className="w-3 h-3 text-black" />}
                      </div>
                      <span className="flex-1 text-xs font-semibold text-white">{opt.label}</span>
                      <span className="text-xs font-black flex-shrink-0" style={{ color: sel ? mod.color : 'rgba(255,255,255,0.3)' }}>
                        {opt.price ? `${opt.monthly ? '+' : ''}${opt.price}€${opt.monthly ? '/mois' : ''}` : 'Sur devis'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepBudgetDelai({ budget, delai, onBudget, onDelai }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white mb-2">Budget & délai</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Aucune obligation — cela aide Julien à vous proposer la meilleure option.</p>
        <h3 className="text-sm font-black text-white mb-3">Fourchette de budget envisagée</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BUDGETS.map(b => (
            <motion.button key={b.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onBudget(b.id)}
              className="flex items-center gap-2 p-3.5 rounded-2xl text-left transition-all"
              style={{
                background: budget === b.id ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                border: budget === b.id ? `1px solid rgba(212,175,55,0.45)` : '1px solid rgba(255,255,255,0.07)',
              }}>
              <span className="text-lg">{b.icon}</span>
              <span className="text-xs font-bold text-white">{b.label}</span>
              {budget === b.id && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0" style={{ color: GOLD }} />}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-black text-white mb-3">Délai souhaité</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {DELAIS.map(d => (
            <motion.button key={d.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onDelai(d.id)}
              className="flex-1 p-4 rounded-2xl text-center text-sm font-bold transition-all"
              style={{
                background: delai === d.id ? `${d.color}12` : 'rgba(255,255,255,0.04)',
                border: delai === d.id ? `1px solid ${d.color}50` : '1px solid rgba(255,255,255,0.07)',
                color: delai === d.id ? d.color : 'rgba(255,255,255,0.5)',
              }}>
              {d.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepContact({ form, onChange }) {
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)', color: 'white', outline: 'none' };
  const focusStyle = 'rgba(212,175,55,0.5)';
  return (
    <div>
      <h2 className="text-xl font-black text-white mb-2">Vos coordonnées</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Pour recevoir votre devis personnalisé sous 24h.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[{ l: 'Prénom *', k: 'firstName', req: true }, { l: 'Nom *', k: 'lastName', req: true }].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.l}</label>
              <input required={f.req} value={form[f.k]} onChange={e => onChange({ ...form, [f.k]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
                onFocus={e => e.target.style.borderColor = focusStyle}
                onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                placeholder={f.l.replace(' *', '')} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email *</label>
          <input required type="email" value={form.email} onChange={e => onChange({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusStyle}
            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
            placeholder="votre@email.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Téléphone</label>
          <input type="tel" value={form.phone} onChange={e => onChange({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusStyle}
            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
            placeholder="+32 494 ..." />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Entreprise / Activité</label>
          <input value={form.company} onChange={e => onChange({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusStyle}
            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
            placeholder="Nom de votre activité" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Précisions sur votre projet</label>
          <textarea value={form.message} onChange={e => onChange({ ...form, message: e.target.value })} rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={inputStyle}
            onFocus={e => e.target.style.borderColor = focusStyle}
            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
            placeholder="Décrivez votre projet, contraintes particulières, site existant..." />
        </div>
        <label className="flex items-start gap-3 cursor-pointer mt-2">
          <div onClick={() => onChange({ ...form, consent: !form.consent })}
            className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer transition-all"
            style={form.consent ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
            {form.consent && <span className="text-black text-xs font-black">✓</span>}
          </div>
          <PrivacyConsentNotice className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }} />
        </label>
      </div>
    </div>
  );
}

// ─── PRICE SUMMARY ───────────────────────────────────────────────────────────

function PriceSummary({ modules, secteur, objectifs }) {
  const selected = [];
  let oneTimeTotal = 0;
  let monthlyTotal = 0;
  let hasOnDevis = false;

  MODULES.forEach(mod => {
    mod.options.forEach(opt => {
      if (modules[`${mod.id}__${opt.id}`]) {
        selected.push({ ...opt, color: mod.color, moduleLabel: mod.label });
        if (!opt.price) hasOnDevis = true;
        else if (opt.monthly) monthlyTotal += opt.price;
        else oneTimeTotal += opt.price;
      }
    });
  });

  return (
    <div className="space-y-4">
      {/* Selected items */}
      {selected.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Aucun module sélectionné
        </p>
      ) : (
        <div className="space-y-1.5">
          {selected.map(item => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-white/70 leading-tight">{item.label}</span>
              </div>
              <span className="font-bold flex-shrink-0 ml-2" style={{ color: item.color }}>
                {item.price ? `${item.price}€${item.monthly ? '/m' : ''}` : 'Devis'}
              </span>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="pt-3 border-t space-y-2" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
          {oneTimeTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Investissement unique</span>
              <span className="text-base font-black" style={{ color: GOLD }}>
                {hasOnDevis ? `${oneTimeTotal}€ +` : `${oneTimeTotal}€`}
              </span>
            </div>
          )}
          {monthlyTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Abonnement mensuel</span>
              <span className="text-sm font-black" style={{ color: CYAN }}>{monthlyTotal}€/mois</span>
            </div>
          )}
          {hasOnDevis && (
            <div className="text-[10px] text-center py-1 rounded-lg"
              style={{ background: 'rgba(139,92,246,0.08)', color: PURPLE }}>
              Certaines options nécessitent un devis personnalisé
            </div>
          )}
        </div>
      )}

      {/* ROI hint */}
      {selected.length >= 2 && (
        <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3 h-3" style={{ color: '#22c55e' }} />
            <span className="font-bold" style={{ color: '#22c55e' }}>Combinaison recommandée</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Julien peut vous proposer un pack combiné à meilleur tarif.</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 'secteur', label: 'Secteur', short: '1' },
  { id: 'objectifs', label: 'Objectifs', short: '2' },
  { id: 'modules', label: 'Solution', short: '3' },
  { id: 'budget', label: 'Budget', short: '4' },
  { id: 'contact', label: 'Contact', short: '5' },
];

export default function SaasDevis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [secteur, setSecteur] = useState(null);
  const [objectifs, setObjectifs] = useState([]);
  const [modules, setModules] = useState({});
  const [budget, setBudget] = useState(null);
  const [delai, setDelai] = useState(null);
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', message: '', consent: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canNext = () => {
    if (currentStep === 0) return !!secteur;
    if (currentStep === 1) return objectifs.length > 0;
    if (currentStep === 2) return Object.keys(modules).length > 0;
    if (currentStep === 3) return true;
    if (currentStep === 4) return contact.firstName && contact.lastName && contact.email && contact.consent;
    return false;
  };

  const computeTotal = () => {
    let oneTime = 0, monthly = 0, hasDevis = false;
    MODULES.forEach(mod => {
      mod.options.forEach(opt => {
        if (modules[`${mod.id}__${opt.id}`]) {
          if (!opt.price) hasDevis = true;
          else if (opt.monthly) monthly += opt.price;
          else oneTime += opt.price;
        }
      });
    });
    return { oneTime, monthly, hasDevis };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { oneTime, monthly, hasDevis } = computeTotal();
    const selectedItems = [];
    MODULES.forEach(mod => mod.options.forEach(opt => {
      if (modules[`${mod.id}__${opt.id}`]) selectedItems.push(opt.label);
    }));

    const budgetLabel = BUDGETS.find(b => b.id === budget)?.label || '';
    const delaiLabel = DELAIS.find(d => d.id === delai)?.label || '';
    const secteurLabel = SECTEURS.find(s => s.id === secteur)?.label || '';

    const messageText = [
      `=== DEVIS INTERACTIF ===`,
      `Secteur: ${secteurLabel}`,
      `Objectifs: ${objectifs.join(', ')}`,
      `Modules sélectionnés: ${selectedItems.join(', ')}`,
      `Budget envisagé: ${budgetLabel}`,
      `Délai: ${delaiLabel}`,
      `Estimation unique: ${oneTime}€${hasDevis ? ' + devis' : ''}`,
      `Estimation mensuelle: ${monthly}€/mois`,
      contact.message ? `\nPrécisions: ${contact.message}` : '',
    ].filter(Boolean).join('\n');

    await platform.entities.Lead.create({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      sector: secteurLabel,
      need: objectifs.join(', '),
      budget: budgetLabel,
      message: messageText,
      source: 'formulaire',
      status: 'nouveau',
      consentRgpd: true,
    });
    setSubmitted(true);
    setLoading(false);
  };

  const { oneTime, monthly, hasDevis } = computeTotal();
  const selectedCount = Object.keys(modules).length;

  if (submitted) {
    const { oneTime, monthly, hasDevis } = computeTotal();
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.35)', boxShadow: '0 0 80px rgba(212,175,55,0.15)' }}>
            <CheckCircle className="w-14 h-14" style={{ color: GOLD }} />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-4">Devis envoyé !</h1>
          <p className="text-base mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Julien analyse votre configuration et vous répond personnellement sous <span style={{ color: GOLD }}>24h</span> avec une proposition sur mesure.
          </p>

          {(oneTime > 0 || monthly > 0) && (
            <div className="flex justify-center gap-6 mb-8">
              {oneTime > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color: GOLD }}>{oneTime}€{hasDevis ? '+' : ''}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Investissement unique</div>
                </div>
              )}
              {monthly > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color: CYAN }}>{monthly}€/mois</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Abonnement mensuel</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
              style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>
              <MessageCircle className="w-4 h-4" /> Continuer sur WhatsApp
            </a>
            <button onClick={() => { setSubmitted(false); setCurrentStep(0); setSecteur(null); setObjectifs([]); setModules({}); setBudget(null); setDelai(null); setContact({ firstName: '', lastName: '', email: '', phone: '', company: '', message: '', consent: false }); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Nouveau devis
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-8 pb-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Devis interactif gratuit
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Construisez votre{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              solution IA
            </span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>Sélectionnez vos modules, obtenez une estimation instantanée.</p>
        </div>

        {/* Steps progress */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${i <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                style={i === currentStep
                  ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                  : i < currentStep
                  ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {i < currentStep ? <Check className="w-3 h-3" /> : <span>{s.short}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-4 h-px flex-shrink-0" style={{ background: i < currentStep ? '#22c55e40' : 'rgba(255,255,255,0.1)' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.15)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />

              <AnimatePresence mode="wait">
                <motion.div key={currentStep}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  {currentStep === 0 && <StepSecteur value={secteur} onChange={setSecteur} />}
                  {currentStep === 1 && <StepObjectifs value={objectifs} onChange={setObjectifs} />}
                  {currentStep === 2 && <StepModules value={modules} onChange={setModules} />}
                  {currentStep === 3 && <StepBudgetDelai budget={budget} delai={delai} onBudget={setBudget} onDelai={setDelai} />}
                  {currentStep === 4 && <StepContact form={contact} onChange={setContact} />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <motion.button onClick={() => setCurrentStep(s => s + 1)} disabled={!canNext()}
                    whileHover={canNext() ? { scale: 1.04 } : {}} whileTap={canNext() ? { scale: 0.97 } : {}}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-black disabled:opacity-40 transition-all"
                    style={{ background: canNext() ? `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` : 'rgba(255,255,255,0.1)', color: canNext() ? '#000' : 'rgba(255,255,255,0.3)' }}>
                    Suivant <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmit}
                    disabled={loading || !canNext()}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-black text-black disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                    {loading
                      ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-4 h-4" /></motion.div> Envoi...</>
                      : <><Send className="w-4 h-4" /> Envoyer mon devis</>}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="lg:block">
            <div className="sticky top-24 p-5 rounded-3xl"
              style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(212,175,55,0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

              <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(212,175,55,0.6)' }}>Votre devis en cours</div>

              {/* Context pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {secteur && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: `${CYAN}10`, color: CYAN, border: `1px solid ${CYAN}20` }}>
                    {SECTEURS.find(s => s.id === secteur)?.icon} {SECTEURS.find(s => s.id === secteur)?.label}
                  </span>
                )}
                {objectifs.map(o => (
                  <span key={o} className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: `${PURPLE}10`, color: PURPLE, border: `1px solid ${PURPLE}20` }}>
                    {OBJECTIFS.find(obj => obj.id === o)?.label}
                  </span>
                ))}
              </div>

              <PriceSummary modules={modules} secteur={secteur} objectifs={objectifs} />

              {/* Total */}
              {(oneTime > 0 || monthly > 0) && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                  {oneTime > 0 && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white/60">Total unique</span>
                      <span className="text-xl font-black" style={{ color: GOLD }}>
                        {oneTime}€{hasDevis ? '+' : ''}
                      </span>
                    </div>
                  )}
                  {monthly > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/60">Mensuel</span>
                      <span className="text-base font-black" style={{ color: CYAN }}>{monthly}€/mois</span>
                    </div>
                  )}
                </div>
              )}

              {/* WA shortcut */}
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-xs font-bold transition-all"
                style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}>
                <MessageCircle className="w-4 h-4" /> Parler directement à Julien
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
