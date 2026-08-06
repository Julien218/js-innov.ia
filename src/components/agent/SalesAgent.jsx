import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

const PLANS = [
  {
    name: 'Starter',
    price: '19€/mois',
    color: 'from-gray-600 to-gray-700',
    border: 'border-gray-600',
    features: ['AI SEO Analyzer', 'AI Content Generator', '50 générations/mois'],
  },
  {
    name: 'Pro',
    price: '39€/mois',
    color: 'from-pink-600 to-purple-600',
    border: 'border-pink-500',
    popular: true,
    features: ['SEO + Content + AI Music', '200 générations/mois', 'Support prioritaire'],
  },
  {
    name: 'Business',
    price: '79€/mois',
    color: 'from-purple-600 to-indigo-600',
    border: 'border-purple-500',
    features: ['Tout inclus', 'Automation Agents IA', 'Illimité + Support 24/7'],
  }
];

function Message({ msg }) {
  const isAgent = msg.role === 'agent';
  return (
    <div className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}>
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isAgent
        ? 'bg-white/5 border border-white/10 text-gray-200'
        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
      }`}>
        {msg.content}
      </div>
    </div>
  );
}

function SEOResult({ data, onSelectPlan }) {
  const score = data.global_score;
  const color = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const bgColor = score >= 70 ? 'bg-green-500/10 border-green-500/30' : score >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30';

  return (
    <div className="space-y-3 my-2">
      {/* Score */}
      <div className={`p-4 rounded-2xl border ${bgColor} text-center`}>
        <div className={`text-5xl font-black ${color}`}>{score}</div>
        <div className="text-xs text-gray-400 mt-1">Score SEO / 100</div>
      </div>

      {/* Issues */}
      {data.issues?.length > 0 && (
        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mb-2">
            <AlertCircle className="w-3.5 h-3.5" /> Problèmes détectés
          </div>
          <ul className="space-y-1">
            {data.issues.map((issue, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Opportunities */}
      {data.opportunities?.length > 0 && (
        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Opportunités
          </div>
          <ul className="space-y-1">
            {data.opportunities.map((opp, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                {opp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Plans */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium">Choisissez votre plan pour corriger ces problèmes :</p>
        {PLANS.map((plan) => (
          <button
            key={plan.name}
            onClick={() => onSelectPlan(plan)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border ${plan.border} bg-white/[0.03] hover:bg-white/[0.06] transition-all group`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${plan.color}`} />
              <span className="text-sm font-semibold text-white">{plan.name}</span>
              {plan.popular && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30">⭐ Populaire</span>
              )}
              {plan.name === data.recommended_plan && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-600/20 text-green-400 border border-green-500/30">Recommandé</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{plan.price}</span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SalesAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Bonjour 👋 Je suis votre assistant IA JS-Innov.\n\nJe peux analyser votre site gratuitement et vous montrer exactement comment améliorer votre référencement Google en quelques secondes.\n\nEntrez l\'URL de votre site :' }
  ]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('awaiting_url'); // awaiting_url | analyzing | results | awaiting_plan | done
  const [analyzing, setAnalyzing] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleAnalyze = async (url) => {
    setAnalyzing(true);
    setStage('analyzing');
    addMessage('agent', '⏳ Analyse en cours... Je scanne votre site avec notre IA SEO.');

    try {
      const res = await base44.functions.invoke('salesAgentAnalyze', { url });
      const data = res.data;
      setSeoData(data);
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          content: `✅ Analyse terminée ! Voici les résultats pour **${url}** :`,
          seoResult: data
        }
      ]);
      setStage('results');
      setTimeout(() => {
        addMessage('agent', `📋 Votre score est de **${data.global_score}/100**. ${data.summary}\n\nSélectionnez un plan ci-dessous pour corriger ces problèmes et booster votre trafic :`);
      }, 600);
    } catch {
      addMessage('agent', '⚠️ Impossible d\'analyser ce site. Vérifiez l\'URL et réessayez.');
      setStage('awaiting_url');
    }
    setAnalyzing(false);
  };

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    addMessage('user', `Je suis intéressé par le Plan ${plan.name} à ${plan.price}`);
    addMessage('agent', `Excellent choix ! 🎉 Le **Plan ${plan.name}** à **${plan.price}** est parfait pour vous.\n\nPour finaliser votre abonnement, entrez votre adresse email :`);
    setAwaitingEmail(true);
    setStage('awaiting_email');
  };

  const handleCheckout = async (email) => {
    setCheckingOut(true);
    addMessage('agent', '🔒 Redirection vers le paiement sécurisé Stripe...');
    try {
      const res = await base44.functions.invoke('salesAgentCheckout', { plan: selectedPlan.name, email });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
        addMessage('agent', `✅ La page de paiement s'est ouverte dans un nouvel onglet. Bon succès avec votre Plan ${selectedPlan.name} ! 🚀`);
        setStage('done');
      } else {
        addMessage('agent', `⚠️ Erreur lors de la création du paiement. Réessayez ou contactez-nous directement.`);
      }
    } catch {
      addMessage('agent', '⚠️ Erreur de connexion Stripe. Réessayez.');
    }
    setCheckingOut(false);
    setAwaitingEmail(false);
  };

  const handleSend = async () => {
    const val = input.trim();
    if (!val || analyzing || checkingOut) return;
    setInput('');
    addMessage('user', val);

    if (stage === 'awaiting_url') {
      const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/\S*)?$/i;
      if (urlRegex.test(val)) {
        const url = val.startsWith('http') ? val : `https://${val}`;
        await handleAnalyze(url);
      } else {
        addMessage('agent', '⚠️ Je n\'ai pas reconnu cette URL. Entrez une adresse valide comme https://votre-site.com');
      }
    } else if (stage === 'awaiting_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(val)) {
        setUserEmail(val);
        await handleCheckout(val);
      } else {
        addMessage('agent', '⚠️ Veuillez entrer une adresse email valide.');
      }
    } else if (stage === 'done') {
      addMessage('agent', 'Merci pour votre confiance ! N\'hésitez pas à nous contacter si vous avez des questions. 😊');
    } else {
      addMessage('agent', 'Entrez l\'URL de votre site pour commencer l\'analyse gratuite.');
      setStage('awaiting_url');
    }
  };

  const getPlaceholder = () => {
    if (stage === 'awaiting_url') return 'https://votre-site.com';
    if (stage === 'awaiting_email') return 'votre@email.com';
    return 'Répondez ici...';
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">Agent IA Vendeur</div>
              <div className="text-[10px] text-white/70">Analyse gratuite →</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[360px] max-h-[600px] flex flex-col rounded-3xl bg-gray-950 border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Agent IA JS-Innov</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-gray-400">En ligne · Analyse gratuite</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i}>
                  <Message msg={msg} />
                  {msg.seoResult && (
                    <div className="mt-2 ml-11">
                      <SEOResult data={msg.seoResult} onSelectPlan={handleSelectPlan} />
                    </div>
                  )}
                </div>
              ))}
              {analyzing && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                    {[0,1,2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-pink-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={getPlaceholder()}
                  disabled={analyzing || checkingOut}
                  className="flex-1 bg-white/5 border-gray-700 text-white text-sm placeholder:text-gray-600 rounded-xl h-10"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || analyzing || checkingOut}
                  className="h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}