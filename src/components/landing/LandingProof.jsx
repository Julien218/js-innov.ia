import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#7C3AED';
const CYAN = '#06B6D4';

export default function LandingProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const projects = [
    { name: 'Synergie Dour', tag: 'Événementiel', desc: 'Plateforme événementielle avec billetterie QR et gestion des participants en temps réel.', color: GOLD, img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
    { name: 'Olivier Trévis', tag: 'Site vitrine', desc: 'Site vitrine premium pour photographe professionnel. Galerie interactive et booking en ligne.', color: CYAN, img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80' },
    { name: 'Miss & Mister Dour', tag: 'Concours', desc: 'Système de votes en ligne, billetterie et gestion des candidats pour concours de beauté.', color: PURPLE, img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80' },
    { name: 'Fashionist\'ART', tag: 'E-commerce', desc: 'Boutique en ligne mode avec branding complet, contenu IA et automatisation des réseaux sociaux.', color: '#EC4899', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  ];

  return (
    <section id="realisations" ref={ref} className="py-24 px-5 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
            Nos réalisations
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Ils nous font confiance
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Des projets concrets, livrés et opérationnels. Chaque réalisation est un cockpit IA en action.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl overflow-hidden relative"
              style={{ background: 'rgba(10,10,18,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="relative h-48 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(8,9,15,0.95) 100%)' }} />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${p.color}20`, border: `1px solid ${p.color}40`, color: p.color, backdropFilter: 'blur(8px)' }}>
                  {p.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  {p.name}
                  <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}