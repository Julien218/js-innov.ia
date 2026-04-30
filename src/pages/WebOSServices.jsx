import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ShoppingBag, Layers, BarChart3, Headphones, Bot, Search, Share2, MapPin, MessageCircle, Shield, Check, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';

const services = [
  {
    icon: Globe,
    title: 'Création site vitrine',
    desc: 'Site professionnel responsive, SEO, formulaire de contact, pages services, design premium adapté à votre activité.',
    features: ['Design sur mesure', 'SEO de base inclus', 'Formulaire contact', 'Responsive mobile'],
    color: '#06B6D4',
  },
  {
    icon: ShoppingBag,
    title: 'Vitrine de vente',
    desc: 'Présentez et vendez vos offres avec un tunnel de conversion clair, des pages produits attractives et un paiement intégré.',
    features: ['Catalogue produits', 'Tunnel de vente', 'Paiement en ligne', 'Upsell intégré'],
    color: '#8B5CF6',
  },
  {
    icon: Layers,
    title: 'Boutique en ligne',
    desc: 'E-commerce complet avec gestion des commandes, stocks, livraisons et paiements sécurisés.',
    features: ['Gestion des stocks', 'Paiements Stripe', 'Emails automatiques', 'Espace client'],
    color: '#EC4899',
  },
  {
    icon: BarChart3,
    title: 'Dashboard administrateur',
    desc: 'Espace admin mobile-first pour gérer vos contenus, clients, crédits IA, demandes et automatisations.',
    features: ['Interface mobile', 'Gestion rôles', 'Crédits IA', 'Notifications temps réel'],
    color: GOLD,
  },
  {
    icon: Headphones,
    title: 'Support client',
    desc: 'Module de ticketing complet avec messages, suivi, notes internes et intervention manuelle par super admin.',
    features: ['Tickets & messages', 'Statuts personnalisables', 'Notes internes', 'Alertes urgence'],
    color: '#22c55e',
  },
  {
    icon: Bot,
    title: 'Automatisation IA',
    desc: 'Emails personnalisés avec délai humain, leads scorés automatiquement, workflows configurables.',
    features: ['Séquence email 4 étapes', 'Lead scoring auto', 'Délai configurable', 'Logs complets'],
    color: '#F59E0B',
  },
  {
    icon: Search,
    title: 'SEO automatique',
    desc: 'Référencement local, contenu SEO généré par IA chaque semaine, suivi positions et optimisation continue.',
    features: ['SEO local', 'Contenu IA hebdo', 'Suivi positions', 'Rapport mensuel'],
    color: '#06B6D4',
  },
  {
    icon: Share2,
    title: 'Publications réseaux sociaux',
    desc: 'Posts programmés générés par IA, validés par vos clients avant publication, visuels créés automatiquement.',
    features: ['Posts IA', 'Validation client', 'Programmation auto', 'Visuels inclus'],
    color: '#8B5CF6',
  },
  {
    icon: MapPin,
    title: 'Google Business Profile',
    desc: "Optimisation et gestion de votre fiche Google My Business pour maximiser votre visibilité locale.",
    features: ['Fiche optimisée', 'Photos pro', 'Réponses avis', 'Posts hebdo'],
    color: '#EC4899',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot optionnel',
    desc: 'Assistant virtuel intégré à votre site, disponible 24h/24, répond aux questions fréquentes et capte les leads.',
    features: ['IA conversationnelle', 'Capture leads', 'FAQ automatique', 'Transfert humain'],
    color: '#22c55e',
  },
  {
    icon: Shield,
    title: 'Marque blanche',
    desc: 'Toutes nos solutions disponibles sous votre propre marque. Revendez nos services sans mention JS-Innov.ia.',
    features: ['Dashboard rebrandé', 'Emails personnalisés', 'Support sous votre marque', 'Prix libres'],
    color: GOLD,
  },
];

export default function WebOSServices() {
  return (
    <div className="min-h-screen px-4 pt-8 pb-20" style={{ background: '#070710', color: 'white' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Nos services</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Ce que nous créons pour vous</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Solutions digitales premium, livrées rapidement, pensées mobile-first
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl h-full"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}18` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
              <ul className="space-y-1.5">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <Check className="w-3 h-3 flex-shrink-0" style={{ color: s.color }} /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/webos-offre">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black mr-3"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
              Voir les offres & tarifs
            </motion.button>
          </Link>
          <Link to="/webos-contact">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border mt-3 sm:mt-0"
              style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD }}>
              Demander un devis <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}