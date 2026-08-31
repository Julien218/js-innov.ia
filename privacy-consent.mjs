export const PRIVACY_NOTICE_VERSION = '2026-09-01';
export const PRIVACY_POLICY_PATH = '/saas-confidentialite';
export const PRIVACY_CONSENT_TEXT = 'J’accepte que Js-Innov.IA utilise les données transmises pour répondre à ma demande et me recontacter. Je peux retirer mon consentement à tout moment.';

export const purposeForSource = (source = '') => {
  const normalized = String(source).toLowerCase();
  if (normalized.includes('devis')) return 'Préparer le devis demandé et recontacter la personne';
  if (normalized.includes('chat') || normalized.includes('elynea')) return 'Transmettre la demande issue du chatbot et recontacter la personne';
  if (normalized.includes('analyse')) return 'Analyser le projet demandé et recontacter la personne';
  return 'Répondre à la demande et recontacter la personne';
};
