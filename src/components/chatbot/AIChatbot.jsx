import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Loader2, RotateCcw, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { platform } from '@/api/platformClient';
import AIAvatar from './AIAvatar';
import ElynaAvatar3D from './ElynaAvatar3D';

const AVATAR = '/brand/companion/companion-avatar-256.webp';
const WELCOME = {
  role: 'assistant',
  content: 'Bonjour ! Je suis Elyna, le Compagnon JS-Innov.IA. Je peux vous guider parmi nos solutions, répondre à vos questions et vous aider à préparer votre projet.'
};
const QUICK_PROMPTS = [
  'Quelles solutions proposez-vous ?',
  'Comment automatiser une tâche ?',
  'Je souhaite demander un devis'
];

function withTimeout(promise, delay) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('timeout')), delay);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

export default function AIChatbot() {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastInput, setLastInput] = useState('');
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const avatarState = status === 'loading' ? 'thinking' : status === 'error' ? 'error' : 'idle';

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);

    function closeOnEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, status, reduceMotion]);

  async function submitMessage(rawContent) {
    const content = rawContent.trim();
    if (!content || status === 'loading') return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLastInput(content);
    setError('');
    setStatus('loading');

    try {
      const response = await withTimeout(platform.functions.invoke('publicChat', {
        messages: nextMessages.slice(-10).map(({ role, content: text }) => ({ role, content: text }))
      }), 25_000);
      const answer = response?.data?.message;
      if (!answer) throw new Error('empty-response');
      setMessages((current) => [...current, { role: 'assistant', content: answer }]);
      setStatus('idle');
    } catch {
      setError('Elyna est momentanément indisponible. Votre message n’a pas été perdu.');
      setStatus('error');
    }
  }

  function sendMessage(event) {
    event?.preventDefault();
    submitMessage(input);
  }

  function retryLastMessage() {
    setStatus('idle');
    setError('');
    setInput(lastInput);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return createPortal(
    <>
      {!isOpen && <AIAvatar onClick={() => setIsOpen(true)} showWelcome={messages.length === 1} />}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: 'easeOut' }}
            className="fixed inset-2 z-[80] flex flex-col overflow-hidden rounded-[28px] border border-amber-300/25 bg-[#080b1f] shadow-[0_30px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.12)] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(700px,calc(100vh-2.5rem))] sm:w-[min(430px,calc(100vw-2.5rem))]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="companion-title"
            aria-describedby="companion-privacy"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(212,175,55,0.14),transparent_30%),radial-gradient(circle_at_100%_10%,rgba(6,182,212,0.12),transparent_32%),radial-gradient(circle_at_60%_100%,rgba(139,92,246,0.14),transparent_36%)]" aria-hidden="true" />

            <header className="relative flex items-center justify-between border-b border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-amber-300/40 bg-slate-950 shadow-[0_0_22px_rgba(212,175,55,0.22)]">
                  <ElynaAvatar3D
                    state={avatarState}
                    fallbackSrc={AVATAR}
                    className="h-full w-full rounded-full object-cover"
                    alt="Elyna — Compagnon JS-Innov.IA"
                  />
                  <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                    <h2 id="companion-title" className="truncate font-semibold tracking-tight text-white">Elyna</h2>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    Compagnon JS-Innov.IA · En ligne
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Fermer le chat">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="relative flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-color:rgba(212,175,55,.35)_transparent]" aria-live="polite" aria-busy={status === 'loading'}>
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <img src={AVATAR} alt="" width="256" height="256" decoding="async" className="mt-1 h-8 w-8 shrink-0 rounded-full border border-amber-300/25 bg-slate-950 object-cover" />
                  )}
                  <p className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${message.role === 'user' ? 'rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-700 text-white' : 'rounded-bl-md border border-white/10 bg-white/[0.075] text-slate-100 backdrop-blur-md'}`}>
                    {message.content}
                  </p>
                </div>
              ))}

              {messages.length === 1 && status === 'idle' && (
                <div className="ml-10 grid gap-2" aria-label="Suggestions de questions">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => submitMessage(prompt)}
                      className="group flex items-center justify-between rounded-xl border border-amber-300/15 bg-slate-950/55 px-3 py-2.5 text-left text-xs text-slate-200 transition-colors hover:border-amber-300/35 hover:bg-amber-300/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      <span>{prompt}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-amber-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {status === 'loading' && (
                <div className="ml-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-300" aria-hidden="true" />
                  Elyna réfléchit…
                </div>
              )}

              {error && (
                <div className="ml-10 rounded-xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100" role="alert">
                  <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</p>
                  <button type="button" onClick={retryLastMessage} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-white underline decoration-red-300/60 underline-offset-4">
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Réessayer
                  </button>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={sendMessage} className="relative border-t border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl">
              <label htmlFor="companion-message" className="sr-only">Votre message</label>
              <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-[#0d1229] p-2 transition-colors focus-within:border-amber-300/45">
                <textarea
                  id="companion-message"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, 1000))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) sendMessage(event);
                  }}
                  rows={1}
                  disabled={status === 'loading'}
                  placeholder="Écrivez votre message…"
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
                />
                <button type="submit" disabled={!input.trim() || status === 'loading'} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-violet-600 text-slate-950 shadow-[0_8px_24px_rgba(212,175,55,0.2)] transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Envoyer le message">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p id="companion-privacy" className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] leading-relaxed text-slate-500">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Ne partagez pas de données sensibles. Les messages sont transmis au service IA pour générer la réponse.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
