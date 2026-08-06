import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Zap, Bot, Cpu, Clapperboard, Code2 } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';

export default function LandingServices() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const services = [
    { icon: Globe, color: CYAN, title: 'Sites web connectés', desc: 'Sites vitrines, e-commerce et plateformes connectés à vos outils. SEO optimisé, ultra-rapides, 100% sur mesure.' },
    { icon: Zap, color: GOLD, title: 'Automatisations intelligentes', desc: 'Workflows qui tournent 24/7 : emails, devis, suivi client, synchronisation multi-outils. Zéro tâche répétitive.' },
    { icon: Bot, color: PURPLE, title: 'Agents IA', desc: 'Assistants IA spécialisés pour votre support, vos ventes, votre contenu. Ils qualifient, répondent et convertissent.' },
    { icon: Cpu, color: '#EC4899', title: 'Cockpit IA local', desc: 'Notre différenciateur : un cockpit IA hybride local + cloud. Confidentialité totale, puissance illimitée.' },
    { icon: Clapperboard, color: '#F59E0B', title: 'Contenus IA', desc: 'Vidéos, branding, copywriting générés par IA. Motion design, scripts, visuels — livrés en 48h.' },
    { icon: Code2, color: '#22c55e', title: 'SaaS sur mesure', desc: 'Applications web complètes : dashboards, CRM, billetterie, espaces clients. Votre idée, transformée en produit.' },
  ];

  return (
    <section ref={ref} className="py-24 px-5 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', color: CYAN }}>
            Nos services
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Tout ce dont votre business a besoin
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Six piliers pour transformer votre entreprise. Choisissez un module ou l'ensemble.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group p-7 rounded-3xl relative overflow-hidden h-full"
              style={{ background: 'rgba(10,10,18,0.6)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                <s.icon size={24} style={{ color: s.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}