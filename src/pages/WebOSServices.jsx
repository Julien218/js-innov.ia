import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ShoppingBag, Layers, BarChart3, Headphones, Bot, Search, Share2, MapPin, MessageCircle, Shield, Check, ArrowRight, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const services = [
  { icon: Globe, title: 'Création site vitrine', desc: 'Site professionnel responsive, SEO, formulaire de contact, pages services, design premium adapté à votre activité.', features: ['Design sur mesure', 'SEO de base inclus', 'Formulaire contact', 'Responsive mobile'], color: CYAN },
  { icon: ShoppingBag, title: 'Vitrine de vente', desc: 'Présentez et vendez vos offres avec un tunnel de conversion clair, des pages produits attractives et un paiement intégré.', features: ['Catalogue produits', 'Tunnel de vente', 'Paiement en ligne', 'Upsell intégré'], color: PURPLE },
  { icon: Layers, title: 'Boutique en ligne', desc: 'E-commerce complet avec gestion des commandes, stocks, livraisons et paiements sécurisés.', features: ['Gestion des stocks', 'Paiements Stripe', 'Emails automatiques', 'Espace client'], color: '#EC4899' },
  { icon: BarChart3, title: 'Dashboard administrateur', desc: 'Espace admin mobile-first pour gérer vos contenus, clients, crédits IA, demandes et automatisations.', features: ['Interface mobile', 'Gestion rôles', 'Crédits IA', 'Notifications temps réel'], color: GOLD },
  { icon: Headphones, title: 'Support client', desc: 'Module de ticketing complet avec messages, suivi, notes internes et intervention manuelle par super admin.', features: ['Tickets & messages', 'Statuts personnalisables', 'Notes internes', 'Alertes urgence'], color: '#22c55e' },
  { icon: Bot, title: 'Automatisation IA', desc: 'Emails personnalisés avec délai humain, leads scorés automatiquement, workflows configurables.', features: ['Séquence email 4 étapes', 'Lead scoring auto', 'Délai configurable', 'Logs complets'], color: '#F59E0B' },
  { icon: Search, title: 'SEO automatique', desc: 'Référencement local, contenu SEO généré par IA chaque semaine, suivi positions et optimisation continue.', features: ['SEO local', 'Contenu IA hebdo', 'Suivi positions', 'Rapport mensuel'], color: CYAN },
  { icon: Share2, title: 'Publications réseaux sociaux', desc: 'Posts programmés générés par IA, validés par vos clients avant publication, visuels créés automatiquement.', features: ['Posts IA', 'Validation client', 'Programmation auto', 'Visuels inclus'], color: PURPLE },
  { icon: MapPin, title: 'Google Business Profile', desc: "Optimisation et gestion de votre fiche Google My Business pour maximiser votre visibilité locale.", features: ['Fiche optimisée', 'Photos pro', 'Réponses avis', 'Posts hebdo'], color: '#EC4899' },
  { icon: MessageCircle, title: 'Chatbot optionnel', desc: 'Assistant virtuel intégré à votre site, disponible 24h/24, répond aux questions fréquentes et capte les leads.', features: ['IA conversationnelle', 'Capture leads', 'FAQ automatique', 'Transfert humain'], color: '#22c55e' },
  { icon: Shield, title: 'Marque blanche', desc: 'Toutes nos solutions disponibles sous votre propre marque. Revendez nos services sans mention Js-Innov.IA.', features: ['Dashboard rebrandé', 'Emails personnalisés', 'Support sous votre marque', 'Prix libres'], color: GOLD },
];

export default function WebOSServices() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-24 relative" style={{ color: 'white' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-[160px] opacity-15"
          style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[130px] opacity-10"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
              <Sparkles className="w-3 h-3" /> Nos services
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Ce que nous créons pour vous</h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Solutions digitales premium, livrées rapidement, pensées mobile-first
            </p>
          </div>
        </Reveal>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}
                className="group p-6 rounded-2xl h-full relative overflow-hidden cursor-default"
                style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${s.color}20` }}>
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% -10%, ${s.color}12, transparent 65%)` }} />
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.color}70, transparent)` }} />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <Check className="w-3 h-3 flex-shrink-0" style={{ color: s.color }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="relative text-center p-10 rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.22)` }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <div className="absolute top-0 left-0 w-32 h-32"
              style={{ background: `radial-gradient(circle, ${GOLD}15, transparent 70%)` }} />
            <div className="absolute bottom-0 right-0 w-32 h-32"
              style={{ background: `radial-gradient(circle, ${PURPLE}15, transparent 70%)` }} />
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/webos-offre">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                  Voir les offres & tarifs
                </motion.button>
              </Link>
              <Link to="/webos-contact">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border"
                  style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                  Demander un devis <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}