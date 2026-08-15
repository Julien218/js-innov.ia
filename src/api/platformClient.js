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

export const platform = {
  entities,
  functions: {
    invoke: (name, payload = {}) => jsonRequest(`/api/platform/functions/${encodeURIComponent(name)}`, {
      method: 'POST', body: JSON.stringify(payload),
    }).then((data) => ({ data })),
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
