import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Layers, ShieldCheck, HardDrive } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';

export default function LandingDifferentiator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    { icon: HardDrive, color: GOLD, title: 'Cockpit IA local', desc: 'Un cockpit IA installé en local, combiné au cloud. Vos données restent chez vous, l\'intelligence tourne 24/7.' },
    { icon: Layers, color: PURPLE, title: 'Agents modulaires', desc: 'Des agents IA spécialisés que vous activez selon vos besoins. Chaque module résout un problème précis.' },
    { icon: ShieldCheck, color: CYAN, title: 'Human-in-the-loop', desc: 'L\'IA génère, l\'humain valide. Chaque action critique passe par une validation humaine. Zéro erreur en production.' },
  ];

  return (
    <section ref={ref} className="py-24 px-5 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', color: PURPLE }}>
            Pourquoi nous sommes différents
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            L'IA locale, augmentée par l'humain
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Pas une simple API dans le cloud. Un véritable cockpit IA qui tourne chez vous, avec des agents spécialisés et une validation humaine systématique.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group p-8 rounded-3xl relative overflow-hidden h-full"
              style={{ background: 'rgba(10,10,18,0.6)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                <f.icon size={26} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Cockpit visual */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 p-8 md:p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04), rgba(124,58,237,0.04))', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={20} style={{ color: GOLD }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>Cockpit IA local + cloud</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Une infrastructure hybride unique en Belgique</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Nos agents IA tournent en local pour la confidentialité, synchronisés avec le cloud pour la puissance. Vous gardez le contrôle total de vos données.
              </p>
              <div className="flex flex-wrap gap-3">
                {['IA locale', 'Sync cloud', 'RGPD natif', 'Temps réel'].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
                  <span className="ml-2 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>cockpit.local</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { c: CYAN, t: '⟫ Agent SEO ............ actif' },
                    { c: GOLD, t: '⟫ Agent Contenu ........ actif' },
                    { c: PURPLE, t: '⟫ Agent Ventes .......... actif' },
                    { c: '#22c55e', t: '⟫ Validation humaine .... prête' },
                    { c: '#22c55e', t: '⟫ Sync cloud ........... OK' },
                  ].map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.15 }} style={{ color: l.c }}>{l.t}</motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}