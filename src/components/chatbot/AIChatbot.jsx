import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Send, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AIAvatar from './AIAvatar';

const WELCOME = {
  role: 'assistant',
  content: 'Bonjour ! Je suis votre compagnon JS-Innov.IA. Je peux vous guider parmi nos services, répondre à vos questions et vous aider à concrétiser votre projet.'
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  async function sendMessage(event) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || status === 'loading') return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setStatus('loading');

    try {
      const response = await base44.functions.invoke('publicChat', {
        messages: nextMessages.slice(-10).map(({ role, content: text }) => ({ role, content: text }))
      });
      const answer = response?.data?.message;
      if (!answer) throw new Error('Réponse vide');
      setMessages((current) => [...current, { role: 'assistant', content: answer }]);
      setStatus('idle');
    } catch {
      setError('Le compagnon est momentanément indisponible. Réessayez dans un instant.');
      setStatus('error');
    }
  }

  return (
    <>
      {!isOpen && <AIAvatar onClick={() => setIsOpen(true)} showWelcome={messages.length === 1} />}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="fixed inset-3 z-[80] flex flex-col overflow-hidden rounded-3xl border border-amber-300/30 bg-slate-950 shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100vh-3rem))] sm:w-[min(420px,calc(100vw-3rem))]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="companion-title"
          >
            <header className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-amber-500/25 via-purple-600/25 to-cyan-500/20 p-4">
              <div className="flex items-center gap-3">
                <img src="/jsinnovia-companion.png" alt="" className="h-12 w-12 object-contain" />
                <div>
                  <h2 id="companion-title" className="font-semibold text-white">Compagnon JS-Innov.IA</h2>
                  <p className="text-xs text-emerald-300">Assistant public</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Fermer le chat">
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-busy={status === 'loading'}>
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && <img src="/jsinnovia-companion.png" alt="" className="h-8 w-8 shrink-0 object-contain" />}
                  <p className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-100'}`}>
                    {message.content}
                  </p>
                </div>
              ))}
              {status === 'loading' && <p className="flex items-center gap-2 text-sm text-slate-300"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Le compagnon réfléchit…</p>}
              {error && <p className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</p>}
              <div ref={endRef} />
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/10 bg-slate-900 p-4">
              <label htmlFor="companion-message" className="sr-only">Votre message</label>
              <div className="flex gap-2">
                <textarea id="companion-message" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value.slice(0, 1000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) sendMessage(event); }} rows={1} disabled={status === 'loading'} placeholder="Écrivez votre message…" className="min-h-11 flex-1 resize-none rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60" />
                <button type="submit" disabled={!input.trim() || status === 'loading'} className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Envoyer le message">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-500">Ne partagez pas d’informations sensibles.</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
