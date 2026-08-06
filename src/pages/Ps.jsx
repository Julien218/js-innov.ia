import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import {
  Zap, Send, Copy, Check, RotateCcw, Code, Gamepad2, Clock, Terminal, MessageSquare, X
} from 'lucide-react';

/* ── Design tokens ── */
const T = {
  bg: '#080C14',
  card: '#0D1525',
  border: 'rgba(0,180,255,0.14)',
  cyan: '#00B4FF',
  cyanDim: 'rgba(0,180,255,0.55)',
  cyanBg: 'rgba(0,180,255,0.08)',
  white: '#E8ECF1',
  silver: '#8899B4',
  muted: 'rgba(136,153,180,0.5)',
  green: '#00E676',
};

const QUICK_TEMPLATES = [
  { icon: '🎯', label: 'Anti-Recoil (COD)', prompt: 'Crée un script anti-recul pour Call of Duty sur PS5. Recul modéré, compatible avec les fusils d\'assaut. Utilise une valeur de correction entre 20 et 35 sur le stick droit Y.' },
  { icon: '⚡', label: 'Rapid Fire', prompt: 'Crée un script rapidfire pour gâchette droite. Délai entre chaque tir de 40ms, activable/désactivable avec le bouton L3.' },
  { icon: '🐰', label: 'Bunny Hop', prompt: 'Crée un script bunny hop automatique. Quand le joueur maintient le stick gauche vers l\'avant et appuie sur X, le script spam le saut automatiquement.' },
  { icon: '🔫', label: 'Aim Assist Auto', prompt: 'Crée un script aim assist automatique. Active un micro-ajustement du stick droit pour coller à la cible quand le joueur vise (L2 maintenu). Valeur d\'ajustement de 25 sur X et Y.' },
  { icon: '💥', label: 'Jitter Shot', prompt: 'Crée un script jitter shot pour fusil à pompe. Alterne rapidement entre visée (L2) et tir (R2) pour annuler l\'animation de rechargement.' },
  { icon: '🎮', label: 'Drop Shot', prompt: 'Crée un script drop shot. Quand le joueur appuie sur R2 pour tirer, le personnage se couche automatiquement (appuie sur Circle/B) puis se relève après 500ms.' },
];

const SYSTEM_PROMPT = `Tu es un expert en scripting GPC (GPC2) pour le Cronus Zen de Collective Minds. Tu génères du code GPC fonctionnel, prêt à être compilé dans Zen Studio.

RÈGLES IMPÉRATIVES :
1. Réponds UNIQUEMENT avec le code GPC dans un bloc markdown \`\`\`gpc, suivi d'explications claires en français.
2. Le code doit être COMPLET et COMPILABLE sans erreur dans Zen Studio.
3. Commente chaque section du code en français.
4. Utilise UNIQUEMENT ces fonctions natives GPC2 :
   - main {} (boucle principale, pas de fonction main())
   - combo NomDuCombo { ... } (définit une macro)
   - define NOM = VALEUR; (constantes)
   - get_val(BOUTON) (lit l'état d'un bouton)
   - set_val(BOUTON, VALEUR) (modifie un bouton)
   - wait(TEMPS); (pause en millisecondes)
   - event_press(BOUTON) (détecte l'appui)
   - event_release(BOUTON) (détecte le relâchement)
   - get_ptime(BOUTON) (temps depuis dernière pression)
   - printf("texte") (debug console)

5. Boutons valides : BUTTON_1 à BUTTON_21, STICK_1_X, STICK_1_Y, STICK_2_X, STICK_2_Y, ACCEL_1_X, etc.
6. Les valeurs des sticks vont de -100 à 100.
7. La boucle main {} s'exécute en continu (pas de while(TRUE) ni de boucle infinie manuelle).
8. N'invente AUCUNE fonction qui n'existe pas dans l'API GPC2 officielle.
9. Structure recommandée :
   - defines en haut
   - combos (macros)
   - main { } avec la logique principale
10. Si l'utilisateur demande quelque chose d'impossible en GPC, explique poliment pourquoi et propose une alternative.

EXEMPLE DE SCRIPT VALIDE :
\`\`\`gpc
// Anti-recul simple pour Call of Duty
define ANTI_RECOIL_FORCE = 25;

main {
    if (get_val(BUTTON_5)) { // R2 = tir
        set_val(STICK_1_Y, ANTI_RECOIL_FORCE); // Pousse le stick vers le bas
    }
}
\`\`\`

Génère toujours du code réellement fonctionnel et testable.`;

