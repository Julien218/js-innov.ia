import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2, Mic, MicOff, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import AIAvatar from './AIAvatar';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis l\'assistant de JS-INNOV.IA, votre partenaire en intelligence artificielle.\n\n🎯 **Nos Services:**\n\n✨ **Innovations IA** - Découvrez nos idées révolutionnaires\n🎬 **Templates Vidéo** - Créations professionnelles\n⚡ **Automatisations** - Solutions clé en main\n🚀 **Applications IA** - Développement sur mesure\n🎵 **Musiques** - Économisez sur la SABAM\n\nComment puis-je vous aider à transformer votre projet ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Paramètres de personnalisation
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('chatbotSettings');
    return saved ? JSON.parse(saved) : {
      tone: 'amical',
      speechRate: 1.0,
      messageTypes: {
        proverbes: true,
        conseils: true,
        services: true
      }
    };
  });

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Sauvegarder les paramètres
  useEffect(() => {
    localStorage.setItem('chatbotSettings', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speakText = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = settings.speechRate;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const saveConversation = () => {
    const conversationData = JSON.stringify(messages, null, 2);
    const blob = new Blob([conversationData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const toneInstructions = {
        formel: 'Utilise un ton professionnel, courtois et précis. Vouvoie le client. Sois concis et direct.',
        amical: 'Utilise un ton chaleureux, accessible et enthousiaste. Tutoie le client. Sois convivial et engageant.',
        technique: 'Utilise un ton expert et détaillé. Mets l\'accent sur les spécifications techniques, les technologies IA utilisées et les bénéfices techniques.'
      };

      const context = `Tu es l'assistant virtuel commercial de JS-INNOV.IA. Ton rôle est de présenter nos services et convaincre le client d'acheter.

      🎯 SERVICES À PROMOUVOIR:

      1. **Innovations IA** (page Innovations)
         - Solutions révolutionnaires et idées futuristes
         - Transforme les entreprises avec l'IA

      2. **Templates Vidéo** (page Templates)
         - Vidéos marketing professionnelles générées par IA
         - Gain de temps et qualité studio

      3. **Automatisations** (page Automations)
         - Solutions clé en main pour optimiser processus
         - Marketing, productivité, e-commerce

      4. **Applications IA** (page Applications)
         - Développement sur mesure d'apps intelligentes
         - Assistants IA, analyse de données, CRM

      5. **Musiques pour Commerces** (page MusicShop)
         - ARGUMENT FORT: Économisez 100-300€/an de frais SABAM
         - Bandes sonores libres de droits, paiement unique
         - Idéal pour boutiques, restaurants, salons, spas
         - Aussi: créations musicales sur mesure

      🎯 TON STYLE DE COMMUNICATION:
      ${toneInstructions[settings.tone]}

      🎯 TON APPROCHE:
      - Être ${settings.tone === 'formel' ? 'professionnel' : settings.tone === 'amical' ? 'enthousiaste' : 'précis et technique'}
      - Mettre en avant les bénéfices concrets et économies
      - Orienter vers la page Contact pour devis/commande
      - Pour les musiques, insister sur l'économie SABAM
      - Toujours finir en suggérant une action (visiter une page, nous contacter)

      Réponds de manière ${settings.tone === 'formel' ? 'professionnelle et courtoise' : settings.tone === 'amical' ? 'chaleureuse et persuasive' : 'technique et détaillée'}. Mets en avant les avantages économiques et la valeur ajoutée.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nQuestion du client: ${userMessage}`,
        add_context_from_internet: false
      });

      const assistantMessage = typeof response.data === 'string' 
        ? response.data 
        : (response.data?.response || response.data?.content || 'Je suis ravi de vous aider ! Pouvez-vous me donner plus de détails sur ce que vous recherchez ?');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage
      }]);

      // Speak the response
      speakText(assistantMessage);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* AI Avatar Button */}
      {!isOpen && (
        <AIAvatar 
          onClick={() => {
            setIsOpen(true);
            setShowWelcome(false);
          }} 
          showWelcome={showWelcome}
          isSpeaking={isSpeaking}
          messageTypes={settings.messageTypes}
        />
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-3xl bg-gray-900 border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Assistant IA</h3>
                  <p className="text-xs text-pink-100">Ton {settings.tone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveConversation}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Sauvegarder la conversation"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Paramètres"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-800 border-b border-gray-700 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Ton de l'assistant</label>
                      <Select value={settings.tone} onValueChange={(value) => setSettings({...settings, tone: value})}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formel">Formel</SelectItem>
                          <SelectItem value="amical">Amical</SelectItem>
                          <SelectItem value="technique">Technique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Vitesse de parole: {settings.speechRate.toFixed(1)}x</label>
                      <Slider
                        value={[settings.speechRate]}
                        onValueChange={([value]) => setSettings({...settings, speechRate: value})}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Types de messages de l'avatar</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={settings.messageTypes.proverbes}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              messageTypes: {...settings.messageTypes, proverbes: checked}
                            })}
                          />
                          <span className="text-sm text-gray-300">Proverbes IA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={settings.messageTypes.conseils}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              messageTypes: {...settings.messageTypes, conseils: checked}
                            })}
                          />
                          <span className="text-sm text-gray-300">Conseils</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={settings.messageTypes.services}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              messageTypes: {...settings.messageTypes, services: checked}
                            })}
                          />
                          <span className="text-sm text-gray-300">Info services</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Réflexion en cours...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex gap-2">
                <Button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "En écoute..." : "Posez votre question..."}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={isLoading || isListening}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50"
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