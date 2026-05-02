import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, TrendingUp, Zap, Cpu, Check, Plus, Minus, ChevronRight,
  Sparkles, Info, ToggleLeft, ToggleRight
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const BASE_PACKS = [
  {
    id: 'starter', icon: Globe, name: 'Pack Starter', basePrice: 490, color: CYAN,
    desc: 'Site vitrine + formulaire + WhatsApp + SEO',
    includes: ['Site vitrine (3-5 pages)', 'Formulaire contact', 'Bouton WhatsApp', 'SEO de base', 'Google Business Profile'],
  },
  {
    id: 'business', icon: TrendingUp, name: 'Pack Business', basePrice: 990, color: GOLD, popular: true,
    desc: 'Site avancé + chatbot + CRM + automatisation',
    includes: ['Tout Starter', 'Site avancé (8 pages)', 'Chatbot qualification IA', 'CRM prospects', 'Séquence email 4 étapes'],
  },
  {
    id: 'automation', icon: Zap, name: 'Pack Automation', basePrice: 1490, color: PURPLE,
    desc: 'Automatisations + dashboards + workflows',
    includes: ['Tout Business', 'Analyse processus', 'Automatisations sur mesure', 'Tableaux de bord', 'Intégration WhatsApp/email'],
  },
  {
    id: 'premium', icon: Cpu, name: 'Pack IA Premium', basePrice: null, color: '#EC4899',
    desc: 'Agents IA + espace client + dashboard complet',
    includes: ['Tout Automation', 'Agents IA spécialisés', 'Espace client sécurisé', 'Dashboard admin complet', 'Validation humaine'],
  },
];

const OPTIONS = [
  { id: 'chatbot', label: 'Chatbot IA supplémentaire', price: 149, color: CYAN, desc: 'Agent conversationnel additionnel configuré pour votre métier.' },
  { id: 'seo_content', label: 'Contenu SEO mensuel', price: 199, color: GOLD, desc: '4 articles SEO générés et validés par mois.' },
  { id: 'social', label: 'Posts réseaux sociaux', price: 99, color: PURPLE, desc: '12 posts/mois sur Facebook, Instagram, LinkedIn.' },
  { id: 'drone', label: 'Vidéo drone', price: 299, color: '#F59E0B', desc: 'Tournage + montage vidéo aérienne professionnelle.' },
  { id: 'maintenance', label: 'Maintenance mensuelle', price: 79, color: '#22c55e', desc: 'Mises à jour, sécurité, support prioritaire.' },
  { id: 'agent_audit', label: 'Agent Audit Client IA', price: 199, color: '#EC4899', desc: 'Analyse automatique de chaque nouveau prospect.' },
  { id: 'agent_content', label: 'Agent Contenu IA', price: 249, color: CYAN, desc: 'Génération de contenus multi-plateformes avec validation.' },
  { id: 'extra_page', label: 'Pages supplémentaires', price: 99, color: GOLD, desc: 'Par page additionnelle au-delà du pack choisi.', qty: true },
  { id: 'app_mobile', label: 'Application mobile', price: null, color: PURPLE, desc: 'iOS & Android — prix sur devis selon complexité.' },
];

