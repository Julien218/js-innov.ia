const DEFAULT_SOURCE = 'site-js-innov-ia';

const buildPayload = (payload = {}) => ({
  source: DEFAULT_SOURCE,
  captured_at: new Date().toISOString(),
  user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  page_url: typeof window !== 'undefined' ? window.location.href : '',
  ...payload,
});

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

export async function sendToCockpit(payload) {
  const webhookUrl = import.meta.env.VITE_COCKPIT_WEBHOOK_URL;
  const apiUrl = import.meta.env.VITE_COCKPIT_API_URL;
  const apiKey = import.meta.env.VITE_COCKPIT_API_KEY;
  const finalPayload = buildPayload(payload);

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
      throw new Error(`Webhook cockpit indisponible (${response.status})`);
    }

    return parseJsonSafe(response);
  }

  if (apiUrl) {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
      throw new Error(`API cockpit indisponible (${response.status})`);
    }

    return parseJsonSafe(response);
  }

  const stored = JSON.parse(localStorage.getItem('jsinnovia_pending_leads') || '[]');
  stored.push(finalPayload);
  localStorage.setItem('jsinnovia_pending_leads', JSON.stringify(stored));

  return {
    ok: true,
    mode: 'local-fallback',
    message: 'Lead sauvegardé localement. Ajoute VITE_COCKPIT_WEBHOOK_URL ou VITE_COCKPIT_API_URL pour connecter le cockpit.',
  };
}

export function getCockpitStatus() {
  if (import.meta.env.VITE_COCKPIT_WEBHOOK_URL) return 'webhook';
  if (import.meta.env.VITE_COCKPIT_API_URL) return 'api';
  return 'local-fallback';
}
