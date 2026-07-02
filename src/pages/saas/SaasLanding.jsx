import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Globe, Palette, Zap, Users, CheckCircle,
  Star, ChevronRight, MessageCircle, QrCode, Ticket, Image,
  FileText, Smartphone, BarChart3, Play, Check
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';
const PURPLE_S = '#8B5CF6';
const CYAN = '#06B6D4';
const MAGENTA = '#FF1B47';
const GREEN = '#22c55e';
const NOIR = '#0B0B0F';
const BLEU_NUIT = '#0F172A';
const WA = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20souhaite%20créer%20mon%20projet.';

function Reveal({ children, delay = 0, y = 28 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function NeuralBg() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      c: [GOLD, PURPLE, CYAN][Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        nodes.slice(i + 1).forEach(m => {
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.045 * (1 - d / 110)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.c + '55';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none opacity-40" style={{ zIndex: 2 }} />;
}

// ── Before/After Branding Demo ──────────────────────────────────────────────
function BrandingDemo() {
  const [showAfter, setShowAfter] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setShowAfter(p => !p), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!showAfter ? (
          <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>⛔ AVANT</div>
            <div className="space-y-3">
              <div className="h-8 rounded bg-gray-700/40 w-3/4" />
              <div className="h-24 rounded bg-gray-700/30 w-full" />
              <div className="flex gap-2">
                <div className="h-8 rounded bg-gray-700/40 w-1/3" />
                <div className="h-8 rounded bg-gray-700/30 w-1/4" />
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Site basique · Pas de cohérence · Zéro conversion</div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="after" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, rgba(212,175,55,0.08), rgba(139,92,246,0.08))`, border: `1px solid rgba(212,175,55,0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: GOLD }}>✅ APRÈS — 48H</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-xs"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>JS</div>
                <div>
                  <div className="text-white font-black text-sm">JS-Luxe Boutique</div>
                  <div className="text-xs" style={{ color: GOLD }}>Identité premium · 100% sur mesure</div>
                </div>
              </div>
              <div className="h-20 rounded-xl w-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}15, ${PURPLE}15)`, border: `1px solid ${GOLD}20` }}>
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Site web · Branding · Contenus</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-7 rounded-lg flex items-center justify-center text-xs font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>Découvrir</div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${PURPLE}20`, border: `1px solid ${PURPLE}30` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
                </div>
              </div>
              <div className="text-xs font-semibold" style={{ color: GREEN }}>
                ✓ Branding · ✓ Site · ✓ Réseaux · ✓ Automatisation
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-3">
        {[false, true].map((s) => (
          <button key={String(s)} onClick={() => setShowAfter(s)}
            className="w-2 h-2 rounded-full transition-all"
            style={{ background: showAfter === s ? GOLD : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}

// ── Smart Project Form ──────────────────────────────────────────────────────
function ProjectForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', activity: '',
    needs: [], visual_style: '', colors: '', budget: '', message: '',
  });

  const NEEDS = [
    { id: 'site_web', label: 'Site web', icon: Globe },
    { id: 'carte_visite', label: 'Carte de visite', icon: FileText },
    { id: 'affiches', label: 'Affiches / Bâches', icon: Image },
    { id: 'reseaux', label: 'Réseaux sociaux', icon: Smartphone },
    { id: 'automatisation', label: 'Automatisation business', icon: Zap },
    { id: 'billetterie', label: 'Billetterie (QR code)', icon: Ticket },
  ];
  const STYLES = [
    { id: 'moderne', label: 'Moderne', desc: 'Épuré, tech, minimaliste' },
    { id: 'luxe', label: 'Luxe', desc: 'Raffiné, premium, élégant' },
    { id: 'fun', label: 'Fun', desc: 'Coloré, dynamique, créatif' },
    { id: 'corporate', label: 'Corporate', desc: 'Professionnel, sérieux' },
  ];
  const BUDGETS = ['< 500€', '500€ - 1500€', '1500€ - 3000€', '3000€ - 6000€', '> 6000€'];

  const toggleNeed = (id) => {
    setForm(p => ({
      ...p,
      needs: p.needs.includes(id) ? p.needs.filter(n => n !== id) : [...p.needs, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.email) return;
    setLoading(true);
    await base44.functions.invoke('submitClientProject', form);
    setLoading(false);
    // Redirect to contact page with pre-filled data → PackConfigurator
    const prefill = encodeURIComponent(JSON.stringify({
      name: form.name,
      email: form.email,
      phone: form.phone,
      activity: form.activity,
      message: form.message,
    }));
    onSuccess({ prefill });
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: 'white',
    padding: '12px 16px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: s <= step ? `linear-gradient(90deg, ${GOLD}, ${GOLD_L})` : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <h3 className="font-black text-white text-lg">Parlez-nous de vous</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Votre prénom / nom" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={inputStyle} />
              <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle} />
            </div>
            <input placeholder="Téléphone (optionnel)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              style={inputStyle} />
            <input placeholder="Votre activité (ex: coiffure, restaurant, e-commerce…) *" value={form.activity}
              onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} style={inputStyle} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => form.email && form.activity && setStep(2)}
              disabled={!form.email || !form.activity}
              className="w-full py-3.5 rounded-2xl font-black text-black text-sm flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
              Continuer <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-5">
            <h3 className="font-black text-white text-lg">Vos besoins & style</h3>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>De quoi avez-vous besoin ?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NEEDS.map(n => (
                  <button key={n.id} onClick={() => toggleNeed(n.id)}
                    className="p-3 rounded-xl text-left transition-all flex items-center gap-2"
                    style={{
                      background: form.needs.includes(n.id) ? `${GOLD}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.needs.includes(n.id) ? GOLD + '40' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <n.icon className="w-4 h-4 flex-shrink-0" style={{ color: form.needs.includes(n.id) ? GOLD : 'rgba(255,255,255,0.4)' }} />
                    <span className="text-xs font-semibold" style={{ color: form.needs.includes(n.id) ? GOLD : 'rgba(255,255,255,0.6)' }}>
                      {n.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Style visuel souhaité</p>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setForm(p => ({ ...p, visual_style: s.id }))}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      background: form.visual_style === s.id ? `${PURPLE}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${form.visual_style === s.id ? PURPLE + '50' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <div className="text-sm font-black text-white">{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <input placeholder="Couleurs souhaitées (ex: noir et or, bleu marine…)" value={form.colors}
              onChange={e => setForm(p => ({ ...p, colors: e.target.value }))} style={inputStyle} />
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>← Retour</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-2xl font-black text-black text-sm flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Continuer <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <h3 className="font-black text-white text-lg">Budget & détails</h3>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget estimé</p>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => setForm(p => ({ ...p, budget: b }))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: form.budget === b ? `${CYAN}15` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.budget === b ? CYAN + '50' : 'rgba(255,255,255,0.08)'}`,
                      color: form.budget === b ? CYAN : 'rgba(255,255,255,0.55)',
                    }}>{b}</button>
                ))}
              </div>
            </div>
            <textarea placeholder="Décrivez votre projet en quelques mots (optionnel)" value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3}
              style={{ ...inputStyle, resize: 'none' }} />
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>← Retour</button>
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-2xl font-black text-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Génération en cours…
                  </>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Créer mon projet</>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
