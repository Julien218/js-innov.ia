import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';

export default function LandingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative p-12 md:p-20 rounded-[2rem] text-center overflow-hidden"
          style={{ background: 'rgba(10,10,18,0.6)', border: '1px solid rgba(212,175,55,0.2)', backdropFilter: 'blur(10px)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
              <Sparkles size={14} /> Prêt à démarrer ?
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
              Lancez votre projet<br />
              <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                dès aujourd'hui
              </span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              L'automatisation intelligente amplifiée par l'humain. Votre cockpit IA, livré en 48h.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="#contact">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
                  Démarrer mon projet <ArrowRight size={16} />
                </motion.button>
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {['Sans engagement', 'Réponse sous 24h', 'RGPD conforme', 'BCE 0877926214'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} style={{ color: 'rgba(212,175,55,0.5)' }} /> {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}