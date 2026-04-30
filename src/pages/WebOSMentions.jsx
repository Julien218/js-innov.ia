import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const GOLD = '#D4AF37';

export default function WebOSMentions() {
  return (
    <div className="min-h-screen px-4 pt-8 pb-20" style={{ background: '#070710', color: 'white' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Shield className="w-7 h-7" style={{ color: GOLD }} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Mentions légales & Confidentialité</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Dernière mise à jour : avril 2025</p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: 'Éditeur du site',
              content: `JS-Innov.ia est une activité exercée par Julien Pagin, basée à Dour, Belgique.\nEmail : contact@js-innov.ia\nTéléphone : +32 494 11 90 90\nNuméro d'entreprise : en cours d'enregistrement`
            },
            {
              title: 'Hébergement',
              content: "Ce site est hébergé par des services cloud sécurisés situés dans l'Union européenne. Les données sont protégées selon les standards RGPD."
            },
            {
              title: 'Propriété intellectuelle',
              content: 'L\'ensemble du contenu de ce site (textes, images, logos, créations) est la propriété exclusive de JS-Innov.ia. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.'
            },
            {
              title: 'Données personnelles (RGPD)',
              content: `Les données collectées via les formulaires (nom, email, téléphone, message) sont utilisées uniquement pour répondre à vos demandes et vous contacter dans le cadre de votre projet.

Aucune donnée n'est vendue à des tiers. Vous pouvez exercer votre droit d'accès, de rectification ou de suppression en contactant : contact@js-innov.ia

Responsable du traitement : Julien Pagin, JS-Innov.ia, Dour, Belgique.`
            },
            {
              title: 'Cookies',
              content: 'Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie de suivi ou publicitaire n\'est utilisé sans votre consentement.'
            },
            {
              title: 'Limitation de responsabilité',
              content: 'JS-Innov.ia ne peut être tenu responsable des dommages directs ou indirects résultant de l\'utilisation de ce site ou des services proposés. Les informations présentées sont données à titre indicatif et peuvent être modifiées sans préavis.'
            },
            {
              title: 'Droit applicable',
              content: 'Le présent site est soumis au droit belge. En cas de litige, les tribunaux de Mons (Belgique) seront seuls compétents.'
            },
          ].map((section, i) => (
            <motion.div key={section.title}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-base font-black mb-3" style={{ color: GOLD }}>{section.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.55)' }}>{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}