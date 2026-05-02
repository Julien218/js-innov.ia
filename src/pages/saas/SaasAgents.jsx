import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, FileText, Globe, Share2, Search, Settings, Headphones, CheckSquare, ArrowRight, Sparkles, Shield } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

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

const agents = [
  {
    icon: Bot, color: CYAN, name: 'Agent Audit Client',
    desc: 'Analyse le problème du client, résume le besoin, identifie les points faibles, propose une solution et recommande un pack.',
    actions: ['Analyse problème', 'Résumé besoin', 'Points faibles', 'Solution proposée', 'Pack recommandé'],
    validation: false,
  },
  {
    icon: FileText, color: GOLD, name: 'Agent Devis',
    desc: 'Génère un brouillon de devis complet avec liste des prestations et options. Attend obligatoirement la validation de Julien avant envoi.',
    actions: ['Brouillon devis', 'Liste prestations', 'Options & variantes', 'Calcul prix'],
    validation: true,
  },
  {
    icon: Globe, color: PURPLE, name: 'Agent Site Web',
    desc: 'Génère la structure du site, propose l\'arborescence, les contenus et les sections en respectant l\'ADN visuel du client.',
    actions: ['Structure site', 'Arborescence', 'Contenus proposés', 'Sections design'],
    validation: true,
  },
  {
    icon: Share2, color: '#EC4899', name: 'Agent Contenu',
    desc: 'Crée posts réseaux, scripts vidéos, textes publicitaires et idées de campagnes. Validation humaine obligatoire avant publication.',
    actions: ['Posts réseaux', 'Scripts vidéos', 'Textes pub', 'Idées campagnes'],
    validation: true,
  },
  {
    icon: Settings, color: '#F59E0B', name: 'Agent Automatisation',
    desc: 'Analyse les tâches répétitives, propose des workflows et prépare les scénarios n8n/Make. Validation humaine obligatoire.',
    actions: ['Analyse processus', 'Workflows proposés', 'Scénarios n8n/Make', 'Documentation'],
    validation: true,
  },
  {
    icon: Search, color: CYAN, name: 'Agent SEO',
    desc: 'Analyse les mots-clés, propose des titres et meta descriptions, structure le blog et fournit des recommandations SEO détaillées.',
    actions: ['Mots-clés ciblés', 'Titres & metas', 'Structure blog', 'Recommandations'],
    validation: false,
  },
  {
    icon: Headphones, color: '#22c55e', name: 'Agent Support Client',
    desc: 'Répond aux questions simples des clients. Escalade automatiquement à Julien pour les questions sensibles ou complexes.',
    actions: ['Réponses simples', 'FAQ automatique', 'Escalade Julien', 'Historique'],
    validation: false,
  },
  {
    icon: CheckSquare, color: GOLD, name: 'Agent Validation Humaine',
    desc: 'Centralise TOUTES les actions à valider. Julien doit explicitement cliquer Valider, Modifier ou Refuser avant toute exécution.',
    actions: ['Centralisation actions', 'Interface validation', 'Commentaires admin', 'Logs complets'],
    validation: true,
    central: true,
  },
];

export default function SaasAgents() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
              <Sparkles className="w-3 h-3" /> Agents métiers IA
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              L'IA travaille.{' '}
              <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Julien valide.
              </span>
            </h1>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Nos agents IA analysent, génèrent et proposent. Mais aucune action sensible n'est exécutée sans validation humaine explicite de Julien.
            </p>
          </div>
        </Reveal>

        {/* Rule banner */}
        <Reveal>
          <div className="flex items-center gap-4 p-5 rounded-2xl mb-10"
            style={{ background: `rgba(212,175,55,0.06)`, border: `1px solid rgba(212,175,55,0.25)` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(212,175,55,0.12)`, border: `1px solid rgba(212,175,55,0.28)` }}>
              <Shield className="w-6 h-6" style={{ color: GOLD }} />
            </div>
            <div>
              <h3 className="font-black text-white text-sm mb-1">Règle absolue de validation humaine</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Aucune action sensible (email, publication, devis, automatisation, réponse client) ne peut être envoyée, publiée, facturée ou exécutée sans validation explicite de Julien. Les agents <strong style={{ color: GOLD }}>proposent</strong>, Julien <strong style={{ color: GOLD }}>décide</strong>.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {agents.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 0.07}>
              <motion.div whileHover={{ y: -6 }} className={`group p-7 rounded-2xl h-full relative overflow-hidden ${agent.central ? 'md:col-span-2' : ''}`}
                style={{
                  background: agent.central ? `rgba(212,175,55,0.05)` : 'rgba(10,8,22,0.85)',
                  border: agent.central ? `1px solid rgba(212,175,55,0.3)` : `1px solid ${agent.color}18`
                }}>
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${agent.color}70, transparent)` }} />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${agent.color}12`, border: `1px solid ${agent.color}28` }}>
                    <agent.icon className="w-6 h-6" style={{ color: agent.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-white text-base">{agent.name}</h3>
                      {agent.validation && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
                          ⚡ Validation requise
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.48)' }}>{agent.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.actions.map(a => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: `${agent.color}10`, color: `${agent.color}`, border: `1px solid ${agent.color}20` }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="text-center p-10 rounded-3xl relative overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(212,175,55,0.22)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <h2 className="text-2xl font-black text-white mb-3">Prêt à bénéficier de vos agents IA ?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Les agents IA sont disponibles à partir du Pack Business.
            </p>
            <Link to="/saas-analyse">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                <Sparkles className="w-4 h-4" /> Analyser mon projet
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}