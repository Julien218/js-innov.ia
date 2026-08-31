import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';

export default function LandingHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { v: '48h', l: 'Livraison express' },
    { v: '100%', l: 'Sur mesure' },
    { v: '24/7', l: 'IA + Humain' },
    { v: 'RGPD', l: 'Cadre appliqué' },
  ];

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center overflow-hidden px-5 pt-24 pb-16">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: `radial-gradient(circle, ${GOLD}30, transparent 70%)` }} />
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
          className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${PURPLE}40, transparent 70%)` }} />
        <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 9, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-[100px]"
          style={{ background: `radial-gradient(circle, ${CYAN}40, transparent 70%)` }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        {/* Badge / Signature */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-xs font-semibold tracking-wide"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
          <Sparkles size={14} />
          L'automatisation intelligente amplifiée par l'HUMAIN
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
          <span className="block text-white">Votre business,</span>
          <span className="block" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            amplifié par l'IA.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)' }}>
          Sites web connectés, automatisations intelligentes, agents IA et contenus créatifs —
          le tout piloté depuis notre Cockpit IA local. Le futur de votre entreprise, livré en 48h.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-16">
          <a href="#contact">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-black"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
              Démarrer mon projet <ArrowRight size={16} />
            </motion.button>
          </a>
          <a href="#realisations">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
              Voir nos réalisations
            </motion.button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-8 md:gap-12 justify-center">
          {stats.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-2xl md:text-3xl font-black" style={{ color: GOLD }}>{s.v}</div>
              <div className="text-xs mt-1 tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
