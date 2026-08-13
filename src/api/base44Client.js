import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, serverUrl, token, functionsVersion } = appParams;

const unavailable = () => {
  const callable = () => Promise.reject(new Error('Base44 non configurÃ© pour cet environnement'));
  return new Proxy(callable, { get: () => unavailable() });
};

// Do not initialize the SDK with null identifiers: it would emit requests to /null/.
export const base44 = appId && serverUrl
  ? createClient({ appId, serverUrl, token, functionsVersion, requiresAuth: false })
  : unavailable();

