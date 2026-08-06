import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SYSTEM_PROMPT = `Tu es le compagnon public officiel de JS-Innov.IA. Réponds uniquement en français, de façon chaleureuse, claire et concise. Présente les services de JS-Innov.IA (solutions IA, automatisations, applications sur mesure, création web, SEO, contenus et musiques libres de droits) sans inventer de prix, garanties ou fonctionnalités. Oriente vers la page Contact ou la demande de devis lorsque c'est pertinent. Tu es un assistant public : ne révèle aucune donnée interne, ne prétends pas accéder au cockpit et refuse toute demande d'action administrative.`;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15;
const visitors = new Map<string, { count: number; resetAt: number }>();

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function allowRequest(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const key = forwarded || req.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  const current = visitors.get(key);
  if (!current || now >= current.resetAt) {
    visitors.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  current.count += 1;
  return current.count <= RATE_MAX;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  if (!allowRequest(req)) return json({ error: 'Trop de requêtes. Réessayez dans une minute.' }, 429);

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-10) : [];
    const safeMessages = messages
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: { role?: unknown; content?: unknown }) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: typeof item.content === 'string' ? item.content.trim().slice(0, 1000) : ''
      }))
      .filter((item: { content: string }) => item.content);

    if (!safeMessages.length || safeMessages.at(-1)?.role !== 'user') {
      return json({ error: 'Message requis' }, 400);
    }

    const transcript = safeMessages.map((item: { role: string; content: string }) => `${item.role === 'user' ? 'Visiteur' : 'Compagnon'}: ${item.content}`).join('\n');
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation:\n${transcript}\n\nCompagnon:`,
      add_context_from_internet: false
    });
    const value = result?.data ?? result;
    const message = typeof value === 'string' ? value : value?.response || value?.content;
    if (!message) return json({ error: 'Réponse IA indisponible' }, 502);

    return json({ message: String(message).slice(0, 4000) });
  } catch (error) {
    console.error('publicChat failed', error instanceof Error ? error.message : error);
    return json({ error: 'Service momentanément indisponible' }, 500);
  }
});
