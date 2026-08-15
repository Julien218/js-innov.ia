import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Globe, TrendingUp, Zap, Cpu, Sparkles, MessageCircle, CreditCard } from 'lucide-react';
import { platform } from '@/api/platformClient';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const packs = [
  {
    icon: Globe, name: 'Pack Starter', price: 'À partir de 490€', color: CYAN,
    target: 'Pour indépendants ou petites activités qui veulent une présence en ligne propre.',
    desc: 'La base solide pour exister sur le web de manière professionnelle.',
    benefits: ['Visibilité immédiate', 'Premiers contacts qualifiés', 'Image professionnelle', 'Base SEO solide'],
    features: ['Site vitrine simple (3 à 5 pages)', 'Design responsive mobile-first', 'Formulaire de contact intégré', 'Bouton WhatsApp intégré', 'SEO de base (titres, métas)', 'Google Business Profile', 'Mentions légales simples', 'Livraison en 3 à 5 jours', '1 modification incluse'],
  },
  {
    icon: TrendingUp, name: 'Pack Business', price: 'À partir de 990€', color: GOLD, popular: true,
    target: 'Pour clients qui veulent générer des leads et développer leur activité.',
    desc: 'Transformez votre site en machine à prospects qualifiés.',
    benefits: ['Génération de leads qualifiés', 'Chatbot de qualification', 'CRM prospects intégré', 'Automatisation email'],
    features: ['Tout le Pack Starter', 'Site vitrine avancé (jusqu\'à 8 pages)', 'Chatbot de qualification IA', 'Formulaire intelligent multi-étapes', 'CRM prospects basique', 'Automatisation emails (séquence 4 étapes)', 'Contenus réseaux sociaux (5 posts)', 'Lead scoring automatique', '3 modifications incluses', 'Livraison en 5 à 7 jours'],
  },
  {
    icon: Zap, name: 'Pack Automation', price: 'À partir de 1490€', color: PURPLE,
    target: 'Pour alléger la charge de travail et automatiser votre activité.',
    desc: 'Récupérez du temps en automatisant vos tâches répétitives.',
    benefits: ['Gain de temps massif', 'Zéro oubli de suivi', 'Centralisation des outils', 'Validation humaine'],
    features: ['Analyse de vos processus', 'Automatisations personnalisées', 'Tableaux de bord visuels', 'Notifications temps réel', 'Intégration WhatsApp / email', 'Workflows n8n/Make préparés', 'Validation humaine obligatoire', 'Module de suivi client', 'Modifications illimitées (1 mois)', 'Livraison en 7 à 10 jours'],
  },
  {
    icon: Cpu, name: 'Pack IA Premium', price: 'Sur devis', color: '#EC4899',
    target: 'Pour clients voulant des agents métiers intelligents et une plateforme complète.',
    desc: 'L\'intelligence artificielle au service de votre activité, avec Julien en validation.',
    benefits: ['Agents IA spécialisés', 'Espace client dédié', 'Dashboard admin complet', 'Suivi projet détaillé'],
    features: ['Tout le Pack Automation', 'Agents IA spécialisés (audit, contenu, SEO)', 'Espace client sécurisé', 'Dashboard admin complet', 'Validation humaine centralisée', 'Génération de contenus IA', 'Automatisation complète', 'Suivi projet en temps réel', 'Support prioritaire', 'Modifications illimitées'],
  },
];

export default function SaasPacks() {
  const [loadingPack, setLoadingPack] = useState(null);

  const handlePayment = async (packName) => {
    setLoadingPack(packName);
    try {
      const response = await platform.functions.invoke('createStripeSession', {
        pack: packName,
        email: '',
        firstName: '',
        lastName: '',
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la session de paiement');
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      {/* Header */}
      <Reveal>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Nos packs
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            La solution adaptée à{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              votre objectif
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Chaque pack est pensé pour un stade précis de votre développement digital. Prix clairs, livraison rapide.
          </p>
        </div>
      </Reveal>

      {/* Packs */}
      <div className="max-w-6xl mx-auto space-y-8 mb-16">
        {packs.map((pack, i) => (
          <Reveal key={pack.name} delay={i * 0.1}>
            <motion.div whileHover={{ y: -4 }} className="relative rounded-3xl overflow-hidden"
              style={{
                background: pack.popular ? 'rgba(212,175,55,0.05)' : 'rgba(10,8,22,0.85)',
                border: pack.popular ? `1px solid rgba(212,175,55,0.35)` : `1px solid ${pack.color}20`,
                boxShadow: pack.popular ? `0 0 60px rgba(212,175,55,0.08)` : 'none'
              }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${pack.color}70, transparent)` }} />
              {pack.popular && (
                <div className="absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>⭐ Populaire</div>
              )}

              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Pack info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${pack.color}12`, border: `1px solid ${pack.color}28` }}>
                        <pack.icon className="w-6 h-6" style={{ color: pack.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{pack.name}</h3>
                        <p className="text-sm font-bold" style={{ color: pack.color }}>{pack.price}</p>
                      </div>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{pack.target}</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>{pack.desc}</p>
                    <div className="space-y-2 mb-6">
                      {pack.benefits.map(b => (
                        <div key={b} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `${pack.color}18` }}>
                            <Check className="w-3 h-3" style={{ color: pack.color }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{b}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {pack.name !== 'Pack IA Premium' && (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handlePayment(pack.name)}
                          disabled={loadingPack === pack.name}
                          className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                          style={pack.popular
                            ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                            : { background: `${pack.color}15`, color: pack.color, border: `1px solid ${pack.color}28` }}>
                          {loadingPack === pack.name ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Sparkles className="w-4 h-4" />
                              </motion.div>
                              Chargement…
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Payer maintenant
                            </>
                          )}
                        </motion.button>
                      )}
                      <div className="flex gap-2">
                        <Link to={`/saas-analyse`} className="flex-1">
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            className="w-full py-3 rounded-2xl font-black text-sm"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            Analyser mon projet
                          </motion.button>
                        </Link>
                        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}>
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right: Features */}
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: `${pack.color}80` }}>Inclus dans ce pack</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pack.features.map(f => (
                        <div key={f} className="flex items-start gap-2 p-2.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: pack.color }} />
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* CTA */}
      <Reveal>
        <div className="max-w-2xl mx-auto text-center p-10 rounded-3xl relative overflow-hidden"
          style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(212,175,55,0.22)` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
          <h2 className="text-2xl font-black text-white mb-3">Vous hésitez entre les packs ?</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Faites analyser votre projet. Julien vous oriente personnellement.
          </p>
          <Link to="/saas-analyse">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-sm"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
              <Sparkles className="w-4 h-4" /> Analyser mon projet gratuitement
            </motion.button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}