export default function PackConfigurator({ onComplete }) {
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [extraPages, setExtraPages] = useState(1);

  const toggleOption = (id) => {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedPackData = BASE_PACKS.find(p => p.id === selectedPack);

  const totalPrice = () => {
    if (!selectedPackData) return 0;
    let total = selectedPackData.basePrice || 0;
    OPTIONS.forEach(opt => {
      if (selectedOptions[opt.id] && opt.price) {
        total += opt.id === 'extra_page' ? opt.price * extraPages : opt.price;
      }
    });
    return total;
  };

  const activeOptions = OPTIONS.filter(o => selectedOptions[o.id]);
  const hasCustom = activeOptions.some(o => !o.price) || selectedPackData?.basePrice === null;

  const handleValidate = () => {
    if (!selectedPack) return;
    const summary = {
      pack: selectedPackData.name,
      options: activeOptions.map(o => o.id === 'extra_page' ? `${o.label} x${extraPages}` : o.label),
      estimatedPrice: hasCustom ? 'Sur devis' : `À partir de ${totalPrice()}€`,
      extraPages: selectedOptions['extra_page'] ? extraPages : 0,
    };
    onComplete(summary);
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Choose base pack */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }}>1</div>
          <h3 className="font-black text-white text-sm">Choisissez votre pack de base</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BASE_PACKS.map(pack => (
            <motion.button key={pack.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPack(pack.id)}
              className="relative p-4 rounded-2xl text-left transition-all overflow-hidden"
              style={{
                background: selectedPack === pack.id ? `${pack.color}12` : 'rgba(255,255,255,0.03)',
                border: selectedPack === pack.id ? `1px solid ${pack.color}60` : `1px solid rgba(255,255,255,0.07)`,
                boxShadow: selectedPack === pack.id ? `0 0 25px ${pack.color}18` : 'none',
              }}>
              {pack.popular && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>⭐</div>
              )}
              {selectedPack === pack.id && (
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${pack.color}80, transparent)` }} />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${pack.color}15`, border: `1px solid ${pack.color}30` }}>
                  <pack.icon className="w-4.5 h-4.5" style={{ color: pack.color }} />
                </div>
                <div>
                  <div className="font-black text-white text-sm">{pack.name}</div>
                  <div className="text-xs font-bold" style={{ color: pack.color }}>
                    {pack.basePrice ? `À partir de ${pack.basePrice}€` : 'Sur devis'}
                  </div>
                </div>
                {selectedPack === pack.id && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: pack.color }}>
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>{pack.desc}</p>
              {selectedPack === pack.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t" style={{ borderColor: `${pack.color}20` }}>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.includes.map(inc => (
                      <span key={inc} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: `${pack.color}10`, color: pack.color }}>
                        {inc}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 2: Add options */}
      <AnimatePresence>
        {selectedPack && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }}>2</div>
              <h3 className="font-black text-white text-sm">Personnalisez avec des options</h3>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>(facultatif)</span>
            </div>
            <div className="space-y-2">
              {OPTIONS.map(opt => (
                <motion.div key={opt.id} whileHover={{ x: 2 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: selectedOptions[opt.id] ? `${opt.color}08` : 'rgba(255,255,255,0.03)',
                    border: selectedOptions[opt.id] ? `1px solid ${opt.color}35` : '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={() => toggleOption(opt.id)}>
                  {/* Toggle */}
                  <div className="flex-shrink-0">
                    {selectedOptions[opt.id]
                      ? <div className="w-10 h-5 rounded-full relative" style={{ background: opt.color }}>
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-black" />
                        </div>
                      : <div className="w-10 h-5 rounded-full relative" style={{ background: 'rgba(255,255,255,0.12)' }}>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white/40" />
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{opt.label}</span>
                      <span className="text-xs font-black" style={{ color: opt.color }}>
                        {opt.price ? `+${opt.price}€` : 'Sur devis'}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>{opt.desc}</p>
                  </div>
                  {/* Extra pages qty */}
                  {opt.id === 'extra_page' && selectedOptions['extra_page'] && (
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setExtraPages(Math.max(1, extraPages - 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-sm font-black text-white w-4 text-center">{extraPages}</span>
                      <button onClick={() => setExtraPages(extraPages + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary + CTA */}
      <AnimatePresence>
        {selectedPack && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-5 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.28)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Votre configuration</div>
                <div className="font-black text-white text-base">{selectedPackData?.name}</div>
                {activeOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeOptions.map(o => (
                      <span key={o.id} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${o.color}12`, color: o.color, border: `1px solid ${o.color}25` }}>
                        + {o.id === 'extra_page' ? `${o.label} ×${extraPages}` : o.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Estimation</div>
                <div className="text-xl font-black" style={{ color: GOLD }}>
                  {hasCustom ? 'Sur devis' : `${totalPrice()}€`}
                </div>
                {!hasCustom && <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>hors maintenance</div>}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
              onClick={handleValidate}
              className="w-full py-3.5 rounded-2xl font-black text-black flex items-center justify-center gap-2 text-sm"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 20px rgba(212,175,55,0.3)` }}>
              <Sparkles className="w-4 h-4" />
              Valider ma configuration
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedPack && (
        <p className="text-center text-xs py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          ← Choisissez un pack pour voir les options et estimer votre budget
        </p>
      )}
    </div>
  );
}