// ── Exit-Intent Popup ────────────────────────────────────────────────────────
function ExitIntentPopup({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl p-8 text-center overflow-hidden"
        style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.3)`, boxShadow: '0 0 80px rgba(212,175,55,0.12)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 text-xl leading-none">✕</button>

        <div className="text-4xl mb-4">⚡</div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
          Offre spéciale · 10% de réduction
        </div>
        <h3 className="text-2xl font-black text-white mb-2 leading-tight">
          Attendez ! Votre projet mérite mieux.
        </h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Configurez votre pack en 2 minutes et obtenez <span style={{ color: GOLD }}>-10% sur votre premier projet</span> si vous commandez aujourd'hui.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/saas-contact" onClick={onClose}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-black text-black text-sm flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.35)` }}>
              <Sparkles className="w-4 h-4" /> Configurer mon pack maintenant
            </motion.button>
          </Link>
          <button onClick={onClose} className="text-xs py-2 transition-colors" style={{ color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}>
            Non merci, je reviendrai plus tard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SaasLanding() {
  const [formSuccess, setFormSuccess] = useState(null);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const exitIntentFired = useRef(false);
  const navigate = useNavigate();

  const handleFormSuccess = (data) => {
    setFormSuccess(data);
    // Auto-redirect after 1.5s to the PackConfigurator with pre-filled data
    setTimeout(() => {
      navigate(`/saas-contact?prefill=${data.prefill}`);
    }, 1500);
  };

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !exitIntentFired.current) {
        exitIntentFired.current = true;
        setShowExitPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const services = [
    { icon: Palette, color: GOLD, title: 'Branding & Design', desc: 'Logo, charte graphique, identité visuelle complète livrée en 48h.' },
    { icon: Globe, color: CYAN, title: 'Création de site web', desc: 'Sites vitrines, landing pages et e-commerce performants.' },
    { icon: Zap, color: PURPLE, title: 'Automatisation business', desc: 'Workflows intelligents qui tournent 24/7 sans intervention.' },
    { icon: Smartphone, color: '#EC4899', title: 'Contenus réseaux sociaux', desc: 'Posts, stories, vidéos générés et planifiés automatiquement.' },
    { icon: QrCode, color: '#F59E0B', title: 'Billetterie & Événements', desc: 'Vente de tickets, QR codes, gestion des entrées en temps réel.' },
  ];

  const steps = [
    { n: '01', title: 'Vous décrivez votre projet', desc: 'Remplissez le formulaire intelligent. 3 minutes suffisent.', color: CYAN },
    { n: '02', title: 'Nous générons votre identité', desc: 'Notre équipe crée vos premiers visuels et mockups.', color: GOLD },
    { n: '03', title: 'Vous recevez une offre', desc: 'Offre personnalisée avec visuels et prix clairs.', color: PURPLE },
    { n: '04', title: 'Vous validez avec un acompte', desc: 'Paiement sécurisé via Stripe. Simple et rapide.', color: '#EC4899' },
    { n: '05', title: 'Livraison en 48h à 7 jours', desc: 'Votre projet complet livré dans l\'espace client.', color: GREEN },
  ];

  const contentExamples = [
    { platform: 'Instagram', icon: '📸', color: '#E1306C', example: 'Post carré · Story animée · Carrousel produit' },
    { platform: 'TikTok', icon: '🎵', color: '#010101', example: 'Script vidéo · Sous-titres auto · Hook accrocheur' },
    { platform: 'Facebook', icon: '📘', color: '#1877F2', example: 'Visuel événement · Post sponsorisé · Cover' },
    { platform: 'YouTube', icon: '▶️', color: '#FF0000', example: 'Thumbnail · Shorts 60s · Description SEO' },
  ];

  const pricingPlans = [
    {
      name: 'Starter', price: '149€', color: CYAN, badge: null,
      desc: 'Idéal pour débuter avec une image pro',
      features: ['Carte de visite recto/verso', '3 visuels réseaux sociaux', '2 formats (carré + story)', 'Livraison 48h', '1 modification incluse'],
    },
    {
      name: 'Pro', price: '399€', color: GOLD, badge: '⭐ Populaire',
      desc: 'Branding complet + présence digitale',
      features: ['Branding complet (logo + charte)', '10 visuels réseaux sociaux', 'Mini site vitrine (3 pages)', 'Carte de visite incluse', '3 modifications', 'Livraison 72h'],
    },
    {
      name: 'Business', price: '899€', color: PURPLE, badge: null,
      desc: 'La solution complète pour scaler',
      features: ['Tout le pack Pro', 'Site web complet (6 pages)', 'Contenus réseaux (1 mois)', 'Automatisation email/WhatsApp', 'Dashboard de suivi', 'Support prioritaire 1 mois'],
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: 'white' }}>
      <AnimatePresence>
        {showExitPopup && <ExitIntentPopup onClose={() => setShowExitPopup(false)} />}
      </AnimatePresence>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-5 pt-20 pb-16">
        {/* ══ VIDEO HERO — promo JS-Innov.IA (muted/playsInline/autoPlay/loop pour compat mobile) ══ */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="https://base44.app/api/apps/6a1845e17cc526d1e44965bc/files/mp/public/6a1845e17cc526d1e44965bc/27927ee4f_promo_video.mp4" type="video/mp4" />
        </video>
        {/* Voile navy pour garder le thème actuel et la lisibilité du texte */}
        <div className="absolute inset-0" style={{ zIndex: 1, background: `linear-gradient(180deg, ${NOIR}CC 0%, ${NOIR}99 35%, ${NOIR}E8 100%)` }} />

        <NeuralBg />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px]"
            style={{ background: `radial-gradient(circle, ${GOLD}25, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${PURPLE}35, transparent 70%)` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Livraison express · 48h garanties
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-5 font-cinzel">
              <span className="block text-white">Automatisez votre business</span>
              <span className="block text-gold-shimmer">et recevez votre identité</span>
              <span className="block font-poppins font-light mt-1" style={{ fontSize: '0.7em', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em' }}>en 48h.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="text-lg mb-8 leading-relaxed font-poppins" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
              JS-Innov.IA crée, automatise et livre votre branding, site web et contenus marketing — sans complexité.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8">
              <a href="#formulaire">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary-gold gold-glow-pulse flex items-center gap-2 px-7 py-4 text-sm">
                  <Sparkles className="w-4 h-4" /> Créer mon projet
                </motion.button>
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm font-poppins"
                  style={{ borderColor: 'rgba(37,211,102,0.35)', border: '1px solid rgba(37,211,102,0.35)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}>
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </motion.button>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6">
              {[{ v: '48h', l: 'Livraison express' }, { v: '100%', l: 'Sur mesure' }, { v: '5★', l: 'Satisfaction' }, { v: 'RGPD', l: 'Conforme' }].map(s => (
                <div key={s.l} className="text-center">
                  <div className="text-2xl font-black" style={{ color: GOLD }}>{s.v}</div>
                  <div className="text-xs mt-0.5 tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <BrandingDemo />
          </motion.div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)`, color: GOLD }}>
                <Sparkles className="w-3 h-3" /> Nos services
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Tout pour votre présence digitale</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                De l'identité visuelle à l'automatisation complète, nous livrons vite et bien.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <motion.div whileHover={{ y: -6, scale: 1.01 }} className="group p-6 rounded-2xl relative overflow-hidden h-full"
                  style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${s.color}15` }}>
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.color}70, transparent)` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
            <Reveal delay={0.35}>
              <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full"
                style={{ background: `linear-gradient(135deg, ${GOLD}06, ${PURPLE}06)`, border: `1px solid rgba(212,175,55,0.2)`, minHeight: 180 }}>
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm font-bold text-white mb-3">Prêt à vous lancer ?</p>
                <a href="#formulaire">
                  <button className="px-5 py-2.5 rounded-xl text-xs font-black text-black"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                    Créer mon projet →
                  </button>
                </a>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ═════════════════════════════════════════════ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(6,182,212,0.08)', border: `1px solid rgba(6,182,212,0.2)`, color: CYAN }}>
                Comment ça marche
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Simple, rapide, efficace</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>5 étapes pour passer de zéro à une présence digitale complète.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.09}>
                <div className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px z-0" style={{ background: `linear-gradient(90deg, ${s.color}40, transparent)` }} />
                  )}
                  <div className="relative z-10 p-5 rounded-2xl h-full" style={{ background: 'rgba(10,8,22,0.7)', border: `1px solid ${s.color}15` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                      <span className="text-base font-black" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <h3 className="font-black text-white text-xs mb-1.5">{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FORMULAIRE INTELLIGENT ════════════════════════════════════════ */}
      <section id="formulaire" className="py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: `rgba(212,175,55,0.08)`, border: `1px solid rgba(212,175,55,0.25)`, color: GOLD }}>
                <Sparkles className="w-3 h-3" /> Créer mon projet
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Décrivez votre projet</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                3 minutes · Offre personnalisée générée · Email de confirmation immédiat
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="p-8 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.22)`, boxShadow: '0 0 60px rgba(212,175,55,0.06)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
              <AnimatePresence mode="wait">
                {formSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: 2 }}
                      className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                      style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}30` }}>✅</motion.div>
                    <h3 className="text-xl font-black text-white mb-2">Projet reçu !</h3>
                    <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Parfait ! On vous redirige vers le configurateur de pack…
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: `${GOLD}60`, borderTopColor: GOLD }} />
                      <span className="text-xs font-semibold" style={{ color: GOLD }}>Chargement du configurateur…</span>
                    </div>
                  </motion.div>
                ) : (
                  <ProjectForm onSuccess={handleFormSuccess} />
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CONTENU AUTOMATISÉ ════════════════════════════════════════════ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid rgba(139,92,246,0.2)`, color: PURPLE }}>
                Contenus automatisés
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Vos contenus, partout, en continu</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Posts, vidéos, stories — créés et planifiés automatiquement selon votre identité.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contentExamples.map((c, i) => (
              <Reveal key={c.platform} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6 }} className="p-5 rounded-2xl text-center"
                  style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${c.color}18` }}>
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="font-black text-white text-sm mb-1">{c.platform}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{c.example}</div>
                  <div className="mt-3 w-2 h-2 rounded-full mx-auto animate-pulse" style={{ background: GREEN }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVENTS ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(245,158,11,0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, #F59E0B, transparent)` }} />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(245,158,11,0.08)' }} />
              <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
                    style={{ background: 'rgba(245,158,11,0.1)', border: `1px solid rgba(245,158,11,0.25)`, color: '#F59E0B' }}>
                    <Ticket className="w-3 h-3" /> Module Événements
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">
                    Créez et gérez vos événements <span style={{ color: '#F59E0B' }}>facilement</span>
                  </h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    Vente de tickets en ligne, génération de QR codes uniques, scan à l'entrée et gestion des participants en temps réel.
                  </p>
                  {[
                    { icon: Ticket, text: 'Vente de tickets en ligne (Stripe)' },
                    { icon: QrCode, text: 'QR code unique par participant' },
                    { icon: Users, text: 'Gestion & scan des entrées' },
                    { icon: BarChart3, text: 'Tableau de bord participants' },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <f.icon className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      </div>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.text}</span>
                    </div>
                  ))}
                  <Link to="/saas-events">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="mt-4 flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-black text-sm"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                      <Ticket className="w-4 h-4" /> Créer mon événement
                    </motion.button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-black text-white">Soirée Networking Pro</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>En ligne</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <span>📅 15 juin 2026</span>
                      <span>🎟 42 / 80 tickets</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '52%', background: '#F59E0B' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Tickets vendus', val: '42', color: '#F59E0B' },
                      { label: 'Revenus', val: '2 100€', color: GREEN },
                      { label: 'Scannés', val: '0', color: CYAN },
                      { label: 'Restants', val: '38', color: PURPLE },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}18` }}>
                        <div className="text-lg font-black" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRICING ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)`, color: GOLD }}>
                Tarifs clairs
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Prix transparents, résultats garantis</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Pas de surprise. Pas de frais cachés.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {pricingPlans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="relative p-7 rounded-3xl flex flex-col h-full"
                  style={{
                    background: p.badge ? `rgba(212,175,55,0.06)` : 'rgba(10,8,22,0.85)',
                    border: p.badge ? `1px solid rgba(212,175,55,0.3)` : `1px solid ${p.color}20`,
                    boxShadow: p.badge ? `0 0 50px rgba(212,175,55,0.08)` : 'none',
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }} />
                  {p.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-black"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>{p.badge}</div>
                  )}
                  <div className="mb-5">
                    <div className="text-3xl font-black" style={{ color: p.color }}>{p.price}</div>
                    <div className="font-black text-white text-lg mt-1">{p.name}</div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.desc}</div>
                  </div>
                  <div className="space-y-2 flex-1 mb-6">
                    {p.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.58)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={`/saas-contact?pack=${encodeURIComponent(p.name)}`}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-2xl font-black text-sm transition-all"
                      style={p.badge
                        ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                        : { background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}28` }}>
                      Choisir ce pack →
                    </motion.button>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Subscription */}
          <Reveal delay={0.3}>
            <div className="p-7 rounded-2xl text-center" style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(6,182,212,0.2)` }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: CYAN }}>Abonnements mensuels</div>
              <div className="flex flex-wrap justify-center gap-5 mb-4">
                {[
                  { label: 'Maintenance', price: '29€/mois', desc: 'Mises à jour + support' },
                  { label: 'Contenus', price: '59€/mois', desc: '8 posts réseaux / mois' },
                  { label: 'Full service', price: '99€/mois', desc: 'Contenus + maintenance + rapport' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-black" style={{ color: CYAN }}>{s.price}</div>
                    <div className="text-sm font-bold text-white">{s.label}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <a href="#formulaire">
                <button className="px-6 py-2.5 rounded-xl text-xs font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${CYAN}, #22D3EE)` }}>
                  Démarrer un abonnement →
                </button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative p-14 md:p-20 rounded-3xl text-center overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.25)`, boxShadow: '0 0 80px rgba(212,175,55,0.07)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />
              <div className="relative z-10">
                <div className="text-4xl mb-5">🚀</div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Lancez votre projet<br />
                  <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    maintenant
                  </span>
                </h2>
                <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Décrivez votre projet en 3 minutes. Recevez votre offre. Démarrez dès aujourd'hui.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="#formulaire">
                    <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
                      className="btn-primary-gold gold-glow-pulse flex items-center gap-2 px-10 py-5 text-base">
                      <Sparkles className="w-5 h-5" /> Créer mon projet
                    </motion.button>
                  </a>
                  <a href={WA} target="_blank" rel="noopener noreferrer">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-10 py-5 rounded-2xl font-semibold border text-base"
                      style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}>
                      <MessageCircle className="w-5 h-5" /> WhatsApp direct
                    </motion.button>
                  </a>
                </div>
                <div className="flex flex-wrap justify-center gap-5 mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {['Sans engagement', 'Réponse sous 24h', 'Paiement sécurisé Stripe', 'RGPD conforme'].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" style={{ color: 'rgba(212,175,55,0.5)' }} /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}