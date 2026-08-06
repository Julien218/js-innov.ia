import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const GREEN = '#25D366';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

const PACK_LOGIC = (d) => {
  const n = d.need || '';
  const g = d.goal || '';
  const b = d.budget || '';
  if (n.includes('agent IA') || b === 'Projet complet') return 'Pack IA Premium';
  if (n.includes('automatiser') || g.includes('Gagner du temps') || g.includes('Automatiser')) return 'Pack Automation';
  if (n.includes('Attirer') || g.includes('plus de clients')) return 'Pack Business';
  return 'Pack Starter';
};

const PACK_COLORS = { 'Pack Starter': CYAN, 'Pack Business': GOLD, 'Pack Automation': PURPLE, 'Pack IA Premium': '#EC4899' };

const FLOW = [
  {
    id: 'welcome', bot: 'Bonjour 👋 Bienvenue chez Js-Innov.IA ! Je suis l\'assistant virtuel. Pour vous aider au mieux, vous êtes :',
    type: 'choice', field: 'typeClient',
    choices: ['Indépendant', 'Entreprise', 'ASBL', 'Commerce', 'Autre']
  },
  {
    id: 'need', bot: 'Parfait ! Quel est votre besoin principal ?',
    type: 'choice', field: 'need',
    choices: ['Créer un site web', 'Automatiser mon activité', 'Attirer plus de clients', 'Créer du contenu', 'Application mobile', 'Agent IA', 'Autre']
  },
  {
    id: 'problem', bot: 'En quelques mots, quel est votre problème ou défi actuel ?',
    type: 'text', field: 'problem', placeholder: 'Décrivez votre situation...'
  },
  {
    id: 'setup', bot: 'Avez-vous déjà quelque chose en place ?',
    type: 'choice', field: 'currentSetup',
    choices: ['Rien pour l\'instant', 'Site existant', 'Réseaux sociaux', 'CRM / outil', 'Automatisations']
  },
  {
    id: 'goal', bot: 'Quel est votre objectif principal ?',
    type: 'choice', field: 'goal',
    choices: ['Gagner du temps', 'Plus de clients', 'Meilleure image', 'Automatiser', 'Contenu régulier', 'Tout centraliser']
  },
  {
    id: 'deadline', bot: 'Quel est votre délai ?',
    type: 'choice', field: 'deadline',
    choices: ['Urgent', 'Moins de 30 jours', '1 à 3 mois', 'Plus tard']
  },
  {
    id: 'budget', bot: 'Et votre budget approximatif ?',
    type: 'choice', field: 'budget',
    choices: ['Petit budget', 'Budget moyen', 'Projet complet', 'Je ne sais pas']
  },
  {
    id: 'contact', bot: 'Pour vous envoyer une analyse personnalisée, j\'ai besoin de vos coordonnées :',
    type: 'contact'
  },
  {
    id: 'consent', bot: 'Dernière étape : consentement RGPD',
    type: 'consent'
  },
];