export default function Ps() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const copyCode = async (text, id) => {
    const codeMatch = text.match(/```gpc\n?([\s\S]*?)```/) || text.match(/```\n?([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : text;
    await navigator.clipboard.writeText(code.trim());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (msg) => {
    const userMsg = msg || input;
    if (!userMsg.trim() || loading) return;

    const userMessage = { role: 'user', content: userMsg, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowTemplates(false);
    setLoading(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nDEMANDE DE L'UTILISATEUR : ${userMsg}`,
        model: 'gemini_3_flash',
      });

      const botMessage = {
        role: 'assistant',
        content: typeof res === 'string' ? res : res?.response || res?.content || JSON.stringify(res),
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, botMessage]);

      const gameMatch = userMsg.match(/pour\s+(.+?)(?:\s+sur|\s*$)/i);
      const game = gameMatch ? gameMatch[1].trim() : 'Général';
      const typeMatch = userMsg.match(/anti.recul|rapidfire|bunny.?hop|aim.?assist|jitter|drop.?shot/i);
      const type = typeMatch ? typeMatch[0] : 'Script personnalisé';

      setHistory(prev => [{ id: Date.now(), label: type, game, code: botMessage.content, time: new Date().toLocaleTimeString() }, ...prev]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur lors de la génération. Réessaie.', id: Date.now() + 1 }]);
    }
    setLoading(false);
  };

  const handleTemplate = (prompt) => {
    setInput(prompt);
    handleSend(prompt);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const loadHistoryItem = (item) => {
    setMessages([
      { role: 'user', content: item.label, id: Date.now() - 1 },
      { role: 'assistant', content: item.code, id: Date.now() },
    ]);
    setShowHistory(false);
    setShowTemplates(false);
  };

  const clearChat = () => { setMessages([]); setShowTemplates(true); setInput(''); };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.white, fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ── */}
      <header style={{
        background: 'linear-gradient(180deg, rgba(0,180,255,0.06), transparent)',
        borderBottom: `1px solid ${T.border}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #00B4FF, #0066CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,180,255,0.35)',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', color: T.white }}>
              Cronus Zen <span style={{ color: T.cyan }}>AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: T.silver, letterSpacing: '0.04em' }}>
              Script Generator · GPC
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {messages.length > 0 && (
            <button onClick={clearChat}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: T.silver, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
              <RotateCcw size={13} /> Nouveau
            </button>
          )}
          <button onClick={() => setShowHistory(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
              background: 'rgba(0,180,255,0.08)', border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.cyan, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
            <Clock size={13} /> Historique {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 16px' }}>
        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: 'clamp(32px,8vw,60px) 16px 20px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18, margin: '0 auto 18px',
                background: 'linear-gradient(135deg, #00B4FF, #0066CC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(0,180,255,0.3)',
              }}>
                <Gamepad2 size={32} color="#fff" />
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 900, color: T.white, marginBottom: 8 }}>
                Génère ton <span style={{ color: T.cyan }}>script GPC</span> en secondes
              </h1>
              <p style={{ fontSize: '0.88rem', color: T.silver, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
                Décris ce que tu veux en langage naturel — anti-recul, rapidfire, aim assist...
                L'IA génère le code GPC prêt à coller dans Zen Studio.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
                {['🎯 Anti-recul', '⚡ Rapidfire', '🐰 Bunny Hop', '🔫 Aim Assist', '💥 Jitter Shot', '🎮 Auto Drop']
                  .map(t => (
                    <span key={t} style={{
                      padding: '6px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600,
                      background: T.cyanBg, border: `1px solid ${T.border}`, color: T.cyanDim,
                    }}>{t}</span>
                  ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 10, padding: '0 2px' }}>
              {msg.role === 'assistant' ? (
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #00B4FF, #0066CC)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={14} color="#fff" />
                </div>
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MessageSquare size={14} color={T.silver} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {msg.role === 'assistant' ? (
                  <div style={{
                    background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 14, padding: '14px 16px',
                  }}>
                    <ReactMarkdown
                      className="prose prose-sm prose-invert max-w-none"
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          if (!inline && match) {
                            const codeStr = String(children).replace(/\n$/, '');
                            return (
                              <div style={{ position: 'relative', margin: '8px 0' }}>
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '6px 12px', background: '#060B14',
                                  borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                  border: '1px solid rgba(0,180,255,0.12)', borderBottom: 0,
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Terminal size={12} color={T.cyan} />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: T.cyanDim }}>
                                      {match[1].toUpperCase()}
                                    </span>
                                  </div>
                                  <button onClick={() => copyCode(msg.content, msg.id)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 4,
                                      padding: '4px 10px', borderRadius: 6,
                                      background: copiedId === msg.id ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.04)',
                                      border: `1px solid ${copiedId === msg.id ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                      color: copiedId === msg.id ? T.green : T.silver,
                                      fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}>
                                    {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                                    {copiedId === msg.id ? 'Copié' : 'Copier'}
                                  </button>
                                </div>
                                <pre style={{
                                  background: '#030610', margin: 0,
                                  padding: '12px 14px', overflow: 'auto',
                                  border: '1px solid rgba(0,180,255,0.12)', borderTop: 0,
                                  borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
                                  fontSize: '0.78rem', lineHeight: 1.65,
                                }}>
                                  <code className={className} {...props}>{children}</code>
                                </pre>
                              </div>
                            );
                          }
                          return <code style={{ background: 'rgba(0,180,255,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: '0.82rem', color: T.cyan }} {...props}>{children}</code>;
                        },
                        p: ({ children }) => <p style={{ fontSize: '0.82rem', color: T.silver, lineHeight: 1.7, margin: '6px 0' }}>{children}</p>,
                        h1: ({ children }) => <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: T.white, margin: '12px 0 6px' }}>{children}</h1>,
                        h2: ({ children }) => <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: T.cyan, margin: '10px 0 4px' }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: T.white, margin: '8px 0 4px' }}>{children}</h3>,
                        ul: ({ children }) => <ul style={{ paddingLeft: 18, color: T.silver, fontSize: '0.82rem', lineHeight: 1.7, margin: '4px 0' }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ paddingLeft: 18, color: T.silver, fontSize: '0.82rem', lineHeight: 1.7, margin: '4px 0' }}>{children}</ol>,
                        li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.10)',
                    borderRadius: 14, padding: '10px 16px',
                  }}>
                    <p style={{ fontSize: '0.84rem', color: T.white, margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10, padding: '0 2px' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #00B4FF, #0066CC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="#fff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.cyan, animation: 'pulse 1s infinite' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.cyan, animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.cyan, animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick templates */}
        {showTemplates && messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '0 0 16px' }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.muted, marginBottom: 10 }}>
              Templates rapides
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,240px), 1fr))', gap: 8 }}>
              {QUICK_TEMPLATES.map((tpl) => (
                <button key={tpl.label} onClick={() => handleTemplate(tpl.prompt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', textAlign: 'left',
                    background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
                    color: T.white, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.background = 'rgba(0,180,255,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}>
                  <span style={{ fontSize: '1.1rem' }}>{tpl.icon}</span>
                  {tpl.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 0 20px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'flex-end',
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
            padding: '8px 8px 8px 16px',
            boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
          }}>
            <textarea
              ref={inputRef}
              placeholder="Ex: anti-recul Call of Duty PS5 avec visée automatique..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: T.white, fontSize: '0.84rem', resize: 'none',
                outline: 'none', padding: '4px 0', minHeight: 24, maxHeight: 120,
                fontFamily: "'Inter','Segoe UI',sans-serif", lineHeight: 1.5,
              }}
            />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #00B4FF, #0066CC)'
                  : 'rgba(255,255,255,0.04)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: input.trim() && !loading ? '0 0 16px rgba(0,180,255,0.3)' : 'none',
              }}>
              <Send size={15} color={input.trim() && !loading ? '#fff' : T.muted} />
            </button>
          </div>
          <p style={{ fontSize: '0.58rem', color: T.muted, textAlign: 'center', margin: '8px 0 0' }}>
            Appuie sur Entrée pour envoyer · L'IA génère du code GPC fonctionnel
          </p>
        </div>
      </div>

      {/* ── History Drawer ── */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 90 }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(100%,380px)',
                background: '#0A1018', zIndex: 100, display: 'flex', flexDirection: 'column',
                borderLeft: `1px solid ${T.border}`,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color={T.cyan} />
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: T.white, margin: 0 }}>Historique des scripts</h3>
                </div>
                <button onClick={() => setShowHistory(false)}
                  style={{ background: 'none', border: 'none', color: T.silver, cursor: 'pointer', padding: 4 }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Code size={32} color={T.muted} style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: '0.82rem', color: T.silver }}>Aucun script généré pour l'instant</p>
                    <p style={{ fontSize: '0.68rem', color: T.muted, marginTop: 4 }}>Les scripts apparaîtront ici pendant ta session</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button key={item.id} onClick={() => loadHistoryItem(item)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '12px 14px', borderRadius: 10, marginBottom: 6,
                        background: 'rgba(0,180,255,0.03)', border: '1px solid rgba(255,255,255,0.04)',
                        color: T.white, cursor: 'pointer',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Code size={13} color={T.cyan} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{item.label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.62rem', color: T.muted }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: T.silver }}>{item.game}</div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}