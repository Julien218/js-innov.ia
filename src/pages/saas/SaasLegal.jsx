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
Email : info@jsinnovia.store
BCE : 0877926214
Site : www.jsinnovia.com`
      },
      { title: 'Hébergement', content: 'Le site et ses services reposent sur des prestataires cloud. Les lieux de traitement et les garanties applicables sont décrits dans la politique de confidentialité.' },
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
      { title: 'Version et responsable du traitement', content: 'Version du 1er septembre 2026.\n\nResponsable : Julien Pagin – Js-Innov.IA\nGrand Rue 52, 7370 Dour, Belgique\nBCE : 0877926214\nContact vie privée et exercice des droits : info@jsinnovia.store · 0494/11.90.90' },
      { title: 'Données traitées', content: 'Selon votre interaction, nous traitons :\n- identité et coordonnées (nom, prénom, e-mail, téléphone, entreprise) ;\n- contenu de votre demande, besoins, budget, délais et réponses de qualification ;\n- conversation avec le chatbot lorsque vous choisissez de la transmettre ;\n- données contractuelles, de projet, de facturation et de paiement ;\n- preuve du consentement (version du texte, date, source, identifiant de soumission et empreinte tronquée de l’adresse IP) ;\n- journaux techniques nécessaires à la sécurité.\n\nNous vous invitons à ne pas communiquer de données sensibles dans les champs libres.' },
      { title: 'Finalités et bases juridiques', content: 'Nous utilisons ces données pour :\n- répondre à votre demande et préparer un devis : mesures précontractuelles prises à votre demande (art. 6.1.b RGPD) ;\n- vous recontacter lorsque vous l’avez demandé : consentement (art. 6.1.a) ;\n- exécuter et administrer un contrat : exécution contractuelle (art. 6.1.b) ;\n- tenir la comptabilité et respecter les obligations fiscales : obligation légale (art. 6.1.c) ;\n- sécuriser les services, prévenir les abus et défendre nos droits : intérêt légitime (art. 6.1.f), après mise en balance.\n\nNous ne vendons pas vos données.' },
      { title: 'Données obligatoires ou facultatives', content: 'Les champs marqués d’un astérisque sont nécessaires pour traiter la demande. Sans nom, adresse e-mail et contenu suffisant, nous ne pouvons pas répondre ou établir une proposition. Le téléphone, l’entreprise et les autres précisions sont facultatifs sauf indication contraire. Le refus d’un consentement facultatif n’empêche pas l’exécution d’un contrat déjà conclu.' },
      { title: 'Destinataires et sous-traitants', content: 'Les données sont accessibles uniquement aux personnes autorisées de Js-Innov.IA et, selon le service utilisé, à nos prestataires techniques : hébergement applicatif, base de données et authentification, stockage documentaire, messagerie, paiement, outils de calendrier et fournisseurs de modèles d’IA.\n\nCes prestataires agissent selon nos instructions ou comme responsables indépendants pour leurs propres obligations. La liste et les garanties sont suivies dans notre registre des sous-traitants. Les données de paiement complètes ne sont pas stockées dans nos formulaires.' },
      { title: 'Transferts hors Espace économique européen', content: 'Certains prestataires ou leurs sous-traitants peuvent traiter des données hors de l’Espace économique européen. Dans ce cas, nous vérifions le mécanisme applicable : décision d’adéquation, clauses contractuelles types de la Commission européenne et, lorsque nécessaire, mesures complémentaires. Vous pouvez demander des informations sur ces garanties à info@jsinnovia.store.' },
      { title: 'Durées de conservation', content: 'Nous appliquons les durées suivantes, puis supprimons, anonymisons ou réexaminons les données :\n- prospects et demandes non converties : 3 ans après le dernier contact pertinent ;\n- conversations chatbot non transmises : durée de session ; conversations transmises : au maximum 1 an, sauf intégration justifiée au dossier ;\n- données opérationnelles client : pendant la relation, puis 5 ans ; les éléments nécessaires à la preuve d’un contrat ou à la défense de droits peuvent être conservés jusqu’au terme de la prescription applicable ;\n- livres et pièces justificatives comptables, dont les factures : 10 ans à partir du 1er janvier suivant la clôture de l’exercice concerné ;\n- preuve du consentement : pendant son utilisation puis 3 ans après son retrait ou le dernier contact ;\n- journaux techniques et de sécurité : 12 mois, sauf incident nécessitant une conservation plus longue.\n\nUne obligation légale, un litige ou une demande en cours peut justifier une conservation limitée plus longue.' },
      { title: 'Consentement et retrait', content: 'Lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment en écrivant à info@jsinnovia.store. Le retrait n’affecte pas la licéité des traitements réalisés avant celui-ci. Chaque formulaire concerné enregistre une preuve versionnée du texte accepté et la rattache au traitement correspondant dans notre registre.' },
      { title: 'Vos droits et réclamation', content: 'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation du traitement et la portabilité, ou vous opposer à un traitement fondé sur notre intérêt légitime. Vous pouvez aussi retirer votre consentement.\n\nAdressez votre demande à info@jsinnovia.store. Nous pouvons demander les informations strictement nécessaires pour vérifier votre identité. Nous répondons en principe dans un délai d’un mois ; ce délai peut être prolongé de deux mois en cas de complexité ou de nombre élevé de demandes, après vous en avoir informé.\n\nVous pouvez introduire une réclamation auprès de l’Autorité de protection des données belge : www.autoriteprotectiondonnees.be.' },
      { title: 'Décisions automatisées et intelligence artificielle', content: 'Le chatbot et certains outils peuvent aider à qualifier une demande ou suggérer une solution. Aucune décision produisant des effets juridiques ou vous affectant de manière similaire n’est prise exclusivement de façon automatisée. Une personne intervient avant toute décision commerciale engageante.' },
      { title: 'Sécurité', content: 'Nous appliquons des mesures proportionnées aux risques : contrôle des accès, cloisonnement des organisations, chiffrement des communications, journalisation, minimisation, sauvegardes et procédures de gestion des incidents. Aucun système n’étant totalement exempt de risque, ces mesures sont régulièrement réexaminées.' },
      { title: 'Cookies et services tiers', content: 'Le site utilise les éléments techniques nécessaires à son fonctionnement et à la sécurité. Aucun cookie publicitaire ou de suivi non essentiel ne doit être déposé sans information et, lorsque la loi l’exige, sans consentement préalable. Un contact initié via WhatsApp ou un autre service tiers est également soumis aux règles de ce fournisseur.' },
      { title: 'Mises à jour', content: 'Nous pouvons mettre cette politique à jour pour refléter une évolution légale, technique ou de nos services. La date de version figure en tête. Une modification importante sera signalée de manière appropriée.' },
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
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>info@jsinnovia.store · 0494/11.90.90 · Grand Rue 52, 7370 Dour · BCE 0877926214</p>
        </div>
      </div>
    </div>
  );
}
