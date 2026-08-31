import { PRIVACY_CONSENT_TEXT, PRIVACY_POLICY_PATH } from '../../../privacy-consent.mjs';

export default function PrivacyConsentNotice({ className = '', style = {}, required = true }) {
  return (
    <span className={className} style={style}>
      {PRIVACY_CONSENT_TEXT}{' '}
      <a
        href={PRIVACY_POLICY_PATH}
        onClick={(event) => event.stopPropagation()}
        className="font-semibold underline underline-offset-2"
      >
        Lire la politique de confidentialité
      </a>
      {required ? ' *' : ''}
    </span>
  );
}
