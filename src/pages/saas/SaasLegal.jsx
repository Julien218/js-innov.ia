import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Lock, ChevronRight, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const LEGAL_SECTIONS = {
  mentions: {
    title: 'Mentions légales',
    icon: FileText,
    color: GOLD,
    sections: [
      {
        title: 'Éditeur du site',
        content: `Js-Innov.IA
Responsable : Julien Pagin
Grand Rue 52, 7370 Dour, Belgique
Téléphone : 0494/11.90.90
Email : info@jsinnovia.com
BCE : 0877926214
Site : www.jsinnovia.com`
      },
      { title: 'Hébergement', content: 'Ce site est hébergé par des services cloud sécurisés situés dans l\'Union européenne. Les données sont protégées selon les standards RGPD en vigueur.' },
      { title: 'Propriété intellectuelle', content: 'L\'ensemble du contenu de ce site (textes, images, logos, créations, agents IA, automatisations, prompts, méthodes, templates et logiques métiers) est la propriété exclusive de Js-Innov.IA. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.\n\nLes créations livrées au client deviennent utilisables par le client après paiement complet. Les systèmes internes, agents IA, automatisations, prompts, méthodes, templates et logiques métiers développés par Js-Innov.IA restent la propriété exclusive de Js-Innov.IA, sauf accord écrit contraire.' },
      { title: 'Responsabilité', content: 'Js-Innov.IA ne peut être tenu responsable des dommages directs ou indirects résultant de l\'utilisation de ce site. Les informations présentées sont données à titre indicatif.' },
      { title: 'Droit applicable', content: 'Le présent site est soumis au droit belge. En cas de litige, les tribunaux de Mons (Belgique) seront seuls compétents.' },
    ]
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    icon: Lock,
    color: PURPLE,
    sections: [
      { title: 'Responsable du traitement', content: 'Julien Pagin – Js-Innov.IA\nGrand Rue 52, 7370 Dour\ninfo@jsinnovia.com · 0494/11.90.90' },
      { title: 'Données collectées', content: 'Nous collectons uniquement les données nécessaires à la fourniture de nos services :\n- Formulaires de contact : nom, prénom, email, téléphone, entreprise, message\n- Chatbot : réponses aux questions de qualification\n- Analyse de projet : informations sur votre activité et besoins\n- WhatsApp : uniquement si vous nous contactez via ce canal\n- Cookies techniques nécessaires au fonctionnement du site' },
      { title: 'Finalité', content: 'Vos données sont utilisées pour :\n- Répondre à vos demandes et vous recontacter\n- Créer votre dossier projet\n- Vous envoyer une proposition adaptée\n- Améliorer nos services\n\nAucune donnée n\'est vendue à des tiers. Aucune utilisation à des fins commerciales sans votre consentement explicite.' },
      { title: 'Durée de conservation', content: 'Leads non convertis : 3 ans maximum\nClients actifs : durée de la relation commerciale + 5 ans\nDonnées de facturation : 7 ans (obligation légale)\nConversations chatbot : 1 an' },
      { title: 'Vos droits', content: 'Conformément au RGPD, vous disposez des droits suivants :\n- Droit d\'accès à vos données\n- Droit de rectification\n- Droit à l\'effacement (droit à l\'oubli)\n- Droit à la portabilité\n- Droit d\'opposition\n\nPour exercer vos droits : info@jsinnovia.com' },
      { title: 'Sécurité', content: 'Vos données sont protégées par des mesures techniques et organisationnelles appropriées. Accès restreint aux seules personnes autorisées. Hébergement en Union européenne.' },
      { title: 'Cookies', content: 'Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun cookie publicitaire ou de tracking sans votre consentement explicite.' },
    ]
  },
  cgv: {
    title: 'Conditions générales de vente',
    icon: Shield,
    color: CYAN,
    sections: [
      { title: 'Prestations', content: 'Js-Innov.IA propose des services de création de sites web, chatbots métier, applications mobiles, contenus digitaux, automatisation et agents IA. Toute prestation fait l\'objet d\'un devis détaillé préalable.' },
      { title: 'Devis et commande', content: 'Tout devis est valable 30 jours. La commande est confirmée par la signature du devis et le versement d\'un acompte de 30% à 50% selon le projet. Aucun travail ne commence avant réception de l\'acompte.' },
      { title: 'Paiement', content: 'Les factures sont payables à 30 jours. En cas de retard, des intérêts de retard de 1% par mois sont applicables. Js-Innov.IA se réserve le droit de suspendre les travaux en cas de non-paiement.' },
      { title: 'Délais', content: 'Les délais indiqués sont donnés à titre indicatif et peuvent varier selon la complexité du projet et la réactivité du client pour les retours et validations. Js-Innov.IA ne peut être tenu responsable des retards imputables au client.' },
      { title: 'Validation humaine', content: 'Toute action sensible générée par nos agents IA (emails, publications, devis, automatisations) est soumise à validation humaine explicite de Julien Pagin avant exécution. Aucune publication ou envoi automatique sans validation préalable.' },
      { title: 'Propriété intellectuelle', content: 'Les créations livrées deviennent la propriété du client après paiement intégral. Les méthodes, agents IA, automatisations, templates et systèmes internes restent la propriété de Js-Innov.IA.' },
      { title: 'Maintenance', content: 'Une maintenance mensuelle est disponible après livraison. Elle comprend les mises à jour techniques, la sécurité et le support. Sans contrat de maintenance, les interventions sont facturées 49€/h.' },
      { title: 'Annulation', content: 'En cas d\'annulation après signature et versement de l\'acompte, celui-ci reste acquis à Js-Innov.IA à titre de dédommagement pour le travail déjà réalisé.' },
      { title: 'Responsabilité', content: 'Js-Innov.IA s\'engage à mettre en œuvre tous les moyens nécessaires à la bonne exécution des prestations. Notre responsabilité est limitée au montant des prestations facturées.' },
      { title: 'Données client', content: 'Les données et contenus fournis par le client restent sa propriété. Js-Innov.IA s\'engage à les traiter confidentiellement et à ne pas les divulguer à des tiers.' },
    ]
  }
};

export default function SaasLegal({ type = 'mentions' }) {
  const [openSection, setOpenSection] = useState(null);
  const legal = LEGAL_SECTIONS[type] || LEGAL_SECTIONS.mentions;

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3 h-3" /> Légal
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${legal.color}12`, border: `1px solid ${legal.color}28` }}>
            <legal.icon className="w-8 h-8" style={{ color: legal.color }} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{legal.title}</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Js-Innov.IA · Julien Pagin · Grand Rue 52, 7370 Dour · BCE 0877926214</p>
        </motion.div>

        <div className="space-y-3">
          {legal.sections.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,${openSection === i ? '0.2' : '0.08'})` }}>
              <button onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                style={{ color: openSection === i ? GOLD : 'rgba(255,255,255,0.7)' }}>
                <span className="font-bold text-sm">{s.title}</span>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${openSection === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {openSection === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.52)' }}>{s.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center p-6 rounded-2xl" style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.15)` }}>
          <p className="text-sm font-bold mb-1" style={{ color: GOLD }}>Julien Pagin · Js-Innov.IA</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>info@jsinnovia.com · 0494/11.90.90 · Grand Rue 52, 7370 Dour · BCE 0877926214</p>
        </div>
      </div>
    </div>
  );
}