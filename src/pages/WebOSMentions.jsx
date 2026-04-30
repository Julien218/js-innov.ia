import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const sections = [
  {
    title: 'Éditeur du site',
    content: "Js-Innov.IA est une activité exercée par Julien Pagin, basée à Dour, Belgique.\nEmail : contact@js-innov.ia\nTéléphone : +32 494 11 90 90\nSite : www.jsinnovia.com\nNuméro d'entreprise : en cours d'enregistrement"
  },
  {
    title: 'Hébergement',
    content: "Ce site est hébergé par des services cloud sécurisés situés dans l'Union européenne. Les données sont protégées selon les standards RGPD."
  },
  {
    title: 'Propriété intellectuelle',
    content: "L'ensemble du contenu de ce site (textes, images, logos, créations) est la propriété exclusive de Js-Innov.IA. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable."
  },
  {
    title: 'Données personnelles (RGPD)',
    content: "Les données collectées via les formulaires (nom, email, téléphone, message) sont utilisées uniquement pour répondre à vos demandes et vous contacter dans le cadre de votre projet.\n\nAucune donnée n'est vendue à des tiers. Vous pouvez exercer votre droit d'accès, de rectification ou de suppression en contactant : contact@js-innov.ia\n\nResponsable du traitement : Julien Pagin, Js-Innov.IA, Dour, Belgique."
  },
  {
    title: 'Cookies',
    content: "Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie de suivi ou publicitaire n'est utilisé sans votre consentement."
  },
  {
    title: 'Limitation de responsabilité',
    content: "Js-Innov.IA ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou des services proposés. Les informations présentées sont données à titre indicatif et peuvent être modifiées sans préavis."
  },
  {
    title: 'Droit applicable',
    content: 'Le présent site est soumis au droit belge. En cas de litige, les tribunaux de Mons (Belgique) seront seuls compétents.'
  },
];

export default function WebOSMentions() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-24 relative" style={{ color: 'white' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[150px] opacity-10"
          style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Légal
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `rgba(212,175,55,0.1)`, border: `1px solid rgba(212,175,55,0.25)`, boxShadow: `0 0 30px rgba(212,175,55,0.1)` }}>
            <Shield className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Mentions légales & Confidentialité</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>Dernière mise à jour : avril 2025</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div key={section.title}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group p-6 rounded-2xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,0.1)` }}>
              {/* Hover accent */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
              <h2 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.52)' }}>{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer contact */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-8 text-center p-6 rounded-2xl"
          style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.15)` }}>
          <p className="text-sm font-bold mb-1" style={{ color: GOLD }}>Julien Pagin · Js-Innov.IA</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>contact@js-innov.ia · 0494/11.90.90 · Dour, Belgique</p>
        </motion.div>
      </div>
    </div>
  );
}