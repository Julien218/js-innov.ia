const jsonRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
};

const toArray = (value) => Array.isArray(value) ? value : value?.data || value?.items || [];

const entity = (name) => ({
  list: async (sort, limit) => {
    const query = new URLSearchParams();
    if (sort) {
      query.set('sort', sort.startsWith('-') ? sort.slice(1) : sort);
      query.set('order', sort.startsWith('-') ? 'desc' : 'asc');
    }
    if (limit) query.set('limit', String(limit));
    return toArray(await jsonRequest(`/api/platform/data/${name}?${query}`));
  },
  get: (id) => jsonRequest(`/api/platform/data/${name}/${encodeURIComponent(id)}`),
  filter: async (filters = {}, sort, limit) => {
    const query = new URLSearchParams(Object.entries(filters).map(([key, value]) => [key, String(value)]));
    if (sort) {
      query.set('sort', sort.startsWith('-') ? sort.slice(1) : sort);
      query.set('order', sort.startsWith('-') ? 'desc' : 'asc');
    }
    if (limit) query.set('limit', String(limit));
    return toArray(await jsonRequest(`/api/platform/data/${name}?${query}`));
  },
  create: (data) => jsonRequest(`/api/platform/data/${name}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => jsonRequest(`/api/platform/data/${name}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => jsonRequest(`/api/platform/data/${name}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
});

const entities = new Proxy({}, { get: (_, name) => entity(String(name)) });

const PIXELIUM_OUTBOX_KEY = 'pixelium_quote_outbox_v1';

const makeSubmissionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `pix-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

const readPixeliumOutbox = () => {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(PIXELIUM_OUTBOX_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writePixeliumOutbox = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PIXELIUM_OUTBOX_KEY, JSON.stringify(items.slice(-20)));
  } catch {
    // Le stockage local est une sécurité supplémentaire, jamais une dépendance bloquante.
  }
};

const removeFromPixeliumOutbox = (submissionId) => {
  writePixeliumOutbox(readPixeliumOutbox().filter((item) => item.submissionId !== submissionId));
};

const sendPixeliumQuoteRequest = async (payload) => jsonRequest('/api/pixelium/quote-request', {
  method: 'POST',
  body: JSON.stringify(payload),
});

const queuePixeliumLead = async (payload = {}) => {
  const submissionId = payload.submissionId || makeSubmissionId();
  const queuedPayload = { ...payload, submissionId };
  const existing = readPixeliumOutbox().filter((item) => item.submissionId !== submissionId);
  writePixeliumOutbox([...existing, queuedPayload]);

  try {
    const data = await sendPixeliumQuoteRequest(queuedPayload);
    removeFromPixeliumOutbox(submissionId);
    return { data };
  } catch (pixeliumError) {
    // Continuité métier : conserver la demande localement et tenter aussi l'ancien registre Contact.
    try {
      await jsonRequest('/api/platform/functions/receiveLead', {
        method: 'POST',
        body: JSON.stringify({ ...payload, pixeliumPending: true, submissionId }),
      });
    } catch {
      // La demande reste dans l'outbox locale et sera rejouée au retour du réseau/backend.
    }
    console.warn('[Pixelium] demande conservée dans l’outbox locale:', pixeliumError.message);
    return { data: { success: true, queuedLocally: true, submissionId } };
  }
};

const flushPixeliumOutbox = async () => {
  const pending = readPixeliumOutbox();
  for (const item of pending) {
    try {
      await sendPixeliumQuoteRequest(item);
      removeFromPixeliumOutbox(item.submissionId);
    } catch {
      break;
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { flushPixeliumOutbox().catch(() => {}); });
  setTimeout(() => { flushPixeliumOutbox().catch(() => {}); }, 1500);
}

export const platform = {
  entities,
  functions: {
    invoke: (name, payload = {}) => {
      if (name === 'receiveLead' && payload?.source === 'ecran-led') return queuePixeliumLead(payload);
      return jsonRequest(`/api/platform/functions/${encodeURIComponent(name)}`, {
        method: 'POST', body: JSON.stringify(payload),
      }).then((data) => ({ data }));
    },
  },
  integrations: {
    Core: {
      InvokeLLM: (payload) => jsonRequest('/api/platform/llm', { method: 'POST', body: JSON.stringify(payload) }),
      SendEmail: (payload) => jsonRequest('/api/platform/email', { method: 'POST', body: JSON.stringify(payload) }),
      UploadFile: async () => { throw new Error('Utilisez le stockage Supabase sécurisé du cockpit.'); },
      GenerateImage: (payload) => jsonRequest('/api/platform/image', { method: 'POST', body: JSON.stringify(payload) }),
      SendSMS: (payload) => jsonRequest('/api/platform/sms', { method: 'POST', body: JSON.stringify(payload) }),
      ExtractDataFromUploadedFile: async () => { throw new Error('Extraction de fichier indisponible sur le site public.'); },
    },
  },
  auth: {
    me: async () => { throw new Error('Authentification administrateur disponible dans NOVA.'); },
    logout: () => undefined,
    redirectToLogin: () => { window.location.assign(import.meta.env.VITE_COCKPIT_URL || 'https://cockpit.jsinnovia.com'); },
  },
  appLogs: { logUserInApp: async () => undefined },
  agents: { getWhatsAppConnectURL: () => import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/32468126016' },
};

export default platform;