export default function SaasChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState({});
  const [inputVal, setInputVal] = useState('');
  const [done, setDone] = useState(false);
  const [pack, setPack] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (open) scrollToBottom(); }, [messages, open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMessage(FLOW[0].bot);
    }
  }, [open]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text, time: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', text, time: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const handleChoice = (choice, field) => {
    addUserMessage(choice);
    const newData = { ...data, [field]: choice };
    setData(newData);
    setTimeout(() => {
      const nextStep = step + 1;
      if (nextStep < FLOW.length) {
        setStep(nextStep);
        addBotMessage(FLOW[nextStep].bot);
      }
    }, 400);
  };

  const handleText = () => {
    if (!inputVal.trim()) return;
    const currentFlow = FLOW[step];
    addUserMessage(inputVal);
    const newData = { ...data, [currentFlow.field]: inputVal };
    setData(newData);
    setInputVal('');
    setTimeout(() => {
      const nextStep = step + 1;
      if (nextStep < FLOW.length) {
        setStep(nextStep);
        addBotMessage(FLOW[nextStep].bot);
      }
    }, 400);
  };

  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', company: '', phone: '', email: '' });
  const [consent, setConsent] = useState(false);

  const handleContactSubmit = () => {
    if (!contactForm.email) return;
    addUserMessage(`${contactForm.firstName} ${contactForm.lastName} — ${contactForm.email}`);
    const newData = { ...data, ...contactForm };
    setData(newData);
    setTimeout(() => {
      const nextStep = step + 1;
      setStep(nextStep);
      addBotMessage(FLOW[nextStep].bot);
    }, 400);
  };

  const handleFinalSubmit = async () => {
    if (!consent) return;
    setLoading(true);
    const recommended = PACK_LOGIC(data);
    setPack(recommended);
    await base44.functions.invoke('receiveLead', {
      ...data,
      recommendedPack: recommended,
      source: 'chatbot',
      consentRgpd: true,
      message: [data.problem, data.currentSetup, data.goal, data.deadline, data.budget].filter(Boolean).join(' — '),
    });
    addUserMessage("J'accepte que mes données soient utilisées pour être recontacté.");
    setTimeout(() => {
      setDone(true);
      addBotMessage(`Merci ! 🎉 Votre demande a été analysée. Le pack recommandé est : ${recommended}. Julien peut vous recontacter avec une proposition personnalisée.`);
      setLoading(false);
    }, 600);
  };

  const currentFlow = FLOW[step];

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`, boxShadow: `0 4px 30px rgba(212,175,55,0.4)`, display: open ? 'none' : 'flex' }}>
        <Bot className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-black">Analyser mon projet</span>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </motion.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm flex flex-col rounded-3xl shadow-2xl overflow-hidden"
            style={{ height: '580px', background: '#0a0818', border: `1px solid rgba(212,175,55,0.25)`, boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(5,5,16,0.95)' }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})` }}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0a0818]" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Assistant Js-Innov.IA</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>En ligne · Répond en direct</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ paddingBottom: currentFlow?.type === 'text' ? '0' : undefined }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})` }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    style={msg.role === 'user'
                      ? { background: `linear-gradient(135deg, ${GOLD}20, ${PURPLE}20)`, color: 'white', border: `1px solid rgba(212,175,55,0.2)` }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)' }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Current step actions */}
              {!done && currentFlow && (
                <div className="mt-2">
                  {currentFlow.type === 'choice' && (
                    <div className="flex flex-wrap gap-1.5">
                      {currentFlow.choices.map(c => (
                        <motion.button key={c} whileTap={{ scale: 0.97 }}
                          onClick={() => handleChoice(c, currentFlow.field)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: `rgba(212,175,55,0.08)`, color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}
                          onMouseEnter={e => { e.target.style.background = 'rgba(212,175,55,0.15)'; e.target.style.color = GOLD; }}
                          onMouseLeave={e => { e.target.style.background = 'rgba(212,175,55,0.08)'; e.target.style.color = 'rgba(212,175,55,0.8)'; }}>
                          {c}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {currentFlow.type === 'contact' && (
                    <div className="space-y-2 mt-2">
                      {[
                        { p: 'Prénom', k: 'firstName' }, { p: 'Nom', k: 'lastName' },
                        { p: 'Entreprise', k: 'company' }, { p: 'Téléphone', k: 'phone' }, { p: 'Email *', k: 'email' }
                      ].map(f => (
                        <input key={f.k} value={contactForm[f.k]} onChange={e => setContactForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                          placeholder={f.p}
                          className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                      ))}
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleContactSubmit} disabled={!contactForm.email}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-black disabled:opacity-40"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        Continuer →
                      </motion.button>
                    </div>
                  )}

                  {currentFlow.type === 'consent' && (
                    <div className="space-y-3 mt-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <div onClick={() => setConsent(!consent)}
                          className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 cursor-pointer"
                          style={consent ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` } : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}>
                          {consent && <span className="text-black text-xs font-black">✓</span>}
                        </div>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          J'accepte que mes données soient utilisées pour être recontacté dans le cadre de ma demande (RGPD).
                        </span>
                      </label>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleFinalSubmit} disabled={!consent || loading}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-black flex items-center justify-center gap-2 disabled:opacity-40"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        {loading ? '⏳ Analyse...' : <><Sparkles className="w-3.5 h-3.5" /> Envoyer mon analyse</>}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Done state - final buttons */}
              {done && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mt-3">
                  <div className="p-3 rounded-xl text-center text-xs font-black"
                    style={{ background: `${PACK_COLORS[pack] || GOLD}15`, color: PACK_COLORS[pack] || GOLD, border: `1px solid ${PACK_COLORS[pack] || GOLD}30` }}>
                    {pack}
                  </div>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black"
                    style={{ background: 'rgba(37,211,102,0.15)', color: GREEN, border: '1px solid rgba(37,211,102,0.3)' }}>
                    <MessageCircle className="w-3.5 h-3.5" /> Continuer sur WhatsApp
                  </a>
                  <a href="/saas-packs"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black text-black"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                    Recevoir une offre <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar for free-text steps */}
            {!done && currentFlow?.type === 'text' && (
              <div className="p-3 border-t flex gap-2" style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(5,5,16,0.95)' }}>
                <input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleText()}
                  placeholder={currentFlow.placeholder || 'Votre réponse...'}
                  className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }}
                  autoFocus
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleText}
                  disabled={!inputVal.trim()}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  <Send className="w-4 h-4 text-black" />
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}